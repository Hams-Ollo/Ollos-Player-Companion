# 📊 Project Tracker

> Development tracking for The Player's Companion — organized by epics, features, user stories, and tasks.
>
> **Last updated:** 2026-02-13

---

## 🏷️ Status Legend

| Status | Icon | Meaning |
|--------|------|---------|
| Not Started | ⬜ | Planned but no work begun |
| In Progress | 🟨 | Actively being worked on |
| In Review | 🟦 | Complete, awaiting review/testing |
| Done | ✅ | Merged and shipped |
| Blocked | 🟥 | Waiting on dependency or decision |

---

## 📌 Epic 1: Core Character Management

> _Build a complete D&D 5e character sheet with creation, editing, and persistence._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Character Creation Wizard (6-step) | @Hams-Ollo | Identity, stats, skills, spells, concept, review |
| ✅ | Task | Standard Array stat assignment | @Hams-Ollo | |
| ✅ | Task | Point Buy stat assignment | @Hams-Ollo | |
| ✅ | Task | Manual stat entry | @Hams-Ollo | |
| ✅ | Feature | Data-driven spell selection | @Hams-Ollo | PHB cantrip + 1st-level lists per class |
| ✅ | Task | Wizard Spellbook Support | @Hams-Ollo | Wizards correctly start with 6 spells at Lvl 1 |
| ✅ | Feature | Racial traits & bonuses | @Hams-Ollo | All PHB races + subraces |
| ✅ | Feature | Class feature progression | @Hams-Ollo | 12 classes, levels 1–20 |
| ✅ | Feature | Spell slot progression tables | @Hams-Ollo | Full/half/pact caster |
| ✅ | Feature | Starter equipment shop | @Hams-Ollo | Roll gold, buy gear post-creation |
| ✅ | Feature | Full PHB marketplace catalog | @Hams-Ollo | 160+ items: all PHB Ch.5 weapons, armor, gear, consumables |
| ✅ | Feature | Character selection & deletion | @Hams-Ollo | |
| ✅ | Task | localStorage persistence | @Hams-Ollo | `vesper_chars` key (guest fallback) |
| ⬜ | User Story | As a player, I want to export/import my character as JSON | — | Download `.json`, import from file |
| ✅ | User Story | As a player, I want my characters synced to the cloud | @Hams-Ollo | See Epic 6 — completed |
| ⬜ | Feature | Multiclass support | — | Split hit dice, merge spell slots |
| ⬜ | Feature | Subclass selection UI | — | Choose at appropriate level |
| ⬜ | Feature | Create character at any level (1–20) | — | See Epic 9: Higher-Level Character Creation |

---

## 📌 Epic 2: Dashboard & Gameplay

> _Interactive dashboard for running a character during play sessions._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Card-stack dashboard UI | @Hams-Ollo | Swipeable cards for each stat category |
| ✅ | Feature | Detail overlay views (7) | @Hams-Ollo | Vitals, Combat, Skills, Features, Spells, Inventory, Journal |
| ✅ | Feature | Dice roller | @Hams-Ollo | Advanced parser: Adv/Dis, complex expressions (2d6+4), crit/fail |
| ✅ | Feature | Rest system (short + long) | @Hams-Ollo | Hit dice recovery |
| ✅ | Feature | In-game equipment shop | @Hams-Ollo | Buy/sell from inventory; search bar, category filter, gp/sp/cp formatting |
| ✅ | Feature | Settings modal (stat editor) | @Hams-Ollo | Manual stat overrides |
| ✅ | User Story | As a player, I want stat edits to auto-update derived values | @Hams-Ollo | AC, initiative, skills, saves cascade via recalculateCharacterStats |
| ⬜ | User Story | As a player, I want to track active conditions | — | Poisoned, Stunned, etc. with effects |
| ⬜ | Feature | Death saves tracker | — | 3 successes / 3 failures |
| ⬜ | Feature | Concentration tracker | — | Flag active spell, prompt CON save |
| ⬜ | Feature | Spellbook management | — | Prepare/swap spells on long rest |
| ⬜ | Feature | Spell slot recovery UI | — | Arcane Recovery, Font of Magic, Pact Magic |
| ⬜ | Feature | Dice roll history log | — | Persistent session log |

---

## 📌 Epic 3: AI Integration

