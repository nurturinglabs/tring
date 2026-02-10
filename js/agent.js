// agent.js — Fast conversational voice demo
// Speed optimizations:
//   1. Welcome audio pre-cached on page load
//   2. Agent API returns text only (STT+LLM) — no TTS wait
//   3. Frontend fetches TTS in parallel — text shows instantly, voice follows

let conversationHistory = [];
let detectedLanguage = null;
let mediaRecorder;
let audioChunks = [];
let isConversationActive = false;
let silenceTimer = null;
let audioContext = null;
let analyser = null;
let silenceStart = null;
let cachedWelcomeAudio = null;

const SILENCE_THRESHOLD = 0.008;
const SILENCE_DURATION = 1800;
const WELCOME_TEXT = 'नमस्कार! ट्रिंग सर्विस एजेंट में आपका स्वागत है। अपनी भाषा में अपनी समस्या बताइए।';

const micBtn = document.getElementById('mic-btn');
const micLabel = document.getElementById('mic-label');
const transcript = document.getElementById('transcript');
const waveform = document.getElementById('waveform');
const detectedLangEl = document.getElementById('detected-lang');
const demoWidget = document.getElementById('demo-widget');

const langNames = {
  'hi-IN': 'Hindi', 'kn-IN': 'Kannada', 'ta-IN': 'Tamil',
  'te-IN': 'Telugu', 'ml-IN': 'Malayalam', 'bn-IN': 'Bengali',
  'mr-IN': 'Marathi', 'gu-IN': 'Gujarati', 'od-IN': 'Odia', 'pa-IN': 'Punjabi',
  'en-IN': 'English'
};

// ── PRE-CACHE welcome audio on page load (with retry) ──
async function loadWelcomeAudio() {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: WELCOME_TEXT, language_code: 'hi-IN' })
    });
    const data = await res.json();
    if (data.audio) {
      cachedWelcomeAudio = data.audio;
      console.log('Welcome audio pre-cached');
      return true;
    }
  } catch (e) {
    console.log('Welcome audio fetch failed, will retry');
  }
  return false;
}
// Try immediately, retry once after 3s if it fails (Vercel cold start)
loadWelcomeAudio().then(ok => { if (!ok) setTimeout(loadWelcomeAudio, 3000); });

// Single click to start / stop
micBtn.addEventListener('click', () => {
  if (isConversationActive) {
    stopConversation();
  } else {
    startConversation();
  }
});

// ── Start conversation — instant welcome from cache ──
async function startConversation() {
  isConversationActive = true;
  conversationHistory = [];
  detectedLanguage = null;

  demoWidget.classList.add('active');
  micBtn.disabled = true;
  waveform.className = 'demo-waveform speaking';
  micLabel.textContent = 'Agent speaking...';

  // Show greeting bubble
  transcript.innerHTML = '';
  addBubble('agent', WELCOME_TEXT);

  // Play cached welcome audio (instant!) or fetch on the fly with timeout
  if (cachedWelcomeAudio) {
    await playBase64Audio(cachedWelcomeAudio);
  } else {
    // Fetch with 5s timeout so we don't hang on cold starts
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: WELCOME_TEXT, language_code: 'hi-IN' }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.audio) {
        cachedWelcomeAudio = data.audio;
        await playBase64Audio(data.audio);
      }
    } catch (e) {
      console.log('Welcome TTS timed out, continuing without audio');
    }
  }

  // Start listening
  if (isConversationActive) {
    micBtn.disabled = false;
    await beginRecording();
  }
}

// ── Stop conversation ──
function stopConversation() {
  isConversationActive = false;
  stopSilenceDetection();
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
  micBtn.classList.remove('recording');
  micBtn.disabled = false;
  micLabel.textContent = 'Click to start';
  waveform.className = 'demo-waveform idle';
  demoWidget.classList.remove('active');
}

