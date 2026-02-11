# 🏗️ Architecture Guide

## Tech Stack

*   **Core Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai) — Gemini 3 Flash (text) + Gemini 2.5 Flash Image (portraits)
*   **Auth**: [Firebase Auth](https://firebase.google.com/docs/auth) — Google sign-in + anonymous guest mode
*   **Markdown**: `react-markdown` + `remark-gfm`

## Project Structure

```text
/
├── components/                # React Components
│   ├── details/               # Card Stack detail views
│   │   ├── VitalsDetail.tsx   #   HP, AC, Initiative, Hit Dice
│   │   ├── CombatDetail.tsx   #   Attacks, damage rolls
│   │   ├── SkillsDetail.tsx   #   Ability scores, saves, skill checks
│   │   ├── FeaturesDetail.tsx #   Class/racial features
│   │   ├── InventoryDetail.tsx#   Items, equipment, gold
│   │   └── JournalDetail.tsx  #   Session notes + AI chronicle
│   ├── AskDMModal.tsx         # Multi-turn AI DM chat
│   ├── CampaignManager.tsx    # Create/join campaigns
│   ├── CardStack.tsx          # Reusable dashboard card container
│   ├── CharacterCreationWizard.tsx  # 4-step character forge
│   ├── CharacterSelection.tsx # Character list + management
│   ├── Dashboard.tsx          # Main view controller
│   ├── DetailOverlay.tsx      # Full-screen detail wrapper
│   ├── DiceRollModal.tsx      # Animated dice roller
│   ├── ItemDetailModal.tsx    # AI-powered item/feature lookup
│   ├── LevelUpModal.tsx       # AI-guided level up wizard
│   ├── LoginScreen.tsx        # Firebase auth screen
│   ├── PortraitGenerator.tsx  # AI portrait generation
│   ├── RestModal.tsx          # Short/Long rest mechanics
│   ├── SettingsModal.tsx      # Character settings & stats editor
│   └── ShopModal.tsx          # Buy/sell marketplace
├── contexts/
│   └── AuthContext.tsx         # Firebase auth provider
├── lib/
│   ├── firebase.ts            # Firebase app initialization
│   └── gemini.ts              # Centralized Gemini client + context caching
├── scripts/
│   └── upload-pdfs.js         # One-time PDF upload to Gemini File API
├── docs/                      # Documentation
├── constants.tsx              # D&D 5e reference data (classes, races, items, shop inventory)
├── types.ts                   # TypeScript interfaces (CharacterData, Item, etc.)
├── utils.ts                   # Rate limiter + game logic (AC calc, attack generation)
├── App.tsx                    # Root component, state management, cache pre-warming
├── vite.config.ts             # Vite config + env var exposure
└── reference-docs/            # D&D PDFs (gitignored)
```

## Data Model

### `CharacterData`
The central interface (defined in `types.ts`) containing:
*   **Identity**: Name, Race, Class, Level, Background, Alignment, Portrait URL, Campaign.
*   **Stats**: STR, DEX, CON, INT, WIS, CHA — each with score, modifier, save, proficiency flag.
*   **Combat**: HP (current/max), AC, Speed, Initiative, Proficiency Bonus, Attacks array.
*   **Inventory**: Array of `Item` objects (with equipped state, armor class, notes), gold count.
*   **Features**: Class/racial features with source, description, and full rules text.
*   **Spells**: Spell list with level, school, casting time, range, duration, components.
*   **Journal**: Array of `JournalEntry` objects (note/npc/location types with timestamps).

### State Management
*   React `useState` lifted to `App.tsx` as the source of truth.
*   **Persistence**: `useEffect` serializes the `characters` array to `localStorage` keyed by authenticated user ID.
*   **Updates**: Prop callbacks (`onUpdateData`) flow down to child components.

## Authentication

Firebase Auth provides two sign-in methods via `AuthContext`:
*   **Google Sign-in**: Full user profile with display name and photo.
*   **Guest Mode**: Anonymous session for quick access without an account.

Character data is scoped to the authenticated user's UID in localStorage.

## AI Integration Architecture

### 1. Centralized Gemini Client (`lib/gemini.ts`)
All text-based AI calls route through a shared module that manages:
*   **Context Caching**: D&D reference PDFs are uploaded once via `scripts/upload-pdfs.js`, and a `CachedContent` object referencing those files is created on app mount. All AI responses are grounded in the actual book text.
*   **Singleton pattern**: One `GoogleGenAI` instance, one cache, shared across all components.
*   **Exports**: `generateWithContext()`, `createChatWithContext()`, `initializeCache()`, `getCacheStatus()`, `getAI()`.

### 2. Models

| Purpose | Model | Used By |
|---|---|---|
| Text generation (cached) | `gemini-3-flash-preview` | AskDM, LevelUp, ItemDetail, Journal |
| Text generation (fallback) | `gemini-3-flash-preview` | Same components when no PDFs configured |
| Image generation | `gemini-2.5-flash-image` | PortraitGenerator, CharacterCreationWizard |

### 3. Cache Lifecycle
1.  `npm run upload-pdfs` uploads PDFs to Google's Gemini File API (one-time).
2.  File URIs are saved to `.env` as `VITE_GEMINI_FILE_URI_*` variables.
3.  On app mount, `initializeCache()` creates a `CachedContent` with 1hr TTL.
4.  All `generateWithContext()` and `createChatWithContext()` calls include the cache reference.
5.  If cache expires or PDFs aren't configured, the fallback model is used without caching.

### 4. Rate Limiting (`utils.ts`)
Multi-layer client-side protection:
*   **Layer 1 — Per-minute**: Sliding window of 10 requests per 60 seconds.
*   **Layer 2 — Daily cap**: 300 requests per calendar day, auto-resets at midnight.
*   **Layer 3 — Tamper detection**: Session counter cross-references localStorage to detect if a user clears storage to bypass limits.

All 6 AI-calling components invoke `checkRateLimit()` before every API call.

### 5. Prompt Engineering
Prompts are constructed dynamically from character data:
*   **Item Detail**: Injects item name/type, requests Markdown + tables, asks for source book page citations.
*   **Level Up**: Sends class/level/subclass, expects structured JSON with `hpAverage`, `newFeatures`, and `choices`.
*   **DM Chat**: Multi-turn conversation via `createChatWithContext()` with D&D system instruction.
*   **Journal**: Aggregates all journal entries and requests a narrative chronicle summary.

## Styling System

*   **Glassmorphism**: `backdrop-blur`, semi-transparent backgrounds (`bg-zinc-900/80`), subtle borders for depth.
*   **Semantic Colors**:
    *   **Red**: Vitals (Health)
    *   **Orange**: Combat (Aggression)
    *   **Blue**: Skills (Intellect/Utility)
    *   **Purple**: Magic/Traits (Mysticism)
    *   **Amber**: Inventory (Gold/Material)
    *   **Cyan**: Journal (Knowledge)
*   **Fonts**: `Cinzel` for fantasy headings, `Inter` for UI text readability.
*   **Responsive**: Mobile-first layout with `sm:`/`md:`/`lg:` breakpoints throughout.
