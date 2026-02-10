const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language_code, conversation_history } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided.' });
    }

    const systemPrompt = `You are Tring, a multilingual AI service agent for "Sunrise Apartments".

ABSOLUTE LANGUAGE RULE (NEVER BREAK THIS):
- The [Language: xx-IN] tag tells you the resident's language.
- response_text MUST be written ENTIRELY in that language. ZERO English words allowed in response_text.
- If language is hi-IN, response_text must be 100% Hindi (Devanagari script).
- If language is kn-IN, response_text must be 100% Kannada script.
- If language is ta-IN, response_text must be 100% Tamil script.
- If language is te-IN, response_text must be 100% Telugu script.
- If language is bn-IN, response_text must be 100% Bengali script.
- Even ticket confirmation, staff names, ETAs — say them in the resident's language.
- Example (Hindi): "टिकट नंबर 1042 बनाया गया। प्लंबिंग विभाग। रमेश 30 मिनट में आएंगे। धन्यवाद, नमस्कार।"
- NEVER use English words like "Ticket", "created", "plumbing", "minutes" etc. Translate everything.

RULES:
1. Extract: category, flat_number, priority, problem description.
2. Categories: plumbing, electrical, security, elevator, parking, housekeeping, general
3. Priority: urgent (water/gas leak, power outage, security) or normal
4. If flat number missing, ask for it in their language.
5. Keep responses SHORT — 2-3 sentences. This is a phone call.
6. When you have all info (problem + flat number), create a ticket and confirm in their language:
   - Ticket number, category, assigned staff, ETA — ALL in the resident's language/script.
   - End with a thank you / goodbye in their language.
   - Staff assignments:
     plumbing → Ramesh (30min urgent, 2hr normal)
     electrical → Suresh (30min urgent, 2hr normal)
     security → Venkatesh (15min)
     elevator → Kumar (30min)
     housekeeping → Lakshmi (2-4hr)
     parking → Manjunath (1hr)
7. IMPORTANT: When you create a ticket, you MUST set conversation_complete to true. The call ends after the ticket is confirmed.

RESPONSE FORMAT — valid JSON only:
{
  "response_text": "MUST BE 100% IN RESIDENT'S LANGUAGE AND SCRIPT. NO ENGLISH.",
  "ticket_created": true/false,
  "ticket": {
    "category": "plumbing",
    "flat_number": "B-204",
    "priority": "urgent",
    "summary_en": "English summary for admin dashboard only",
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
    messages.push({ role: 'user', content: `[Language: ${language_code}] ${text}` });

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

    return res.status(200).json({
      agent_response: agentResponse.response_text,
      ticket: agentResponse.ticket_created ? agentResponse.ticket : null,
      conversation_complete: agentResponse.conversation_complete || false,
      assistant_message: { role: 'assistant', content: assistantMessage }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Chat error.' });
  }
};
