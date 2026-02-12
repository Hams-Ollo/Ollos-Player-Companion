# ⚜️ The War Council's Ledger — Project Tracker ⚜️

> *"The Council of Guildmasters meets to survey the battlefield.  
> Every task is accounted for, every victory logged, every challenge ahead mapped.  
> This strategic ledger tracks every stone laid in the keep's construction."*
>
> Comprehensive task tracking by epic. Updated as work is completed.

---

## The Status Runes

| Rune | Meaning |
|:-----|:--------|
| ✅ | **Quest Complete** — Victory achieved |
| 🔲 | **Quest Available** — Awaiting a champion |
| 🚧 | **In Progress** — Currently being attempted |

---

## Epic 1: The Foundation Stone — Core Utilities & References

> *"Before a keep can be raised, the foundation must be laid true."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 1.1 | Extract dice rolling to `lib/dice.ts` | ✅ | `parseDiceExpression`, `rollDice`, `rollBatch` |
| 1.2 | Refactor Dashboard to use `lib/dice.ts` | ✅ | Replaced inline dice parsing |
| 1.3 | Refactor RestModal to use `lib/dice.ts` | ✅ | Replaced inline hit die rolling |
| 1.4 | Add `CONDITIONS` reference map | ✅ | All 15 D&D 5e conditions |
| 1.5 | Add encounter difficulty thresholds | ✅ | DMG XP budget tables (1–20) |
| 1.6 | Expand `types.ts` with multiplayer models | ✅ | `CampaignMember`, `CombatEncounter`, `Combatant`, `DMNote`, `Whisper`, `RollRequest` |
| 1.7 | SRD monster data (`lib/monsters.ts`) | 🔲 | ~300 SRD creatures |
| 1.8 | Backend API proxy for Gemini key | ✅ | Express proxy in `server/index.js` — shipped v0.4.1 |

---

## Epic 2: The Tavern Door — Firebase Auth & Cloud Basics

> *"The door swings open. All are welcome — from the mightiest paladin to the humblest guest."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 2.1 | Google sign-in + anonymous fallback | ✅ | `AuthContext.tsx` |
| 2.2 | `LoginScreen` component | ✅ | Google button + guest mode |
| 2.3 | Auth state persistence | ✅ | `onAuthStateChanged` listener |
| 2.4 | Cloud Run deployment pipeline | ✅ | Dockerfile + Express server |
| 2.5 | Firebase project configuration | ✅ | Hosting, auth domains |
| 2.6 | Environment variable setup | ✅ | `GEMINI_API_KEY` server-only via Express proxy; `VITE_*` via Vite |

---

## Epic 3: The Vault — Firestore Character Persistence

> *"The Vault's enchantments protect every hero's record against time and misfortune."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 3.1 | `CharacterContext` dual-mode provider | ✅ | Cloud vs localStorage |
| 3.2 | Firestore `subscribeUserCharacters` | ✅ | Real-time `onSnapshot` |
| 3.3 | Debounced `saveCharacter` (500ms) | ✅ | Prevents write storms |
| 3.4 | `deleteCharacter` with debounce cancel | ✅ | Clean removal |
| 3.5 | `migrateLocalCharacters` batch write | ✅ | localStorage → Firestore |
| 3.6 | Migration banner UI | ✅ | Accept / dismiss flow |
| 3.7 | Document size warning (>800KB) | ✅ | Console warning |
| 3.8 | Portrait compression to JPEG | ✅ | Canvas-based, max 200KB |

---

## Epic 4: The Arcane Forge — Character Creation

