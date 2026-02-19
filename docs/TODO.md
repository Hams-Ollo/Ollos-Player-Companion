# ⚜️ The Quest Board — Developer Roadmap ⚜️

> *"Step right up, adventurer! The Quest Board holds all manner of work —  
> from dragon-slaying epics to simple fetch quests. Find what suits your  
> level and sign your name."*
>
> Living document tracking planned features, enhancements, and community requests.
>
> **Scribed last:** 2026-02-13 (roadmap audit: security + communication + high-level creation status corrected to match code)

---

## The Difficulty Rating

> *Like encounter difficulty, each quest has a challenge rating.*

| Rating | Meaning |
|:-------|:--------|
| 🔴 **Deadly** | Blocking issues or core missing functionality |
| 🟠 **Hard** | Important for next release |
| 🟡 **Medium** | Nice to have, improves UX or DX significantly |
| 🟢 **Easy** | Polish, minor enhancements, good first quest |
| 🔵 **Community** | Requested by fellow adventurers |

---

## The Campaign Map — Development Roadmap

> *"Our journey is long, but the path is clear."*

```
Phase 0: Foundation Cleanup           ████████████████████████████████████████  ✅ CLEARED
Phase 1: Firestore Campaign Foundation    ████████████████████████████████████████  ✅ CLEARED
UI Overhaul & API Cleanup                ████████████████████████████████████████  ✅ CLEARED
Phase 2: Campaign Context & Party UI          ██████████████████████████████████  ✅ CLEARED
🔒 Security Hardening (BLOCKS PUBLIC LAUNCH)   ██████████████████░░░░░░░░░░░░░░  ← PRIMARY FOCUS
Character Sheet Parity (D&D Beyond-Inspired)           ░░░░░░░░████████░░░░░░░░░░
Character Export & Import                              ░░░░░░░░████████░░░░░░░░░░
Phase 3: Combat & Initiative Tracker                          ░░░░░░░░████████░░
Premade Character Templates                                   ░░░░░░░░████████░░
Phase 4: DM Journal, NPCs & Items                            ░░░░░░░░████████░░
Phase 4b: Custom Items & Loot                                ░░░░░░░░░░██████░░
Phase 5: AI DM Co-Pilot                                              ░░░░░░████
SRD Content Browser                                                  ░░░░░░████
Phase 6: Multiplayer Communication                                   ████░░████  (whispers live; roll requests backend)
Phase 7: Higher-Level Char Creation                                  ████████████░░  (1–20 flow live; multiclass pending)
                                       v0.3.1   v0.4.0  v0.4.1  v0.4.x  v0.5.0  v0.5.5  v0.6.0  v0.7.0
```

### Phase Dependencies

> *Some dungeons must be cleared before others become accessible.*

```
Phase 0 ─→ Phase 1 ─→ Phase 2 ─┬→ 🔒 Security Hardening (MUST clear before public sharing)
                                │      │
                                │      ├→ v0.4.x Char Sheet Parity + Export
                                │      └→ Phase 3 (Combat) + Premade Templates
                                ├→ Phase 4 (Journal/NPCs) ─┬→ Phase 4b (Items & Loot)
                                ├→ Phase 6 (Comms)         │
                                │                           └→ Phase 5 (AI Co-Pilot) + SRD Browser
                                └→ Phase 7 (Char Creation)
```

### Release Targets

| Version | Phase | Milestone | Status |
|:--------|:------|:----------|:-------|
| v0.3.1 | Phase 0 | Foundation — utilities, dice, conditions | ✅ Cleared |
| v0.3.2 | UI Overhaul | Class theming, Dashboard rewrite, centralized AI | ✅ Cleared |
| v0.4.0 | Phases 1–2 | Firestore campaigns, party roster, DM overview | ✅ Cleared |
| v0.4.1 | 🔒 Security | API proxy, rate limiting, debug cleanup, Firestore hardening | 🟨 In Progress (Layers 1–2 ✅, Layer 3 mostly ✅, Layers 4–7 remaining) |
| v0.4.x | Char Sheet Parity | Conditions, heroic inspiration, passives, XP, clone, export | ⬜ Not Started |
| v0.5.0 | Phases 3–4 | Combat tracker, encounter builder, DM journal, NPC registry, premade templates | 🟨 In Progress (UX polish started; core combat/DM systems pending) |
| v0.5.5 | Phase 4b | DM item builder, SRD magic items, loot sessions | ⬜ Not Started |
| v0.6.0 | Phases 5–6 | AI DM Co-Pilot, whispers, roll requests, handouts, SRD content browser | 🟨 In Progress (whispers shipped; roll requests backend present; handouts/browser pending) |
| v0.7.0 | Phase 7 | Create characters at levels 1–20, multiclass | 🟨 In Progress (1–20 flow shipped; multiclass + advanced feature aggregation pending) |

