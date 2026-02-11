<p align="center">
  <h1 align="center">🏰 The Player's Companion</h1>
  <p align="center">A D&D 5e digital character sheet & AI companion — built with React, TypeScript, and Google Gemini</p>
</p>

---

## 🎯 Overview

The Player's Companion is a mobile-first web app for managing D&D 5th Edition characters. Create characters with a guided wizard, track stats and inventory, roll dice, level up with AI assistance, and consult an AI Dungeon Master grounded in official rulebook text.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧙 **Character Creation Wizard** | 6-step guided flow — Identity, Ability Scores (Standard Array / Point Buy / Manual), Skills, Spells (data-driven PHB lists), Concept, Review + AI portrait |
| 🛒 **Starter Equipment Shop** | Roll or take average starting gold, browse 5 gear categories, buy items |
| 📋 **Dashboard** | Card-stack UI with swipeable detail views — Vitals, Combat, Skills, Features, Spells, Inventory, Journal |
| 🎲 **Dice Roller** | Complex expressions (`2d6+4`), crit/fail detection on d20 rolls |
| 📖 **Spell Slot Tracking** | Full/half/pact caster progression tables from the PHB |
| ⬆️ **Level Up** | AI-assisted leveling with HP rolls, ASI, new features, spell slot updates |
| 🤖 **Ask the DM** | Multi-turn AI chat grounded in uploaded PHB/DMG/MM/Basic Rules PDFs |
| 🛏️ **Rest System** | Short & long rest with hit dice recovery |
| 🗺️ **Campaign Manager** | Create or join campaigns with shareable codes |
| 🔐 **Authentication** | Firebase Google sign-in + anonymous guest mode |
| 🎨 **AI Portraits** | Gemini 2.5 Flash image model for character portraits |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | Lucide React |
| **AI** | Google Gemini (`@google/genai`) — `gemini-3-flash-preview` (text), `gemini-2.5-flash-image` (portraits) |
| **Auth** | Firebase Authentication (Google + Anonymous providers) |
| **Storage** | localStorage (client-side) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- A [Google AI Studio](https://aistudio.google.com/) API key
- A [Firebase](https://console.firebase.google.com/) project with Authentication enabled (Google + Anonymous sign-in)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Hams-Ollo/The-Players-Companion.git
cd The-Players-Companion
npm install
```

### 2️⃣ Configure Environment

Create a `.env` file in the project root:

```env
# 🔑 Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key

# 🔥 Firebase Configuration (required for auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 📚 Gemini File URIs (optional — set after running upload-pdfs)
VITE_GEMINI_FILE_URI_BASIC=
VITE_GEMINI_FILE_URI_DMG=
VITE_GEMINI_FILE_URI_MM=
VITE_GEMINI_FILE_URI_PHB=
```

> ⚠️ **Never commit `.env` to version control.** It's already in `.gitignore`.

### 3️⃣ (Optional) Upload Reference PDFs

Place your D&D reference PDFs in `reference-docs/`, then run:

```bash
npm run upload-pdfs
```

This uploads PDFs to Google's Gemini File API and writes the file URIs back to `.env`. On app startup, a context cache is created so all AI answers are grounded in actual book text with page citations.

### 4️⃣ Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5️⃣ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── App.tsx                     # 🏠 Root — auth gate, character state, routing
├── constants.tsx               # 📊 D&D data: races, classes, spells, features, slot tables
├── types.ts                    # 📝 TypeScript interfaces (CharacterData, Campaign, etc.)
├── utils.ts                    # 🔧 Rate limiting, stat recalculation, helpers
├── vite.config.ts              # ⚙️ Vite config with env var injection
├── index.html                  # 🌐 HTML entry point
│
├── lib/
│   └── gemini.ts               # 🤖 Centralized Gemini AI client
│
├── contexts/
│   └── AuthContext.tsx          # 🔐 Firebase auth provider + hooks
│
├── components/
│   ├── LoginScreen.tsx          # 🚪 Google sign-in / guest mode
│   ├── CharacterSelection.tsx   # 📜 Character list + create/delete
│   ├── CharacterCreationWizard.tsx # 🧙 6-step character builder
│   ├── Dashboard.tsx            # 📋 Main character view shell
│   ├── CardStack.tsx            # 🃏 Swipeable card-stack dashboard
│   ├── DetailOverlay.tsx        # 🔍 Fullscreen detail view wrapper
│   ├── DiceRollModal.tsx        # 🎲 Dice roller with expression parser
│   ├── LevelUpModal.tsx         # ⬆️ AI-powered level up flow
│   ├── RestModal.tsx            # 🛏️ Short/long rest with hit dice
│   ├── ShopModal.tsx            # 🏪 In-game equipment shop
│   ├── AskDMModal.tsx           # 🤖 AI DM multi-turn chat
│   ├── ItemDetailModal.tsx      # 🔎 AI-powered item/feature lookup
│   ├── CampaignManager.tsx      # 🗺️ Create/join campaigns
│   ├── SettingsModal.tsx        # ⚙️ Character stat editor
│   ├── PortraitGenerator.tsx    # 🎨 AI portrait generation
│   ├── TranscriptionButton.tsx  # 🎙️ Voice-to-text input
│   │
│   └── details/
│       ├── VitalsDetail.tsx     # ❤️ HP, AC, speed, conditions
│       ├── CombatDetail.tsx     # ⚔️ Attacks, actions, initiative
│       ├── SkillsDetail.tsx     # 🎯 Skill list with proficiency
│       ├── FeaturesDetail.tsx   # ✨ Class/racial features
│       ├── SpellsDetail.tsx     # 📖 Spellbook + slot tracking
│       ├── InventoryDetail.tsx  # 🎒 Items, gold, encumbrance
│       └── JournalDetail.tsx    # 📓 Session notes + AI chronicles
│
└── reference-docs/              # 📚 D&D PDFs (gitignored)
```

## 🔒 Rate Limiting

Client-side multi-layer protection to prevent API abuse:

- **Per-call throttle:** 2-second minimum between AI requests
- **Tamper detection:** Rate limit state stored in closure (not localStorage)

## 📚 Documentation

- [🏗️ Architecture](docs/ARCHITECTURE.md) — System design, data flow, component map
- [🔌 API Reference](docs/API.md) — Gemini AI integration, helper functions, data schemas
- [🤝 Contributing](docs/CONTRIBUTING.md) — Setup, code style, PR guidelines

## 🗺️ Roadmap

- [ ] 📖 Spellbook management (prepare/swap spells)
- [ ] 💾 Firestore cloud sync for characters
- [ ] 📤 Export/import character JSON
- [ ] 🛡️ Error boundaries for graceful failure
- [ ] 🎨 Tailwind proper build pipeline (replace CDN)
- [ ] 🔐 Backend proxy for API keys

## 📄 License

MIT
