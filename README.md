<p align="center">
  <img src="https://img.shields.io/badge/🏰-Ollo's%20Player%20Companion-B8860B?style=for-the-badge&labelColor=1a1a2e" alt="Ollo's Player Companion" />
</p>

<h1 align="center">⚜️ Ollo's Player Companion ⚜️</h1>

<p align="center"><em>A Tome of Digital Sorcery for the Modern Adventurer</em></p>

<p align="center">
  <strong>D&D 5th Edition Character Sheet & AI Dungeon Master</strong><br/>
  <sub>Forged with React, TypeScript, and the arcane power of Google Gemini</sub>
</p>

---

> *"Every adventurer needs a companion — not just in the dungeon, but at the table.  
> This tome serves as your faithful squire: tracking your abilities, managing your  
> inventory, and consulting the ancient texts so you don't have to."*

---

## Chapter 1: Introduction

**Ollo's Player Companion** is a mobile-first web application for managing D&D 5th Edition characters and campaigns. Create heroes with a guided wizard, track stats and inventory, roll dice, level up with AI assistance, and consult an AI Dungeon Master grounded in official rulebook text.

Whether you are a battle-scarred veteran of a hundred campaigns or a wide-eyed newcomer stepping into your first tavern, this companion will serve you well.

---

## Chapter 2: Features of the Companion

> *Record all the features that your companion grants you here.*

| Feature | Description |
|:--------|:------------|
| 🧙 **Character Creation Wizard** | A 6-step guided ritual — Identity, Ability Scores (Standard Array / Point Buy / Manual), Skills, Spells (data-driven PHB lists), Concept, Review + AI Portrait |
| 🛒 **Starter Equipment Shop** | Roll or take average starting gold, browse 5 gear categories, purchase supplies |
| 📋 **The Dashboard** | Card-stack UI with swipeable detail views — Vitals, Combat, Skills, Features, Spells, Inventory, Journal |
| 🎲 **Dice Roller** | Complex expressions (`2d6+4`), critical hit & fumble detection on d20 rolls |
| 📖 **Spell Slot Tracking** | Full/half/pact caster progression tables faithfully transcribed from the PHB |
| ⬆️ **Level Up Wizard** | AI-assisted ascension with HP rolls, ASI, new features, and spell slot updates |
| 🤖 **Ask the DM** | Multi-turn AI chat grounded in uploaded PHB/DMG/MM/Basic Rules PDFs |
| 🛏️ **Rest System** | Short & long rest with hit dice recovery, as the gods intended |
| 🗂️ **Campaign Manager** | Create or join campaigns with shareable join codes, DM role confirmation, character assignment, email invites with 7-day expiry, player invite permissions |
| 🔐 **Authentication** | Firebase Google sign-in + anonymous guest mode |
| ☁️ **Cloud Sync** | Firestore character persistence — real-time sync across devices |
| 🎨 **AI Portraits** | Gemini 2.5 Flash image model conjures character portraits from description |
| 🎲 **Quick Roll** | One-click AI-generated character from a vibe prompt — stats, backstory, portrait; optional name input or AI-generated name |
| 🎭 **Class Theming** | Dynamic color themes per D&D class — borders, gradients, and arcane glow effects |
| 🎙️ **Voice Input** | Live audio transcription via Gemini Native Audio for hands-free DM chat (proxied via secure WS endpoint — API key never reaches browser) |
| 🛡️ **DM Dashboard** | Full tabbed DM command centre — Party Overview, Combat Tracker (initiative order, HP, conditions, combat log), Encounter Generator (AI-drafted encounters with creature stat blocks), Campaign Journal (Markdown notes + tags), Roll Request system (DM creates group rolls; players respond inline), Campaign Settings |
| 👥 **Party Roster** | Live party member cards with HP bars, AC, level, class info; DM can kick members |
| ⚔️ **Combat Strip** | At-a-glance combat status bar with initiative display and roll hook |
| 🎯 **Quick Action Bar** | Context-sensitive shortcut buttons for common actions |
| ⚡ **Cloud Functions** | Server-side Firestore triggers auto-sync `memberUids` when players join/leave campaigns |

---

## Chapter 3: The Arcane Components

> *Every work of great magic requires the right components. Here you will find the  
> material, somatic, and verbal components that power the Companion.*

