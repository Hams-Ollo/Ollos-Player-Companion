# 📋 Developer Roadmap

> Living document tracking planned features, enhancements, and community requests for The Player's Companion.
>
> **Last updated:** 2026-02-12

---

## 🏷️ Priority Legend

| Label | Meaning |
|-------|---------|
| 🔴 **Critical** | Blocking issues or core missing functionality |
| 🟠 **High** | Important for next release |
| 🟡 **Medium** | Nice to have, improves UX or DX significantly |
| 🟢 **Low** | Polish, minor enhancements, long-term ideas |
| 🔵 **Community** | Requested by contributors or users |

---

## 📊 Gantt Chart — Development Roadmap

```
Phase 0: Foundation Cleanup           ████████████████████████████████████████  ✅ DONE
Phase 1: Firestore Campaign Foundation    ████████████████████████████████████████  ✅ DONE (backend)
UI Overhaul & API Cleanup                ████████████████████████████████████████  ✅ DONE
Phase 2: Campaign Context & Party UI          ██████████░░░░░░░░░░░░░░░░░░░░░░░░  ← NOW
Phase 3: Combat & Initiative Tracker                  ░░░░░░░░████████░░░░░░░░░░
Phase 4: DM Journal, NPCs & Items                    ░░░░░░░░████████░░░░░░░░░░
Phase 4b: Custom Items & Loot                        ░░░░░░░░░░██████░░░░░░░░░░
Phase 5: AI DM Co-Pilot                                      ░░░░░░░░████████░░
Phase 6: Multiplayer Communication                            ░░░░░░░░████████░░
Phase 7: Higher-Level Char Creation                                   ░░████████
Character Export (independent)         ░░░░░░░░░░░░░░ (can ship anytime)
                                       v0.3.1   v0.4.0   v0.5.0  v0.5.5  v0.6.0  v0.7.0
```

### Phase Dependencies

```
Phase 0 ─→ Phase 1 ─→ Phase 2 ─┬→ Phase 3 (Combat)
                                ├→ Phase 4 (Journal/NPCs) ─┬→ Phase 4b (Items & Loot)
                                ├→ Phase 6 (Comms)        │
                                │                          └→ Phase 5 (AI Co-Pilot)
                                └→ Phase 7 (Char Creation)
Character Export (no deps) ─→ can ship independently at any time
```

### Release Targets

| Version | Phase | Target | Status |
|---------|-------|--------|--------|
| v0.3.1 | Phase 0: Foundation Cleanup | Foundation utilities, dice extraction, conditions data | ✅ Done |
| v0.3.2 | UI Overhaul & API Cleanup | Class theming, Dashboard rewrite, centralized AI helpers, error handling | ✅ Done |
| v0.4.0 | Phase 1-2: Campaign Foundation + Party UI | Firestore campaigns, party roster, DM overview, DM/Player roles, character assignment, join/invite flow | 🟨 In Progress |
| v0.4.x | Character Export (independent) | Native JSON export/import, PDF sheet, FoundryVTT/D&D Beyond format adapters | ⬜ Not Started |
| v0.5.0 | Phase 3-4: Combat + DM Journal + NPCs | Initiative tracker, encounter builder, AI encounter drafting, DM campaign journal, NPC registry with AI generation, quest & faction tracking | ⬜ Not Started |
| v0.5.5 | Phase 4b: Custom Items & Loot | DM item builder, SRD magic item catalog, loot award sessions, homebrew items | ⬜ Not Started |
| v0.6.0 | Phase 5-6: AI Co-Pilot + Communication | Context-aware DM assistant with journal/NPC context injection, whispers, roll requests, shared handouts | ⬜ Not Started |
| v0.7.0 | Phase 7: Higher-Level Characters | Create characters at levels 1-20, multiclass support | ⬜ Not Started |

---

## ✅ v0.3.1 — Foundation Cleanup (Phase 0) — COMPLETE

> _Extract shared utilities, add reference data, unblock all multiplayer/DM features._

### 🔴 Critical

