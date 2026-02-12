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

**Used by:** `LevelUpModal`, `ItemDetailModal`, `JournalDetail`, `QuickRollModal`, `CharacterCreationWizard`

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

### `generatePortrait(prompt, parts?)`

Generates an AI portrait using `gemini-2.5-flash-image`. All portrait generation is centralized through this shared helper in `lib/gemini.ts`.

```typescript
import { generatePortrait } from '../lib/gemini';

// Text-only portrait (from description)
const dataUri = await generatePortrait(
  'D&D Portrait: Drow Elf Rogue with silver hair and violet eyes'
);
// Returns "data:image/png;base64,..." or null

// Image-to-image portrait (with reference image)
const dataUri = await generatePortrait('Repaint in watercolor style', [
  { text: 'Repaint in watercolor style' },
  { inlineData: { mimeType: 'image/png', data: base64ImageData } }
]);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | Text description of the portrait |
| `parts` | `any[]` | Optional content parts array (for image-to-image mode) |
| **Returns** | `Promise<string \| null>` | Base64 data URI on success, `null` if no image produced |

**Used by:** `CharacterCreationWizard` (forge step), `PortraitGenerator`, `QuickRollModal`

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

---

## 🔥 Firestore Service (`lib/firestore.ts`)

The Firestore service module handles all Cloud Firestore operations for character persistence.

### `subscribeUserCharacters(uid, onData, onError?)`

Subscribes to a user's characters in real-time via `onSnapshot`.

```typescript
import { subscribeUserCharacters } from '../lib/firestore';

const unsubscribe = subscribeUserCharacters(
  user.uid,
  (chars) => setCharacters(chars),
  (err) => console.error(err),
);
// Call unsubscribe() to stop listening
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `uid` | `string` | Firebase Auth UID |
| `onData` | `(chars: CharacterData[]) => void` | Callback with updated characters array |
| `onError` | `(err: Error) => void` | Optional error handler |
| **Returns** | `Unsubscribe` | Function to stop the listener |

**Query:** `where('ownerUid', '==', uid)` + `orderBy('updatedAt', 'desc')`

---

### `saveCharacter(char)`

Saves or updates a character document. **Debounced** (500ms) to prevent excessive writes during rapid gameplay changes.

```typescript
import { saveCharacter } from '../lib/firestore';

await saveCharacter({ ...character, updatedAt: Date.now() });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `char` | `CharacterData` | Full character data (must include `id` and `ownerUid`) |
| **Returns** | `Promise<void>` | Resolves when write completes |

**Behavior:** Uses `setDoc` with `{ merge: true }`. Warns in console if document size exceeds 800KB (Firestore limit is 1MB).

---

### `deleteCharacter(charId)`

Deletes a character document and cancels any pending debounced write.

```typescript
import { deleteCharacter } from '../lib/firestore';

await deleteCharacter('char-uuid-123');
```

---

### `migrateLocalCharacters(uid, chars)`

Batch-writes an array of local characters to Firestore, setting `ownerUid` on each.

```typescript
import { migrateLocalCharacters } from '../lib/firestore';

await migrateLocalCharacters(user.uid, localCharacters);
```

Used by the migration prompt when a Google user first signs in and has existing localStorage characters.

---

## 📦 Character Context (`contexts/CharacterContext.tsx`)

The `CharacterProvider` manages all character state and provides a unified API regardless of storage backend.

### `useCharacters()` Hook

```typescript
import { useCharacters } from '../contexts/CharacterContext';

const {
  characters,           // CharacterData[]
  activeCharacter,      // CharacterData | null
  activeCharacterId,    // string | null
  setActiveCharacterId, // (id: string | null) => void
  createCharacter,      // (char: CharacterData) => void
  updateCharacter,      // (partial: Partial<CharacterData>) => void
  updatePortrait,       // (url: string) => void
  deleteCharacter,      // (id: string) => void
  isCloudUser,          // boolean — true if using Firestore
  isLoading,            // boolean — true while initial data loads
  pendingMigration,     // CharacterData[] | null — local chars awaiting import
  acceptMigration,      // () => Promise<void>
  dismissMigration,     // () => void
} = useCharacters();
```

**Dual-mode behavior:**
- **Google users** (`isCloudUser === true`): All CRUD operations write to Firestore. State updates come from `onSnapshot` listener.
- **Guest users** (`isCloudUser === false`): All CRUD operations write to localStorage. State managed locally.
