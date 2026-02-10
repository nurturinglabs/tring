const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio_base64, conversation_history } = req.body;

    if (!audio_base64) {
      return res.status(400).json({ error: 'No audio provided.' });
    }

    // STEP 1: SAARIKA STT — Auto-detect language
    const audioBuffer = Buffer.from(audio_base64, 'base64');
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'recording.webm',
      contentType: 'audio/webm'
    });
    formData.append('language_code', 'unknown');
    formData.append('model', 'saarika:v2.5');

    const sttResponse = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        ...formData.getHeaders()
      },
      body: formData
    });
    const sttData = await sttResponse.json();
    const residentText = sttData.transcript;
    const detectedLang = sttData.language_code;

    if (!residentText || residentText.trim() === '') {
      return res.status(400).json({ error: 'Could not hear clearly. Please try again.' });
    }

    // STEP 2: SARVAM-M — Understand intent (NO TTS here — frontend fetches audio separately for speed)
    const systemPrompt = `You are Tring, a multilingual AI service agent for "Sunrise Apartments".

CRITICAL LANGUAGE RULE:
- You MUST respond ONLY in the SAME language the resident is speaking.
- If they speak Kannada, you reply in Kannada. If Hindi, reply in Hindi. If Tamil, reply in Tamil. And so on.
- NEVER respond in English. The response_text MUST be in the resident's language.
- The [Language: xx-IN] tag tells you which language was detected.

RULES:
1. Extract: category, flat_number, priority, problem description.
2. Categories: plumbing, electrical, security, elevator, parking, housekeeping, general
3. Priority: urgent (water/gas leak, power outage, security) or normal
4. If flat number missing, ask for it in their language.
5. Keep responses SHORT — 2-3 sentences. This is a phone call.
6. When you have all info (problem + flat number), create a ticket and confirm in their language:
   - Ticket number, category, assigned staff, ETA.
   - Staff assignments:
     plumbing → Ramesh (30min urgent, 2hr normal)
     electrical → Suresh (30min urgent, 2hr normal)
     security → Venkatesh (15min)
     elevator → Kumar (30min)
     housekeeping → Lakshmi (2-4hr)
     parking → Manjunath (1hr)
7. After confirming ticket, ask "anything else?" in their language, then set conversation_complete to true.

RESPONSE FORMAT — valid JSON only:
{
  "response_text": "YOUR RESPONSE IN THE RESIDENT'S LANGUAGE (never English)",
  "ticket_created": true/false,
  "ticket": {
    "category": "plumbing",
    "flat_number": "B-204",
    "priority": "urgent",
    "summary_en": "Bathroom pipe leaking",
    "summary_local": "summary in resident's language",
    "assigned_to": "Ramesh",
    "eta": "30 minutes"
  },
  "conversation_complete": true/false
}`;

    const messages = [{ role: 'system', content: systemPrompt }];
    if (conversation_history && conversation_history.length > 0) {
      messages.push(...conversation_history);
    }
    messages.push({ role: 'user', content: `[Language: ${detectedLang}] ${residentText}` });

    const llmResponse = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const llmData = await llmResponse.json();
    const assistantMessage = llmData.choices[0].message.content;

    let agentResponse;
    try {
      const cleaned = assistantMessage.replace(/```json|```/g, '').trim();
      agentResponse = JSON.parse(cleaned);
    } catch (e) {
      agentResponse = {
        response_text: assistantMessage,
        ticket_created: false,
        conversation_complete: false
      };
    }

    // Return text immediately — NO TTS wait. Frontend calls /api/tts separately.
    return res.status(200).json({
      resident_text: residentText,
      detected_language: detectedLang,
      agent_response: agentResponse.response_text,
      ticket: agentResponse.ticket_created ? agentResponse.ticket : null,
      conversation_complete: agentResponse.conversation_complete || false,
      assistant_message: { role: 'assistant', content: assistantMessage }
    });

  } catch (error) {
    console.error('Agent error:', error);
    return res.status(500).json({ error: 'Agent error. Please try again.' });
  }
};
