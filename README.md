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
| ☁️ **Cloud Sync** | Firestore character persistence for signed-in users — real-time sync across devices |
| 🎨 **AI Portraits** | Gemini 2.5 Flash image model for character portraits |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | Lucide React |
| **AI** | Google Gemini (`@google/genai`) — `gemini-2.5-flash` (text), `gemini-2.5-flash-image` (portraits) |
| **Auth** | Firebase Authentication (Google + Anonymous providers) |
| **Database** | Cloud Firestore (character sync for authenticated users) |
| **Storage** | localStorage (guest/offline fallback) |
| **Deployment** | Docker (multi-stage) → Google Cloud Run |

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

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Then edit `.env` with your Gemini API key and Firebase config. See [`.env.example`](.env.example) for all available variables with descriptions.

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
├── App.tsx                     # 🏠 Root — auth gate, routing (uses CharacterContext)
├── constants.tsx               # 📊 D&D data: races, classes, spells, features, slot tables
├── types.ts                    # 📝 TypeScript interfaces (CharacterData, Campaign, etc.)
├── utils.ts                    # 🔧 Rate limiting, stat recalculation, helpers
├── vite.config.ts              # ⚙️ Vite config with env var injection
├── index.html                  # 🌐 HTML entry point
├── Dockerfile                  # 🐳 Multi-stage build (node → nginx)
├── nginx.conf                  # 🌐 Production SPA server config
├── firebase.json               # 🔥 Firebase project config (Firestore rules + indexes)
├── firestore.rules             # 🔒 Firestore security rules
├── firestore.indexes.json      # 📇 Firestore composite indexes
│
├── lib/
│   ├── gemini.ts               # 🤖 Centralized Gemini AI client
│   └── firestore.ts            # 🔥 Firestore CRUD, real-time subscriptions, migration
│
├── contexts/
│   ├── AuthContext.tsx          # 🔐 Firebase auth provider + hooks
│   └── CharacterContext.tsx     # 📦 Character state provider (Firestore/localStorage dual-mode)
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
│   ├── QuickRollModal.tsx       # 🎲 AI-generated quick character
│   ├── ErrorBoundary.tsx        # 🛡️ React error boundary
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

## ☁️ Cloud Persistence

Signed-in users (Google Auth) get **automatic Firestore sync**:

- Characters are stored in the `characters` collection, partitioned by `ownerUid`
- Real-time `onSnapshot` listeners keep multiple browser tabs/devices in sync
- Writes are **debounced** (500ms) to avoid excessive Firestore operations during combat
- Guest users continue using localStorage with no cloud calls
- First-time sign-in detects local characters and offers a one-click **migration** to the cloud
- Firestore security rules enforce per-user isolation — users can only read/write their own characters

## 🔒 Rate Limiting

Client-side multi-layer protection to prevent API abuse:

- **Per-call throttle:** 2-second minimum between AI requests
- **Tamper detection:** Rate limit state stored in closure (not localStorage)

## 📚 Documentation

- [🏗️ Architecture](docs/ARCHITECTURE.md) — System design, data flow, component map
- [🔌 API Reference](docs/API.md) — Gemini AI integration, helper functions, data schemas
- [🤝 Contributing](docs/CONTRIBUTING.md) — Setup, code style, PR guidelines
- [� Roadmap & TODO](docs/TODO.md) — Planned features, enhancements, community requests
- [� Project Tracker](docs/PROJECT_TRACKER.md) — Epics, features, user stories, tasks with status tracking

## 📄 License

MIT
