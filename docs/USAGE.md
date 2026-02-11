# 🎮 User Guide

## Getting Started

1.  **Launch the App**: Run `npm run dev` and open `http://localhost:5173` in your browser.
2.  **Sign In**: Choose **Google Sign-in** for a persistent account or **Continue as Guest** for quick access.
3.  **API Key**: The Gemini API key is loaded from your `.env` file. The "Neural Link" indicator in **Settings** shows connection status.

## Setting Up D&D Reference PDFs (Optional)

For the best AI experience, upload your D&D 5e PDFs so the AI can cite rules directly from the books:

1.  Place PDFs in the `reference-docs/` folder (PHB, DMG, MM, and/or Basic Rules).
2.  Run `npm run upload-pdfs` — this uploads them to Google's servers and saves file URIs to `.env`.
3.  Restart the dev server. The app pre-warms the cache on load.

Without PDFs, AI features still work but use general knowledge instead of book-grounded citations.

## Character Creation

Click **Forge New Hero** on the character selection screen.

1.  **Identity**: Choose Name, Race, Class, Background, Alignment, and Campaign.
2.  **Ability Scores**:
    *   **Standard Array**: Assign 15, 14, 13, 12, 10, 8 to your stats.
    *   **Point Buy**: Spend 27 points to customize stats (8–15 range).
    *   **Manual**: Input your rolled stats directly (3–20 range).
    *   Half-Elf players pick two bonus stats for their +1 racial bonuses.
3.  **Concept**: Enter an appearance description and backstory. The appearance text drives AI portrait generation.
4.  **Forge**: Review your build. The AI generates a character portrait, then you enter the dashboard.

### Starter Equipment Shop
After forging your character, a **Starter Shop** opens automatically. Roll or take average starting gold for your class, then purchase equipment across five categories (Weapons, Armor, Gear, Packs, Ammo & Tools). You can skip this step with the X button.

## The Dashboard

The dashboard is your command center. Click any **Card Stack** to expand its detailed view.

### ❤️ Vitals
*   **Health**: Click "Damage" or "Heal" to adjust HP.
*   **Resting**: Click the Moon icon to open the Rest modal.
    *   *Short Rest*: Spend Hit Dice to heal partial HP.
    *   *Long Rest*: Fully restore HP and reset spell slots.
*   **Level Up**: Click the Arrow Up icon. The AI analyzes your class progression table and walks you through new features, spells, feats, and ASI choices.

### ⚔️ Combat
*   **Attack**: Click the "To Hit" box to roll a d20 + modifier.
*   **Damage**: Click the "Damage" box to roll weapon damage dice.
*   **Critical Hits**: Nat 20s and Nat 1s get special visual feedback.

### 🧠 Skills
*   **Checks**: Click any Ability Score or Skill to roll a d20 + modifier.
*   **Saves**: Click a Saving Throw to roll.
*   **Proficiency**: Filled circles indicate proficiency; the bonus is auto-applied.

### ✨ Features
*   **Inspect**: Click any feature name to have the AI generate rules-accurate text cited from the source books.

### 🎒 Inventory
*   **Equip/Unequip**: Toggle items between backpack and equipped. Equipped armor/weapons affect AC and the attack list automatically.
*   **Shop**: Click "Visit Merchant" to open the marketplace — buy gear or sell loot at half price.
*   **Inspect**: Click any item name for an AI-generated description with rules and page citations.
*   **Gold**: Tracked in gp with fractional sp/cp support.

### 📓 Journal
*   **Record**: Type notes and tag them as Note, NPC, or Location.
*   **Delete**: Hover over an entry and click the trash icon to remove it.
*   **Summarize**: Click the Sparkles icon to have the AI generate a narrative chronicle from your entries.

## AI Features

### 🎨 Portrait Artificer
Click your character portrait to open the generator.
*   **Text Mode**: Describe a new look and generate a fresh portrait.
*   **Image Mode**: Upload a sketch or photo and have the AI reimagine it as a fantasy painting.

### 🧙‍♂️ Ask the DM
Click the Message icon in the header to open a multi-turn chat with an AI Dungeon Master.
*   Ask about rules, spells, class features, or game mechanics.
*   Responses are grounded in the D&D reference documents with page citations.
*   The DM formats answers with Markdown, bold keywords, and tables.

### 📋 Campaign Manager
Access from the character selection screen to:
*   **Create** a new campaign (generates a 6-character join code).
*   **Join** an existing campaign by entering a join code.
*   View your campaigns and their members.

## Rate Limits

To protect the API key, the app enforces:
*   **10 requests per minute** (sliding window).
*   **300 requests per day** (resets at midnight).

If you hit a limit, a message will tell you how long to wait.