> *"From raw ability scores, a hero is forged."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 4.1 | Multi-step creation wizard | ✅ | `CharacterCreationWizard.tsx` |
| 4.2 | Race selection with subraces | ✅ | PHB races + variants |
| 4.3 | Class selection with subclasses | ✅ | All 12 PHB classes |
| 4.4 | Ability score assignment | ✅ | Standard Array, Point Buy, Manual |
| 4.5 | Background & personality | ✅ | Bonds, flaws, ideals |
| 4.6 | Equipment selection | ✅ | Class-based starting packs |
| 4.7 | AI backstory generation | ✅ | Gemini-powered |
| 4.8 | AI portrait generation | ✅ | `generatePortrait()` |
| 4.9 | Racial ability bonuses applied | ✅ | Auto-calculated |
| 4.10 | Level 1 features & proficiencies | ✅ | From PHB tables |
| 4.11 | Higher-level creation (1–20) | 🔲 | Planned for v0.7.0 |
| 4.12 | Multiclass support | 🔲 | v0.7.0 |

---

## Epic 5: The War Table — Dashboard & UI

> *"The war table spreads before you — every vital stat, every spell, every weapon at a glance."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 5.1 | Card-stack dashboard layout | ✅ | `CardStack.tsx` with swipe |
| 5.2 | Detail overlay panels | ✅ | Vitals, Combat, Skills, Spells, Features, Inventory, Journal |
| 5.3 | Class-themed color system | ✅ | Per-class palettes |
| 5.4 | Inline HP editing | ✅ | Click-to-edit with validation |
| 5.5 | Dice rolling modal | ✅ | `DiceRollModal.tsx` |
| 5.6 | Quick roll modal | ✅ | `QuickRollModal.tsx` |
| 5.7 | Rest modal (short/long) | ✅ | `RestModal.tsx` with HD healing |
| 5.8 | Level-up modal | ✅ | `LevelUpModal.tsx` with AI choices |
| 5.9 | Settings modal | ✅ | `SettingsModal.tsx` |
| 5.10 | Error boundary | ✅ | `ErrorBoundary.tsx` |
| 5.11 | Responsive mobile layout | ✅ | Touch-friendly |
| 5.12 | Portrait regeneration | ✅ | `PortraitGenerator.tsx` |

---

## Epic 6: The Marketplace — Items & Equipment

> *"Step into the shop, adventurer — we have wares aplenty."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 6.1 | Full PHB marketplace (160+ items) | ✅ | `ShopModal.tsx` |
| 6.2 | Category-based item browsing | ✅ | Weapons, armor, gear, tools |
| 6.3 | Item detail modal | ✅ | `ItemDetailModal.tsx` |
| 6.4 | Gold tracking & purchases | ✅ | Auto-deducted |
| 6.5 | Cost formatting (gp/sp/cp) | ✅ | Proper denomination display |
| 6.6 | Equipped/unequipped state | ✅ | Toggle in inventory |
| 6.7 | AC recalculation on equip | ✅ | `recalculateCharacterStats` |
| 6.8 | Attack generation from weapons | ✅ | Auto-detects finesse/ranged |
| 6.9 | SRD magic item catalog | 🔲 | ~200 items |
| 6.10 | DM custom item builder | 🔲 | v0.5.5 |
| 6.11 | Loot session management | 🔲 | v0.5.5 |

---

## Epic 7: The Weave — AI Integration

> *"The Weave permeates all things. These are the threads we've woven into the Companion."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 7.1 | Centralized AI client (`lib/gemini.ts`) | ✅ | Calls Express proxy; API key never in browser |
| 7.2 | `generateWithContext()` | ✅ | Single-shot via `/api/gemini/generate` |
| 7.3 | `createChatWithContext()` | ✅ | Multi-turn via `/api/gemini/chat` |
| 7.4 | `generatePortrait()` | ✅ | Image gen via `/api/gemini/portrait` |
| 7.5 | Rate limiting (2s cooldown) | ✅ | Client-side + server-side (20/user/min, 200 global) |
| 7.6 | Ask DM modal | ✅ | `AskDMModal.tsx` |
| 7.7 | AI-assisted level-up choices | ✅ | Gemini suggests feat/ASI/spells |
| 7.8 | AI backstory generation | ✅ | In creation wizard |
| 7.9 | AI journal summaries | ✅ | Quick session notes |
| 7.10 | Voice transcription | ✅ | `TranscriptionButton.tsx` |
| 7.11 | AI error parsing | ✅ | `parseApiError()` with status codes |
| 7.12 | Context-aware DM Assistant | 🔲 | v0.6.0 — full campaign context |
| 7.13 | AI NPC generation with context | 🔲 | v0.5.0 |
| 7.14 | AI encounter drafting | 🔲 | v0.5.0 |