- [x] **Extract dice rolling to `lib/dice.ts`** — Pull inline dice logic from Dashboard (`handleRoll`) and RestModal (`handleSpendHitDie`) into a shared module: `parseDiceExpression()`, `rollDice()`, `rollBatch()`
- [x] **Refactor Dashboard to use `lib/dice.ts`** — Replace inline dice parsing with imported functions
- [x] **Refactor RestModal to use `lib/dice.ts`** — Replace inline hit die rolling with imported functions

### 🟠 High

- [x] **Add `CONDITIONS` reference map to constants** — All 15 D&D 5e conditions (Blinded, Charmed, Deafened, etc.) with mechanical effects as structured data
- [x] **Add encounter difficulty thresholds to constants** — DMG XP budget tables (Easy/Medium/Hard/Deadly per level 1-20) + encounter multiplier table
- [x] **Expand `types.ts` with multiplayer data models** — `CampaignMember`, `CombatEncounter`, `Combatant`, `CombatLogEntry`, `DMNote`, `EncounterTemplate`, `Whisper`, `RollRequest`, `CampaignInvite`
- [ ] **Backend API proxy** — Move Gemini API key to a server-side proxy so it's not embedded in the client bundle

### 🟡 Medium

- [ ] **Add SRD monster data** — `lib/monsters.ts` with ~300 SRD creatures (name, CR, HP, AC, initiative modifier, attacks)

---

## 📦 v0.4.0 — Campaign Foundation & Party System (Phases 1-2)

> _Migrate campaigns to Firestore. Build party roster, DM overview, and invite system._

### 🔴 Critical

- [x] **Firestore campaign subcollection structure** — `campaigns/{id}/members`, `/encounters`, `/notes`, `/templates`, `/whispers`, `/rollRequests`; top-level `invites`
- [x] **Create `lib/campaigns.ts` service layer** — `createCampaign`, `subscribeToCampaign`, `subscribeToMembers`, `leaveCampaign`, `archiveCampaign`
- [x] **Update Firestore security rules** — Campaign member reads, DM-only writes, encounter/note/whisper access, invite rules
- [x] **Create `CampaignContext` provider** — `useCampaign()` hook with `activeCampaign`, `myCampaigns`, `members`, `myRole`, `pendingInvites`
- [ ] **Wire `CampaignProvider` into `App.tsx`** — Remove localStorage campaign state, wrap app tree with CampaignProvider, strip campaign props
- [ ] **Rewrite `CampaignManager` component** — Replace localStorage with `useCampaign()`, real join flow with `joinCode` Firestore lookup

### 🟠 High

- [ ] **DM/Player role selection at campaign creation** — Users choose to create a campaign as DM or join as a Player; role selector in creation UI, players joining via invite code default to player role
- [ ] **Character-to-campaign assignment** — Players can assign any of their characters to campaigns they've created or joined; dropdown picker stored as `CampaignMember.characterId`
- [ ] **Build `PartyRoster` component** — Grid of party member cards (portrait, name, class, level, HP, AC), read-only character overlay
- [ ] **Build `DMPartyOverview` component** — Live vitals grid, passive scores panel, party inventory summary
- [ ] **Build `DMDashboard` layout** — DM-specific layout replacing player Dashboard when `myRole === 'dm'`
- [ ] **Invite management** — Join code sharing + direct email invites, pending invites banner, accept/decline flow
- [ ] **Migrate localStorage campaigns to Firestore** — Migration function following `migrateLocalCharacters` pattern

### 🟡 Medium

- [ ] **Cloud Functions layer** — `joinByCode`, `fetchPartyCharacters`, `sendInvite`, `acceptInvite`, `geminiProxy`
- [ ] **Add "Party" card to player Dashboard** — Party card in `CardStack` grid when character is in a campaign
- [ ] **Character diff badges** — Notification dot on party member cards when they've leveled up or changed equipment

---

## 📦 v0.5.0 — Combat System & DM Campaign Tools (Phases 3-4)

> _Real-time initiative tracker, encounter builder, DM notes, NPC registry, quest tracker._

### 🟠 High — Combat & Initiative

