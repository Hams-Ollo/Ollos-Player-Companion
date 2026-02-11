# 🐉 The Player's Companion

![Status](https://img.shields.io/badge/Status-Active_Development-success)
![Tech](https://img.shields.io/badge/Stack-React_19_|_TypeScript_|_Tailwind-blue)
![AI](https://img.shields.io/badge/Powered_by-Google_Gemini_3-purple)
![Auth](https://img.shields.io/badge/Auth-Firebase-orange)

**The Player's Companion** is a modern, mobile-first Dungeons & Dragons 5e character sheet application. It reimagines the traditional spreadsheet-style character sheet as a tactile "Card Deck" dashboard, focusing on visual hierarchy, intuitive interactions, and AI grounded in the official D&D reference documents.

## ✨ Features

### 🎴 The Card Stack UI
Data is organized into 6 intuitive, color-coded stacks that expand into detailed overlays:
*   **❤️ Vitals (Red):** HP management, AC calculation, Initiative, Hit Dice, and Short/Long rest mechanics.
*   **⚔️ Combat (Orange):** Integrated weapon attacks, damage rolls, and class features (e.g., Sneak Attack).
*   **🧠 Skills (Blue):** Ability scores, saving throws, and skill checks with visual proficiency indicators.
*   **✨ Traits (Purple):** Class features and racial traits with expandable rules text.
*   **🎒 Inventory (Amber):** Gold tracking, equipment management, and an interactive marketplace.
*   **📓 Journal (Cyan):** Session notes with NPC/Location categorization and AI-powered chronicle summaries.

### 🤖 AI-Powered Dungeon Master (Google Gemini 3)
All text-based AI features are grounded in the official D&D 5e reference documents (PHB, DMG, MM, Basic Rules) via Gemini Context Caching. Responses include page citations from the source books.

*   **Portrait Artificer:** Generate high-fantasy character portraits from text descriptions or uploaded reference photos.
*   **Level Up Wizard:** AI analyzes your class progression table and guides you through spells, feats, and ASI choices.
*   **Lore Master:** Click any item or feature to get rules-accurate descriptions cited from the books.
*   **Journal Scribe:** Summarize session notes into a coherent narrative chronicle.
*   **DM Chat:** A multi-turn "Ask the DM" chat interface for rule queries and mechanic clarifications.

### 🎲 Interactive Systems
*   **Dice Roller:** Click any stat, skill, or attack to roll. Visual feedback for Critical Successes (Nat 20) and Fails.
*   **Character Forge:** A step-by-step wizard (Standard Array, Point Buy, or Manual) with AI-generated portraits.
*   **Starter Equipment Shop:** After character creation, roll or take average starting gold and buy equipment before your first session.
*   **Campaign Manager:** Create campaigns, generate join codes, and organize characters by party.
*   **Rest System:** Short rests with Hit Dice spending, Long rests with full HP/spell slot recovery.
*   **Authentication:** Google sign-in or anonymous guest mode via Firebase Auth.
*   **Persistence:** All character data saved per-user to browser localStorage.

### �️ Security
*   **Multi-layer Rate Limiting:** Per-minute sliding window (10 req/min) + daily cap (300 req/day) + session tamper detection.

---

## 📚 Documentation

*   **[🏗️ Architecture Guide](docs/ARCHITECTURE.md)**: Tech stack, component structure, AI integration, and data flow.
*   **[🎮 User Guide](docs/USAGE.md)**: Setup, character creation, dashboard features, and AI tools.
*   **[🤝 Contributing Guide](docs/CONTRIBUTING.md)**: Dev environment setup and contribution guidelines.

---

## 🚀 Quick Start

### Prerequisites
*   Node.js (v20+ recommended)
*   A Google AI Studio API Key ([Get one here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Hams-Ollo/The-Players-Companion.git
    cd The-Players-Companion
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_key_here
    VITE_FIREBASE_API_KEY=your_firebase_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Upload D&D Reference PDFs** *(optional but recommended)*
    Place your D&D 5e PDFs in `reference-docs/`, then run:
    ```bash
    npm run upload-pdfs
    ```
    This uploads the PDFs to Google's Gemini File API and saves the file URIs to `.env`. The PDFs are never committed to git.

5.  **Run Local Server**
    ```bash
    npm run dev
    ```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