> _Leverage Google Gemini for intelligent assistance grounded in D&D rules._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | AI portrait generation | @Hams-Ollo | `gemini-2.5-flash-image` |
| ✅ | Feature | Ask the DM (multi-turn chat) | @Hams-Ollo | Grounded in uploaded PDFs |
| ✅ | Feature | AI-assisted level up | @Hams-Ollo | HP roll, ASI, new features |
| ✅ | Feature | Item/feature detail lookup | @Hams-Ollo | AI-powered rules text |
| ✅ | Feature | Journal AI chronicles | @Hams-Ollo | Session summary generation |
| ✅ | Task | Centralized Gemini client | @Hams-Ollo | `lib/gemini.ts` shared module |
| ✅ | Task | Rate limiting (2s throttle) | @Hams-Ollo | Closure-based, tamper-resistant |
| ✅ | Task | Gemini 3 API compatibility | @Hams-Ollo | `thinkingConfig: LOW`, removed incompatible temperature, `parseApiError()` helper |
| ✅ | Feature | Quick Roll AI character gen | @Hams-Ollo | One-click AI character creation via `gemini-2.5-flash` with structured output |
| ✅ | Feature | Voice-to-text transcription | @Hams-Ollo | `TranscriptionButton` component |
| 🟥 | User Story | As a developer, I want the API key not exposed in the bundle | — | Blocked: needs backend proxy |
| ⬜ | Feature | Backend API proxy | — | Server-side Gemini key management |

---

## 📌 Epic 4: Authentication & Multiplayer

> _Firebase auth and campaign-based multiplayer features._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Firebase Google sign-in | @Hams-Ollo | Modular Firebase API |
| ✅ | Feature | Anonymous guest mode | @Hams-Ollo | Fallback to local session |
| ✅ | Feature | Campaign manager | @Hams-Ollo | Create/join with shareable codes |
| ⬜ | User Story | As a DM, I want to see all players in my campaign | — | See Epic 7: Party System |
| ✅ | Feature | Firestore character sync | @Hams-Ollo | See Epic 6 — completed |
| ⬜ | Feature | Real-time campaign updates | — | Campaigns still localStorage, planned for Party System |

---

## 📌 Epic 5: Deployment & Infrastructure

> _Production deployment pipeline, containerization, and cloud hosting._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Task | Dockerfile (multi-stage build) | @Hams-Ollo | node:20-alpine build → nginx:stable-alpine serve |
| ✅ | Task | nginx.conf for SPA serving | @Hams-Ollo | Port 8080, SPA routing, gzip, caching, security headers |
| ✅ | Task | .dockerignore | @Hams-Ollo | Exclude node_modules, .env, .git, docs |
| ✅ | Task | vite.config.ts env var handling | @Hams-Ollo | `getVar()` helper for Docker/Cloud Run build-time env injection |
| ✅ | Task | Remove legacy import map from index.html | @Hams-Ollo | Leftover from pre-Vite CDN setup |
| ✅ | Task | Cloud Run deployment guide | @Hams-Ollo | `docs/CLOUD_RUN_DEPLOY.md` |
| ✅ | Task | Firebase authorized domains config | @Hams-Ollo | Cloud Run `.run.app` domain added |
| ✅ | Task | CI/CD pipeline (Cloud Build) | @Hams-Ollo | Trigger on `main`, inline YAML, auto-deploy to Cloud Run |
| ⬜ | Task | Backend API proxy for Gemini key | — | Server-side key management, unblocks Epic 3 security |
| ✅ | User Story | As a developer, I want CI/CD pipeline | @Hams-Ollo | Cloud Build trigger → Cloud Run auto-deploy |

---

## 📌 Epic 5b: Developer Experience & Quality

> _Code quality, build pipeline, testing, and documentation._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Task | Project documentation suite | @Hams-Ollo | README, Architecture, API, Contributing |
| ✅ | Task | `.env.example` template | @Hams-Ollo | |
| ✅ | Task | Mermaid architecture diagrams | @Hams-Ollo | |
| ✅ | Task | Accessibility fixes (a11y) | @Hams-Ollo | aria-labels, htmlFor/id on forms |
| ✅ | Task | Dead code cleanup | @Hams-Ollo | Removed unused imports, interfaces |
| ✅ | Task | Tailwind build pipeline | @Hams-Ollo | Replaced CDN with `@tailwindcss/vite` plugin |
| ✅ | Task | Error boundaries | @Hams-Ollo | ErrorBoundary component on all detail views + AI modals |
| ⬜ | Task | `tsconfig` strict mode | — | Enable strict TypeScript checking |
| ⬜ | Task | Unit tests (Vitest) | — | Core utils, constants helpers |
| ⬜ | Task | E2E tests (Playwright) | — | Character creation flow |
| ⬜ | Feature | PWA support | — | Service worker, manifest |
| ⬜ | Feature | Dark/light theme toggle | — | Currently dark-only |

---