---

## Epic 8: The War Room — Firestore Campaign System

> *"Campaigns are waged from the war room. This is where parties are assembled  
> and alliances forged."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 8.1 | Campaign subcollection structure | ✅ | members, encounters, notes, templates, whispers, rollRequests |
| 8.2 | `lib/campaigns.ts` service layer | ✅ | Full CRUD + real-time subscriptions |
| 8.3 | Firestore security rules | ✅ | Member reads, DM writes, invite rules |
| 8.4 | Composite indexes | ✅ | `firestore.indexes.json` |
| 8.5 | `CampaignContext` provider | ✅ | `useCampaign()` hook |
| 8.6 | `CampaignManager` component | ✅ | Create, join, manage campaigns |
| 8.7 | Join codes (6-char) | ✅ | Shareable codes |
| 8.8 | Campaign deletion with subcollections | ✅ | Members deleted last |
| 8.9 | DM fallback read permissions | ✅ | On members, encounters, rollRequests, whispers |
| 8.10 | Character-to-campaign assignment | ✅ | Dropdown picker + bidirectional sync of `CharacterData.campaign`/`campaignId` |
| 8.11 | Party roster component | ✅ | `PartyRoster.tsx` — card grid with character fetching |
| 8.12 | DM party overview | ✅ | `DMPartyOverview.tsx` — vitals grid, passive scores |
| 8.13 | Invite management (email + code) | ✅ | Join code sharing panel + email invites + accept/decline |
| 8.14 | Campaign member migration | 🔲 | v0.4.0 |
| 8.15 | Wire `CampaignProvider` into `App.tsx` | ✅ | Provider wraps `AppContent`, no localStorage |
| 8.16 | Rewrite `CampaignManager` with `useCampaign()` | ✅ | Fully Firestore-backed |
| 8.17 | `DMDashboard` layout | ✅ | Tabbed DM view (overview/combat/notes/settings) |
| 8.18 | DM role confirmation at creation | ✅ | Crown badge + confirmation in create form |
| 8.19 | `updateMemberCharacter` service fn | ✅ | Change character assignment after joining |
| 8.20 | `sendInvite` context action | ✅ | Wired `createInvite` into `CampaignContext` |
| 8.21 | Party card in player Dashboard | ✅ | Conditional card in `CardStack` when in campaign |

---

## Epic 9: The Spellbook — Spells & Casting

> *"Every cantrip, every incantation, carefully catalogued and ready to cast."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 9.1 | Full spell data structure | ✅ | `Spell` type in `types.ts` |
| 9.2 | Spell slot tracking | ✅ | Per-level slots + current |
| 9.3 | Cantrips known progression | ✅ | `getCantripsKnownCount()` |
| 9.4 | Spells known progression | ✅ | `getSpellsKnownCount()` |
| 9.5 | Spell slot recovery (long rest) | ✅ | RestModal integration |
| 9.6 | Spell detail display | ✅ | `SpellsDetail.tsx` |
| 9.7 | Warlock Pact Magic | ✅ | All slots at highest level |
| 9.8 | Arcane Recovery | 🔲 | Short rest slot recovery |
| 9.9 | Concentration tracking | 🔲 | v0.8.0+ |
| 9.10 | Ritual casting indicator | 🔲 | Visual flag |

---

## Epic 10: The Chronicle — Journal System

