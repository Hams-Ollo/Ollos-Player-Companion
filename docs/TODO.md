# ⚜️ The Quest Board — Developer Roadmap ⚜️

> *"Step right up, adventurer! The Quest Board holds all manner of work —  
> from dragon-slaying epics to simple fetch quests. Find what suits your  
> level and sign your name."*
>
> Living document tracking planned features, enhancements, and community requests.
>
> **Scribed last:** 2026-02-12 (security hardening roadmap added)

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
Phase 2: Campaign Context & Party UI          ██████████████████░░░░░░░░░░░░░░░░  ← WE ARE HERE
🔒 Security Hardening (BLOCKS PUBLIC LAUNCH)   ░░░░░░░░████████░░░░░░░░░░░░░░░░  ← NEXT PRIORITY
Phase 3: Combat & Initiative Tracker                  ░░░░░░░░████████░░░░░░░░░░
Phase 4: DM Journal, NPCs & Items                    ░░░░░░░░████████░░░░░░░░░░
Phase 4b: Custom Items & Loot                        ░░░░░░░░░░██████░░░░░░░░░░
Phase 5: AI DM Co-Pilot                                      ░░░░░░░░████████░░
Phase 6: Multiplayer Communication                            ░░░░░░░░████████░░
Phase 7: Higher-Level Char Creation                                   ░░████████
Character Export (independent)         ░░░░░░░░░░░░░░ (can ship anytime)
                                       v0.3.1   v0.4.0  v0.4.1  v0.5.0  v0.5.5  v0.6.0  v0.7.0
```

### Phase Dependencies

> *Some dungeons must be cleared before others become accessible.*

```
Phase 0 ─→ Phase 1 ─→ Phase 2 ─┬→ 🔒 Security Hardening (MUST clear before public sharing)
                                │      │
                                │      └→ Phase 3 (Combat)
                                ├→ Phase 4 (Journal/NPCs) ─┬→ Phase 4b (Items & Loot)
                                ├→ Phase 6 (Comms)         │
                                │                           └→ Phase 5 (AI Co-Pilot)
                                └→ Phase 7 (Char Creation)
