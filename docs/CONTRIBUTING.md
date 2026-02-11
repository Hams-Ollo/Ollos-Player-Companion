# 🤝 Contributing

> Guidelines for contributing to The Player's Companion. Welcome to the party, adventurer!

---

## 🏁 Quick Start

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/The-Players-Companion.git
cd The-Players-Companion
npm install
```

### 2. Set Up Environment

Copy the `.env` template and fill in your keys:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app hot-reloads on save.

### 4. Verify TypeScript

```bash
npx tsc --noEmit
```

Ensure zero errors before submitting a PR.

---

## 📏 Code Style

### 🔤 General

- **Language:** TypeScript (`.tsx` for components, `.ts` for utilities)
- **Framework:** React 19 with functional components and hooks
- **Formatting:** 2-space indentation, single quotes for strings in TS, double quotes for JSX attributes
- **Naming:**
  - Components: `PascalCase` (`LevelUpModal.tsx`)
  - Functions/variables: `camelCase` (`getClassData`, `handleForge`)
  - Constants: `UPPER_SNAKE_CASE` (`DND_CLASSES`, `FULL_CASTER_SLOTS`)
  - Types/interfaces: `PascalCase` (`CharacterData`, `StatKey`)
  - CSS classes: Tailwind utilities only

### 🧩 Component Patterns

- **Functional components only** — no class components
- **Props interfaces** defined inline or co-located:
  ```typescript
  const MyModal: React.FC<{ data: CharacterData; onClose: () => void }> = ({ data, onClose }) => {
  ```
- **State management:** React `useState`/`useEffect` — no external state libraries
- **Modals:** Render as fixed overlays with `z-50`, dark backdrop, rounded cards
- **Icons:** Import from `lucide-react` only

### 🎨 Styling Conventions

- **Dark theme:** `bg-zinc-900` base, `bg-zinc-800` cards, `bg-zinc-950` inputs
- **Accent colors:**
  - 🟡 Amber (`amber-500/600`) — primary actions, headings
  - 🔵 Blue (`blue-500/600`) — skills, proficiencies
  - 🟣 Purple (`purple-500/600`) — spells (1st level+)
  - 🔵 Cyan (`cyan-500/600`) — cantrips
  - 🟠 Orange (`orange-500/600`) — warnings, secondary CTAs
  - 🔴 Red (`red-500/600`) — errors, HP loss
  - 🟢 Green (`green-500/600`) — success, healing
- **Font sizes:** `text-xs` for labels, `text-sm` for body, `text-xl`+ for headings
- **Responsive:** Mobile-first (`p-4 sm:p-6 md:p-8`), max widths on modals

---

## ♿ Accessibility

Accessibility is a priority. Follow these guidelines:

### ✅ Required

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

### 🧪 Testing

Run your browser's accessibility audit (Chrome DevTools > Lighthouse > Accessibility) before submitting. Target: **no warnings** for elements you've touched.

---

## 📦 D&D Data (`constants.tsx`)

When adding or modifying game data:

- **Source all data from the PHB/SRD.** Cite the page/section in a comment if it's non-obvious.
- **Use typed exports.** All data arrays and records must have explicit TypeScript types.
- **Add helper functions** for any data that needs lookup logic (see `getSpellSlotsForLevel`, `getCantripsKnownCount`, etc.)
- **Keep data sorted:** Races alphabetical, classes alphabetical, spells alphabetical within each list.

---

## 🔀 Git Workflow

### Branch Naming

```
feat/short-description    # New features
fix/short-description     # Bug fixes
docs/short-description    # Documentation only
refactor/short-description # Code restructuring
```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add spell preparation UI for prepared casters
fix: Correct half-caster spell slot table for level 2
docs: Update API reference with new helper functions
refactor: Extract stat calculation into shared utility
```

### Pull Request Process

1. 🍴 Fork the repo and create a feature branch
2. 💻 Make your changes with clear, atomic commits
3. ✅ Run `npx tsc --noEmit` — zero errors required
4. 🧪 Test manually in the browser (create a character, level up, etc.)
5. ♿ Run accessibility audit on any UI changes
6. 📝 Write a clear PR description explaining **what** and **why**
7. 🔗 Reference any related issues

---

## 🐛 Reporting Bugs

Open a GitHub issue with:

- **Steps to reproduce** (which class/race/level triggers it)
- **Expected behavior** vs **actual behavior**
- **Browser and OS**
- **Screenshots** if it's a UI issue
- **Console errors** if any

---

## 🗺️ Roadmap Items Open for Contribution

These are tracked in the README and are great first contributions:

| Item | Difficulty | Description |
|------|-----------|-------------|
| 📖 Spellbook management | 🟡 Medium | Prepare/swap spells on long rest for prepared casters |
| 💾 Firestore sync | 🔴 Hard | Cloud persistence for characters via Firebase Firestore |
| 📤 Export/import JSON | 🟢 Easy | Download/upload character data as JSON files |
| 🛡️ Error boundaries | 🟢 Easy | Add React error boundaries around AI calls and detail views |
| 🎨 Tailwind build pipeline | 🟡 Medium | Replace CDN with proper PostCSS/Tailwind build |
| 🔐 Backend API proxy | 🔴 Hard | Move Gemini API key to a server-side proxy |

---

## 💬 Questions?

Open a GitHub Discussion or reach out via Issues. We're happy to help new contributors get started!