- [ ] **Create `lib/combat.ts` service layer** — `createEncounter`, `startEncounter`, `nextTurn`, `prevTurn`, `updateCombatant`, `endEncounter`, `subscribeToEncounter` (all Firestore transaction-based)
- [ ] **Build `InitiativeTracker` component** — Sorted combatant list, current turn highlight, DM controls (next/damage/heal/conditions), player read-only view, monster HP descriptors (Uninjured/Wounded/Bloodied/Near Death), combat log
- [ ] **DM combat initiative, turns, status effects & NPC tracking** — Full turn-order management with all 15 5e conditions, add/remove NPC combatants mid-encounter, track NPC HP/AC/conditions, reference NPC stat blocks from NPC Registry
- [ ] **AI encounter drafting from brief description** — DM provides area description + enemy types → Gemini generates structured `EncounterTemplate` with combatants, initiative, difficulty rating; auto-injects party level/size as context
- [ ] **Build `EncounterBuilder` component** — Monster picker from SRD data, NPC picker from NPC Registry, party auto-population, DMG difficulty meter, save/load encounter templates
- [ ] **Batch initiative rolling** — DM clicks "Roll All" to auto-roll initiative for NPCs/monsters via `rollBatch()`

### 🟠 High — DM Campaign Journal, NPC Management & Factions

- [ ] **Create `lib/notes.ts` service layer** — CRUD for `DMNote` docs, real-time subs with type/tag/session filtering
- [ ] **Create `lib/npcs.ts` service layer** — CRUD for `NPC` docs in `campaigns/{id}/npcs` subcollection, real-time subscriptions
- [ ] **Add `NPC` interface to `types.ts`** — First-class NPC type: name, race, class, stat block (abilities, HP, AC, attacks), backstory, disposition, faction, location, portrait, relationships to PCs
- [ ] **Expand `DMNoteType` enum** — Add `'faction'`, `'plot_hook'`, `'story_arc'` to existing types for full campaign journal coverage
- [ ] **Build `DMNotesPanel` / Campaign Journal** — Tabbed views (Session/Event/NPC/Location/Lore/Quest/Faction/Plot Hook/Story Arc), Markdown editor, tag system, linked entities, session grouping, quick-capture button
- [ ] **Build `NPCRegistry` component** — NPC cards with name/role/stat block/location/disposition/faction, AI dialogue generator, portrait generation, link to combat encounters
- [ ] **AI NPC drafting with context** — DM provides brief NPC concept → Gemini generates stat block, backstory, motivations, connections; pulls context from party journal entries + DM campaign notes for contextually-aware NPCs
- [ ] **Build `QuestTracker` component** — Quest list with status (Active/Completed/Failed/Hidden), objectives, rewards
- [ ] **Build `FactionManager` component** — Faction cards with name, goals, members (linked NPCs), disposition toward party, territory/locations, political relationships
- [ ] **Bidirectional entity linking** — NPC notes link to factions, factions link to locations, quests link to NPCs — navigable wiki-style browsing

### 🟡 Medium

- [ ] **Lair action & legendary action support** — Fixed initiative-20 event entries, legendary action counter per creature
- [ ] **Turn timer** — Configurable countdown (30s/60s/90s) with visual + audio alert
- [ ] **Quick-capture notes during combat** — Floating button creates timestamped note tagged with current encounter
- [ ] **AI session summarization** — "Summarize Session" sends notes to Gemini for narrative recap
- [ ] **AI cross-reference note suggestions** — Auto-suggest links to existing NPCs/locations/factions when saving notes

### 🟢 Low

- [ ] **Keyboard shortcuts for combat** — Space=next turn, N=add combatant, D=damage, H=heal, Esc=close
- [ ] **Audio/visual combat feedback** — Nat 20/1 animations, combat transition effects

---

## 📦 v0.6.0 — AI DM Co-Pilot & Multiplayer Communication (Phases 5-6)

> _Context-aware AI assistant for DMs. DM-to-player messaging, group rolls, shared handouts._

### 🟠 High