## 📌 Epic 6: Cloud Persistence (Phase 1)

> _Migrate from localStorage to Firestore so characters sync across devices and enable multiplayer. **This is the prerequisite for all multiplayer features.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Task | Enable Firestore in Firebase project | @Hams-Ollo | Firebase Console → Build → Firestore, us-west1 |
| ✅ | Task | Design Firestore data schema | @Hams-Ollo | Collection: `characters` (top-level), `ownerUid` field, `createdAt`/`updatedAt` timestamps |
| ✅ | Task | Firestore security rules | @Hams-Ollo | `firestore.rules` — users read/write own chars only, ownerUid immutable |
| ✅ | Feature | Migrate character persistence to Firestore | @Hams-Ollo | `lib/firestore.ts` + `contexts/CharacterContext.tsx`, debounced writes (500ms) |
| ⬜ | Feature | Migrate campaign persistence to Firestore | — | Campaigns still in localStorage, planned for Party System epic |
| ✅ | Task | localStorage offline/guest fallback | @Hams-Ollo | Guest users use localStorage; cloud users fall back on Firestore error |
| ✅ | Feature | Real-time Firestore listeners (`onSnapshot`) | @Hams-Ollo | CharacterContext subscribes on auth, auto-updates across tabs/devices |
| ✅ | Task | Data migration helper | @Hams-Ollo | Migration banner on first sign-in: "Import All" batch-writes local chars to Firestore |
| ✅ | Task | Per-user data partitioning | @Hams-Ollo | `ownerUid` field + composite index (`ownerUid` ASC + `updatedAt` DESC) |

---

## 📌 Epic 7: Foundation Cleanup (Phase 0)

> _Extract shared utilities and add reference data to unblock all multiplayer and DM features._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| 🟨 | Task | Extract dice rolling to `lib/dice.ts` | @Hams-Ollo | `parseDiceExpression`, `rollDice`, `rollBatch` — pulled from Dashboard/RestModal inline code |
| 🟨 | Task | Add `CONDITIONS` reference map to constants | @Hams-Ollo | All 15 D&D 5e conditions with mechanical effects as structured data |
| 🟨 | Task | Add encounter difficulty thresholds to constants | @Hams-Ollo | DMG XP budget tables: Easy/Medium/Hard/Deadly per player level 1-20 + encounter multipliers |
| ⬜ | Task | Add SRD monster data (`lib/monsters.ts`) | — | ~300 SRD creatures: name, CR, HP, AC, initiative modifier, attacks, abilities |
| 🟨 | Task | Refactor Dashboard to use `lib/dice.ts` | @Hams-Ollo | Replace inline `handleRoll` dice logic with shared module |
| 🟨 | Task | Refactor RestModal to use `lib/dice.ts` | @Hams-Ollo | Replace inline `handleSpendHitDie` dice logic with shared module |

---

## 📌 Epic 8: Firestore Campaign Foundation (Phase 1)

> _Migrate campaigns from localStorage to Firestore. Add all new data models, security rules, Cloud Functions proxy, and campaign service layer. **Prerequisite for all multiplayer features.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| 🟨 | Task | Expand data models in `types.ts` | @Hams-Ollo | `CampaignMember`, `CombatEncounter`, `Combatant`, `CombatLogEntry`, `DMNote`, `EncounterTemplate`, `Whisper`, `RollRequest`, `CampaignInvite` |
| 🟨 | Task | Design Firestore subcollection structure | @Hams-Ollo | `campaigns/{id}/members`, `/encounters`, `/notes`, `/templates`, `/whispers`, `/rollRequests`; top-level `invites` |
| 🟨 | Task | Create `lib/campaigns.ts` service layer | @Hams-Ollo | `createCampaign`, `subscribeToCampaign`, `subscribeToMembers`, `subscribeToMyInvites`, `leaveCampaign`, `archiveCampaign` |
| 🟨 | Task | Update Firestore security rules | @Hams-Ollo | Campaign member reads, DM-only writes, encounter/note/whisper access, invite rules |
| 🟨 | Task | Add Firestore composite indexes | @Hams-Ollo | `campaigns.joinCode`, `invites.email+status`, `encounters.active+createdAt`, `notes.type+createdAt` |
| ⬜ | Task | Create Cloud Functions layer (`functions/`) | — | `joinByCode`, `fetchPartyCharacters`, `sendInvite`, `acceptInvite`, `geminiProxy` |
| ⬜ | Task | Migrate localStorage campaigns to Firestore | — | Migration function following `migrateLocalCharacters` pattern |

---

## 📌 Epic 9: Campaign Context & Party UI (Phase 2)

