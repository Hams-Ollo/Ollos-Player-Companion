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

## 🚀 Next Up (v0.2.2)

### 🔴 Critical

- [ ] **Backend API proxy** — Move Gemini API key to a server-side proxy so it's not embedded in the client bundle

### 🟠 High

- [ ] **Spellbook management** — Prepare/swap spells on long rest for prepared casters (Cleric, Druid, Wizard, Paladin)
- [ ] **Firestore cloud sync** — Persist characters to Firebase Firestore so data survives across devices/browsers

### 🟡 Medium

- [ ] **Export/import character JSON** — Download character as `.json` file, import from file
- [ ] **Multiclass support** — Allow characters to take levels in multiple classes, split hit dice, merge spell slots
- [ ] **Subclass selection** — UI for choosing subclass at the appropriate level with feature integration
- [ ] **Conditions tracker** — Track active conditions (Poisoned, Stunned, etc.) with mechanical effects on the dashboard

---

## 🗺️ Future (v0.3.0+)

### 🟡 Medium

- [ ] **Death saves tracker** — Track successes/failures with auto-reset on stabilize or heal
- [ ] **Concentration tracker** — Flag active concentration spell, auto-prompt CON save on damage
- [ ] **Spell slot recovery UI** — Arcane Recovery (Wizard), Font of Magic (Sorcerer), Pact Magic short rest
- [ ] **Encounter tracker** — Initiative order, turn tracking, monster HP for DMs
- [ ] **Party view** — See all characters in a campaign at a glance
- [ ] **Dark/light theme toggle** — Currently dark-only; add a light theme option

### 🟢 Low

- [ ] **PWA support** — Service worker + manifest for installable mobile app with offline support
- [ ] **Dice roll history** — Persistent log of all dice rolls in a session
- [ ] **Character comparison** — Side-by-side stat comparison between characters
- [ ] **Sound effects** — Optional dice roll sounds, level-up fanfare
- [ ] **i18n / localization** — Support for languages beyond English
- [ ] **Print-friendly character sheet** — CSS print stylesheet for paper export

---

## 🔵 Community Requests

> Add community-requested features here. Include the GitHub issue # if applicable.

- [ ] _No requests yet — [open an issue](https://github.com/Hams-Ollo/The-Players-Companion/issues) to suggest a feature!_

---

## ✅ Completed

> Move items here as they're finished. Include the version/date.

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