- [ ] **Build `DMAssistant` component** — Context-injected AI chat; injects party composition, encounter state, session notes, active quests, NPC registry, faction data into system prompt
- [ ] **Suggested prompt quick-actions** — "Suggest a plot twist", "What would [NPC] do?", "Describe this environment", "Generate random encounter", "Draft an NPC", "Create a magic item", "Recap last session"
- [ ] **Structured output mode** — JSON schema output for encounters/NPCs/loot tables/custom items, directly importable into encounter builder, NPC registry, and item vault
- [ ] **AI NPC generation using journal & note context** — Gemini ingests DM notes (lore, quests, factions) + party member journal entries to generate contextually-aware NPCs with stat blocks and backstories
- [ ] **Context window management** — Summarize older notes rather than including verbatim, allow DM to select which notes/journals to include, handle 50K+ token campaigns gracefully
- [ ] **Enhance player `AskDMModal`** — Inject character data into system prompt for context-aware rules answers

### 🟡 Medium

- [ ] **Whisper system** — DM sends private messages to individual players, notification badges, read tracking
- [ ] **Roll request system** — DM initiates group rolls ("Everyone make a Wisdom save"), players get pre-configured prompts, results stream back live
- [ ] **Shared handouts** — DM pushes read-only content (descriptions, lore, images) to players
- [ ] **AI conversation persistence** — Save DM-AI chat history to Firestore, tagged by session

---

## 📦 v0.5.5 — Custom Items & Loot System (Phase 4b)

> _DM item creation tools, SRD magic item catalog, and loot award flow to players. **Depends on v0.4.0 (campaign context) and v0.6.0 (DM-to-player comms for loot push).**_

### 🟠 High

- [ ] **Add `CustomItem` interface to `types.ts`** — Extends `Item` with: rarity (Common→Artifact), attunement, stat block (bonus to hit, bonus damage, spell charges, special abilities), lore text, homebrew flag
- [ ] **Create `lib/items.ts` service layer** — CRUD for custom items in `campaigns/{id}/items` subcollection, real-time subscriptions
- [ ] **DM custom item creation** — Item builder form: name, type (weapon/armor/wondrous/potion/scroll/artifact), rarity, attunement, description, mechanical effects, lore text
- [ ] **Build `ItemBuilder` component** — Form-based + AI-assisted item creation; covers weapons, armor, wondrous items, potions, scrolls, artifacts
- [ ] **AI Item Generator** — Gemini-powered: DM provides brief concept → generates full item with stats, lore, and balanced mechanics
- [ ] **DM awards homebrew AND standard 5e magic items** — Item picker combining custom items + SRD magic item catalog, assign to specific party member(s)
- [ ] **Build `LootSession` component** — DM selects items → assigns to party members → players receive notification with item details auto-added to inventory

### 🟡 Medium

- [ ] **Add SRD magic item catalog to constants** — ~200 SRD magic items with name, rarity, type, attunement, description, mechanical effects
- [ ] **Build `DM Item Vault` component** — DM's personal library of created/saved items, searchable by name/type/rarity, reusable across campaigns
- [ ] **Extend `Item` type for magic item display** — Inventory detail view shows rarity color coding, attunement status, charge tracking, full item card
- [ ] **Player loot notification** — Push notification with item card; item auto-added to character inventory with full stat block and description

---

## 📦 v0.4.x — Character Export & Interoperability (Independent)

> _Allow players to export their characters for use with other D&D platforms. No dependencies — can ship anytime._

### 🟠 High

- [ ] **Native JSON export/import** — Download `CharacterData` as `.json`, import from file on character selection screen
- [ ] **PDF character sheet export** — Generate filled standard 5e character sheet PDF using `jspdf` or PDF template filling

### 🟡 Medium

- [ ] **FoundryVTT export** — Transform `CharacterData` to FoundryVTT actor JSON schema
- [ ] **D&D Beyond format export** — Transform `CharacterData` to D&D Beyond-compatible JSON
- [ ] **Export UI** — "Export Character" button on character selection & settings with format picker (JSON / PDF / FoundryVTT / D&D Beyond)

---

## 📦 v0.7.0 — Higher-Level Character Creation (Phase 7)

### 🟠 High