> _Build the `CampaignContext`, rewrite `CampaignManager`, and create party roster and DM overview views. **Depends on Epic 8.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| 🟨 | Task | Create `CampaignContext` provider | @Hams-Ollo | `useCampaign()` hook: `activeCampaign`, `myCampaigns`, `members`, `partyCharacters`, `myRole`, `pendingInvites` |
| ⬜ | Feature | Rewrite `CampaignManager` component | — | Replace localStorage with `useCampaign()`, campaign creation, join flow, list with role badges |
| ⬜ | Feature | Build `PartyRoster` component | — | Grid of party member cards, read-only character overlay, character diff badges |
| ⬜ | Feature | Build `DMPartyOverview` component | — | Live vitals grid, passive scores panel, party inventory summary |
| ⬜ | Feature | Build `DMDashboard` layout | — | DM-specific layout replacing player Dashboard when `myRole === 'dm'` |
| ⬜ | Task | Add "Party" card to player Dashboard | — | Party card in `CardStack` grid when character is in a campaign |
| ⬜ | Task | Update `CharacterSelection` with campaign badges | — | Show campaign assignment, pending invites banner |

---

## 📌 Epic 10: Real-Time Combat & Initiative Tracker (Phase 3)

> _Collaborative combat system with real-time initiative tracking, encounter builder, and AI encounter generation. **Depends on Epic 9.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Task | Create `lib/combat.ts` service layer | — | `createEncounter`, `startEncounter`, `nextTurn`, `prevTurn`, `updateCombatant`, `endEncounter`, `subscribeToEncounter` |
| ⬜ | Feature | Build `InitiativeTracker` component | — | Sorted combatant list, current turn highlight, DM controls (next/damage/heal/conditions), player read-only view, monster HP descriptors, lair/legendary action support, turn timer, combat log |
| ⬜ | Feature | Build `EncounterBuilder` component | — | Monster picker (SRD data), party auto-population, difficulty meter (DMG XP budgets), save/load templates |
| ⬜ | Feature | AI Encounter Generator integration | — | Gemini-powered: party level/size + difficulty + theme → structured encounter JSON |
| ⬜ | Feature | Keyboard shortcuts for combat | — | Space=next turn, N=add combatant, D=damage, H=heal, Esc=close |
| ⬜ | Feature | Audio/visual combat feedback | — | Nat 20/1 animations, combat start/end transitions |

---

## 📌 Epic 11: DM Notes & Campaign Management (Phase 4)

> _DM-only notes system with session grouping, NPC registry, quest tracker, and AI-powered summarization. **Depends on Epic 9.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Task | Create `lib/notes.ts` service layer | — | CRUD for `DMNote` docs, real-time subscriptions with type/tag/session filtering |
| ⬜ | Feature | Build `DMNotesPanel` component | — | Tabbed views (Session/Event/NPC/Location/Lore/Quest), Markdown editor, tag system, linked entities, session grouping, quick-capture button |
| ⬜ | Feature | AI session summarization | — | "Summarize Session" button → Gemini narrative recap |
| ⬜ | Feature | Build `NPCRegistry` component | — | NPC cards with name/role/location/disposition, AI dialogue generator, portrait generation |
| ⬜ | Feature | Build `QuestTracker` component | — | Quest list with status (Active/Completed/Failed/Hidden), objectives, rewards, linked NPCs/locations |
| ⬜ | Feature | AI cross-reference suggestions | — | Auto-suggest links to existing NPCs/locations when saving notes |

---

## 📌 Epic 12: AI DM Co-Pilot (Phase 5)

> _Context-aware AI assistant for DMs with full campaign state injection and structured output. **Depends on Epics 9-11.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Build `DMAssistant` component | — | Context-injected AI chat with party/encounter/notes state in system prompt |
| ⬜ | Feature | Suggested prompt quick-actions | — | "Suggest a plot twist", "What would [NPC] do?", "Describe this environment", "Generate random encounter" |
| ⬜ | Feature | Structured output mode | — | JSON schema output for encounters, NPCs, loot tables — directly importable |
| ⬜ | Feature | Conversation persistence | — | Save DM-AI chats to Firestore, tagged by session |
| ⬜ | Task | Enhance player `AskDMModal` | — | Inject character data into system prompt for context-aware rules answers |
| ⬜ | task | Route AI through Cloud Function proxy | — | `geminiProxy` for server-side API key management |

---

## 📌 Epic 13: Multiplayer Communication (Phase 6)

