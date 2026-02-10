// demos.js — Interactive demo playback with real TTS audio

const demosGrid = document.getElementById('demos-grid');

const demoData = [
  {
    lang: 'kn',
    langCode: 'kn-IN',
    langName: 'ಕನ್ನಡ',
    langNameEn: 'Kannada',
    desc: 'Plumbing complaint — "ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್"',
    tags: ['Kannada', 'Plumbing', 'Ticket #1042'],
    conversation: [
      { speaker: 'agent', text: 'ನಮಸ್ಕಾರ! ಟ್ರಿಂಗ್ ಸರ್ವಿಸ್ ಏಜೆಂಟ್. ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ.' },
      { speaker: 'user', text: 'ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್ ಆಗ್ತಿದೆ, ತುಂಬಾ ನೀರು ಬರ್ತಿದೆ.' },
      { speaker: 'agent', text: 'ನಿಮ್ಮ ಫ್ಲಾಟ್ ನಂಬರ್ ಹೇಳಿ?' },
      { speaker: 'user', text: 'B-204' },
      { speaker: 'agent', text: 'ಟಿಕೆಟ್ 1042 ರಚಿಸಲಾಗಿದೆ. ಪ್ಲಂಬಿಂಗ್ ವಿಭಾಗ. ರಮೇಶ್ 30 ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತಾರೆ.' }
    ]
  },
  {
    lang: 'hi',
    langCode: 'hi-IN',
    langName: 'हिन्दी',
    langNameEn: 'Hindi',
    desc: 'Electrical issue — "बिजली चली गई है"',
    tags: ['Hindi', 'Electrical', 'Ticket #1043'],
    conversation: [
      { speaker: 'agent', text: 'नमस्कार! ट्रिंग सर्विस एजेंट. अपनी समस्या बताइए.' },
      { speaker: 'user', text: 'बिजली चली गई है, पूरे फ्लैट में अंधेरा है.' },
      { speaker: 'agent', text: 'आपका फ्लैट नंबर बताइए?' },
      { speaker: 'user', text: 'A-105' },
      { speaker: 'agent', text: 'टिकट 1043 बनाया गया. इलेक्ट्रिकल विभाग. सुरेश 30 मिनट में आएंगे.' }
    ]
  },
  {
    lang: 'ta',
    langCode: 'ta-IN',
    langName: 'தமிழ்',
    langNameEn: 'Tamil',
    desc: 'Parking issue — "பார்க்கிங்ல அந்நிய வண்டி"',
    tags: ['Tamil', 'Security', 'Ticket #1044'],
    conversation: [
      { speaker: 'agent', text: 'வணக்கம்! ட்ரிங் சேவை முகவர். உங்கள் பிரச்சனை சொல்லுங்கள்.' },
      { speaker: 'user', text: 'என் பார்க்கிங்ல யாரோ வண்டி நிறுத்தியிருக்காங்க.' },
      { speaker: 'agent', text: 'உங்கள் பிளாட் நம்பர் சொல்லுங்கள்?' },
      { speaker: 'user', text: 'D-102' },
      { speaker: 'agent', text: 'டிக்கெட் 1044 உருவாக்கப்பட்டது. பாதுகாப்பு பிரிவு. வெங்கடேஷ் 15 நிமிடத்தில் வருவார்.' }
    ]
  },
  {
    lang: 'te',
    langCode: 'te-IN',
    langName: 'తెలుగు',
    langNameEn: 'Telugu',
    desc: 'Elevator issue — "లిఫ్ట్ పనిచేయడం లేదు"',
    tags: ['Telugu', 'Elevator', 'Ticket #1045'],
    conversation: [
      { speaker: 'agent', text: 'నమస్కారం! ట్రింగ్ సర్వీస్ ఏజెంట్. మీ సమస్య చెప్పండి.' },
      { speaker: 'user', text: 'లిఫ్ట్ పనిచేయడం లేదు, మూడో ఫ్లోర్ లో ఉన్నాం.' },
      { speaker: 'agent', text: 'మీ ఫ్లాట్ నంబర్ చెప్పండి?' },
      { speaker: 'user', text: 'E-303' },
      { speaker: 'agent', text: 'టిక్కెట్ 1045 సృష్టించబడింది. ఎలివేటర్ విభాగం. కుమార్ 30 నిమిషాల్లో వస్తారు.' }
    ]
  },
  {
    lang: 'bn',
    langCode: 'bn-IN',
    langName: 'বাংলা',
    langNameEn: 'Bengali',
    desc: 'Housekeeping — "ফ্লোরে জল জমে আছে"',
    tags: ['Bengali', 'Housekeeping', 'Ticket #1046'],
    conversation: [
      { speaker: 'agent', text: 'নমস্কার! ট্রিং সার্ভিস এজেন্ট. আপনার সমস্যা বলুন.' },
      { speaker: 'user', text: 'লবিতে জল জমে আছে, পিছলে যাওয়ার ভয় আছে.' },
      { speaker: 'agent', text: 'আপনার ফ্ল্যাট নম্বর বলুন?' },
      { speaker: 'user', text: 'F-501' },
      { speaker: 'agent', text: 'টিকিট 1046 তৈরি হয়েছে. হাউসকিপিং বিভাগ. লক্ষ্মী 2 ঘণ্টায় আসবেন.' }
    ]
  }
];

