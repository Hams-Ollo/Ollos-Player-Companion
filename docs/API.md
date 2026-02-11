# 🔌 API Reference

> Gemini AI integration, helper functions, data schemas, and environment configuration.

---

## 🤖 Gemini AI Client

The centralized AI client lives in `lib/gemini.ts`. All AI-powered components use this module.

### `generateWithContext(prompt, config?)`

Single-shot text generation using Gemini.

```typescript
import { generateWithContext } from '../lib/gemini';

const result = await generateWithContext(
  'Explain the Fireball spell in D&D 5e',
  { responseMimeType: 'application/json' }  // optional
);
console.log(result); // string response
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | The text prompt to send |
| `config` | `Partial<GenerateContentParameters['config']>` | Optional Gemini config (response format, temperature, etc.) |
| **Returns** | `string \| undefined` | Generated text response |

**Used by:** `LevelUpModal`, `ItemDetailModal`, `JournalDetail`

---

### `createChatWithContext(history, systemInstruction)`

Creates a multi-turn chat session with Gemini.

```typescript
import { createChatWithContext } from '../lib/gemini';

const chat = await createChatWithContext(
  [],  // previous message history
  'You are a D&D 5e Dungeon Master. Answer rules questions accurately.'
);

const response = await chat.sendMessage({ message: 'What does Magic Missile do?' });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `history` | `any[]` | Array of previous chat messages |
| `systemInstruction` | `string` | System prompt defining AI behavior |
| **Returns** | `Chat` | Gemini chat session object |

**Used by:** `AskDMModal`

---

## 🎨 Portrait Generation