- [ ] **Level selection in Character Creation Wizard** — Choose starting level 1–20 in step 1
- [ ] **Cumulative HP calculation** — Sum of hit dice averages + CON modifier per level
- [ ] **ASI / Feat application per level** — Class-specific ASI levels (4,8,12,16,19 + Fighter/Rogue extras)
- [ ] **Subclass selection at appropriate level** — Level 1–3 depending on class
- [ ] **Spell slots & spells known by level** — Use existing `CLASS_FEATURES` and progression tables in constants.tsx
- [ ] **Class features accumulated through levels** — Compact multi-level choice UI (not 20 separate wizards)

### 🟡 Medium

- [ ] **Level-appropriate starting equipment & gold** — Scaled gold and gear for higher levels
- [ ] **"Recommended Build" quick button** — AI-suggested standard/popular choices for fast generation
- [ ] **Use deterministic logic from constants.tsx** — Drive core math from PHB tables; AI supplements with suggestions only
- [ ] **Multiclass support** — Allow characters to take levels in multiple classes, split hit dice, merge spell slots

---

## 🗺️ Long-term (v0.8.0+)

### 🟡 Medium

- [ ] **Death saves tracker** — Track successes/failures with auto-reset on stabilize or heal
- [ ] **Concentration tracker** — Flag active concentration spell, auto-prompt CON save on damage
- [ ] **Spell slot recovery UI** — Arcane Recovery (Wizard), Font of Magic (Sorcerer), Pact Magic short rest
- [ ] **Dark/light theme toggle** — Currently dark-only; add a light theme option
- [ ] **Offline-first DM notes** — Dual-mode persistence (Firestore + localStorage) for DM notes with sync

### 🟢 Low

- [ ] **PWA support** — Service worker + manifest for installable mobile app with offline support
- [ ] **Dice roll history panel** — Last 50 rolls per session, persistent log
- [ ] **Character comparison** — Side-by-side stat comparison between characters
- [ ] **Sound effects** — Optional dice roll sounds, level-up fanfare
- [ ] **i18n / localization** — Support for languages beyond English
- [ ] **Print-friendly character sheet** — CSS print stylesheet for paper export
- [ ] **Quick-reference rules card** — Common actions, conditions, and rules lookup
- [ ] **Map / location tracker** — Simple location graph or scene manager

---

## 🔵 Community Requests

> Add community-requested features here. Include the GitHub issue # if applicable.

