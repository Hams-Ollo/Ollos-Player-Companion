# ⚜️ The Architect's Blueprints ⚜️

> *"Before the first stone was laid, the Architect drew these plans.  
> Within them lies the fundamental structure of the Companion —  
> its chambers, its passages, and the flow of magical energy throughout."*
>
> System design, data flow, and component map for Ollo's Player Companion.

---

## Chapter 1: High-Level Architecture

> *A bird's-eye view of the realm, as seen from a wizard's tower.*

```mermaid
flowchart TB
    subgraph Browser["🌐 The Material Plane (Browser)"]
        FA["🔐 Firebase Auth"] <--> RA["⚛️ React App (Vite SPA)"]
        RA <--> LS["💽 localStorage"]
    end
    RA -->|"REST API calls"| EXP["🛡️ Express Proxy (Cloud Run)"]
    EXP -->|"Proxied calls"| GEM["🤖 The Weave (Google Gemini API)"]
    RA <-->|"Firebase SDK"| FS["🔥 Cloud Firestore"]
    FS -->|"Document triggers"| CF["⚡ Cloud Functions v2"]
    CF -->|"Updates memberUids"| FS
```

The app is a **mobile-first SPA** served by an Express proxy server on Cloud Run. Character state persists in **Cloud Firestore** for signed-in users and `localStorage` for guest adventurers. AI calls route through the Express proxy (which holds the Gemini API key). **Firebase Cloud Functions v2** handle server-side data consistency — specifically, Firestore document triggers that keep `campaign.memberUids` in sync when members join or leave. Firebase guards the gates of authentication.

---

## Chapter 2: Application Flow

> *The journey every adventurer takes through the Companion, from the tavern door  
> to the dungeon depths.*

```mermaid
flowchart TD
    Login["🚪 The Tavern Door (LoginScreen)"] -->|Google Sign-In| FA["🔐 Firebase Auth"]
    Login -->|Guest Mode| Anon["👤 Anonymous Auth / Local Fallback"]
    FA --> CS["📜 The Heroes' Gallery"]
    Anon --> CS

    CS -->|Select existing| Dash["📋 The Dashboard"]
    CS -->|Create new| Wiz["🧙 The Ritual of Creation"]
    CS -->|Delete| CS

    subgraph Wizard["🧙 The Ritual of Creation (6 Steps)"]
        W1["1. Identity — Name, Race, Class"] --> W2["2. Ability Scores"]
        W2 --> W3["3. Skill Proficiencies"]
        W3 --> W4["4. Spells & Cantrips"]
        W4 --> W5["5. Character Concept"]
        W5 --> W6["6. Review + AI Portrait"]
    end
    Wiz --> W1
    W6 --> Dash

    subgraph DashboardModals["📋 The Dashboard"]
        Cards["🃏 The Deck of Many Stats"]
        Detail["🔍 The Scrying Glass"]
        Dice["🎲 The Dice Tower"]
        LvlUp["⬆️ The Ascension Chamber"]
        Rest["🛏️ The Campfire"]
        Shop["🏪 The Merchant's Stall"]
        DM["🤖 The Oracle's Chamber"]
        Settings["⚙️ The Tinkerer's Bench"]
        Portrait["🎨 The Portrait Gallery"]
    end
    Dash --> Cards
```

---

## Chapter 3: Component Map

> *Every chamber in the Companion has a purpose. Here is the registry,  
> organized by the layer of the keep in which each component dwells.*

### 🏠 The Root Layer

| Component | File | Responsibility |
|:----------|:-----|:---------------|
| `App` | `App.tsx` | Auth gate, routing between selection and dashboard |
| `AuthProvider` | `contexts/AuthContext.tsx` | Firebase auth state, sign-in/out methods, React context |
| `CharacterProvider` | `contexts/CharacterContext.tsx` | Character CRUD, Firestore/localStorage dual-mode, migration, `updateCharacterById` for cross-context syncing |
| `CampaignProvider` | `contexts/CampaignContext.tsx` | Campaign CRUD, real-time subscriptions, invites, member removal, join code regeneration, character–campaign membership sync; `partyCharacters` Map (DM view of party characters fetched from Firestore); `startCombat`/`advanceTurn`/`endCombat`; `createNote`/`updateNote`/`deleteNote`; `removeMember`; `rollRequests` subscription + `submitRollResponse` |