> *"A true adventurer records their deeds. The journal preserves your story."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 10.1 | Journal entry types (note/npc/location/summary/bond) | ✅ | `JournalEntry` type |
| 10.2 | Journal detail panel | ✅ | `JournalDetail.tsx` |
| 10.3 | AI quick summaries | ✅ | One-click session recap |
| 10.4 | Timestamped entries | ✅ | Auto-dated |
| 10.5 | DM campaign journal | 🔲 | v0.5.0 |
| 10.6 | Entity linking (wiki-style) | 🔲 | v0.5.0 |
| 10.7 | AI session summarization | 🔲 | v0.5.0 |

---

## Epic 11: The Training Grounds — Skills & Proficiencies

> *"Practice makes perfect — or at least proficient."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 11.1 | Full 18-skill display | ✅ | `SkillsDetail.tsx` |
| 11.2 | Proficiency/expertise toggles | ✅ | None → proficient → expertise |
| 11.3 | Saving throw proficiencies | ✅ | Per-class defaults |
| 11.4 | Passive Perception calculation | ✅ | 10 + Perception modifier |
| 11.5 | Expertise from Rogue/Bard levels | ✅ | `isExpertiseLevel()` |
| 11.6 | Jack of All Trades | 🔲 | Bard half-proficiency |

---

## Epic 12: The Scroll of Advancement — Level-Up System

> *"Each level brings new power. The scroll guides the ascension."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 12.1 | Level-up modal with AI suggestions | ✅ | Gemini-powered choices |
| 12.2 | ASI / feat selection | ✅ | Ability score or feat |
| 12.3 | HP advancement (average or roll) | ✅ | Per-class hit die |
| 12.4 | Class feature unlocking | ✅ | `getClassFeatures()` |
| 12.5 | Spell slot progression | ✅ | `getSpellSlotsForLevel()` |
| 12.6 | New spell selection | ✅ | AI-suggested spell list |
| 12.7 | Proficiency bonus update | ✅ | Auto-recalculated |
| 12.8 | Expertise selection at appropriate levels | ✅ | Rogue 1/6, Bard 3/10 |
| 12.9 | Target level display (not off-by-one) | ✅ | `targetLevel` state |

---

## Epic 13: The Armorer's Workshop — Combat Stats

> *"Armor Class, hit points, attacks — the numbers that keep you alive."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 13.1 | AC calculation (all armor types) | ✅ | `recalculateCharacterStats` |
| 13.2 | Attack generation from weapons | ✅ | Finesse/ranged detection |
| 13.3 | Initiative calculation | ✅ | DEX modifier |
| 13.4 | Speed display | ✅ | Racial base speed |
| 13.5 | Combat detail panel | ✅ | `CombatDetail.tsx` |
| 13.6 | Condition tracking | 🔲 | v0.8.0+ |
| 13.7 | Death saves | 🔲 | v0.8.0+ |

---

## Epic 14: The Scribe's Tools — Data Management

> *"Data is the ink of the digital age."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 14.1 | JSON export | 🔲 | v0.4.x |
| 14.2 | JSON import | 🔲 | v0.4.x |
| 14.3 | PDF character sheet export | 🔲 | v0.4.x |
| 14.4 | FoundryVTT export | 🔲 | v0.4.x |
| 14.5 | D&D Beyond export | 🔲 | v0.4.x |

---

## Epic 15: The Battle Map — Combat Tracker

> *"Where initiative is rolled and battles are won."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 15.1 | `lib/combat.ts` service layer | 🔲 | v0.5.0 |
| 15.2 | Initiative tracker component | 🔲 | v0.5.0 |
| 15.3 | DM combat management | 🔲 | v0.5.0 |
| 15.4 | Encounter builder | 🔲 | v0.5.0 |
| 15.5 | Batch initiative rolling | 🔲 | v0.5.0 |
| 15.6 | Lair/legendary actions | 🔲 | v0.5.0 |
| 15.7 | Combat keyboard shortcuts | 🔲 | v0.5.0 |

---

## Epic 16: The Messenger — Communication System

> *"Not every message is for all ears."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 16.1 | Whisper system (DM ↔ player) | 🔲 | v0.6.0 |
| 16.2 | Roll request system | 🔲 | v0.6.0 |
| 16.3 | Shared handouts | 🔲 | v0.6.0 |