---

## ✅ Dungeon Cleared: v0.3.1 — Foundation Cleanup (Phase 0)

> *The foundation stones have been laid. The keep stands firm.*

### 🔴 Deadly

- [x] **Extract dice rolling to `lib/dice.ts`** — `parseDiceExpression()`, `rollDice()`, `rollBatch()`
- [x] **Refactor Dashboard to use `lib/dice.ts`** — Replace inline dice parsing
- [x] **Refactor RestModal to use `lib/dice.ts`** — Replace inline hit die rolling

### 🟠 Hard

- [x] **Add `CONDITIONS` reference map** — All 15 D&D 5e conditions with mechanical effects
- [x] **Add encounter difficulty thresholds** — DMG XP budget tables (Easy/Medium/Hard/Deadly per level 1–20)
- [x] **Expand `types.ts` with multiplayer models** — `CampaignMember`, `CombatEncounter`, `Combatant`, `DMNote`, `Whisper`, `RollRequest`, etc.
- [ ] **Backend API proxy** — Move Gemini API key to a server-side proxy → _✅ Shipped in v0.4.1 Security Hardening (Layers 1–2)_

### 🟡 Medium

- [ ] **Add SRD monster data** — `lib/monsters.ts` with ~300 SRD creatures

---

## 📦 Current Quest: v0.4.0 — Campaign Foundation & Party System (Phases 1–2) ✅

> *"The war council has assembled. The structures that unite  
> adventurers across the realm stand firm."*

### 🔴 Deadly

- [x] **Firestore campaign subcollection structure** — `campaigns/{id}/members`, `/encounters`, `/notes`, `/templates`, `/whispers`, `/rollRequests`
- [x] **Create `lib/campaigns.ts` service layer** — Full campaign CRUD with real-time subscriptions
- [x] **Update Firestore security rules** — Campaign member reads, DM-only writes, invite rules
- [x] **Create `CampaignContext` provider** — `useCampaign()` hook with campaigns, members, roles
- [x] **Wire `CampaignProvider` into `App.tsx`** — Remove localStorage campaign state, wrap with provider
- [x] **Rewrite `CampaignManager` component** — Replace localStorage with `useCampaign()`

### 🟠 Hard

- [x] **DM/Player role selection** — DM role confirmation badge at campaign creation
- [x] **Character-to-campaign assignment** — Dropdown picker at join, invite accept, and post-join change
- [x] **Build `PartyRoster` component** — Grid of party member cards with portraits; DM kick button for removing members
- [x] **Build `DMPartyOverview` component** — Live vitals grid, passive scores panel
- [x] **Build `DMDashboard` layout** — DM-specific layout when `myRole === 'dm'`; `allowPlayerInvites` toggle; regenerate join code
- [x] **Invite management** — Join code sharing (prominent copy-paste) + email invites + accept/decline flow + 7-day expiry + duplicate prevention
- [ ] **Migrate localStorage campaigns to Firestore** — Migration function

### 🟡 Medium

- [x] **Cloud Functions layer** — `onMemberCreated` / `onMemberDeleted` Firestore triggers for `memberUids` sync; auto-deployed via Cloud Build
- [x] **Add "Party" card to player Dashboard** — Party card in `CardStack` when in a campaign
- [ ] **Character diff badges** — Notification dot when party members level up

---

## � SECURITY GATE: v0.4.1 — The Warding Circle (Blocks Public Launch)

