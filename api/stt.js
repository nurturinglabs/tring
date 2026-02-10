const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio_base64 } = req.body;
    if (!audio_base64) {
      return res.status(400).json({ error: 'No audio provided.' });
    }

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

    if (!sttData.transcript || sttData.transcript.trim() === '') {
      return res.status(400).json({ error: 'Could not hear clearly.' });
    }

    return res.status(200).json({
      transcript: sttData.transcript,
      language_code: sttData.language_code
    });
  } catch (error) {
    console.error('STT error:', error);
    return res.status(500).json({ error: 'STT error.' });
  }
};
