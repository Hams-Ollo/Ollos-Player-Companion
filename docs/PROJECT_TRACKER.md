# 📊 Project Tracker

> Development tracking for The Player's Companion — organized by epics, features, user stories, and tasks.
>
> **Last updated:** 2026-02-12

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
| ✅ | Feature | Character selection & deletion | @Hams-Ollo | |
| ✅ | Task | localStorage persistence | @Hams-Ollo | `vesper_chars` key |
| ⬜ | User Story | As a player, I want to export/import my character as JSON | — | Download `.json`, import from file |
| ⬜ | User Story | As a player, I want my characters synced to the cloud | — | Firestore integration |
| ⬜ | Feature | Multiclass support | — | Split hit dice, merge spell slots |
| ⬜ | Feature | Subclass selection UI | — | Choose at appropriate level |

---

## 📌 Epic 2: Dashboard & Gameplay

> _Interactive dashboard for running a character during play sessions._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Card-stack dashboard UI | @Hams-Ollo | Swipeable cards for each stat category |
| ✅ | Feature | Detail overlay views (7) | @Hams-Ollo | Vitals, Combat, Skills, Features, Spells, Inventory, Journal |
| ✅ | Feature | Dice roller | @Hams-Ollo | Advanced parser: Adv/Dis, complex expressions (2d6+4), crit/fail |
| ✅ | Feature | Rest system (short + long) | @Hams-Ollo | Hit dice recovery |
| ✅ | Feature | In-game equipment shop | @Hams-Ollo | Buy/sell from inventory |
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
| ⬜ | User Story | As a DM, I want to see all players in my campaign | — | Party view |
| ⬜ | Feature | Firestore character sync | — | Cloud persistence |
| ⬜ | Feature | Real-time campaign updates | — | Firestore listeners |

---

## 📌 Epic 5: Developer Experience & Quality

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
| ⬜ | User Story | As a developer, I want CI/CD pipeline | — | GitHub Actions build + lint |
| ⬜ | Feature | PWA support | — | Service worker, manifest |
| ⬜ | Feature | Dark/light theme toggle | — | Currently dark-only |

---

## 📌 Epic 6: Polish & Extras

> _UX improvements, quality-of-life features, and long-term ideas._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Encounter tracker | — | Initiative order, turn tracking |
| ⬜ | Feature | Character comparison | — | Side-by-side stats |
| ⬜ | Feature | Print-friendly character sheet | — | CSS print stylesheet |
| ⬜ | Feature | Sound effects | — | Dice rolls, level-up fanfare |
| ⬜ | Feature | i18n / localization | — | Multi-language support |
| ⬜ | User Story | As a player, I want a quick-reference rules card | — | Common actions, conditions |

---

## 📈 Progress Summary

| Epic | Done | In Progress | Not Started | Total |
|------|------|-------------|-------------|-------|
| 1. Core Character Management | 12 | 0 | 4 | 16 |
| 2. Dashboard & Gameplay | 7 | 0 | 6 | 13 |
| 3. AI Integration | 8 | 0 | 2 | 10 |
| 4. Auth & Multiplayer | 3 | 0 | 3 | 6 |
| 5. Developer Experience | 7 | 0 | 5 | 12 |
| 6. Polish & Extras | 0 | 0 | 6 | 6 |
| **Total** | **37** | **0** | **26** | **63** |

---

## 📝 How to Update This Tracker

1. **New work item** — Add a row to the relevant epic table with ⬜ status
2. **Starting work** — Change status to 🟨 and add your GitHub handle as owner
3. **Ready for review** — Change status to 🟦
4. **Merged/shipped** — Change status to ✅
5. **Blocked** — Change status to 🟥 and add a note explaining the blocker
6. **New epic** — Add a new `## 📌 Epic N:` section following the existing format
7. **Update summary** — Recount the progress table after bulk changes