> *"The strongest keep falls to a single unguarded gate. Before the realm is opened  
> to visitors, every ward must be inscribed, every seal tested, every secret hidden."*
>
> **⚠️ CRITICAL: Layers 1–2 are complete and removed client-side key exposure.**  
> Remaining work focuses on hardening (rules, cloud restrictions, headers, dependency hygiene)  
> before broad public sharing.

### 🔴 Deadly — Layer 1: Backend API Proxy (eliminates root cause)

- [x] **Create Express proxy server** (`server/index.ts`) — Serves static SPA files + proxies `/api/gemini/*` routes
- [x] **Firebase Admin SDK token verification** — Every `/api/*` request requires valid Firebase ID token in `Authorization: Bearer <token>` header; unauthenticated requests get `401`
- [x] **Refactor `lib/gemini.ts`** — Replace direct `generativelanguage.googleapis.com` calls with `fetch('/api/gemini/...')` + attach Firebase ID token from `auth.currentUser.getIdToken()`
- [x] **Remove `GEMINI_API_KEY` from Vite `define`** — Key must never appear in the client JS bundle
- [x] **Remove `VITE_GEMINI_FILE_URI_*` from client bundle** — Move D&D PDF file URIs to server-side environment only
- [x] **Update Dockerfile** — Replace nginx-only Stage 2 with Node Express (serves static `dist/` + proxy routes)
- [x] **Update `cloudbuild.yaml`** — Remove `GEMINI_API_KEY` from `--build-arg`; inject as Cloud Run **runtime** env var instead

### 🔴 Deadly — Layer 2: Server-Side Rate Limiting

- [x] **Per-user rate limiting** — In-memory map keyed by Firebase UID, 20 req/min per user
- [x] **Global rate limit fallback** — 200 req/min total across all users; prevents runaway if user pool spikes
- [x] **Rate limit response headers** — Return `X-RateLimit-Remaining` and `Retry-After` so the client can show friendly UX

### 🟠 Hard — Layer 3: Debug & Logging Cleanup

- [x] **Strip API key `console.log` from `gemini.ts`** — No API key debug logging remains in the client helper
- [x] **Strip key prefix logging from `vite.config.ts`** — Vite config no longer logs key prefixes
- [ ] **Add production logging guard** — Wrap remaining debug logs in `if (import.meta.env.DEV)` checks

### 🟠 Hard — Layer 4: Firestore Rules Tightening

- [x] **Restrict invite `update` rule** — Fixed `toEmail` → `email` field reference; now only invite recipient or campaign DM can accept/decline
- [ ] **Add field-type validation** — Enforce string/number types on `ownerUid`, `name`, `level`, etc. in security rules
- [ ] **Add document size limits** — `request.resource.data.size() < N` on character writes to prevent abuse
- [ ] **Scope local guest fallback** — Remove `guest-local-*` UID bypass or restrict it to localStorage-only path (no Firestore access)

### 🟡 Medium — Layer 5: Google Cloud Console Restrictions

- [ ] **Restrict Gemini API key** — Google Cloud Console → Credentials → restrict to Cloud Run service account/IP (no longer browser-accessible)
- [ ] **Restrict Firebase API key** — Add HTTP referrer restrictions to deployed domain(s) only
- [ ] **Set daily quota caps** — Billing safety net on Gemini key (e.g., 5000 req/day)

### 🟡 Medium — Layer 6: Security Headers & CSP

