# D&D Card Deck Character Sheet

A modern, mobile-first Dungeons & Dragons 5e character sheet application. This project reimagines the traditional spreadsheet-style character sheet as a "Card Deck" dashboard, focusing on visual hierarchy, tactile interactions, and AI-powered enhancements.

![Status](https://img.shields.io/badge/Status-Active-success)
![Tech](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Google_Gemini-purple)

## 🌟 Features

### 🎴 The Card Stack UI
Instead of scrolling through endless tables, data is organized into 5 intuitive color-coded stacks:
*   **❤️ Vitals (Red):** HP, AC, Initiative, and Speed. Includes interactive Heal/Damage controls.
*   **⚔️ Combat (Orange):** Weapons, Attacks, and Class combat features (e.g., Sneak Attack).
*   **🧠 Skills (Blue):** Ability scores, Saving throws, and Skill checks with proficiency/expertise tracking.
*   **✨ Traits (Purple):** Racial and Class features with expandable rule text.
*   **🎒 Inventory (Amber):** Gold tracking, equipment list, and encumbrance.

### 🎲 Interactive Systems
*   **Dice Roller:** Click any stat, skill, or attack modifier to roll 3D dice logic instantly. Visual feedback for Critical Success (Nat 20) and Critical Fail (Nat 1).
*   **Character Management:** Create new characters (with auto-rolled Standard Array stats), switch between active campaigns, and delete old sheets. Data is persisted via `localStorage`.

### 🤖 AI Integration (Google Gemini)
*   **Portrait Artificer:** Generate high-fantasy character portraits based on your race/class description using text-to-image or image-to-image generation.
*   **Dungeon Master Chat:** An in-app chat interface to query rules, spell descriptions, or mechanics.

---

## 🛠️ Tech Stack

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI SDK:** `@google/genai` (Gemini API)
*   **Build Tooling:** Compatible with Vite/ESM

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   A Google AI Studio API Key (for AI features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/dnd-card-sheet.git
    cd dnd-card-sheet
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory to enable the AI features.
    
    ```env
    # Get your key at https://aistudio.google.com/
    API_KEY=your_google_ai_key_here
    ```
    
    *Note: If using Vite, you may need to prefix this as `VITE_API_KEY` and update the references in the code from `process.env.API_KEY` to `import.meta.env.VITE_API_KEY`.*

4.  **Run Local Server**
    ```bash
    npm start
    # or
    npm run dev
    ```

---

## 📂 Project Structure

```text
/
├── App.tsx                 # Main Session Manager (State & LocalStorage)
├── types.ts                # TypeScript Interfaces (CharacterData, Skills, etc.)
├── constants.tsx           # Default Data & Factories (Vesper template)
├── components/
│   ├── Dashboard.tsx       # Main Character Sheet View
│   ├── CharacterSelection.tsx # Menu for selecting/creating characters
│   ├── CardStack.tsx       # Reusable Card UI Component
│   ├── DetailOverlay.tsx   # Modal wrapper for detailed views
│   ├── DiceRollModal.tsx   # Visual Dice Result Pop-up
│   ├── SettingsModal.tsx   # Edit Stats/Bio & API Status
│   ├── PortraitGenerator.tsx # AI Image Generation Modal
│   ├── AskDMModal.tsx      # AI Chat Interface
│   └── details/            # Inner content for specific stacks
│       ├── VitalsDetail.tsx
│       ├── CombatDetail.tsx
│       ├── SkillsDetail.tsx
│       ├── FeaturesDetail.tsx
│       └── InventoryDetail.tsx
```

---

## 🧩 Customization Guide

### Adding New Skills
Modify `types.ts` to update the `Skill` interface if needed, and update the `defaultSkills` array in `constants.tsx`.

### Changing the Theme
The app uses semantic color mapping in `CardStack.tsx` and `DetailOverlay.tsx`.
```typescript
const colorMap = {
  red: "border-l-red-500 shadow-red-900/10",
  // ... change these Tailwind classes to adjust the theme
};
```

### Modifying AI Prompts
*   **Portrait Prompts:** Located in `components/PortraitGenerator.tsx`. Currently set to generate "High fantasy digital art".
*   **DM Persona:** Located in `components/AskDMModal.tsx` inside the `systemInstruction` config.

---

## 🔒 Security Note

The API Key is currently accessed via `process.env.API_KEY`.
*   **Local Dev:** This is safe if using `.env` not committed to Git.
*   **Production:** Do not embed your personal API Key in a public client-side build. For a production deployment, you should proxy these requests through a backend server or require the user to input their own API Key in the Settings modal.

---

## 📜 License

[MIT](https://choosealicense.com/licenses/mit/)