| Layer | Component |
|:------|:----------|
| **Framework** | React 19.2 + TypeScript 5.8 |
| **Forge** | Vite 6 |
| **Styling** | Tailwind CSS via Vite plugin (`@tailwindcss/vite`) |
| **Iconography** | Lucide React |
| **The Weave (AI)** | Google Gemini (`@google/genai` v1.41+) — `gemini-2.5-flash` (text), `gemini-2.5-flash-image` (portraits) |
| **The Gate (Proxy)** | Express.js server — API proxy with auth middleware + rate limiting |
| **Ward (Auth)** | Firebase Authentication (Google + Anonymous providers) |
| **Vault (Database)** | Cloud Firestore (character sync for authenticated users) |
| **Scroll Case (Storage)** | localStorage (guest/offline fallback) |
| **Shield (Secrets)** | Google Cloud Secret Manager (Gemini API key, never in browser) |
| **Sentinels (Triggers)** | Firebase Cloud Functions v2 (Firestore document triggers for data consistency) |
| **Planar Gate (Deploy)** | Docker (multi-stage) → Google Cloud Run + Cloud Build CI/CD (auto-deploys app, functions, and rules on push to main) |

---

## Chapter 4: Summoning the Companion

> *Before you can summon this companion to your side, you must gather the  
> requisite components and speak the proper incantations.*

### Prerequisites

