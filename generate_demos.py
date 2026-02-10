"""
generate_demos.py — Pre-generate demo audio conversations using Sarvam AI TTS (Bulbul V3)

Usage: python generate_demos.py
Requires: SARVAM_API_KEY environment variable

Generates 5 demo conversations (Kannada, Hindi, Tamil, Telugu, Bengali)
Each conversation has multiple turns stitched into a single audio file.
"""

import os
import json
import base64
import requests
import time

SARVAM_API_KEY = os.environ.get('SARVAM_API_KEY', 'sk_ty5by96e_1tspiQNWgpfdQMhKU2Kir8ZL')
TTS_URL = 'https://api.sarvam.ai/text-to-speech'
AUDIO_DIR = 'audio'

# Demo conversations
DEMOS = {
    'kn': {
        'lang_code': 'kn-IN',
        'turns': [
            "ನಮಸ್ಕಾರ! ಟ್ರಿಂಗ್ ಸರ್ವಿಸ್ ಏಜೆಂಟ್. ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ.",
            "ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್ ಆಗ್ತಿದೆ, ತುಂಬಾ ನೀರು ಬರ್ತಿದೆ.",
            "ನಿಮ್ಮ ಫ್ಲಾಟ್ ನಂಬರ್ ಹೇಳಿ?",
            "B-204",
            "ಟಿಕೆಟ್ ನಂಬರ್ 1042 ರಚಿಸಲಾಗಿದೆ. ಪ್ಲಂಬಿಂಗ್ ವಿಭಾಗ. ರಮೇಶ್ 30 ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತಾರೆ. ಬೇರೆ ಏನಾದರೂ ಸಹಾಯ ಬೇಕೇ?"
        ]
    },
    'hi': {
        'lang_code': 'hi-IN',
        'turns': [
            "नमस्कार! ट्रिंग सर्विस एजेंट. अपनी समस्या बताइए.",
            "बिजली चली गई है, पूरे फ्लैट में अंधेरा है.",
            "आपका फ्लैट नंबर बताइए?",
            "A-105",
            "टिकट नंबर 1043 बनाया गया. इलेक्ट्रिकल विभाग. सुरेश 30 मिनट में आएंगे. कुछ और मदद चाहिए?"
        ]
    },
    'ta': {
        'lang_code': 'ta-IN',
        'turns': [
            "வணக்கம்! ட்ரிங் சேவை முகவர். உங்கள் பிரச்சனை சொல்லுங்கள்.",
            "என் பார்க்கிங்ல யாரோ வண்டி நிறுத்தியிருக்காங்க.",
            "உங்கள் பிளாட் நம்பர் சொல்லுங்கள்?",
            "D-102",
            "டிக்கெட் நம்பர் 1044 உருவாக்கப்பட்டது. பாதுகாப்பு பிரிவு. வெங்கடேஷ் 15 நிமிடத்தில் வருவார். வேறு ஏதாவது உதவி வேண்டுமா?"
        ]
    },
    'te': {
        'lang_code': 'te-IN',
        'turns': [
            "నమస్కారం! ట్రింగ్ సర్వీస్ ఏజెంట్. మీ సమస్య చెప్పండి.",
            "లిఫ్ట్ పనిచేయడం లేదు, మూడో ఫ్లోర్ లో ఉన్నాం.",
            "మీ ఫ్లాట్ నంబర్ చెప్పండి?",
            "E-303",
            "టిక్కెట్ నంబర్ 1045 సృష్టించబడింది. ఎలివేటర్ విభాగం. కుమార్ 30 నిమిషాల్లో వస్తారు. ఇంకేమైనా సహాయం కావాలా?"
        ]
    },
    'bn': {
        'lang_code': 'bn-IN',
        'turns': [
            "নমস্কার! ট্রিং সার্ভিস এজেন্ট. আপনার সমস্যা বলুন.",
            "লবিতে জল জমে আছে, পিছলে যাওয়ার ভয় আছে.",
            "আপনার ফ্ল্যাট নম্বর বলুন?",
            "F-501",
            "টিকিট নম্বর 1046 তৈরি হয়েছে. হাউসকিপিং বিভাগ. লক্ষ্মী 2 ঘণ্টায় আসবেন. আর কিছু সাহায্য দরকার?"
        ]
    }
}


def generate_tts(text, lang_code):
    """Generate TTS audio using Sarvam Bulbul V3"""
    response = requests.post(
        TTS_URL,
        headers={
            'Content-Type': 'application/json',
            'api-subscription-key': SARVAM_API_KEY
        },
        json={
            'input': text,
            'model': 'bulbul:v3',
            'language_code': lang_code,
            'pace': 0.95,
            'loudness': 1.5
        }
    )
    data = response.json()
    if 'audio' in data:
        return base64.b64decode(data['audio'])
    else:
        print(f"  TTS error: {data}")
        return None


def generate_demo(lang_key, demo_info):
    """Generate all turns for a demo conversation"""
    print(f"\nGenerating {lang_key} demo...")

    all_audio = b''
    silence = b'\x00' * 16000  # ~0.5s silence at 16kHz

    for i, turn_text in enumerate(demo_info['turns']):
        print(f"  Turn {i+1}/{len(demo_info['turns'])}: {turn_text[:40]}...")
        audio_data = generate_tts(turn_text, demo_info['lang_code'])

        if audio_data:
            # Save individual turn
            turn_file = os.path.join(AUDIO_DIR, f"demo_{lang_key}_{i+1}.wav")
            with open(turn_file, 'wb') as f:
                f.write(audio_data)
            print(f"    Saved: {turn_file}")

            all_audio += audio_data + silence

        # Rate limiting
        time.sleep(0.5)

    # Save combined audio
    if all_audio:
        combined_file = os.path.join(AUDIO_DIR, f"demo_{lang_key}_full.wav")
        with open(combined_file, 'wb') as f:
            f.write(all_audio)
        print(f"  Combined: {combined_file}")


def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)

    print("=" * 50)
    print("Tring Demo Audio Generator")
    print("Using Sarvam AI Bulbul V3 TTS")
    print("=" * 50)

    for lang_key, demo_info in DEMOS.items():
        generate_demo(lang_key, demo_info)
        time.sleep(1)  # Rate limiting between languages

    print("\n" + "=" * 50)
    print("Done! All demo audio files generated.")
    print(f"Files saved in: {AUDIO_DIR}/")
    print("=" * 50)


if __name__ == '__main__':
    main()