// ── TTS fetch ──
async function fetchTTS(text, langCode) {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: langCode })
    });
    const data = await res.json();
    return data.audio || null;
  } catch (e) { return null; }
}

// ── Audio playback — try multiple MIME types with proper fallback chain ──
function playBase64Audio(base64Audio) {
  return new Promise((resolve) => {
    if (!base64Audio) { resolve(); return; }
    const mimeTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
    let attempt = 0;

    function tryPlay() {
      if (attempt >= mimeTypes.length) { resolve(); return; }
      const audio = new Audio('data:' + mimeTypes[attempt] + ';base64,' + base64Audio);
      audio.onended = resolve;
      audio.onerror = () => { attempt++; tryPlay(); };
      audio.play().then(() => {
        // Playing successfully — onended will resolve
      }).catch(() => { attempt++; tryPlay(); });
    }
    tryPlay();
  });
}

// ── Record one turn ──
async function beginRecording() {
  if (!isConversationActive) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      stopSilenceDetection();
      if (!isConversationActive || audioChunks.length === 0) return;

      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      if (blob.size < 5000) {
        // Too short — skip and re-listen
        if (isConversationActive) await beginRecording();
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => processAudio(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    micBtn.classList.add('recording');
    micLabel.textContent = 'Listening... (click to stop)';
    waveform.className = 'demo-waveform active';
    startSilenceDetection(stream);
  } catch (err) {
    console.error('Mic error:', err);
    micLabel.textContent = 'Mic access denied';
    stopConversation();
  }
}

// ── Silence detection ──
function startSilenceDetection(stream) {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const dataArray = new Float32Array(analyser.fftSize);
    silenceStart = null;

    function check() {
      if (!isConversationActive || !mediaRecorder || mediaRecorder.state !== 'recording') return;
      analyser.getFloatTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / dataArray.length);
      if (rms < SILENCE_THRESHOLD) {
        if (!silenceStart) silenceStart = Date.now();
        if (Date.now() - silenceStart > SILENCE_DURATION) {
          if (mediaRecorder.state === 'recording') mediaRecorder.stop();
          return;
        }
      } else { silenceStart = null; }
      silenceTimer = requestAnimationFrame(check);
    }
    setTimeout(() => { if (isConversationActive) check(); }, 1500);
  } catch (e) { console.error('Silence detection error:', e); }
}

function stopSilenceDetection() {
  if (silenceTimer) { cancelAnimationFrame(silenceTimer); silenceTimer = null; }
  if (audioContext && audioContext.state !== 'closed') { audioContext.close().catch(() => {}); audioContext = null; }
  analyser = null; silenceStart = null;
}

