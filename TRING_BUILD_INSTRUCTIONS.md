# BUILD: Tring — AI Voice Agent for Apartment Management
# Tring · ट्रिंग · Your apartment called. AI answered.
# "Your residents speak 10 languages. Your service desk speaks all of them."
# Deadline: Feb 11 — Sarvam Bulbul Challenge
# Stack: HTML/CSS/JS + Vercel Serverless + Full Sarvam AI Stack

---

## WHAT WE'RE BUILDING

A dark, premium SaaS product website (like livekit.io) for a multilingual voice AI agent. The LIVE DEMO is embedded right in the hero section — judge lands on the page, speaks into the demo, hears Bulbul V3 respond. No navigation needed.

**This should NOT look like a hackathon project. It should look like a funded startup's website.**

---

## DESIGN REFERENCE

Study livekit.io for design inspiration:
- Dark background (#0a0a0f or similar near-black)
- Bold white headlines, large font
- Subtle gradient accents (not flat)
- Interactive demo embedded in hero
- Smooth scroll sections
- Minimal, premium feel
- Monospace accents for tech credibility

---

## SINGLE PAGE ARCHITECTURE

Everything lives on ONE page (index.html) with smooth scroll sections:

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR (sticky)                                          │
│ Logo · Features · How it Works · Demo · Dashboard · CTA │
├─────────────────────────────────────────────────────────┤
│ SECTION 1: HERO                                          │
│ Left: Bold headline + subtext                            │
│ Right: LIVE VOICE DEMO (embedded, interactive)           │
├─────────────────────────────────────────────────────────┤
│ SECTION 2: TRUST BAR                                     │
│ "10 Languages · Auto-Detect · 24/7 · 4 AI Models"      │
├─────────────────────────────────────────────────────────┤
│ SECTION 3: HOW IT WORKS                                  │
│ 3-step visual: Speak → AI Understands → Ticket Created  │
├─────────────────────────────────────────────────────────┤
│ SECTION 4: FEATURES                                      │
│ 6 feature cards with icons                               │
├─────────────────────────────────────────────────────────┤
│ SECTION 5: LISTEN TO DEMOS                               │
│ Pre-recorded conversations in 5 languages                │
├─────────────────────────────────────────────────────────┤
│ SECTION 6: LIVE DASHBOARD                                │
│ Embedded real-time ticket dashboard                      │
├─────────────────────────────────────────────────────────┤
│ SECTION 7: TECH STACK                                    │
│ "Powered entirely by Sarvam AI" + product logos          │
├─────────────────────────────────────────────────────────┤
│ SECTION 8: PRICING                                       │
│ Starter / Pro / Enterprise (with "Contact Us")          │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                   │
│ Built with Sarvam AI · #TheMicIsYours                   │
└─────────────────────────────────────────────────────────┘
```

---

## FILE STRUCTURE

```
tring/
├── index.html              ← Single page: everything
├── css/
│   └── style.css           ← Dark theme, all styles
├── js/
│   ├── agent.js            ← Voice demo: recording + conversation
│   ├── dashboard.js        ← Live ticket display
│   ├── demos.js            ← Sample playback
│   └── animations.js       ← Scroll animations, waveform
├── audio/
│   ├── greeting.wav        ← Pre-generated greeting
│   ├── ring.mp3            ← Short ring tone
│   ├── demo_kn_*.wav       ← Kannada demo conversation
│   ├── demo_hi_*.wav       ← Hindi demo
│   ├── demo_ta_*.wav       ← Tamil demo
│   ├── demo_te_*.wav       ← Telugu demo
│   └── demo_bn_*.wav       ← Bengali demo
├── api/
│   ├── agent.js            ← Main: STT → Sarvam-M → TTS
│   └── tickets.js          ← Ticket store
├── generate_demos.py       ← Pre-generate demo audio
└── vercel.json
```

---

## SECTION 1: HERO — THE MOST IMPORTANT SECTION

This is where you win or lose the judge. 30 seconds.

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Tring 📞            Features  How it Works  Demo  Dashboard      │
│                                                                  │
│                                                                  │
│   Your residents speak                 ┌──────────────────────┐  │
│   10 different languages.              │                      │  │
│                                        │  ┌────────────────┐  │  │
│   Your service desk                    │  │ ◉ ~~~~~~~~~~~~ │  │  │
│   speaks all of them.                  │  │                │  │  │
│                                        │  │  Tring   │  │  │
│   AI-powered multilingual voice        │  │  ● Online      │  │  │
│   agent for apartment management.      │  │                │  │  │
│   Understands complaints in any        │  │  🎙️ Try Demo   │  │  │
│   Indian language. Creates tickets     │  │  Speak in any  │  │  │
│   instantly.                           │  │  language       │  │  │
│                                        │  │                │  │  │
│   [ ▶ Watch Demo ]  [ Try it Live ]   │  └────────────────┘  │  │
│                                        │                      │  │
│                                        │  Powered by          │  │
│                                        │  Sarvam AI           │  │
│                                        └──────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Layout (Mobile)
- Headline stacked on top
- Demo widget below, full width
- Scroll down for everything else

### Hero Headline
```html
<h1>
  Your residents speak<br>
  <span class="gradient-text">10 different languages.</span><br>
  Your service desk<br>
  speaks all of them.
</h1>
<p class="hero-sub">
  AI-powered multilingual voice agent for apartment management.
  Understands complaints in any Indian language. Creates tickets instantly.
</p>
```

### Gradient text effect
The "10 different languages" line should have a gradient text effect — warm orange to gold, like livekit.io's accent color treatment. CSS:
```css
.gradient-text {
  background: linear-gradient(135deg, #f97316, #eab308, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### HERO DEMO WIDGET (Right Side)

This is the embedded voice agent. NOT a separate page. It lives IN the hero.

```html
<div class="demo-widget">
  <div class="demo-header">
    <div class="demo-status">
      <span class="status-dot"></span>
      <span>Tring</span>
    </div>
    <span class="demo-label">LIVE DEMO</span>
  </div>
  
  <div class="demo-waveform" id="waveform">
    <!-- Animated waveform bars -->
  </div>
  
  <div class="demo-transcript" id="transcript">
    <!-- Conversation bubbles appear here -->
  </div>
  
  <div class="demo-controls">
    <button class="mic-button" id="mic-btn">
      <span class="mic-icon">🎙️</span>
      <span class="mic-label">Hold to speak</span>
    </button>
  </div>
  
  <div class="demo-footer">
    <span class="detected-lang" id="detected-lang"></span>
    <span class="powered-by">Powered by Sarvam AI</span>
  </div>
</div>
```

### Demo Widget Design
```
┌──────────────────────────────────┐
│ ● Tring          LIVE DEMO │  ← dark card, subtle border glow
├──────────────────────────────────┤
│                                  │
│    ▁ ▂ ▅ ▇ ▅ ▂ ▁ ▂ ▅ ▇ ▅ ▂    │  ← animated waveform (CSS bars)
│                                  │
├──────────────────────────────────┤
│                                  │
│ 🤖 नमस्कार, ट्रिंग सर्विस एजेंट.  │  ← agent messages (left)
│    अपनी भाषा में बोलिए.          │
│                                  │
│          ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್ 👤    │  ← user messages (right)
│                                  │
│ 🤖 ನಿಮ್ಮ ಫ್ಲಾಟ್ ನಂಬರ್ ಹೇಳಿ?    │
│                                  │
├──────────────────────────────────┤
│                                  │
│      ┌──────────────────┐        │
│      │  🎙️ Hold to speak │        │  ← large, glowing mic button
│      └──────────────────┘        │
│                                  │
│  ● Kannada detected    Sarvam AI │  ← footer with detected language
└──────────────────────────────────┘
```

### Demo Widget Styling
- Background: #12121a (slightly lighter than page bg)
- Border: 1px solid rgba(255,255,255,0.1) — subtle
- Border glow: box-shadow with orange/gold accent when active
- Waveform: CSS animated bars, orange/gold gradient
- Mic button: large circle, dark bg, orange border, GLOW on hover/press
- Transcript: scrollable, max-height ~300px
- Agent bubbles: left, dark bg with slight blue tint
- User bubbles: right, orange/gold tint
- "LIVE DEMO" badge: small pill, orange bg, uppercase
- Status dot: pulsing green animation

### Demo Widget States

**State 1: Idle (page load)**
```
Waveform: gentle idle animation (small bars)
Transcript: shows greeting text
Mic button: "Hold to speak"
Status: ● Online
```

**State 2: User starts speaking (mic pressed)**
```
Waveform: active animation (large bars, orange glow)
Mic button: pulsing red ring, "Listening..."
Status: ● Recording
Entire widget gets subtle orange border glow
```

**State 3: Processing**
```
Waveform: thinking animation (slow pulse)
Mic button: disabled, "Understanding..."
Status: ● Processing
Show detected language: "● Kannada detected"
```

**State 4: Agent speaking**
```
Waveform: speaking animation (medium bars)
Transcript: new agent bubble appears
Audio plays through speaker
Status: ● Speaking
```

**State 5: Ready for next turn**
```
Back to idle, but transcript shows history
Mic button: "Hold to speak"
```

---

## SECTION 2: TRUST BAR

Horizontal bar with key stats. Subtle bg difference from hero.

```html
<div class="trust-bar">
  <div class="trust-item">
    <span class="trust-number">10</span>
    <span class="trust-label">Indian Languages</span>
  </div>
  <div class="trust-item">
    <span class="trust-number">Auto</span>
    <span class="trust-label">Language Detection</span>
  </div>
  <div class="trust-item">
    <span class="trust-number">24/7</span>
    <span class="trust-label">Always Available</span>
  </div>
  <div class="trust-item">
    <span class="trust-number">4</span>
    <span class="trust-label">Sarvam AI Models</span>
  </div>
  <div class="trust-item">
    <span class="trust-number">&lt;5s</span>
    <span class="trust-label">Response Time</span>
  </div>
</div>
```

Styling: dark bg, numbers in large gradient text, labels in muted gray.

---

## SECTION 3: HOW IT WORKS

3-step visual with connecting lines/arrows.

```
     STEP 1                    STEP 2                    STEP 3
  ┌──────────┐            ┌──────────┐            ┌──────────┐
  │          │            │          │            │          │
  │  🗣️      │ ────────→ │  🧠      │ ────────→ │  ✅      │
  │          │            │          │            │          │
  └──────────┘            └──────────┘            └──────────┘
  
  Resident Speaks          AI Understands          Ticket Created
  
  "ಬಾತ್ರೂಮ್ ಪೈಪ್           Saarika detects         #1042 · Plumbing
   ಲೀಕ್ ಆಗ್ತಿದೆ"           Kannada. Sarvam-M       Assigned: Ramesh
                           extracts: plumbing,      ETA: 30 min
                           B-204, urgent.           Staff notified.
```

### Under the hood (tech detail for judges)
Show the Sarvam pipeline visually:
```
Audio → [Saarika STT] → Text + Language → [Sarvam-M] → Intent + Ticket → [Bulbul V3] → Voice Response
           auto-detect         ↓               understand        ↓              speak back
                          "kn-IN"          "plumbing, B-204"          "ನಿಮ್ಮ ದೂರು..."
```

Style this like a code/architecture diagram with monospace font and subtle connecting lines. Dark cards on darker background.

---

## SECTION 4: FEATURES

6 feature cards in a 3x2 grid (2x3 on mobile).

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 🌐               │  │ 🤖               │  │ 📋               │
│ Auto Language     │  │ Smart Triage     │  │ Instant Tickets  │
│ Detection         │  │                  │  │                  │
│                   │  │ AI categorizes:  │  │ Auto-creates     │
│ Speaks Kannada?   │  │ plumbing,        │  │ tickets with     │
│ Agent responds    │  │ electrical,      │  │ category,        │
│ in Kannada. No    │  │ security. Sets   │  │ priority, flat   │
│ menus. No setup.  │  │ priority: urgent │  │ number, and      │
│                   │  │ vs normal.       │  │ assigned staff.  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 👴               │  │ 📊               │  │ 🔔               │
│ No App Needed    │  │ Live Dashboard   │  │ Staff Alerts     │
│                  │  │                  │  │                  │
│ No downloads.    │  │ Managers see all │  │ Plumber gets     │
│ No typing. No    │  │ tickets in real  │  │ WhatsApp alert:  │
│ English. Works   │  │ time. Filter by  │  │ "Leak at B-204.  │
│ for elderly      │  │ category,        │  │ Go now." Auto-   │
│ residents too.   │  │ priority, status.│  │ dispatched.      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

Card styling: dark bg (#16161e), subtle border, icon on top, title bold white, description muted gray. Hover: slight lift + border glow.

---

## SECTION 5: LISTEN TO DEMOS

Pre-recorded sample conversations. Each is a card with a play button.

```
Listen to Tring handle real complaints in 5 languages.

┌─────────────────────────────────────────────────────┐
│ ▶  ಕನ್ನಡ                                            │
│    Plumbing complaint — "ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್"         │
│    ━━━━━━━━●━━━━━━━━━━━━ 0:28                       │
│    Kannada · Plumbing · Ticket #1042                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▶  हिन्दी                                            │
│    Electrical issue — "बिजली चली गई है"               │
│    ━━━━━━━━━━━━━━━━━━━━━ 0:32                       │
│    Hindi · Electrical · Ticket #1043                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▶  தமிழ்                                             │
│    Parking issue — "பார்க்கிங்ல அந்நிய வண்டி"        │
│    ━━━━━━━━━━━━━━━━━━━━━ 0:30                       │
│    Tamil · Security · Ticket #1044                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▶  తెలుగు                                            │
│    Elevator issue — "లిఫ్ట్ పనిచేయడం లేదు"           │
│    ━━━━━━━━━━━━━━━━━━━━━ 0:28                       │
│    Telugu · Elevator · Ticket #1045                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▶  বাংলা                                             │
│    Housekeeping — "ফ্লোরে জল জমে আছে"                │
│    ━━━━━━━━━━━━━━━━━━━━━ 0:26                       │
│    Bengali · Housekeeping · Ticket #1046             │
└─────────────────────────────────────────────────────┘
```

Each demo plays all turns (agent greeting → resident complaint → agent asks flat → resident answers → agent confirms ticket) as one continuous audio. Pre-stitch them into single files per language.

Card styling: dark bg, left accent border in orange, progress bar in orange/gold gradient, language tag as small pill.

---

## SECTION 6: LIVE DASHBOARD

Embedded dashboard section. Shows tickets created from the hero demo AND pre-seeded sample tickets.

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Live Dashboard — Sunrise Apartments                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Filters: [All] [Urgent] [Plumbing] [Electrical] [Security] │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 🔴 URGENT  #1042  Plumbing              2 min ago  │     │
│  │ B-204 · ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್ · Assigned: Ramesh      │     │
│  │ Lang: ಕನ್ನಡ · ETA: 30 min              ● Open      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 🟡 NORMAL  #1041  Electrical           15 min ago  │     │
│  │ A-105 · गलियारे की लाइट · Assigned: Suresh         │     │
│  │ Lang: हिन्दी · ETA: 2 hrs              ● Open      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 🟢 NORMAL  #1040  Housekeeping         1 hr ago    │     │
│  │ C-301 · பொது பகுதி சுத்தம் · Assigned: Lakshmi     │     │
│  │ Lang: தமிழ் · ETA: 4 hrs              ● Resolved   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key behavior:
- Pre-seeded with 2-3 sample tickets so it's never empty
- When judge uses the hero demo and creates a ticket, it appears HERE in real-time with a slide-in animation + subtle glow
- This is the "wow" moment — speak in Kannada up top, see ticket appear below

### Real-time update:
- Use localStorage as ticket store
- Dashboard polls every 2 seconds
- New tickets animate in with a flash/glow effect
- Urgent tickets have red left border, normal have yellow, resolved have green

---

## SECTION 7: TECH STACK / POWERED BY

Show the Sarvam AI stack prominently. This is the contest pitch.

```
Powered entirely by Sarvam AI

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Saarika  │→ │ Sarvam-M │→ │Translate │→ │ Bulbul   │
│ v2.5     │  │          │  │ (Mayura) │  │ V3       │
│          │  │          │  │          │  │          │
│ Speech   │  │ Understand│  │ Cross-   │  │ Voice    │
│ to Text  │  │ Intent   │  │ language │  │ Response │
│ + Auto   │  │ + Extract│  │ support  │  │ in any   │
│ Detect   │  │ Details  │  │          │  │ language │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

4 Sarvam products. Every interaction. The ultimate showcase.
```

Style: horizontal pipeline with arrow connectors. Each box is a dark card with subtle glow. Model names in monospace. Orange/gold accent on arrows.

---

## SECTION 8: PRICING

Makes it look like a real product. Use "Contact Us" for Enterprise.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Starter    │  │     Pro      │  │  Enterprise  │
│              │  │  POPULAR     │  │              │
│  ₹4,999/mo  │  │ ₹14,999/mo  │  │  Contact Us  │
│              │  │              │  │              │
│  Up to 100   │  │  Up to 500  │  │  Unlimited   │
│  units       │  │  units      │  │  units       │
│              │  │              │  │              │
│  5 languages │  │ 10 languages│  │ 10 languages │
│  Basic dash  │  │ Full dash   │  │ Custom dash  │
│  Email       │  │ WhatsApp    │  │ API access   │
│  support     │  │ alerts      │  │ Priority     │
│              │  │ Priority    │  │ support      │
│              │  │ support     │  │ SLA          │
│              │  │              │  │              │
│ [Start Free] │  │ [Start Free]│  │ [Contact Us] │
└──────────────┘  └──────────────┘  └──────────────┘
```

"Pro" card should be highlighted — taller, slight border glow, "POPULAR" badge.

---

## SECTION 9: FOOTER

```html
<footer>
  <div class="footer-brand">
    <h3>ट्रिंग Tring</h3>
    <p>AI Voice Agent for Apartment Management</p>
  </div>
  <div class="footer-links">
    <a href="#features">Features</a>
    <a href="#demo">Demo</a>
    <a href="#dashboard">Dashboard</a>
    <a href="#pricing">Pricing</a>
  </div>
  <div class="footer-contest">
    🎙️ Built with Sarvam AI — Saarika · Sarvam-M · Translate · Bulbul V3
    <br>
    #TheMicIsYours · Bulbul Challenge 2025
  </div>
  <div class="footer-languages">
    हिन्दी · ಕನ್ನಡ · தமிழ் · తెలుగు · മലయാളം · বাংলা · मराठी · ગુજરાતી · ଓଡ଼ିଆ · ਪੰਜਾਬੀ
  </div>
</footer>
```

---

## COMPLETE CSS DESIGN SYSTEM (style.css)

### Colors
```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0f;        /* main page background */
  --bg-secondary: #12121a;      /* cards, sections */
  --bg-tertiary: #1a1a25;       /* elevated elements */
  --bg-widget: #0d0d14;         /* demo widget bg */
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --text-muted: #606070;
  
  /* Accents */
  --accent-orange: #f97316;
  --accent-gold: #eab308;
  --accent-gradient: linear-gradient(135deg, #f97316, #eab308);
  
  /* Status */
  --status-urgent: #ef4444;
  --status-normal: #eab308;
  --status-resolved: #22c55e;
  --status-online: #22c55e;
  
  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(249, 115, 22, 0.5);
  
  /* Glows */
  --glow-orange: 0 0 20px rgba(249, 115, 22, 0.15);
  --glow-active: 0 0 30px rgba(249, 115, 22, 0.25);
}
```

### Typography
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* For Indian scripts */
.indic-text {
  font-family: 'Noto Sans', 'Noto Sans Kannada', 'Noto Sans Devanagari', 
               'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Bengali', sans-serif;
  line-height: 1.8;
}

/* Monospace for tech elements */
.mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

h1 { font-size: 3.5rem; font-weight: 700; line-height: 1.1; }
h2 { font-size: 2.5rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }

/* Large headline on mobile */
@media (max-width: 768px) {
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.8rem; }
}
```

### Key Components

**Navbar:** Sticky, dark, blur backdrop
```css
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 100;
  padding: 1rem 2rem;
}
```

**Demo Widget:** The star of the show
```css
.demo-widget {
  background: var(--bg-widget);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 1.5rem;
  width: 380px;
  box-shadow: var(--glow-orange);
  transition: box-shadow 0.3s;
}

.demo-widget.active {
  border-color: var(--border-active);
  box-shadow: var(--glow-active);
}
```

**Mic Button:**
```css
.mic-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 2px solid var(--accent-orange);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.mic-button:hover {
  box-shadow: 0 0 25px rgba(249, 115, 22, 0.3);
}

.mic-button.recording {
  border-color: var(--status-urgent);
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
```

**Waveform Animation:**
```css
.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 40px;
}

.waveform .bar {
  width: 3px;
  background: var(--accent-gradient);
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
}

.waveform .bar:nth-child(1) { animation-delay: 0s; }
.waveform .bar:nth-child(2) { animation-delay: 0.1s; }
.waveform .bar:nth-child(3) { animation-delay: 0.2s; }
/* ... more bars */

@keyframes wave {
  0%, 100% { height: 8px; }
  50% { height: 35px; }
}

/* Idle: small gentle movement */
.waveform.idle .bar {
  animation-duration: 2s;
}

/* Active: fast, large movement */
.waveform.active .bar {
  animation-duration: 0.5s;
}
```

**Feature Cards:**
```css
.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--border-active);
  transform: translateY(-4px);
  box-shadow: var(--glow-orange);
}
```

**Ticket Cards (Dashboard):**
```css
.ticket-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-left: 4px solid var(--status-normal);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

.ticket-card.urgent {
  border-left-color: var(--status-urgent);
}

.ticket-card.new {
  animation: flashIn 0.5s ease-out;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes flashIn {
  0% { opacity: 0; box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
  100% { opacity: 1; box-shadow: 0 0 20px rgba(249, 115, 22, 0.1); }
}
```

### Responsive
```css
/* Desktop: side by side hero */
@media (min-width: 769px) {
  .hero { display: flex; align-items: center; gap: 4rem; }
  .hero-text { flex: 1; }
  .demo-widget { flex: 0 0 380px; }
}

/* Mobile: stacked */
@media (max-width: 768px) {
  .hero { flex-direction: column; text-align: center; }
  .demo-widget { width: 100%; max-width: 380px; margin: 0 auto; }
}
```

---

## BACKEND API — /api/agent.js

**Same as previous build instructions. No changes to backend logic.**

The agent pipeline remains:
1. Saarika v2.5 STT (language_code: "unknown" for auto-detect)
2. Sarvam-M (system prompt: apartment service agent, JSON output)
3. Bulbul V3 TTS (respond in detected language)

```javascript
// /api/agent.js
// FULL CODE — same as previous build doc

const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio_base64, conversation_history } = req.body;

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
      return res.status(400).json({ error: 'Could not hear clearly.' });
    }

    // STEP 2: SARVAM-M — Understand intent
    const systemPrompt = `You are Tring, a multilingual AI service agent for "Sunrise Apartments".

RULES:
1. ALWAYS respond in the SAME language the resident speaks.
2. Extract: category, flat_number, priority, problem description.
3. Categories: plumbing, electrical, security, elevator, parking, housekeeping, general
4. Priority: urgent (water/gas leak, power outage, security) or normal
5. If flat number missing, ask for it in their language.
6. Keep responses SHORT — 2-3 sentences. This is a phone call.
7. When complete, confirm: ticket number, category, staff name, ETA.
   - plumbing: Ramesh (30min urgent, 2hr normal)
   - electrical: Suresh (30min urgent, 2hr normal)
   - security: Venkatesh (15min)
   - elevator: Kumar (30min)
   - housekeeping: Lakshmi (2-4hr)
   - parking: Manjunath (1hr)
8. End with "anything else?" in their language.

RESPONSE FORMAT — valid JSON only:
{
  "response_text": "response in resident's language",
  "ticket_created": true/false,
  "ticket": {
    "category": "plumbing",
    "flat_number": "B-204",
    "priority": "urgent",
    "summary_en": "Bathroom pipe leaking",
    "summary_local": "ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್",
    "assigned_to": "Ramesh",
    "eta": "30 minutes"
  },
  "conversation_complete": true/false
}`;

    const messages = [{ role: 'system', content: systemPrompt }];
    if (conversation_history) {
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

    // STEP 3: BULBUL V3 TTS — Speak response
    const ttsLang = detectedLang || 'hi-IN';
    const chunks = splitText(agentResponse.response_text, 900);
    let audioChunks = [];

    for (const chunk of chunks) {
      const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': process.env.SARVAM_API_KEY
        },
        body: JSON.stringify({
          input: chunk,
          model: 'bulbul:v3',
          language_code: ttsLang,
          pace: 0.95,
          loudness: 1.5
        })
      });
      const ttsData = await ttsResponse.json();
      audioChunks.push(ttsData.audio);
    }

    return res.status(200).json({
      resident_text: residentText,
      detected_language: detectedLang,
      agent_response: agentResponse.response_text,
      audio_chunks: audioChunks,
      ticket: agentResponse.ticket_created ? agentResponse.ticket : null,
      conversation_complete: agentResponse.conversation_complete || false,
      assistant_message: { role: 'assistant', content: assistantMessage }
    });

  } catch (error) {
    console.error('Agent error:', error);
    return res.status(500).json({ error: 'Agent error. Please try again.' });
  }
};

function splitText(text, maxLength) {
  if (text.length <= maxLength) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLength) { chunks.push(remaining); break; }
    let splitAt = remaining.lastIndexOf('.', maxLength);
    if (splitAt === -1 || splitAt < maxLength / 2) splitAt = remaining.lastIndexOf(' ', maxLength);
    if (splitAt === -1) splitAt = maxLength;
    chunks.push(remaining.substring(0, splitAt + 1).trim());
    remaining = remaining.substring(splitAt + 1).trim();
  }
  return chunks;
}
```

---

## FRONTEND AGENT LOGIC (js/agent.js)

```javascript
// agent.js — Hero demo widget logic

let conversationHistory = [];
let detectedLanguage = null;
let mediaRecorder;
let audioChunks = [];

const micBtn = document.getElementById('mic-btn');
const transcript = document.getElementById('transcript');
const waveform = document.getElementById('waveform');
const detectedLangEl = document.getElementById('detected-lang');
const demoWidget = document.querySelector('.demo-widget');

// HOLD TO SPEAK
micBtn.addEventListener('mousedown', startRecording);
micBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRecording(); });
micBtn.addEventListener('mouseup', finishRecording);
micBtn.addEventListener('touchend', (e) => { e.preventDefault(); finishRecording(); });

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.start();
    
    // UI: recording state
    micBtn.classList.add('recording');
    micBtn.querySelector('.mic-label').textContent = 'Listening...';
    waveform.classList.remove('idle');
    waveform.classList.add('active');
    demoWidget.classList.add('active');
  } catch (err) {
    console.error('Mic error:', err);
  }
}

async function finishRecording() {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return;
  
  const audioBase64 = await new Promise((resolve) => {
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    };
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  });

  // UI: processing state
  micBtn.classList.remove('recording');
  micBtn.querySelector('.mic-label').textContent = 'Understanding...';
  micBtn.disabled = true;
  waveform.classList.remove('active');
  waveform.classList.add('processing');

  // Send to agent
  try {
    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio_base64: audioBase64,
        conversation_history: conversationHistory
      })
    });
    const data = await response.json();

    if (data.error) {
      addBubble('agent', 'Sorry, could not understand. Please try again.');
      resetMic();
      return;
    }

    // Show detected language
    detectedLanguage = data.detected_language;
    const langNames = {
      'hi-IN': 'Hindi', 'kn-IN': 'Kannada', 'ta-IN': 'Tamil',
      'te-IN': 'Telugu', 'ml-IN': 'Malayalam', 'bn-IN': 'Bengali',
      'mr-IN': 'Marathi', 'gu-IN': 'Gujarati', 'od-IN': 'Odia', 'pa-IN': 'Punjabi'
    };
    detectedLangEl.innerHTML = `<span class="lang-dot"></span> ${langNames[detectedLanguage] || detectedLanguage} detected`;

    // Add user bubble
    addBubble('user', data.resident_text);

    // Update conversation history
    conversationHistory.push({
      role: 'user',
      content: `[Language: ${data.detected_language}] ${data.resident_text}`
    });
    conversationHistory.push(data.assistant_message);

    // Add agent bubble
    addBubble('agent', data.agent_response);

    // Play audio
    waveform.classList.remove('processing');
    waveform.classList.add('speaking');
    await playAudioChunks(data.audio_chunks);
    waveform.classList.remove('speaking');

    // If ticket created, save to localStorage for dashboard
    if (data.ticket) {
      const tickets = JSON.parse(localStorage.getItem('tring_tickets') || '[]');
      data.ticket.id = 1042 + tickets.length;
      data.ticket.timestamp = new Date().toISOString();
      data.ticket.status = 'open';
      data.ticket.language = detectedLanguage;
      tickets.push(data.ticket);
      localStorage.setItem('tring_tickets', JSON.stringify(tickets));
      
      // Show ticket notification in widget
      showTicketNotification(data.ticket);
    }

    resetMic();

  } catch (err) {
    console.error('Error:', err);
    addBubble('agent', 'Connection error. Please try again.');
    resetMic();
  }
}

function resetMic() {
  micBtn.disabled = false;
  micBtn.querySelector('.mic-label').textContent = 'Hold to speak';
  waveform.classList.remove('active', 'processing', 'speaking');
  waveform.classList.add('idle');
  demoWidget.classList.remove('active');
}

function addBubble(speaker, text) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${speaker}`;
  bubble.innerHTML = `<span class="bubble-icon">${speaker === 'agent' ? '🤖' : '👤'}</span><span class="bubble-text">${text}</span>`;
  transcript.appendChild(bubble);
  transcript.scrollTop = transcript.scrollHeight;
}

function showTicketNotification(ticket) {
  const notif = document.createElement('div');
  notif.className = 'ticket-notif';
  notif.innerHTML = `✅ Ticket #${ticket.id} created · ${ticket.category} · ${ticket.assigned_to}`;
  transcript.appendChild(notif);
  transcript.scrollTop = transcript.scrollHeight;
}

function playAudioChunks(chunks) {
  return new Promise((resolve) => {
    let i = 0;
    function next() {
      if (i >= chunks.length) { resolve(); return; }
      const audio = new Audio('data:audio/wav;base64,' + chunks[i]);
      audio.onended = () => { i++; next(); };
      audio.play();
    }
    next();
  });
}
```

---

## DEMO AUDIO GENERATION (generate_demos.py)

Same as previous doc — generates 5 demo conversations in Kannada, Hindi, Tamil, Telugu, Bengali. Each demo is a full agent↔resident conversation pre-generated as audio files.

For a cleaner demo experience, stitch all turns into ONE audio file per language with short pauses between turns. Use ffmpeg or pydub:

```python
# After generating individual turn audio files, stitch them:
from pydub import AudioSegment

pause = AudioSegment.silent(duration=1000)  # 1 sec pause

demo = AudioSegment.empty()
for turn_file in turn_files:
    demo += AudioSegment.from_wav(turn_file) + pause

demo.export(f"audio/demo_{lang}_full.wav", format="wav")
```

This way, each demo card has ONE play button → plays the full conversation.

---

## VERCEL CONFIG

```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" },
    { "src": "**/*.html", "use": "@vercel/static" },
    { "src": "css/**", "use": "@vercel/static" },
    { "src": "js/**", "use": "@vercel/static" },
    { "src": "audio/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

Environment: `SARVAM_API_KEY=<key>`

---

## DEPLOY CHECKLIST

### Must-have (contest minimum)
1. [ ] Dark SaaS landing page with hero section
2. [ ] Demo widget in hero — mic works, records, sends to API
3. [ ] /api/agent — Saarika (auto-detect) → Sarvam-M → Bulbul V3
4. [ ] Agent responds in detected language
5. [ ] Transcript shows in demo widget
6. [ ] Waveform animations (idle, recording, speaking)
7. [ ] Demo audio section — at least 3 languages playable
8. [ ] Contest banner / Sarvam AI attribution
9. [ ] Mobile responsive
10. [ ] Deploy to Vercel

### Should-have (makes it win)
11. [ ] Multi-turn conversation (agent asks flat number)
12. [ ] Dashboard section with live tickets
13. [ ] Ticket appears in dashboard when created from demo
14. [ ] Pre-seeded sample tickets in dashboard
15. [ ] All 5 demo conversations generated
16. [ ] Pricing section
17. [ ] "How it Works" section with pipeline diagram
18. [ ] Smooth scroll navigation
19. [ ] Scroll-triggered animations (fade in sections)

### Nice-to-have (polish)
20. [ ] Greeting audio plays when demo widget loads
21. [ ] Ring tone animation before greeting
22. [ ] Feature cards with hover effects
23. [ ] Gradient text effects on headline
24. [ ] "LIVE DEMO" badge pulsing
25. [ ] Tech stack pipeline animation

---

## PRIORITY BUILD ORDER

1. **index.html** — Full page structure with all sections
2. **style.css** — Dark theme, demo widget, all components
3. **js/agent.js** — Demo widget recording + API integration
4. **api/agent.js** — Saarika → Sarvam-M → Bulbul V3 pipeline
5. **Demo audio** — Run generate_demos.py for 5 languages
6. **js/dashboard.js** — Live ticket display
7. **Animations** — Waveform, scroll, transitions
8. **Deploy**

---

## CRITICAL NOTES

1. **Dark theme is NON-NEGOTIABLE** — this is a product, not a hackathon project
2. **Demo widget must be in hero** — judge should NOT have to scroll to try it
3. **Saarika: language_code "unknown"** for auto-detect
4. **Sarvam-M: OpenAI-compatible** at api.sarvam.ai/v1/chat/completions
5. **Auth headers differ:** Saarika/Bulbul use api-subscription-key, Sarvam-M uses Bearer token
6. **Bulbul V3 only** — model: "bulbul:v3"
7. **1000 char limit** per TTS call
8. **localStorage for tickets** — dashboard reads from same store
9. **Hold-to-speak** — handle both mouse AND touch events
10. **Test at least Kannada + Hindi** end-to-end before deploying
11. **Inter font** — load from Google Fonts for the clean SaaS look
12. **Noto Sans** — load for Indian script rendering