---

## Epic 17: The Cloud Forge — Infrastructure & DevOps

> *"The ethereal plane where our application lives and breathes."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 17.1 | Dockerfile + Express server | ✅ | Multi-stage build; Stage 2 = Node Express serving static + proxy |
| 17.2 | Cloud Run deployment | ✅ | Source deploy + manual |
| 17.3 | Firebase hosting config | ✅ | Auth domain setup |
| 17.4 | Vite build pipeline | ✅ | TypeScript + Tailwind |
| 17.5 | `tsconfig.json` strict mode | ✅ | Full type checking |
| 17.6 | CI/CD pipeline | 🔲 | GitHub Actions |
| 17.7 | Staging environment | 🔲 | Separate Firebase project |
| 17.8 | Cloud Functions deployment | 🔲 | v0.4.0 |

---

## Epic 19: The Warding Circle — Security Hardening

> *"The strongest keep falls to a single unguarded gate. Before the realm is opened  
> to visitors, every ward must be inscribed, every seal tested, every secret hidden."*

### Layer 1: Backend API Proxy (CRITICAL — blocks public launch)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.1 | Create Express proxy server (`server/index.ts`) | ✅ | `server/index.js` — serves static SPA + proxies `/api/gemini/*` routes |
| 19.2 | Firebase Admin SDK token verification | ✅ | `server/middleware/auth.js` — verifies Firebase ID tokens, 5-min cache |
| 19.3 | Refactor `lib/gemini.ts` to call proxy | ✅ | All Gemini calls go through `proxyFetch()` with Firebase bearer token |
| 19.4 | Remove `GEMINI_API_KEY` from Vite `define` | ✅ | Key removed from `vite.config.ts` — not in client bundle |
| 19.5 | Update Dockerfile for Express server | ✅ | Stage 2 = `node:20-alpine` running `node server/index.js` |
| 19.6 | Update `cloudbuild.yaml` — runtime secret | ✅ | Removed build args; key injected via Cloud Run Secret Manager |
| 19.7 | Remove Gemini File URIs from client bundle | ✅ | `GEMINI_FILE_URI_*` read server-side only |

### Layer 2: Server-Side Rate Limiting (HIGH)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.8 | Per-user rate limiting on proxy | ✅ | `server/middleware/rateLimit.js` — 20 req/min per Firebase UID |
| 19.9 | Global rate limiting fallback | ✅ | 200 req/min total across all users |
| 19.10 | Rate limit headers in responses | ✅ | `X-RateLimit-Remaining`, `Retry-After` headers |

### Layer 3: Debug & Logging Cleanup (MEDIUM)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.11 | Strip API key `console.log` from `gemini.ts` | 🔲 | Lines 16-18, 28 — leak key metadata to browser console |
| 19.12 | Strip key prefix logging from `vite.config.ts` | 🔲 | Lines 18-22 — leak first 8 chars to CI build logs |
| 19.13 | Production-only logging guard | 🔲 | Wrap debug logs in `if (import.meta.env.DEV)` |

### Layer 4: Firestore Rules Tightening (MEDIUM)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.14 | Restrict invite `update` rule | 🔲 | Only `toEmail` owner or campaign DM can accept/decline |
| 19.15 | Add field-type validation rules | 🔲 | Enforce types on `ownerUid`, `name`, `level`, etc. |
| 19.16 | Add document size limits | 🔲 | `request.resource.data.size() < X` on character writes |
| 19.17 | Eliminate local guest UID bypass | 🔲 | Remove `guest-local-*` fallback or scope it to localStorage only |

### Layer 5: Google Cloud API Key Restrictions (MEDIUM)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.18 | Restrict Gemini API key to Cloud Run service | 🔲 | Google Cloud Console → Credentials → IP/service account restriction |
| 19.19 | Restrict Firebase API key by HTTP referrer | 🔲 | Limit to deployed domain(s) only |
| 19.20 | Set daily quota caps on Gemini key | 🔲 | Billing safety net — e.g., 5000 req/day |