### 📜 The Selection Layer

| Component | File | Responsibility |
|:----------|:-----|:---------------|
| `LoginScreen` | `components/LoginScreen.tsx` | Google sign-in button, guest adventurer mode |
| `CharacterSelection` | `components/CharacterSelection.tsx` | Character list, create/delete, campaign management |
| `CampaignManager` | `components/CampaignManager.tsx` | Create/join campaigns, DM role confirmation, character assignment, invite management (join code + email); honors `allowPlayerInvites` setting |

### 🧙 The Creation Layer

| Component | File | Responsibility |
|:----------|:-----|:---------------|
| `CharacterCreationWizard` | `components/CharacterCreationWizard.tsx` | 6-step wizard with internal step components (`StepIdentity`, `StepAbilityScores`, `StepSkills`, `StepPowers`, `StepConcept`, `StepReview`) |

### 📋 The Dashboard Layer

| Component | File | Responsibility |
|:----------|:-----|:---------------|
| `Dashboard` | `components/Dashboard.tsx` | Main character view shell, modal orchestration |
| `CardStack` | `components/CardStack.tsx` | Swipeable card-stack UI for stat categories |
| `DetailOverlay` | `components/DetailOverlay.tsx` | Fullscreen detail view wrapper with slide animation |

### 🛡️ The DM Layer

| Component | File | Responsibility |
|:----------|:-----|:---------------|
| `DMDashboard` | `components/DMDashboard.tsx` | Tabbed DM view: Overview (live party vitals via `partyCharacters` from context), Combat (fully wired `CombatTracker`), Encounter Generator (`EncounterGenerator` → Launch Combat → auto-switches to Combat tab), Notes (full CRUD `DMNotesPanel`), Roll Requests (`RollRequestPanel`), Settings; `allowPlayerInvites` toggle + join-code regeneration |
| `DMPartyOverview` | `components/DMPartyOverview.tsx` | Live party vitals grid with HP bars, AC, passive scores |
| `PartyRoster` | `components/PartyRoster.tsx` | Party member card grid, DM kick button, campaign chat channels, and live DM↔player whispers |

### 🔍 The Detail Views (`components/details/`)

| Component | View | Key Data |
|:----------|:-----|:---------|
| `VitalsDetail` | ❤️ The Life Force | HP, AC, speed, hit dice, conditions |
| `CombatDetail` | ⚔️ The Armory | Attacks, initiative, actions |
| `SkillsDetail` | 🎯 The Training Grounds | 18 skills with proficiency/expertise |
| `FeaturesDetail` | ✨ The Hall of Abilities | Class/racial features with full text |
| `SpellsDetail` | 📖 The Spellbook | Spellbook, slot tracking, casting |
| `InventoryDetail` | 🎒 The Bag of Holding | Items, gold, equip/unequip, encumbrance |
| `JournalDetail` | 📓 The Chronicle | Session notes, NPC log, AI chronicles |

### 🎛️ The Modals

| Component | File | Trigger |
|:----------|:-----|:--------|
| `DiceRollModal` | `components/DiceRollModal.tsx` | Tap any rollable stat |
| `LevelUpModal` | `components/LevelUpModal.tsx` | Level up button on dashboard |
| `RestModal` | `components/RestModal.tsx` | Rest button on vitals |
| `ShopModal` | `components/ShopModal.tsx` | Shop button on inventory |
| `AskDMModal` | `components/AskDMModal.tsx` | DM button on dashboard |
| `ItemDetailModal` | `components/ItemDetailModal.tsx` | Tap any item/feature for AI rules lookup |
| `SettingsModal` | `components/SettingsModal.tsx` | Settings gear icon; also exposes JSON export (`handleExport`) and JSON import (`handleImportFile` FileReader) |
| `PortraitGenerator` | `components/PortraitGenerator.tsx` | Tap portrait on dashboard |
| `TranscriptionButton` | `components/TranscriptionButton.tsx` | Mic icon on text fields |
| `QuickActionBar` | `components/QuickActionBar.tsx` | Context-sensitive shortcut action buttons |
| `CombatStrip` | `components/CombatStrip.tsx` | At-a-glance combat status bar with initiative display + roll action hook |
| `AbilityScoreBar` | `components/AbilityScoreBar.tsx` | Ability score display component |