// ── SPLIT pipeline: STT → show user text → Chat → show agent text → TTS (parallel) ──
async function processAudio(audioBase64) {
  micBtn.classList.remove('recording');
  micLabel.textContent = 'Transcribing...';
  micBtn.disabled = true;
  waveform.className = 'demo-waveform processing';

  try {
    // STEP 1: STT only — fast transcription
    const sttRes = await fetch('/api/stt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64: audioBase64 })
    });
    const sttData = await sttRes.json();

    if (sttData.error || !sttData.transcript) {
      // Silently re-listen — don't spam error bubbles for ambient noise
      console.log('STT returned no transcript, re-listening...');
      if (isConversationActive) { micBtn.disabled = false; await beginRecording(); }
      return;
    }

    // Show detected language immediately
    detectedLanguage = sttData.language_code;
    detectedLangEl.innerHTML = `<span class="lang-dot"></span> ${langNames[detectedLanguage] || detectedLanguage} detected`;

    // Show user text immediately (don't wait for LLM!)
    addBubble('user', sttData.transcript);
    micLabel.textContent = 'Thinking...';

    // STEP 2: Chat LLM — get agent response
    const chatRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sttData.transcript,
        language_code: sttData.language_code,
        conversation_history: conversationHistory
      })
    });
    const chatData = await chatRes.json();

    if (chatData.error) {
      addBubble('agent', 'Sorry, something went wrong. Please try again.');
      if (isConversationActive) { micBtn.disabled = false; await beginRecording(); }
      return;
    }

    // Show agent text immediately (don't wait for TTS!)
    addBubble('agent', chatData.agent_response);

    // Update conversation history
    conversationHistory.push({ role: 'user', content: `[Language: ${sttData.language_code}] ${sttData.transcript}` });
    conversationHistory.push(chatData.assistant_message);

    // STEP 3: TTS in parallel — voice plays while text is already visible
    waveform.className = 'demo-waveform speaking';
    micLabel.textContent = 'Agent speaking...';

    const ttsLang = detectedLanguage || 'hi-IN';
    const ttsAudio = await fetchTTS(chatData.agent_response, ttsLang);
    if (ttsAudio) await playBase64Audio(ttsAudio);

    // Ticket handling
    if (chatData.ticket) {
      const tickets = JSON.parse(localStorage.getItem('tring_tickets') || '[]');
      chatData.ticket.id = 1042 + tickets.length;
      chatData.ticket.timestamp = new Date().toISOString();
      chatData.ticket.status = 'open';
      chatData.ticket.language = detectedLanguage;
      tickets.push(chatData.ticket);
      localStorage.setItem('tring_tickets', JSON.stringify(tickets));
      showTicketNotification(chatData.ticket);
    }

    // Done? End if conversation_complete OR if a ticket was just created
    if (chatData.conversation_complete || chatData.ticket) {
      stopConversation();
      micLabel.textContent = 'Click to start';
      return;
    }

    // Next turn
    if (isConversationActive) {
      micBtn.disabled = false;
      await beginRecording();
    }

  } catch (err) {
    console.error('Agent error:', err);
    addBubble('agent', 'Connection error. Please try again.');
    stopConversation();
  }
}

// ── UI helpers ──
function addBubble(speaker, text) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${speaker}`;
  bubble.innerHTML = `<span class="bubble-icon">${speaker === 'agent' ? '🤖' : '👤'}</span><span class="bubble-text">${escapeHtml(text)}</span>`;
  transcript.appendChild(bubble);
  transcript.scrollTop = transcript.scrollHeight;
}

function showTicketNotification(ticket) {
  const priorityColor = ticket.priority === 'urgent' ? '#ef4444' : '#eab308';
  const priorityLabel = ticket.priority === 'urgent' ? '🔴 URGENT' : '🟡 NORMAL';
  const notif = document.createElement('div');
  notif.className = 'ticket-notif-card';
  notif.innerHTML = `
    <div style="background:var(--bg-tertiary);border:1px solid rgba(34,197,94,0.3);border-left:4px solid ${priorityColor};border-radius:8px;padding:0.7rem 0.9rem;margin-top:0.6rem;animation:bubbleIn 0.3s ease-out;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
        <span style="font-size:0.75rem;font-weight:700;color:${priorityColor};">${priorityLabel}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--text-muted);">#${ticket.id}</span>
      </div>
      <div style="font-size:0.8rem;margin-bottom:0.3rem;">
        <strong>${ticket.category ? ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1) : ''}</strong>
        · ${ticket.flat_number || ''}
      </div>
      <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.3rem;">
        ${ticket.summary_local || ticket.summary_en || ''}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--text-muted);">
        <span>👷 ${ticket.assigned_to || 'Unassigned'}</span>
        <span>⏱️ ETA: ${ticket.eta || '-'}</span>
      </div>
      <div style="text-align:center;margin-top:0.4rem;font-size:0.7rem;color:#22c55e;">✅ Ticket Created</div>
    </div>`;
  transcript.appendChild(notif);
  transcript.scrollTop = transcript.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// "Try it Live" button
document.getElementById('try-live-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  demoWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { if (!isConversationActive) startConversation(); }, 600);
});