Portrait generation uses `gemini-2.5-flash-image` directly (not via the shared client, since image generation doesn't support context caching).

```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-image',
  contents: { parts: [{ text: 'D&D Portrait: Drow Elf Rogue...' }] },
});
// Extract base64 image from response.candidates[0].content.parts
```

**Used by:** `CharacterCreationWizard` (forge step), `PortraitGenerator`

---

## 🔒 Rate Limiting

### `checkRateLimit()`

```typescript
import { checkRateLimit } from '../utils';

checkRateLimit(); // throws if called within 2 seconds of last call
```

Enforces a 2-second cooldown between AI requests. State is stored in a module-level closure — not in `localStorage` — so it can't be tampered with from the console.

**Throws:** `Error("Slow down, adventurer! The Weave needs a moment to settle.")`

---

## 🔧 Utility Functions (`utils.ts`)

### `calculateModifier(score)`

```typescript
calculateModifier(16); // → 3
calculateModifier(8);  // → -1
```

Standard D&D modifier formula: `Math.floor((score - 10) / 2)`

---

### `recalculateCharacterStats(data)`

Recomputes derived stats from current character state:

```typescript
import { recalculateCharacterStats } from '../utils';

const updated = recalculateCharacterStats(character);
// updated.ac — recalculated from equipped armor
// updated.attacks — rebuilt from equipped weapons
// updated.passivePerception — 10 + perception modifier
// updated.initiative — DEX modifier
```

**AC Calculation Logic:**
- Base: `10 + DEX mod`
- Leather: `11 + DEX mod`
- Studded Leather: `12 + DEX mod`
- Chain Shirt: `13 + min(2, DEX mod)`
- Scale Mail: `14 + min(2, DEX mod)`
- Plate: `18`
- Shield: `+2`

**Attack Generation:** Auto-generates attack entries from equipped weapons, detecting finesse/ranged properties and applying the correct ability modifier + proficiency bonus.

---

## 📊 D&D Data Helpers (`constants.tsx`)

### Spell Slot Functions

#### `getSpellSlotsForLevel(className, charLevel)`

Returns the spell slots available for a class at a given level.

```typescript
getSpellSlotsForLevel('Wizard', 3);
// → [{ level: 1, max: 4 }, { level: 2, max: 2 }]

getSpellSlotsForLevel('Warlock', 5);
// → [{ level: 3, max: 2 }]  (Pact Magic — all slots same level)

getSpellSlotsForLevel('Fighter', 1);
// → []  (non-caster)
```

Handles full casters, half casters (Paladin/Ranger), and Warlock Pact Magic.

---

#### `getCantripsKnownCount(className, charLevel)`

```typescript
getCantripsKnownCount('Wizard', 1);  // → 3
getCantripsKnownCount('Wizard', 10); // → 5
getCantripsKnownCount('Fighter', 1); // → 0
```

---

#### `getSpellsKnownCount(className, charLevel)`

For "known" casters only (Bard, Ranger, Sorcerer, Warlock). Returns 0 for prepared casters.

```typescript
getSpellsKnownCount('Bard', 1);    // → 4
getSpellsKnownCount('Sorcerer', 5); // → 6
getSpellsKnownCount('Cleric', 5);   // → 0 (prepared caster)
```

---

### Class Feature Functions

#### `getClassFeatures(className, level)`

```typescript
getClassFeatures('Rogue', 1);
// → [
//   { name: 'Expertise', description: 'Double proficiency for two skills...' },
//   { name: 'Sneak Attack (1d6)', description: '...' },
//   { name: "Thieves' Cant", description: '...' }
// ]
```

---

#### `isASILevel(className, level)`

```typescript
isASILevel('Fighter', 6); // → true  (Fighters get extra ASIs)
isASILevel('Wizard', 6);  // → false
```

---

#### `isExpertiseLevel(className, level)`

```typescript
isExpertiseLevel('Rogue', 1);  // → true
isExpertiseLevel('Bard', 3);   // → true
isExpertiseLevel('Wizard', 1); // → false
```

---

#### `getSneakAttackDice(rogueLevel)`

```typescript
getSneakAttackDice(1);  // → "1d6"
getSneakAttackDice(5);  // → "3d6"
getSneakAttackDice(20); // → "10d6"
```

---

### Race & Class Lookups

| Function | Signature | Returns |
|----------|-----------|---------|
| `getAllRaceOptions()` | `() → string[]` | Flat list of all races including subraces |
| `getRaceSpeed(name)` | `(string) → number` | Walking speed (default 30) |
| `getClassData(name)` | `(string) → ClassOption \| undefined` | Full class definition |
| `getRacialBonus(race, stat)` | `(string, StatKey) → number` | Ability score bonus |
| `getRacialBonusDisplay(race)` | `(string) → string` | Formatted string like `"+2 DEX, +1 WIS"` |
| `getRaceTraits(race)` | `(string) → RaceTraitData \| undefined` | Traits, languages, darkvision, racial spells |

---

## 📝 Data Schemas

### `CharacterData`

The core data model. See `types.ts` for the full interface. Key nested types:

| Type | Fields |
|------|--------|
| `Stat` | `score`, `modifier`, `save`, `proficientSave` |
| `Skill` | `name`, `ability`, `modifier`, `proficiency` (`none` / `proficient` / `expertise`) |
| `Attack` | `name`, `bonus`, `damage`, `type`, `range?`, `properties?` |
| `Feature` | `name`, `source`, `description`, `fullText` |
| `Spell` | `name`, `level`, `school`, `castingTime`, `range`, `components`, `duration`, `description`, `atHigherLevels?` |
| `Item` | `name`, `quantity`, `type?`, `cost?`, `weight?`, `notes?`, `equipped?` |
| `JournalEntry` | `id`, `timestamp`, `type` (`note`/`npc`/`location`/`summary`/`bond`), `content` |

### `Campaign`

```typescript
interface Campaign {
  id: string;
  name: string;
  dmId: string;
  description: string;
  joinCode: string;           // shareable 6-char code
  members: { uid: string; name: string }[];
  createdAt: number;
}
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key for Gemini |
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `VITE_GEMINI_FILE_URI_BASIC` | ❌ | Gemini File API URI for Basic Rules PDF |
| `VITE_GEMINI_FILE_URI_DMG` | ❌ | Gemini File API URI for DMG PDF |
| `VITE_GEMINI_FILE_URI_MM` | ❌ | Gemini File API URI for Monster Manual PDF |
| `VITE_GEMINI_FILE_URI_PHB` | ❌ | Gemini File API URI for PHB PDF |

### How Env Vars Are Injected

- **`GEMINI_API_KEY`** → Injected by Vite's `define` in `vite.config.ts` as `process.env.API_KEY`
- **`VITE_*`** → Automatically exposed by Vite as `import.meta.env.VITE_*` and via the `getEnv()` helper in `AuthContext.tsx`