- **Node.js** 18+ *(the arcane runtime)*
- A [Google AI Studio](https://aistudio.google.com/) API key *(your connection to the Weave)*
- A [Firebase](https://console.firebase.google.com/) project with Authentication enabled *(Google + Anonymous sign-in)*

---

### Step 1. Clone the Repository

*Reach through the planes and pull the source code to your local realm:*

```bash
git clone https://github.com/Hams-Ollo/Ollos-Player-Companion.git
cd Ollos-Player-Companion
npm install
```

### Step 2. Configure Your Secrets

*A wizard never reveals their secrets — but they do store them in `.env`:*

```bash
cp .env.example .env
```

Edit `.env` with your Gemini API key and Firebase config. At minimum you need:

```bash
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Ward of Protection:** Never commit `.env` to version control. It is already guarded by `.gitignore`.  
> The `GEMINI_API_KEY` is read **only by the Express proxy server** — it is never exposed to the browser.

### Step 3. Upload Reference Tomes *(Optional)*

*For the truest answers, the DM must consult the original texts:*

```bash
npm run upload-pdfs
```

Place your D&D reference PDFs in `reference-docs/`, then run the command above. This uploads PDFs to Google's Gemini File API and writes the file URIs back to `.env`. On app startup, a context cache grounds all AI answers in actual book text with page citations.

### Step 4. Ignite the Dev Server

```bash
# Start both the Express API proxy and the Vite dev server
npm run dev:full
```

- **Vite SPA:** [http://localhost:3000](http://localhost:3000)
- **Express API proxy:** [http://localhost:3001](http://localhost:3001)

The Vite dev server automatically proxies `/api/*` requests to the Express server.

> 💡 You can also run them separately: `npm run dev:server` (proxy) and `npm run dev` (Vite).

### Step 5. Forge for Production

```bash
npm run build
npm run preview
```

---

## Chapter 5: The Map of the Realm

> *A complete cartographic survey of the Companion's directory structure.  
> Study it well, for navigating these halls is essential to understanding the magic within.*

```
├── App.tsx                        # 🏠 The Great Hall — auth gate & routing
├── constants.tsx                  # 📜 The Compendium — races, classes, spells, features
├── types.ts                      # 📝 The Codex — TypeScript interfaces
├── utils.ts                      # 🔧 The Artificer's Tools — stat calculation, helpers
├── vite.config.ts                # ⚙️ The Forge Config — Vite with env var injection
├── index.html                    # 🌐 Portal of Entry
├── Dockerfile                    # 🐳 Blueprint for the Iron Golem (container)
├── firebase.json                 # 🔥 Pact of the Flame (Firebase config)
├── firestore.rules               # 🔒 Wards of Protection (security rules)
├── firestore.indexes.json        # 📇 Index of Forbidden Knowledge
│
├── server/
│   ├── index.js                  # 🛡️ The Gatekeeper — Express API proxy + static SPA server
│   └── middleware/
│       ├── auth.js               # 🔐 Token Verification — validates Firebase ID tokens
│       └── rateLimit.js          # ⏱️ Rate Limiter — per-user & global request throttling
│
├── functions/
│   ├── package.json              # ⚙️ Cloud Functions dependencies (Node 20)
│   ├── tsconfig.json             # ⚙️ Cloud Functions TypeScript config
│   └── src/
│       └── index.ts              # ⚡ The Sentinels — Firestore triggers (onMemberCreated/Deleted)
│
├── lib/
│   ├── gemini.ts                 # 🤖 The Weave — proxy client (calls /api/gemini/*)
│   ├── firestore.ts              # 🔥 The Vault — Firestore CRUD & real-time sync
│   ├── campaigns.ts              # 🗺️ The Campaign Ledger — campaign Firestore operations
│   ├── dice.ts                   # 🎲 The Dice Bag — roll parsing & execution
│   ├── themes.ts                 # 🎨 The Palette — class-based color themes
│   └── debug-fetch.ts            # 🔍 Debug Fetch — network diagnostics utility
│
├── contexts/
│   ├── AuthContext.tsx            # 🔐 The Wardkeeper — Firebase auth provider
│   ├── CharacterContext.tsx       # 📦 The Character Vault — state provider
│   └── CampaignContext.tsx        # 🗺️ The Campaign Keeper — campaign state
│
├── components/
│   ├── LoginScreen.tsx            # 🚪 The Tavern Door
│   ├── CharacterSelection.tsx     # 📜 The Heroes' Gallery
│   ├── CharacterCreationWizard.tsx # 🧙 The Ritual of Creation (6 steps)
│   ├── Dashboard.tsx              # 📋 The Adventurer's Dashboard
│   ├── CardStack.tsx              # 🃏 The Deck of Many Stats
│   ├── DetailOverlay.tsx          # 🔍 The Scrying Glass
│   ├── DiceRollModal.tsx          # 🎲 The Dice Tower
│   ├── LevelUpModal.tsx           # ⬆️ The Ascension Chamber
│   ├── RestModal.tsx              # 🛏️ The Campfire
│   ├── ShopModal.tsx              # 🏪 The Merchant's Stall
│   ├── AskDMModal.tsx             # 🤖 The Oracle's Chamber
│   ├── ItemDetailModal.tsx        # 🔎 The Identify Spell
│   ├── CampaignManager.tsx        # 🗺️ The War Room — create/join/invite/manage campaigns
│   ├── DMDashboard.tsx            # 🛡️ The DM's Sanctum — tabbed DM campaign view
│   ├── DMPartyOverview.tsx        # 👥 The Party Roster — live party vitals grid
│   ├── PartyRoster.tsx            # 📋 The Muster Roll — party member cards
│   ├── CombatStrip.tsx            # ⚔️ The Battle Line — combat status bar
│   ├── QuickActionBar.tsx         # 🎯 The Quick Draw — shortcut action buttons
│   ├── AbilityScoreBar.tsx        # 📊 The Measure — ability score display bar
│   ├── SettingsModal.tsx          # ⚙️ The Tinkerer's Bench
│   ├── PortraitGenerator.tsx      # 🎨 The Portrait Gallery
│   ├── TranscriptionButton.tsx    # 🎙️ The Sending Stone
│   ├── QuickRollModal.tsx         # 🎲 The Quicksilver Forge
│   ├── ErrorBoundary.tsx          # 🛡️ The Shield Guardian
│   │
│   └── details/
│       ├── VitalsDetail.tsx       # ❤️ The Life Force
│       ├── CombatDetail.tsx       # ⚔️ The Armory
│       ├── SkillsDetail.tsx       # 🎯 The Training Grounds
│       ├── FeaturesDetail.tsx     # ✨ The Hall of Abilities
│       ├── SpellsDetail.tsx       # 📖 The Spellbook
│       ├── InventoryDetail.tsx    # 🎒 The Bag of Holding
│       └── JournalDetail.tsx      # 📓 The Chronicler's Journal
│
└── reference-docs/                # 📚 The Forbidden Library (gitignored)
```

---

## Chapter 6: Cloud Persistence

> *"Trust not the localStorage alone, for it is as fleeting as a cantrip's flame.  
> Inscribe your heroes upon the eternal Firestore, and they shall endure."*

Signed-in users (Google Auth) receive **automatic Firestore synchronization**:

- Characters are stored in the `characters` collection, partitioned by `ownerUid`
- Campaigns are stored in the `campaigns` collection with subcollections for `members`, `encounters`, `notes`, `templates`, `whispers`, and `rollRequests`
- Invites are stored in a top-level `invites` collection with shareable 6-character join codes and 7-day expiry
- **Cloud Functions v2** automatically sync `campaign.memberUids[]` via Firestore document triggers when members join or leave
- Real-time `onSnapshot` listeners keep multiple browser tabs and devices in sync
- Writes are **debounced** (500ms) to avoid excessive Firestore operations during heated combat
- DMs can remove members from campaigns; players can send invites when `allowPlayerInvites` is enabled
- Guest adventurers continue using localStorage for characters with no cloud calls
- Campaign features require Google authentication (no guest fallback)
- First-time sign-in detects local characters and offers a one-click **migration** to the cloud
- Firestore security rules enforce per-user isolation and campaign membership checks

---

## Chapter 7: Security & Rate Limiting

> *"The Weave resists those who draw upon it too hastily.  
> Patience, young spellcaster — two seconds between castings."*

The Companion employs a **defense-in-depth** strategy to protect the Gemini API key and prevent abuse:

- **Server-side API proxy:** All Gemini requests route through an Express server (`server/index.js`). The API key **never** reaches the browser — including the Gemini Live Audio WebSocket, which is tunnelled through a `/api/gemini/live` WS proxy with token verification.
- **Firebase Admin SDK token verification:** Every `/api/*` request requires a valid Firebase ID token. Tokens are cryptographically verified with revocation checking (`verifyIdToken(token, true)`) via the Firebase Admin SDK. A UID-keyed cache (4-min TTL, 500-entry LRU cap) keeps auth fast.
- **Redis-backed rate limiting:** Per-user 20 req/min (atomic pipeline INCR+EXPIRE) with automatic in-memory fallback when Redis is unavailable. Global cap of 200 req/min across all users. Responses include `X-RateLimit-Remaining` and `Retry-After` headers.
- **Security headers:** Full header suite on every response — CSP (13 directives including `frame-ancestors 'none'` and `upgrade-insecure-requests`), HSTS preload (`max-age=31536000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, COOP `same-origin`, CORP `same-origin`, Permissions-Policy microphone=(self).
- **Input validation:** Every route validates and caps payload sizes — prompts ≤20 KB, chat history ≤50 turns/10 KB per message, portrait parts ≤2/5 MB each, encounter fields capped.
- **Google Cloud Secret Manager:** API key stored as a managed secret, injected at Cloud Run runtime — not baked into the Docker image.
- **Budget alert:** $20/month billing alert with thresholds at 50/90/100/150%.
- **0 npm vulnerabilities:** `package.json` overrides pin `minimatch` and `glob` to patched versions.
- **Client-side throttle:** 2-second minimum between AI requests as a UX safeguard.

---

## Chapter 8: The Library

> *"Knowledge is the greatest treasure — more valuable than gold, more powerful  
> than magic. These tomes contain the deeper lore of the Companion's construction."*

| Tome | Contents |
|:-----|:---------|
| [🏗️ Architecture](docs/ARCHITECTURE.md) | *The Architect's Blueprints* — system design, data flow, component map |
| [🔌 API Reference](docs/API.md) | *The Spellbook* — Gemini AI integration, helper functions, data schemas |
| [🤝 Contributing](docs/CONTRIBUTING.md) | *The Adventurer's Code* — setup, code style, PR guidelines |
| [📋 Roadmap & TODO](docs/TODO.md) | *The Quest Board* — planned features, enhancements, community requests |
| [📊 Project Tracker](docs/PROJECT_TRACKER.md) | *The War Council's Ledger* — epics, features, user stories with status |
| [☁️ Cloud Deployment](docs/CLOUD_RUN_DEPLOY.md) | *The Planar Gate Manual* — Docker → Cloud Run deployment guide |

---

## Chapter 9: Current Roadmap Snapshot

> *"A quick report from the war council, for those who need present-tense status at a glance."*

- **v0.5.1 (current):** Security hardening fully complete — Firebase Admin SDK cryptographic token verification, Redis-backed rate limiting, full CSP/HSTS header suite, WebSocket proxy for Live Audio, Firestore field-type validation + size caps, 0 npm vulnerabilities. DM suite UI complete — CombatTracker, EncounterGenerator, DMNotesPanel, RollRequestPanel, RollRequestBanner all live.
- **v0.5.0 → v0.5.x remaining:** World-building layer not yet built — NPCRegistry, QuestTracker, FactionManager; `lib/combat.ts` service abstraction; premade character templates; save/load encounter templates from Firestore.
- **v0.6.0 AI DM Co-Pilot:** DMAssistant (full campaign-context AI), shared handouts, SRD content browser.
- **v0.7.0 Higher-Level Creation:** In progress — level 1–20 creation flow is live; multiclass support remains pending.

For the authoritative live status, see [📋 Roadmap & TODO](docs/TODO.md) and [📊 Project Tracker](docs/PROJECT_TRACKER.md).

---

## Appendix A: License

*This work is released under the **MIT License** — free for all adventurers to use, modify, and distribute across the Material Plane and beyond.*

---

<p align="center">
  <sub><em>⚔️ May your rolls be high and your saves be true. ⚔️</em></sub>
</p>