---

## Chapter 4: The Data Model

> *"A character is more than a name and a sword. Here lies the schema  
> that defines every hero in the Companion's vault."*

### 📊 Core Type: `CharacterData`

```typescript
interface CharacterData {
  id: string;
  ownerUid?: string;                     // Firebase Auth UID (cloud users)
  createdAt?: number;                    // epoch ms
  updatedAt?: number;                    // epoch ms (auto-set on every save)
  name: string;
  race: string;
  class: string;
  background?: string;
  alignment?: string;
  level: number;
  subclass?: string;
  campaign?: string;                     // display name (e.g. "Firestorm")
  campaignId?: string;                   // Firestore campaign doc ID
  portraitUrl: string;
  stats: Record<StatKey, Stat>;          // STR, DEX, CON, INT, WIS, CHA
  hp: { current: number; max: number };
  hitDice: { current: number; max: number; die: string };
  ac: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  activeConditions?: string[];           // D&D 5e condition names (e.g. "Poisoned")
  exhaustionLevel?: number;              // 0–6
  heroicInspiration?: boolean;           // one-time advantage on any roll
  xp?: number;                           // experience points
  skills: Skill[];                       // 18 D&D skills
  attacks: Attack[];
  features: Feature[];
  spells: Spell[];
  spellSlots: { level: number; current: number; max: number }[];
  inventory: { gold: number; items: Item[]; load: string };
  journal: JournalEntry[];
  motivations?: string;                  // from creation wizard (rendered in JournalDetail)
  keyNPCs?: string;                      // from creation wizard (rendered in JournalDetail)
}
```

See `types.ts` for all interfaces (`Stat`, `Skill`, `Attack`, `Feature`, `Spell`, `Item`, `JournalEntry`, `Campaign`, `UserProfile`, `RollResult`).

### 💽 Persistence

> *Where do heroes go when the browser closes?*

| Data | Storage (Google Users) | Storage (Guests) | Key / Collection |
|:-----|:----------------------|:------------------|:-----------------|
| Characters | Cloud Firestore | `localStorage` | `characters` collection / `vesper_chars` |
| Campaigns | Cloud Firestore | — *(auth required)* | `campaigns` collection + subcollections |
| Invites | Cloud Firestore | — *(auth required)* | `invites` collection |
| Auth Session | Firebase Auth | Firebase Auth / local | Managed by Firebase SDK |

**Firestore Schema:**
- Collection: `characters` (top-level)
- Document ID: `character.id` (client-generated UUID)
- Partition field: `ownerUid` (Firebase Auth UID)
- Composite index: `ownerUid` ASC + `updatedAt` DESC
- Security rules: Users can only read/write documents where `ownerUid == auth.uid`

**Dual-mode logic** is managed by `CharacterContext`:
- On auth change: subscribes to Firestore (`onSnapshot`) for Google users, loads localStorage for guests
- Writes are debounced (500ms) to avoid excessive Firestore operations during combat
- Failed Firestore connections fall back to localStorage

**Campaign Firestore Schema:**
- Collection: `campaigns` (top-level) with subcollections: `members`, `encounters`, `notes`, `templates`, `whispers`, `rollRequests`
- Collection: `invites` (top-level) — join code + email invite tracking
- Members subcollection stores `uid`, `displayName`, `role` (`dm`/`player`), and optional `characterId`
- Character–campaign membership is synced bidirectionally: `CharacterData.campaignId` \u2194 `campaigns/{id}/members/{uid}`
- **Cloud Functions v2** automatically sync `campaign.memberUids[]` via Firestore document triggers (`onDocumentCreated` / `onDocumentDeleted` on `campaigns/{campaignId}/members/{memberId}`)
- Security rules enforce campaign membership — only members can read/write subcollection data
- Campaign creation automatically assigns the creator as DM
- DM can remove members from the party via the `PartyRoster` kick button
- DM can toggle `allowPlayerInvites` in campaign settings; when enabled, players can also send invites
- DM can regenerate the join code to invalidate old links
- Invites include a 7-day expiry (`expiresAt` timestamp); duplicate pending invites are prevented
- Invite flow: DM (or player if allowed) shares join code or sends email invite → player accepts → added to members subcollection → Cloud Function syncs `memberUids`

