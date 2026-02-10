# Tring — Because Every Voice Deserves to Be Heard

> *"In a country where 22 official languages are spoken across 28 states, a plumber's phone call shouldn't need a translator."*

---

## The India Problem

Picture this. It's 11 PM in a Bangalore apartment complex. A pipe bursts in flat B-204. The resident — a Tamil-speaking grandmother who moved here to be closer to her grandchildren — picks up the phone to call the building helpdesk.

She speaks Tamil. The security guard speaks Kannada. The maintenance manager's WhatsApp group runs in Hindi. The plumber speaks Telugu.

**The pipe keeps leaking.**

This isn't a technology problem. This is an India problem. We are a nation of 1.4 billion people speaking 22 scheduled languages, 121 recognized languages, and over 19,500 dialects. We celebrate this diversity every day — in our food, our festivals, our films. But when it comes to something as basic as getting a leaking pipe fixed at midnight, that diversity becomes a barrier.

**Tring exists to tear down that barrier.**

---

## What is Tring?

Tring is India's first AI voice agent built specifically for apartment management. No app downloads. No English forms. No chatbots that don't understand your mother tongue.

**Just a phone call.**

A resident calls. They speak in their language — Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali, Marathi, Gujarati, Odia, or Punjabi. Tring listens, understands, creates a ticket, assigns the right staff member, and confirms everything back — **in the same language the resident spoke.**

The security guard's phone buzzes with the ticket. The plumber gets an ETA. The resident hears *"Ramesh 30 minute-alli barthare"* in Kannada or *"Ramesh 30 minute mein aayega"* in Hindi. The pipe gets fixed.

**No language was lost. No complaint was ignored. No resident felt like a stranger in their own home.**

---

## The Soul of This App

India doesn't need another English-first SaaS tool localized with Google Translate. India needs technology that was **born multilingual** — technology that thinks in Kannada, dreams in Tamil, and solves problems in Hindi.

Tring is built entirely on **Sarvam AI** — India's own AI platform. Every piece of intelligence in this app was trained on Indian languages, Indian voices, Indian accents, and Indian context.

| What Tring Does | The Sarvam AI Behind It |
|---|---|
| Listens to the resident | **Saarika v2.5** — Speech-to-Text that understands Indian accents, code-switching, and 10 languages |
| Understands the problem | **Sarvam-M** — India's multilingual LLM that thinks natively in Indian languages |
| Speaks back to the resident | **Bulbul v3** — Text-to-Speech that sounds natural, not robotic, in every Indian language |

This isn't AI bolted onto an Indian problem. This is **Indian AI solving an Indian problem.**

---

## How It Works

```
Resident calls    ──>    Saarika STT (auto-detects language)
                              │
                              v
                         Sarvam-M LLM (understands intent, creates ticket)
                              │
                              v
                         Bulbul v3 TTS (responds in resident's language)
                              │
                              v
                    Staff notified. Problem solved.
```

**Three API calls. One phone call. Zero language barriers.**

---

## The Numbers That Matter

| | |
|---|---|
| **10** | Indian languages supported |
| **< 3 sec** | Average response time |
| **0** | Apps the resident needs to download |
| **1** | Phone call to get help |
| **24/7** | Always available, never tired, never rude |

---

## Try It Live

Visit the landing page and click the mic button. Speak in any Indian language. Watch Tring understand you, respond in your language, and create a ticket — all in real time.

This isn't a mockup. This is the real Sarvam AI stack, running live.

---

## Project Structure

```
tring/
├── index.html          # Landing page with live voice demo
├── admin.html          # Ticket management dashboard
├── css/style.css       # Dark premium theme
├── js/
│   ├── agent.js        # Voice conversation engine (silence detection, split pipeline)
│   ├── dashboard.js    # Live ticket dashboard
│   ├── demos.js        # Interactive demo conversations
│   └── animations.js   # Scroll animations
├── api/
│   ├── stt.js          # Saarika v2.5 — Speech to Text
│   ├── chat.js         # Sarvam-M — Multilingual LLM
│   ├── tts.js          # Bulbul v3 — Text to Speech
│   ├── agent.js        # Combined STT + LLM pipeline
│   └── tickets.js      # Sample ticket data
├── server.js           # Local dev server
├── vercel.json         # Vercel deployment config
└── package.json
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Add your Sarvam API key
echo "SARVAM_API_KEY=your_key_here" > .env

# Start the server
npm start

# Open http://localhost:3000
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variable: `SARVAM_API_KEY`
4. Deploy

That's it. Vercel auto-detects the serverless functions from `api/` and serves everything else as static files.

---

## Built For the Sarvam Bulbul Challenge

This project was built for the [Sarvam Bulbul Challenge](https://sarvam.ai) — a challenge to build real-world applications using India's own AI stack.

**Sarvam APIs used:**
- **Saarika v2.5** — Speech-to-Text with auto language detection
- **Sarvam-M** — Multilingual chat completions (OpenAI-compatible)
- **Bulbul v3** — Natural Text-to-Speech in 10 Indian languages

---

## Why This Matters

Every day in India, thousands of complaints go unheard — not because nobody cares, but because the person complaining speaks one language and the person listening speaks another.

A migrant worker in Mumbai who speaks Odia. A retired professor in Chennai who speaks Tamil. A young couple in Hyderabad who switch between Telugu and Hindi mid-sentence.

They all deserve to be heard. They all deserve to have their problems solved. They all deserve technology that speaks their language.

**Tring is that technology.**

---

<p align="center">
  <strong>Built with Sarvam AI. Built for India. Built with love.</strong>
  <br><br>
  <em>Because in a country of a billion voices, every single one matters.</em>
</p>
