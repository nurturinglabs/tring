const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language_code } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided.' });
    }

    const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        inputs: [text.substring(0, 900)],
        model: 'bulbul:v3',
        language_code: language_code || 'hi-IN'
      })
    });

    const ttsData = await ttsResponse.json();

    if (ttsData.audios && ttsData.audios[0]) {
      return res.status(200).json({ audio: ttsData.audios[0] });
    } else {
      return res.status(500).json({ error: 'TTS failed', details: ttsData });
    }
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: 'TTS error.' });
  }
};