### Layer 6: Security Headers & CSP (LOW)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.21 | Content Security Policy header | 🔲 | `default-src 'self'; connect-src 'self' *.googleapis.com *.firebaseio.com` |
| 19.22 | HSTS header | 🔲 | `Strict-Transport-Security: max-age=31536000; includeSubDomains` |
| 19.23 | Permissions-Policy header | 🔲 | Restrict camera/mic/geolocation to what's actually needed |

### Layer 7: Dependency & Supply Chain (LOW)

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 19.24 | `npm audit` — fix known vulnerabilities | 🔲 | Run before public launch |
| 19.25 | Pin dependency versions | 🔲 | Remove `^` ranges for critical deps |
| 19.26 | Add `.env.example` secret checklist | 🔲 | Document which vars are build-time vs runtime |

---

## Epic 18: The Enchantments — Polish & Accessibility

> *"The finest weapons are not merely functional — they gleam."*

| # | Task | Status | Notes |
|:--|:-----|:------:|:------|
| 18.1 | Error boundaries | ✅ | `ErrorBoundary.tsx` |
| 18.2 | Tailwind build pipeline | ✅ | JIT compilation |
| 18.3 | Keyboard navigation | ✅ | Tab-indexing, focus management |
| 18.4 | Screen reader support | ✅ | ARIA labels, semantic HTML |
| 18.5 | PWA support | 🔲 | Service worker + manifest |
| 18.6 | Dark/light theme toggle | 🔲 | v0.8.0+ |
| 18.7 | Sound effects | 🔲 | Dice rolls, level-up |
| 18.8 | i18n / localization | 🔲 | v0.8.0+ |
| 18.9 | Print-friendly sheet | 🔲 | CSS print media |
| 18.10 | Dice roll history panel | 🔲 | Last 50 rolls |

---

## ⚔️ The Progress Tally

> *"The war council surveys the state of the realm."*

| Category | ✅ Done | 🚧 Active | 🔲 Remaining | Total |
|:---------|:--------|:-----------|:-------------|:------|
| Epic 1: Foundation | 7 | 0 | 1 | 8 |
| Epic 2: Auth & Cloud | 6 | 0 | 0 | 6 |
| Epic 3: Character Persistence | 8 | 0 | 0 | 8 |
| Epic 4: Character Creation | 10 | 0 | 2 | 12 |
| Epic 5: Dashboard & UI | 12 | 0 | 0 | 12 |
| Epic 6: Marketplace | 8 | 0 | 3 | 11 |
| Epic 7: AI Integration | 11 | 0 | 3 | 14 |
| Epic 8: Campaign System | 20 | 0 | 1 | 21 |
| Epic 9: Spells & Casting | 7 | 0 | 3 | 10 |
| Epic 10: Journal | 4 | 0 | 3 | 7 |
| Epic 11: Skills | 5 | 0 | 1 | 6 |
| Epic 12: Level-Up | 9 | 0 | 0 | 9 |
| Epic 13: Combat Stats | 5 | 0 | 2 | 7 |
| Epic 14: Data Export | 0 | 0 | 5 | 5 |
| Epic 15: Combat Tracker | 0 | 0 | 7 | 7 |
| Epic 16: Communication | 0 | 0 | 3 | 3 |
| Epic 17: Infrastructure | 5 | 0 | 3 | 8 |
| Epic 18: Polish & A11y | 4 | 0 | 6 | 10 |
| Epic 19: Security Hardening | 10 | 0 | 16 | 26 |
| **TOTALS** | **131** | **0** | **59** | **190** |

---

## 📜 How to Update This Ledger

1. Find the relevant **Epic** section
2. Change the status rune (🔲 → 🚧 → ✅)
3. Add notes about what was done
4. Update the **Progress Tally** table at the bottom
5. Commit with message: `docs: update project tracker — [Epic X: task description]`

---

<p align="center"><em>⚔️ The Council adjourns. The work continues. ⚔️</em></p>