Character Export (no deps) ─→ can ship independently at any time
```

### Release Targets

| Version | Phase | Milestone | Status |
|:--------|:------|:----------|:-------|
| v0.3.1 | Phase 0 | Foundation — utilities, dice, conditions | ✅ Cleared |
| v0.3.2 | UI Overhaul | Class theming, Dashboard rewrite, centralized AI | ✅ Cleared |
| v0.4.0 | Phases 1–2 | Firestore campaigns, party roster, DM overview | 🟨 In Progress |
| v0.4.1 | 🔒 Security | API proxy, rate limiting, debug cleanup, Firestore hardening | ⬜ Not Started |
| v0.4.x | Character Export | JSON export/import, PDF sheet, FoundryVTT/D&D Beyond | ⬜ Not Started |
| v0.5.0 | Phases 3–4 | Combat tracker, encounter builder, DM journal, NPC registry | ⬜ Not Started |
| v0.5.5 | Phase 4b | DM item builder, SRD magic items, loot sessions | ⬜ Not Started |
| v0.6.0 | Phases 5–6 | AI DM Co-Pilot, whispers, roll requests, handouts | ⬜ Not Started |
| v0.7.0 | Phase 7 | Create characters at levels 1–20, multiclass | ⬜ Not Started |

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
- [ ] **Backend API proxy** — Move Gemini API key to a server-side proxy → _Tracked in v0.4.1 Security Hardening_

### 🟡 Medium

- [ ] **Add SRD monster data** — `lib/monsters.ts` with ~300 SRD creatures

---

## 📦 Current Quest: v0.4.0 — Campaign Foundation & Party System (Phases 1–2)

> *"The war council assembles. It is time to build the structures  
> that will unite adventurers across the realm."*

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
- [x] **Build `PartyRoster` component** — Grid of party member cards with portraits
- [x] **Build `DMPartyOverview` component** — Live vitals grid, passive scores panel
- [x] **Build `DMDashboard` layout** — DM-specific layout when `myRole === 'dm'`
- [x] **Invite management** — Join code sharing (prominent copy-paste) + email invites + accept/decline flow
- [ ] **Migrate localStorage campaigns to Firestore** — Migration function

### 🟡 Medium

- [ ] **Cloud Functions layer** — `joinByCode`, `fetchPartyCharacters`, `sendInvite` _(geminiProxy moved to v0.4.1 Security)_
- [x] **Add "Party" card to player Dashboard** — Party card in `CardStack` when in a campaign
- [ ] **Character diff badges** — Notification dot when party members level up

---

## � SECURITY GATE: v0.4.1 — The Warding Circle (Blocks Public Launch)

> *"The strongest keep falls to a single unguarded gate. Before the realm is opened  
> to visitors, every ward must be inscribed, every seal tested, every secret hidden."*
>
> **⚠️ CRITICAL: Complete Layers 1–3 before sharing on Reddit/Discord.**  
> The Gemini API key is currently baked into the browser JS bundle. Anyone can extract  
> it in 30 seconds with DevTools and abuse your quota. This phase eliminates that risk.

### 🔴 Deadly — Layer 1: Backend API Proxy (eliminates root cause)

- [ ] **Create Express proxy server** (`server/index.ts`) — Serves static SPA files + proxies `/api/gemini/*` routes
- [ ] **Firebase Admin SDK token verification** — Every `/api/*` request requires valid Firebase ID token in `Authorization: Bearer <token>` header; unauthenticated requests get `401`
- [ ] **Refactor `lib/gemini.ts`** — Replace direct `generativelanguage.googleapis.com` calls with `fetch('/api/gemini/...')` + attach Firebase ID token from `auth.currentUser.getIdToken()`
- [ ] **Remove `GEMINI_API_KEY` from Vite `define`** — Key must never appear in the client JS bundle
- [ ] **Remove `VITE_GEMINI_FILE_URI_*` from client bundle** — Move D&D PDF file URIs to server-side environment only
- [ ] **Update Dockerfile** — Replace nginx-only Stage 2 with Node Express (serves static `dist/` + proxy routes)
- [ ] **Update `cloudbuild.yaml`** — Remove `GEMINI_API_KEY` from `--build-arg`; inject as Cloud Run **runtime** env var instead

### 🔴 Deadly — Layer 2: Server-Side Rate Limiting

- [ ] **Per-user rate limiting** — In-memory map keyed by Firebase UID, 20 req/min per user
- [ ] **Global rate limit fallback** — 200 req/min total across all users; prevents runaway if user pool spikes
- [ ] **Rate limit response headers** — Return `X-RateLimit-Remaining` and `Retry-After` so the client can show friendly UX

### 🟠 Hard — Layer 3: Debug & Logging Cleanup

- [ ] **Strip API key `console.log` from `gemini.ts`** — Lines 16-18, 28 currently leak key length + first 8 chars to every user's browser console
- [ ] **Strip key prefix logging from `vite.config.ts`** — Lines 18-22 print first 8 chars of API key to CI build logs
- [ ] **Add production logging guard** — Wrap remaining debug logs in `if (import.meta.env.DEV)` checks

### 🟠 Hard — Layer 4: Firestore Rules Tightening

- [ ] **Restrict invite `update` rule** — Currently any signed-in user can accept any invite; restrict to `toEmail` owner or campaign DM only
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
- [ ] **Permissions-Policy** — Restrict camera/microphone/geolocation to what's actually needed (voice input uses mic)

### 🟢 Easy — Layer 7: Dependency & Supply Chain

- [ ] **Run `npm audit fix`** — Resolve known vulnerabilities before public launch
- [ ] **Pin critical dependency versions** — Remove `^` semver ranges for `@google/genai`, `firebase`, `react`
- [ ] **Update `.env.example`** — Document which variables are build-time (Firebase config) vs runtime-only (Gemini key)

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

- [ ] **Whisper system** — DM-to-player private messages
- [ ] **Roll request system** — DM-initiated group rolls
- [ ] **Shared handouts** — DM pushes read-only content to players
- [ ] **AI conversation persistence** — Save chats to Firestore by session

---

## 📦 v0.4.x — Character Export & Interoperability

> *"Take your hero with you — across planes, platforms, and file formats."*

### 🟠 Hard

- [ ] **Native JSON export/import** — Download/upload `CharacterData` as `.json`
- [ ] **PDF character sheet export** — Standard 5e sheet via `jspdf`

### 🟡 Medium

- [ ] **FoundryVTT export** — Transform to FoundryVTT actor JSON schema
- [ ] **D&D Beyond format export** — Transform to D&D Beyond-compatible JSON
- [ ] **Export UI** — Format picker (JSON / PDF / FoundryVTT / D&D Beyond)

---

## 📦 v0.7.0 — Higher-Level Character Creation (Phase 7)

> *"Not every hero starts at level 1. Some begin their tale mid-adventure."*

### 🟠 Hard

- [ ] **Level selection (1–20)** in Character Creation Wizard
- [ ] **Cumulative HP calculation** — Sum of HD averages + CON per level
- [ ] **ASI / Feat application per level** — Class-specific ASI levels
- [ ] **Subclass selection at appropriate level**
- [ ] **Spell slots & spells known by level** — Use existing progression tables
- [ ] **Class features accumulated through levels** — Compact multi-level UI

### 🟡 Medium

- [ ] **Level-appropriate starting equipment & gold**
- [ ] **"Recommended Build" quick button** — AI-suggested standard choices
- [ ] **Deterministic logic from constants.tsx** — PHB tables for core math
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

- [ ] **Create characters at any level (1–20)** — Much requested. Tracked in v0.7.0.
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
- [x] **Campaign Provider Integration** — `CampaignProvider` wired into `App.tsx`, `CampaignManager` rewritten with `useCampaign()` _(v0.4.0 — 2026-02-12)_
- [x] **DM Dashboard & Party Views** — `DMDashboard`, `DMPartyOverview`, `PartyRoster` components built _(v0.4.0 — 2026-02-12)_
- [x] **Campaign Role & Character Assignment** — DM role confirmation, character picker at join/invite, `updateMemberCharacter` _(v0.4.0 — 2026-02-12)_
- [x] **Invite Management** — Join code sharing panel, email invites via `createInvite`, `sendInvite` context action _(v0.4.0 — 2026-02-12)_
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