- [ ] **Create characters at any level (1–20)** — Users have asked to skip starting at level 1 for experienced campaigns. Tracked in v0.7.0.
- [ ] _[Open an issue](https://github.com/Hams-Ollo/The-Players-Companion/issues) to suggest a feature!_

---

## ✅ Completed

> Move items here as they're finished. Include the version/date.

- [x] **Foundation Cleanup (Phase 0)** — Extracted dice rolling to `lib/dice.ts` (`parseDiceExpression`, `rollDice`, `rollBatch`), refactored Dashboard + RestModal to use shared module, added 15 CONDITIONS to constants, added encounter difficulty thresholds (DMG XP budgets) _(v0.3.1 — 2026-02-11)_
- [x] **Firestore Campaign Foundation** — Expanded `types.ts` with all campaign/combat/notes types, built `lib/campaigns.ts` (25+ Firestore functions), `CampaignContext` provider with real-time subscriptions, Firestore security rules for all campaign collections, 9 composite indexes _(v0.3.1 — 2026-02-11)_
- [x] **Character UI Overhaul** — Dynamic class theming (color borders, gradients, glow), `AbilityScoreBar` component, `CombatStrip` (AC/initiative/speed), `QuickActionBar`, Dashboard rewrite with class-themed header and portrait _(v0.3.2 — 2026-02-12)_
- [x] **Centralized AI helpers** — Added `generatePortrait()` to `lib/gemini.ts`, refactored QuickRollModal, CharacterCreationWizard, and PortraitGenerator to use shared helpers instead of direct `GoogleGenAI` SDK calls _(v0.3.2 — 2026-02-12)_
- [x] **Error handling improvements** — Refactored `parseApiError()` to use numeric status codes instead of string matching, fixed false 405 detection _(v0.3.2 — 2026-02-12)_
- [x] **Bug fixes** — CardStack/DetailOverlay class-themed colors, VitalsDetail inline HP editing, Sneak Attack dice scaling (`getSneakAttackDice`), AC calculation for armor types, attack type comma formatting _(v0.3.2 — 2026-02-12)_
- [x] **Gemini 3 API compatibility** — Added `thinkingConfig: { thinkingLevel: 'LOW' }` to all Gemini calls, removed incompatible `temperature: 0.8`, added `parseApiError()` helper for user-friendly error messages _(v0.3.1 — 2026-02-13)_
- [x] **Full PHB marketplace overhaul** — Expanded shop from 6 items to 160+ (37 weapons, 14 armor, 100+ gear, 9 consumables), added search bar, `formatCost()` for gp/sp/cp display, `useMemo` filtering _(v0.3.1 — 2026-02-13)_
- [x] **Cloud Run deployment infrastructure** — Dockerfile (multi-stage), nginx.conf, .dockerignore, env var handling, deployment guide _(v0.2.3 — 2026-02-11)_
- [x] **CI/CD pipeline** — Cloud Build trigger on `main` branch, inline YAML with build-arg substitution, auto-deploy to Cloud Run _(v0.2.3 — 2026-02-11)_
- [x] **Firestore character persistence** — `lib/firestore.ts` service + `CharacterContext` provider, dual-mode (Firestore for Google users, localStorage for guests), debounced writes, migration banner, security rules + composite index _(v0.3.0 — 2026-02-11)_
- [x] **Firebase auth fixes** — Anonymous auth fallback to local guest session, Firebase authorized domains config _(v0.2.3 — 2026-02-11)_
- [x] **Wizard Spellbook Support** — Added Wizards to known-spell tables and improved AI forge parsing to prevent missing Grimoire data _(v0.2.2 — 2026-02-12)_
- [x] **Card Name Revert** — Reverted "Pouch" back to "Inventory" and "Legacy" to "Journal" for better intuitive navigation _(v0.2.2 — 2026-02-12)_
- [x] **Advanced Dice Roller** — Support for complex expressions (e.g., `2d6+1d4+2`) and Advantage/Disadvantage logic for d20 rolls with detailed UI _(v0.2.1 — 2026-02-12)_
- [x] **Error boundaries** — React error boundaries on all detail views and AI-powered modals _(v0.2.0 — 2026-02-11)_
- [x] **SettingsModal stat cascade** — Stat edits now recalculate AC, initiative, skills, saves, attacks _(v0.2.0 — 2026-02-11)_
- [x] **Tailwind build pipeline** — Replaced CDN with `@tailwindcss/vite` plugin, tree-shaken CSS _(v0.2.0 — 2026-02-11)_
- [x] **Data-driven spell selection** — Replaced AI-suggestion spell picker with PHB cantrip/spell lists _(v0.1.1 — 2026-02-11)_
- [x] **Spell slot progression tables** — Full/half/pact caster slots from PHB _(v0.1.1 — 2026-02-11)_
- [x] **Accessibility fixes** — `aria-label` on icon buttons, `htmlFor`/`id` on all form controls _(v0.1.1 — 2026-02-11)_
- [x] **Project documentation** — README, Architecture, API, Contributing docs _(v0.1.1 — 2026-02-11)_
- [x] **Starter equipment shop** — Roll starting gold, buy gear after character creation _(v0.1.0 — 2026-02-10)_
- [x] **Racial traits data** — Full PHB racial traits, languages, darkvision, racial spells _(v0.1.0 — 2026-02-10)_
- [x] **Class feature progression** — All 12 classes, levels 1–20 _(v0.1.0 — 2026-02-10)_
- [x] **Firebase authentication** — Google sign-in + anonymous guest mode _(v0.1.0 — 2026-02-10)_
- [x] **Gemini AI integration** — Portrait generation, DM chat, level-up assist, item lookup _(v0.1.0 — 2026-02-10)_
- [x] **Campaign manager** — Create/join with shareable codes _(v0.1.0 — 2026-02-10)_

---

## 💡 How to Propose a Feature

1. Check this list and [GitHub Issues](https://github.com/Hams-Ollo/The-Players-Companion/issues) for duplicates
2. Open a new issue with the `enhancement` label
3. Describe the **user story** ("As a player, I want to...")
4. Include any relevant PHB/SRD page references
5. The maintainers will triage and add it to this roadmap