---

## Chapter 5: AI Integration

> *"The Weave connects all magic in the world.  
> Through it, the Companion channels the power of Gemini."*

### Models Used

| Model | Purpose | Summoned By |
|:------|:--------|:------------|
| `gemini-2.5-flash` | Text generation (rules, level-up, DM chat, quick roll) | `lib/gemini.ts` → `LevelUpModal`, `AskDMModal`, `ItemDetailModal`, `JournalDetail`, `QuickRollModal` |
| `gemini-2.5-flash-image` | Image generation (portraits) | `lib/gemini.ts` → `CharacterCreationWizard`, `PortraitGenerator`, `QuickRollModal` |

### The Gemini Client (`lib/gemini.ts`)

Three exported incantations:

- **`generateWithContext(prompt, config?)`** — Single-shot text generation
- **`createChatWithContext(history, systemInstruction)`** — Multi-turn chat session
- **`generatePortrait(prompt, parts?)`** — Image generation via `gemini-2.5-flash-image`, returns base64 data URI or null

All AI calls route through the **Express API proxy** at `/api/gemini/*`. The client attaches a Firebase ID token via `Authorization: Bearer <token>`. The proxy server holds the `GEMINI_API_KEY` in its runtime environment (injected via Cloud Run secrets or `.env` locally) and forwards requests to the Gemini API. The API key **never** appears in the browser bundle.

### The Express Proxy (`server/index.js`)

| Route | Purpose |
|:------|:--------|
| `POST /api/gemini/generate` | Single-shot text generation |
| `POST /api/gemini/chat` | Multi-turn chat |
| `POST /api/gemini/portrait` | Image generation |
| `POST /api/gemini/encounter` | AI encounter drafting (description → `EncounterTemplate` with creature stat blocks) |
| `POST /api/gemini/live-token` | Returns authenticated Live Audio session credential payload (currently proxy-issued API key) |
| `GET /api/health` | Health check |
| `GET /*` | Serves static `dist/` files (production) |

**Middleware pipeline:** Firebase token verification → per-user rate limiter (20/min) → global rate limiter (200/min) → Gemini proxy.

---

## Chapter 6: Cloud Functions

> *"Invisible servants toil behind the scenes, keeping the realm's ledgers in perfect order."*

Firebase Cloud Functions v2 (located in `functions/src/index.ts`) provide server-side data consistency that cannot be handled safely from the client.

### Functions

| Function | Trigger | Purpose |
|:---------|:--------|:--------|
| `onMemberCreated` | `onDocumentCreated('campaigns/{campaignId}/members/{memberId}')` | Adds the new member's UID to `campaign.memberUids[]` via `arrayUnion` |
| `onMemberDeleted` | `onDocumentDeleted('campaigns/{campaignId}/members/{memberId}')` | Removes the member's UID from `campaign.memberUids[]` via `arrayRemove` (with campaign existence check) |

### Why Cloud Functions?

The `memberUids` array on the campaign document is used for `array-contains` queries (e.g., "find all campaigns this user belongs to"). Firestore security rules restrict campaign document updates to the DM — but when a non-DM player joins via invite code, they can't update the campaign doc. Cloud Functions run with admin privileges, bypassing security rules to keep `memberUids` in sync automatically.

### Deployment

Cloud Functions deploy automatically via the Cloud Build pipeline (Step 4 in `cloudbuild.yaml`). For manual deployment:

```bash
cd functions && npm install && npm run build
firebase deploy --only functions --project YOUR_PROJECT_ID
```

---

<p align="center"><em>⚔️ Thus concludes the Architect's Blueprints. ⚔️</em></p>
