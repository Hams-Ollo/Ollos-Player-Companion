# ⚜️ The Adventurer's Code ⚜️

> *"Welcome to the party, adventurer! Before you draw your sword — or your IDE —  
> read these bylaws. Every good adventuring company has rules, and these  
> will keep our codebase as organized as a wizard's spellbook."*
>
> Guidelines for contributing to Ollo's Player Companion.

---

## Chapter 1: Joining the Party

### Step 1. Fork & Clone

*Create your own copy of the repository and pull it to your local realm:*

```bash
git clone https://github.com/<your-username>/Ollos-Player-Companion.git
cd Ollos-Player-Companion
npm install
```

### Step 2. Prepare Your Spellbook

*Copy the `.env` template and inscribe your personal keys:*

```env
# Server-only — never exposed to the browser
GEMINI_API_KEY=your_gemini_api_key
PORT=3001

# Client-side — baked into the Vite bundle
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ `GEMINI_API_KEY` is read **only** by the Express proxy server (`server/index.js`). It never enters the Vite build or the browser.

### Step 3. Ignite the Dev Server

```bash
npm run dev:full
```

This starts **two** processes concurrently:
- **Vite** dev server on [http://localhost:3000](http://localhost:3000) (frontend, hot-reloads on save)
- **Express** API proxy on port 3001 (proxies `/api/gemini/*` to Gemini, holds the API key)

Vite is configured to forward `/api` requests to the Express proxy automatically.

### Step 4. Verify Your Enchantments

```bash
npx tsc --noEmit
```

Ensure **zero errors** before submitting a PR. The TypeScript compiler is our first line of defense.

---

## Chapter 2: The Code Style Codex

### 🔤 General Laws

- **Language:** TypeScript (`.tsx` for components, `.ts` for utilities)
- **Framework:** React 19 with functional components and hooks only
- **Formatting:** 2-space indentation, single quotes for strings in TS, double quotes for JSX attributes
- **Naming Conventions:**
  - Components: `PascalCase` (`LevelUpModal.tsx`)
  - Functions/variables: `camelCase` (`getClassData`, `handleForge`)
  - Constants: `UPPER_SNAKE_CASE` (`DND_CLASSES`, `FULL_CASTER_SLOTS`)
  - Types/interfaces: `PascalCase` (`CharacterData`, `StatKey`)
  - CSS classes: Tailwind utilities only — no custom CSS

### 🧩 Component Patterns

> *"Keep your components pure, like a Paladin's oath."*

- **Functional components only** — no class components (this isn't 3rd Edition)
- **Props interfaces** defined inline or co-located:
  ```typescript
  const MyModal: React.FC<{ data: CharacterData; onClose: () => void }> = ({ data, onClose }) => {
  ```
- **State management:** React `useState`/`useEffect` — no external state libraries
- **Modals:** Fixed overlays with `z-50`, dark backdrop, rounded cards
- **Icons:** Import from `lucide-react` only

### 🎨 The Color Palette

> *"Every color has meaning in the dungeon."*

- **Base:** `bg-zinc-900` (the darkness), `bg-zinc-800` (cards), `bg-zinc-950` (inputs)
- 🟡 **Amber** (`amber-500/600`) — Primary actions, headings, gold
- 🔵 **Blue** (`blue-500/600`) — Skills, proficiencies
- 🟣 **Purple** (`purple-500/600`) — Spells (1st level+)
- 🔵 **Cyan** (`cyan-500/600`) — Cantrips
- 🟠 **Orange** (`orange-500/600`) — Warnings, secondary CTAs
- 🔴 **Red** (`red-500/600`) — Errors, HP loss, danger
- 🟢 **Green** (`green-500/600`) — Success, healing, level-up
- **Font sizes:** `text-xs` for labels, `text-sm` for body, `text-xl`+ for headings
- **Responsive:** Mobile-first (`p-4 sm:p-6 md:p-8`), max widths on modals

---

## Chapter 3: Accessibility — The Universal Law

> *"A good tavern has a wide door so all may enter. So too must our app."*

### ✅ Required for All Contributions

- All `<button>` elements with icon-only content **must** have `aria-label`:
  ```tsx
  <button aria-label="Remove Fire Bolt" onClick={...}><X size={12} /></button>
  ```

- All `<select>` elements **must** have an accessible name via `htmlFor`/`id` or `aria-label`:
  ```tsx
  <label htmlFor="wizard-race">Race</label>
  <select id="wizard-race" ...>
  ```

- All `<input>` elements **must** be linked to a `<label>` via `htmlFor`/`id`

- Modal close buttons **must** have `aria-label="Close"`:
  ```tsx
  <button onClick={onClose} aria-label="Close"><X size={24} /></button>
  ```

- Interactive elements must have visible focus styles (Tailwind `focus:outline-none focus:border-amber-500` pattern)

### 🧪 Testing the Wards

Run your browser's accessibility audit (Chrome DevTools → Lighthouse → Accessibility) before submitting. Target: **no warnings** for elements you've touched.

---

## Chapter 4: The Compendium of D&D Data (`constants.tsx`)

> *"When adding to the Compendium, accuracy is paramount.  
> A wrong saving throw can mean the difference between life and a very annoyed player."*

When adding or modifying game data:

- **Source all data from the PHB/SRD.** Cite the page/section in a comment if it's non-obvious.
- **Use typed exports.** All data arrays and records must have explicit TypeScript types.
- **Add helper functions** for any data that needs lookup logic (see `getSpellSlotsForLevel`, `getCantripsKnownCount`, etc.)
- **Keep data sorted:** Races alphabetical, classes alphabetical, spells alphabetical within each list.

---

## Chapter 5: The Git Workflow

### Branch Naming

*Name your branch like you'd name an expedition:*

```
feat/short-description     # A new feature (a quest)
fix/short-description      # A bug fix (slaying a monster)
docs/short-description     # Documentation (updating the lore)
refactor/short-description # Code restructuring (renovating the keep)
```

### Commit Messages

*Use [Conventional Commits](https://www.conventionalcommits.org/) — clear, structured, and to the point:*

```
feat: Add spell preparation UI for prepared casters
fix: Correct half-caster spell slot table for level 2
docs: Update API reference with new helper functions
refactor: Extract stat calculation into shared utility
```

### The Pull Request Ritual

1. 🍴 Fork the repo and create a feature branch
2. 💻 Make your changes with clear, atomic commits
3. ✅ Run `npx tsc --noEmit` — zero errors required
4. 🧪 Test manually in the browser (create a character, level up, etc.)
5. ♿ Run accessibility audit on any UI changes
6. 📝 Write a clear PR description explaining **what** and **why**
7. 🔗 Reference any related issues

---

## Chapter 6: Reporting Bugs

> *"Encountered a beholder in the codebase? Report it immediately."*

Open a GitHub issue with:

- **Steps to reproduce** (which class/race/level triggers it)
- **Expected behavior** vs **actual behavior**
- **Browser and OS**
- **Screenshots** if it's a UI issue
- **Console errors** if any

---

## Chapter 7: Quests Open for Contribution

> *"Check the Quest Board at the tavern. These quests pay well in XP."*

| Quest | Difficulty | Description |
|:------|:-----------|:------------|
| 📖 Spellbook Management | 🟡 Medium | Prepare/swap spells on long rest for prepared casters |
| 📦 Export/Import JSON | 🟢 Easy | Download/upload character data as JSON files |
| �️ Conditions Tracker | 🟡 Medium | Track active conditions with mechanical effects |
| 🎯 Subclass Selection | 🟡 Medium | UI for choosing subclass at appropriate level |
| 🔄 localStorage Migration | 🟡 Medium | Migrate campaign localStorage data to Firestore |
| ☁️ Cloud Functions | 🔴 Hard | Server-side campaign operations (invite emails, notifications) |
| 📊 Character Diff Badges | 🟡 Medium | Show visual diff indicators when stats change during level-up |
| 🔒 Firestore Rules Hardening | 🟠 Hard | Field-type validation, document size limits, invite rule tightening |
| 🛡️ Security Headers & CSP | 🟡 Medium | Content Security Policy, HSTS, Permissions-Policy headers |

---

## Chapter 8: Questions?

> *"The tavern keep is always happy to point you in the right direction."*

Open a GitHub Discussion or reach out via Issues. We're happy to help new adventurers find their footing!

---

<p align="center"><em>⚔️ Welcome to the party. Let's build something legendary. ⚔️</em></p>