> _DM-to-player messaging, roll requests, and shared handouts. **Depends on Epic 9.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Whisper system | — | DM sends private messages to individual players, notification badges, read tracking |
| ⬜ | Feature | Roll request system | — | DM initiates group rolls ("Wisdom save"), players receive pre-configured prompts, results stream back live |
| ⬜ | Feature | Shared handouts | — | DM pushes read-only content (descriptions, lore, images) to players, modal display |
| ⬜ | Feature | Invite management panel | — | Join code sharing + direct email invites, pending invites banner, accept/decline flow |

---

## 📌 Epic 14: Higher-Level Character Creation (Phase 7)

> _Allow players to create characters at any level from 1–20. **Complex due to cumulative level-up decisions. Formerly Epic 9.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Level selection in Character Creation Wizard | — | Choose starting level 1–20 in step 1 |
| ⬜ | Task | Cumulative HP calculation | — | Sum of hit dice averages + CON modifier per level |
| ⬜ | Task | ASI / Feat application per level | — | Class-specific ASI levels (4,8,12,16,19 + Fighter extras) |
| ⬜ | Task | Subclass selection at appropriate level | — | Level 1–3 depending on class |
| ⬜ | Task | Spell slots & spells known by level | — | Use existing `CLASS_FEATURES` and spell slot tables in constants.tsx |
| ⬜ | Task | Class features accumulated through levels | — | Compact multi-level choice UI (not 20 separate wizards) |
| ⬜ | Task | Level-appropriate starting equipment & gold | — | Scaled gold and gear for higher levels |
| ⬜ | Feature | "Recommended Build" quick button | — | AI-suggested standard/popular choices for fast character generation |
| ⬜ | Task | Use deterministic logic from constants.tsx | — | Drive core math from PHB tables, not AI; AI supplements with suggestions |
| ⬜ | Task | Proficiency bonus auto-calculation | — | `Math.floor((level - 1) / 4) + 2` |

---

## 📌 Epic 15: Polish & Extras

> _UX improvements, quality-of-life features, and long-term ideas. Formerly Epic 10._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Character comparison | — | Side-by-side stats |
| ⬜ | Feature | Print-friendly character sheet | — | CSS print stylesheet |
| ⬜ | Feature | Sound effects | — | Dice rolls, level-up fanfare |
| ⬜ | Feature | i18n / localization | — | Multi-language support |
| ⬜ | User Story | As a player, I want a quick-reference rules card | — | Common actions, conditions |
| ⬜ | Feature | Dice roll history panel | — | Last 50 rolls per session, persistent log |
| ⬜ | Feature | Offline-first DM notes | — | Dual-mode persistence (Firestore + localStorage) for DM notes |

---

## � Progress Summary

| Epic | Done | In Progress | Not Started | Total |
|------|------|-------------|-------------|-------|
| 1. Core Character Management | 14 | 0 | 4 | 18 |
| 2. Dashboard & Gameplay | 7 | 0 | 6 | 13 |
| 3. AI Integration | 10 | 0 | 2 | 12 |
| 4. Auth & Multiplayer | 4 | 0 | 2 | 6 |
| 5. Deployment & Infrastructure | 9 | 0 | 1 | 10 |
| 5b. Developer Experience | 7 | 0 | 4 | 11 |
| 6. Cloud Persistence (Phase 1) | 8 | 0 | 1 | 9 |
| 7. Foundation Cleanup (Phase 0) | 0 | 6 | 1 | 7 |
| 8. Firestore Campaign Foundation (Phase 1) | 0 | 5 | 2 | 7 |
| 9. Campaign Context & Party UI (Phase 2) | 0 | 1 | 6 | 7 |
| 10. Combat & Initiative Tracker (Phase 3) | 0 | 0 | 6 | 6 |
| 11. DM Notes & Campaign Mgmt (Phase 4) | 0 | 0 | 6 | 6 |
| 12. AI DM Co-Pilot (Phase 5) | 0 | 0 | 6 | 6 |
| 13. Multiplayer Communication (Phase 6) | 0 | 0 | 4 | 4 |
| 14. Higher-Level Char Creation (Phase 7) | 0 | 0 | 10 | 10 |
| 15. Polish & Extras | 0 | 0 | 7 | 7 |
| **Total** | **59** | **12** | **68** | **139** |

---

## 📝 How to Update This Tracker

1. **New work item** — Add a row to the relevant epic table with ⬜ status
2. **Starting work** — Change status to 🟨 and add your GitHub handle as owner
3. **Ready for review** — Change status to 🟦
4. **Merged/shipped** — Change status to ✅
5. **Blocked** — Change status to 🟥 and add a note explaining the blocker
6. **New epic** — Add a new `## 📌 Epic N:` section following the existing format
7. **Update summary** — Recount the progress table after bulk changes