- [ ] **Content Security Policy** — `default-src 'self'; script-src 'self'; connect-src 'self' *.googleapis.com *.firebaseio.com`
- [ ] **HSTS header** — `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [x] **Permissions-Policy** — Server now sets `microphone=(self), camera=(), geolocation=()`

### 🟢 Easy — Layer 7: Dependency & Supply Chain

- [ ] **Run `npm audit fix`** — Resolve known vulnerabilities before public launch
- [ ] **Pin critical dependency versions** — Remove `^` semver ranges for `@google/genai`, `firebase`, `react`
- [ ] **Update `.env.example`** — Document which variables are build-time (Firebase config) vs runtime-only (Gemini key)

---
## 📦 v0.4.x — Character Sheet Parity & Export (D&D Beyond-Inspired)

> *"The hero's portrait grows clearer — every condition, every triumph,
> every earned point of experience now visible at a glance."*

### 🟠 Hard — Condition Tracking (pulled forward from v0.8.0+)

- [ ] **Add `activeConditions`, `exhaustionLevel`, `heroicInspiration` to `CharacterData`** — New fields in `types.ts`; `activeConditions: string[]`, `exhaustionLevel: number (0-6)`, `heroicInspiration: boolean`
- [ ] **Build `ConditionsModal.tsx`** — Checkbox list of all 15 conditions (reusing `CONDITIONS` from `constants.tsx`), exhaustion level picker (0-6), persisted to Firestore
- [ ] **Wire "Conditions" button into `CombatStrip`** — Opens conditions modal, shows active condition count badge
- [ ] **Display active conditions on Dashboard header** — Condition badges/chips visible at a glance, matching D&D Beyond's prominent placement

### 🟡 Medium — Character Sheet Enhancements

- [ ] **Heroic Inspiration toggle** — Boolean toggle icon near portrait in Dashboard header; one-tap on/off
- [ ] **Passive Investigation & Passive Insight** — Compute `10 + skill modifier` for Investigation and Insight; display alongside Passive Perception in `SkillsDetail.tsx`
- [ ] **XP tracking & progress display** — Add `xp: number` to `CharacterData`; show XP / XP-to-next-level progress bar in `SettingsModal` or Dashboard header

### 🟡 Medium — Portrait Experience

- [x] **Portrait fullscreen lightbox** — New `PortraitLightbox.tsx`; clicking the portrait in `Dashboard` opens a fullscreen overlay with ESC/click-outside dismiss and "Regenerate Portrait" / "Change Image" CTA buttons; portrait generator no longer opens directly on portrait click
- [x] **Richer regeneration description default** — `PortraitGenerator` now builds its default description from `race`, `class`, `subclass`, and `background` (where available); previously only used `race class`
- [x] **Camera selfie as portrait base** — Dedicated `capture="user"` file input in `PortraitGenerator`'s Image to Image tab renders as a "Use Camera / Take Selfie" button; image is passed to Gemini for fantasy redraw and is never persisted directly
- [x] **Privacy disclosure (one-time consent)** — Inline `ShieldCheck` notice in Image to Image tab explains upload data use; dismissed with "I Understand" and remembered in `localStorage` as `portrait_image_consent_v1`
- [x] **Client-side upload size guard** — `handleFileSelect` rejects files over 10 MB before base64 conversion with a user-facing error message
- [x] **Lift camera Permissions-Policy block** — `server/index.js` updated from `camera=()` to `camera=(self)` so the browser camera API is available to same-origin pages; required for `<input capture>` and future `getUserMedia` use

### 🟡 Medium — Character Management

- [ ] **Character cloning ("Duplicate")** — Deep-clone `CharacterData` with new ID, clear `campaignId`/`campaign`, append "(Copy)" to name; option in character card menu on `CharacterSelection.tsx`

### 🟠 Hard — Character Export & Import

- [ ] **Native JSON export/import** — Download/upload `CharacterData` as `.json`
- [ ] **PDF character sheet export** — Standard 5e sheet via `jspdf`

### 🟡 Medium — Export Formats

- [ ] **FoundryVTT export** — Transform to FoundryVTT actor JSON schema
- [ ] **D&D Beyond format export** — Transform to D&D Beyond-compatible JSON
- [ ] **Export UI** — Format picker (JSON / PDF / FoundryVTT / D&D Beyond)

---
## �📦 Epic Quest: v0.5.0 — Combat System & DM Campaign Tools (Phases 3–4)

> *"Roll for initiative! The combat system and DM tools  
> will bring the full tabletop experience to the digital realm."*

### 🟠 Hard — Combat & Initiative

- [ ] **Create `lib/combat.ts` service layer** — Firestore transaction-based combat management
- [ ] **Build `InitiativeTracker` component** — Sorted combatants, turn tracking, DM controls
- [ ] **DM combat management** — Full turn-order with conditions, NPC tracking, stat block reference
- [ ] **AI encounter drafting** — Brief description → structured `EncounterTemplate` with difficulty rating
- [ ] **Build `EncounterBuilder` component** — Monster/NPC picker, difficulty meter, save/load templates
- [ ] **Batch initiative rolling** — "Roll All" for NPCs/monsters

### 🟠 Hard — DM Campaign Journal, NPCs & Factions

- [ ] **Create `lib/notes.ts` service layer** — CRUD for DM notes with filtering
- [ ] **Create `lib/npcs.ts` service layer** — NPC management in `campaigns/{id}/npcs`
- [ ] **Add `NPC` interface to `types.ts`** — Full stat blocks, backstory, faction, portrait
- [ ] **Build `DMNotesPanel` / Campaign Journal** — Tabbed views, Markdown editor, tags, entity linking
- [ ] **Build `NPCRegistry` component** — NPC cards, AI dialogue generator, portrait generation
- [ ] **AI NPC drafting with context** — Pulls party journals + DM notes for contextual generation
- [ ] **Build `QuestTracker` component** — Quest status, objectives, rewards
- [ ] **Build `FactionManager` component** — Faction cards, goals, NPC links, disposition tracking
- [ ] **Bidirectional entity linking** — Wiki-style navigation between NPCs, factions, locations

### 🟡 Medium

- [ ] **Lair action & legendary action support** — Fixed initiative entries, legendary action counter
- [ ] **Turn timer** — Configurable countdown (30s/60s/90s)
- [ ] **Quick-capture notes during combat** — Floating button, timestamped + encounter-tagged
- [ ] **AI session summarization** — "Summarize Session" → narrative recap
- [ ] **AI cross-reference suggestions** — Auto-link to existing entities when saving notes

### 🟢 Easy

- [ ] **Keyboard shortcuts for combat** — Space=next, N=add, D=damage, H=heal
- [ ] **Audio/visual combat feedback** — Nat 20/1 animations, combat transitions

### 🟠 Hard — Premade Character Templates (Epic 20)

- [ ] **Define `PremadeTemplate` interface** — Maps to `CharacterData` + metadata (description, playstyle, difficulty rating)
- [ ] **Create 12 premade template entries** — One per PHB class with curated race/stat/equipment/backstory combos in `constants.tsx`
- [ ] **Build premade vs. custom selection dialog** — Modal on "Create New Character" with two paths (matching D&D Beyond pattern)
- [ ] **Build premade gallery browser** — Card grid with class icon, playstyle description, difficulty badge
- [ ] **Wire premade selection to `CharacterCreationWizard`** — Populates wizard state, skips to review/confirm step
- [ ] **AI portrait pre-generation for premades** — Generate on first load or use static placeholder art

### 🟡 Medium — UX Polish (D&D Beyond-Inspired)

- [ ] **Rest dropdown UX refinement** — Contextual popover near campfire icon instead of full-screen modal
- [x] **Campaign badge on character cards** — Campaign label is displayed on `CharacterSelection` cards
- [ ] **Saved dice presets ("My Dice")** — `savedDice` array on `CharacterData`, quick-access from `QuickRollModal`

---

## 📦 Side Quest: v0.5.5 — Custom Items & Loot System (Phase 4b)

> *"The DM's treasure vault overflows with possibility."*

### 🟠 Hard

- [ ] **`CustomItem` interface** — Rarity, attunement, stat block, lore text
- [ ] **`lib/items.ts` service layer** — Custom items in campaign subcollection
- [ ] **DM custom item creation** — Form-based item builder with AI assist
- [ ] **Build `ItemBuilder` component** — Weapons, armor, wondrous items, potions, scrolls
- [ ] **AI Item Generator** — Brief concept → full balanced item with stats and lore
- [ ] **DM loot awards** — Pick items (custom + SRD), assign to party members
- [ ] **Build `LootSession` component** — DM selects → assigns → players receive

### 🟡 Medium

- [ ] **SRD magic item catalog** — ~200 items with full descriptions
- [ ] **Build `DM Item Vault`** — Personal library, searchable, reusable across campaigns
- [ ] **Magic item display in inventory** — Rarity colors, attunement, charge tracking

---

## 📦 v0.6.0 — AI DM Co-Pilot & Communication (Phases 5–6)

> *"The ultimate power: an AI assistant that knows your entire campaign."*

### 🟠 Hard

- [ ] **Build `DMAssistant` component** — Context-injected AI with full campaign state
- [ ] **Suggested prompt quick-actions** — "Suggest a plot twist", "Draft an NPC", "Create a magic item"
- [ ] **Structured output mode** — JSON schema for encounters/NPCs/loot, directly importable
- [ ] **AI NPC generation using journal & note context**
- [ ] **Context window management** — Summarize older notes, handle 50K+ token campaigns
- [ ] **Enhance player `AskDMModal`** — Character data injection for context-aware answers

### 🟡 Medium

- [x] **Whisper system** — DM-to-player private messages (service + PartyRoster UI)
- [ ] **Roll request system** — DM-initiated group rolls _(backend service implemented; player/DM UI pending)_
- [ ] **Shared handouts** — DM pushes read-only content to players
- [ ] **AI conversation persistence** — Save chats to Firestore by session

### 🟠 Hard — SRD Content Browser (Epic 21)

- [ ] **Build unified search index** — Aggregate spells, items, conditions, and monster data into searchable index
- [ ] **Create `ContentBrowser.tsx` component** — Search bar with category filters, result cards with type badges
- [ ] **Spell reference cards** — Full spell details, school icons, level badges
- [ ] **Item reference cards** — Weapon/armor/gear stats, rarity colors for magic items
- [ ] **Condition reference cards** — Mechanical effects, icon display, exhaustion level table
- [ ] **Monster reference cards** — Depends on `lib/monsters.ts`; stat blocks, CR, abilities
- [ ] **Integrate as Dashboard card or bottom-nav tab** — Accessible from main navigation

---

## 📦 v0.7.0 — Higher-Level Character Creation (Phase 7)

> *"Not every hero starts at level 1. Some begin their tale mid-adventure."*

### 🟠 Hard

- [x] **Level selection (1–20)** in Character Creation Wizard
- [x] **Cumulative HP calculation** — Sum of HD averages + CON per level
- [x] **ASI / Feat application per level** — Class-specific ASI levels
- [x] **Subclass selection at appropriate level**
- [x] **Spell slots & spells known by level** — Use existing progression tables
- [ ] **Class features accumulated through levels** — Compact multi-level UI

### 🟡 Medium

- [x] **Level-appropriate starting equipment & gold**
- [ ] **"Recommended Build" quick button** — AI-suggested standard choices
- [x] **Deterministic logic from constants.tsx** — PHB tables for core math
- [ ] **Multiclass support** — Multiple classes, split hit dice, merged spell slots

---

## 🗺️ The Far Horizon (v0.8.0+)

> *"These quests lie beyond the mist. Someday, brave adventurer... someday."*

### 🟡 Medium

- [ ] **Death saves tracker** — 3 successes / 3 failures, auto-reset
- [ ] **Concentration tracker** — Flag active spell, CON save prompts
- [ ] **Spell slot recovery UI** — Arcane Recovery, Font of Magic, Pact Magic
- [ ] **Dark/light theme toggle** — A light theme for the brave
- [ ] **Offline-first DM notes** — Dual-mode persistence with sync

### 🟢 Easy

- [ ] **PWA support** — Service worker + manifest for mobile install
- [ ] **Dice roll history panel** — Last 50 rolls, persistent log
- [ ] **Character comparison** — Side-by-side stat comparison
- [ ] **Sound effects** — Dice rolls, level-up fanfare
- [ ] **i18n / localization** — Multi-language support
- [ ] **Print-friendly character sheet** — CSS print stylesheet
- [ ] **Quick-reference rules card** — Common actions, conditions, rules
- [ ] **Map / location tracker** — Scene manager

---

## 🔵 Community Requests

> *"The people speak! Add your voice to the chorus."*

- [x] **Create characters at any level (1–20)** — Shipped in `CharacterCreationWizard`.
- [ ] _[Post on the Quest Board](https://github.com/Hams-Ollo/Ollos-Player-Companion/issues) to suggest a feature!_

---

## ✅ Tales of Past Glory — Completed

> *"These quests have been completed and the heroes rewarded.  
> Their deeds are inscribed here for posterity."*

- [x] **Foundation Cleanup (Phase 0)** — Dice library, CONDITIONS, XP budgets _(v0.3.1 — 2026-02-11)_
- [x] **Firestore Campaign Foundation** — `lib/campaigns.ts`, `CampaignContext`, security rules, indexes _(v0.3.1 — 2026-02-11)_
- [x] **Character UI Overhaul** — Class theming, `AbilityScoreBar`, `CombatStrip`, Dashboard rewrite _(v0.3.2 — 2026-02-12)_
- [x] **Centralized AI Helpers** — `generatePortrait()`, shared `generateWithContext`, refactored all callers _(v0.3.2 — 2026-02-12)_
- [x] **Error Handling** — `parseApiError()` with numeric status codes _(v0.3.2 — 2026-02-12)_
- [x] **Bug Fixes** — Class-themed colors, inline HP editing, Sneak Attack dice, AC calc, attack formatting _(v0.3.2 — 2026-02-12)_
- [x] **Gemini API Compatibility** — Removed incompatible settings _(v0.3.1 — 2026-02-13)_
- [x] **Full PHB Marketplace** — 160+ items, search, cost formatting _(v0.3.1 — 2026-02-13)_
- [x] **Cloud Run Infrastructure** — Dockerfile, nginx, CI/CD pipeline _(v0.2.3 — 2026-02-11)_
- [x] **Firestore Character Persistence** — Dual-mode, debounced writes, migration _(v0.3.0 — 2026-02-11)_
- [x] **Firebase Auth** — Google sign-in + anonymous fallback _(v0.2.3 — 2026-02-11)_
- [x] **Spellbook Support, Advanced Dice, Data-driven Spells, Slot Tables** _(v0.1.x–v0.2.x)_
- [x] **Starter Equipment Shop, Racial Traits, Class Features, Campaign Manager** _(v0.1.0)_
- [x] **Express API Proxy (Layers 1–2)** — `server/index.js` + auth middleware + rate limiter; API key fully server-side _(v0.4.1 — 2026-02-12)_
- [x] **Campaign Membership Sync** — Bidirectional sync of `CharacterData.campaign`/`campaignId` with members subcollection on join, leave, and reassignment _(v0.4.0 — 2026-02-12)_
- [x] **Cloud Run Secret Manager** — `GEMINI_API_KEY` stored in GCP Secret Manager, mounted at runtime _(v0.4.1 — 2026-02-12)_
- [x] **Campaign Provider Integration** — `CampaignProvider` wired into `App.tsx`, `CampaignManager` rewritten with `useCampaign()` _(v0.4.0 — 2026-02-12)_
- [x] **DM Dashboard & Party Views** — `DMDashboard`, `DMPartyOverview`, `PartyRoster` components built _(v0.4.0 — 2026-02-12)_
- [x] **Campaign Role & Character Assignment** — DM role confirmation, character picker at join/invite, `updateMemberCharacter` _(v0.4.0 — 2026-02-12)_
- [x] **Invite Management** — Join code sharing panel, email invites via `createInvite`, `sendInvite` context action _(v0.4.0 — 2026-02-12)_
- [x] **Campaign Invite System Overhaul** — DM remove members, player invite toggle, join code regeneration, 7-day invite expiry, duplicate prevention, Cloud Functions memberUids sync _(v0.4.1 — 2026-02-12)_
- [x] **Cloud Functions v2** — `onMemberCreated` / `onMemberDeleted` Firestore triggers for server-side `memberUids` sync _(v0.4.1 — 2026-02-12)_
- [x] **Cloud Build Pipeline** — Auto-deploys Cloud Functions (Step 4) and Firestore rules (Step 5) alongside Cloud Run app _(v0.4.1 — 2026-02-12)_
- [x] **Firestore Rules Fix** — Fixed `toEmail` → `email` field mismatch in invite update rule _(v0.4.1 — 2026-02-12)_
- [x] **Accessibility Fixes, Error Boundaries, Tailwind Build Pipeline** _(v0.1.1–v0.2.0)_

---

## 💡 How to Post a Quest

1. Check this board and [GitHub Issues](https://github.com/Hams-Ollo/Ollos-Player-Companion/issues) for duplicates
2. Open a new issue with the `enhancement` label
3. Describe the **user story** ("As a player, I want to...")
4. Include any relevant PHB/SRD page references
5. The guild masters will triage and pin it to this board

---

<p align="center"><em>⚔️ There are always more quests to be done. Onward! ⚔️</em></p>