let currentPlayingDemo = null;
let demoAbortController = null;

function initDemos() {
  demosGrid.innerHTML = '';
  demoData.forEach((demo, index) => {
    const card = createDemoCard(demo, index);
    demosGrid.appendChild(card);
  });
}

function createDemoCard(demo, index) {
  const card = document.createElement('div');
  card.className = 'demo-card';
  card.dataset.index = index;

  card.innerHTML = `
    <button class="demo-play-btn" data-index="${index}">▶</button>
    <div class="demo-card-info">
      <div class="demo-card-lang">${demo.langName} <span style="color:var(--text-muted);font-size:0.85rem;font-weight:400;">${demo.langNameEn}</span></div>
      <div class="demo-card-desc">${demo.desc}</div>
      <div class="demo-card-progress"><div class="demo-card-progress-bar" id="progress-${index}"></div></div>
      <div class="demo-card-tags">
        ${demo.tags.map(t => `<span class="demo-tag">${t}</span>`).join('')}
      </div>
      <div class="demo-live-transcript" id="demo-transcript-${index}" style="display:none;margin-top:0.8rem;padding:0.8rem;background:var(--bg-tertiary);border-radius:8px;font-size:0.8rem;max-height:200px;overflow-y:auto;"></div>
    </div>
  `;

  const playBtn = card.querySelector('.demo-play-btn');
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playDemoConversation(index);
  });

  return card;
}

async function fetchTTS(text, langCode) {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: langCode })
    });
    const data = await res.json();
    return data.audio || null;
  } catch (e) {
    console.error('TTS fetch error:', e);
    return null;
  }
}

function playBase64Audio(base64Audio) {
  return new Promise((resolve) => {
    if (!base64Audio) { resolve(); return; }
    try {
      const audio = new Audio('data:audio/wav;base64,' + base64Audio);
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    } catch (e) {
      resolve();
    }
  });
}

async function playDemoConversation(index) {
  // Stop any currently playing demo
  if (currentPlayingDemo !== null) {
    stopDemoPlayback(currentPlayingDemo);
  }

  // If clicking the same demo, just stop
  if (currentPlayingDemo === index) {
    currentPlayingDemo = null;
    return;
  }

  const demo = demoData[index];
  const playBtn = document.querySelector(`.demo-play-btn[data-index="${index}"]`);
  const progressBar = document.getElementById(`progress-${index}`);
  const transcriptEl = document.getElementById(`demo-transcript-${index}`);

  if (!playBtn || !progressBar || !transcriptEl) return;

  currentPlayingDemo = index;
  demoAbortController = { aborted: false };
  const abort = demoAbortController;

  playBtn.textContent = '⏸';
  playBtn.classList.add('playing');
  transcriptEl.style.display = 'block';
  transcriptEl.innerHTML = '<div style="color:var(--text-muted);text-align:center;">Loading audio...</div>';

  const totalTurns = demo.conversation.length;

  for (let i = 0; i < totalTurns; i++) {
    if (abort.aborted) break;

    const turn = demo.conversation[i];

    // Show the text bubble
    const bubble = document.createElement('div');
    bubble.style.cssText = `margin-bottom:0.5rem;text-align:${turn.speaker === 'user' ? 'right' : 'left'};animation:bubbleIn 0.3s ease-out;`;
    bubble.innerHTML = `<span style="display:inline-block;padding:0.4rem 0.7rem;border-radius:8px;background:${turn.speaker === 'agent' ? 'rgba(59,130,246,0.1)' : 'rgba(249,115,22,0.1)'};max-width:90%;line-height:1.5;">${turn.speaker === 'agent' ? '🤖' : '👤'} ${turn.text}</span>`;

    // Remove "Loading" message on first bubble
    if (i === 0) transcriptEl.innerHTML = '';
    transcriptEl.appendChild(bubble);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;

    // Update progress
    progressBar.style.width = ((i + 1) / totalTurns * 100) + '%';

    // Fetch TTS and play audio for this turn
    const audioBase64 = await fetchTTS(turn.text, demo.langCode);
    if (abort.aborted) break;

    if (audioBase64) {
      await playBase64Audio(audioBase64);
    } else {
      // Fallback: wait a beat so the text is readable
      await new Promise(r => setTimeout(r, 1500));
    }

    if (abort.aborted) break;

    // Short pause between turns
    await new Promise(r => setTimeout(r, 500));
  }

  // Finished
  if (!abort.aborted) {
    stopDemoPlayback(index);
  }
}

function stopDemoPlayback(index) {
  if (demoAbortController) {
    demoAbortController.aborted = true;
    demoAbortController = null;
  }

  const playBtn = document.querySelector(`.demo-play-btn[data-index="${index}"]`);
  if (playBtn) {
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
  }

  currentPlayingDemo = null;
}

// Initialize
initDemos();
