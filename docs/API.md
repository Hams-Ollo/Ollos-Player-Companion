# ⚜️ The Spellbook — API Reference ⚜️

> *"Within these pages lie the incantations that power the Companion's magic.  
> Study them carefully — a miscast spell can have... unexpected consequences."*
>
> Express API proxy, Gemini AI integration, helper functions, data schemas, and environment configuration.

---

## Chapter 1: The Gatekeeper — Express API Proxy

> *The Express server in `server/index.js` acts as the Gatekeeper between the browser and the Weave.  
> It holds the Gemini API key, verifies identity, and enforces rate limits.*

### Proxy Routes

| Route | Method | Description |
|:------|:-------|:------------|
| `/api/gemini/generate` | POST | Single-shot text generation — prompt + optional config |
| `/api/gemini/chat` | POST | Multi-turn chat — history + system instruction + message |
| `/api/gemini/portrait` | POST | Image generation via `gemini-2.5-flash-image` |
| `/api/gemini/live-token` | POST | Ephemeral token for live audio transcription |
| `/api/health` | GET | Health check, returns `{ status: 'ok' }` |

### Authentication Middleware (`server/middleware/auth.js`)

Every `/api/gemini/*` request requires a valid Firebase ID token:

```
Authorization: Bearer <firebase-id-token>
```

The middleware verifies the token against Google's Identity Toolkit REST API and caches results for 5 minutes. Unauthenticated requests receive `401`.

### Rate Limiting Middleware (`server/middleware/rateLimit.js`)

| Limit | Scope | Window |
|:------|:------|:-------|
| 20 requests/min | Per Firebase UID | Sliding window |
| 200 requests/min | Global (all users) | Sliding window |

Returns `429 Too Many Requests` with `Retry-After` header when exceeded.

---

## Chapter 2: The Weave — Gemini AI Client

> *The centralized conduit to the Weave lives in `lib/gemini.ts`.  
> All AI-powered components channel their magic through this module.*

### `generateWithContext(prompt, config?)`

*A single incantation sent to the Weave. Speak your query, and the Weave answers.*

```typescript
import { generateWithContext } from '../lib/gemini';

const result = await generateWithContext(
  'Explain the Fireball spell in D&D 5e',
  { responseMimeType: 'application/json' }  // optional
);
console.log(result); // string response
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `prompt` | `string` | The text prompt to send |
| `config` | `Partial<GenerateContentParameters['config']>` | Optional Gemini config (response format, temperature, etc.) |
| **Returns** | `string \| undefined` | Generated text response |

**Summoned by:** `LevelUpModal`, `ItemDetailModal`, `JournalDetail`, `QuickRollModal`, `CharacterCreationWizard`

---

### `createChatWithContext(history, systemInstruction)`

*Opens a persistent channel to the Weave — a two-way Sending spell.*

```typescript
import { createChatWithContext } from '../lib/gemini';

const chat = await createChatWithContext(
  [],  // previous message history
  'You are a D&D 5e Dungeon Master. Answer rules questions accurately.'
);

const response = await chat.sendMessage({ message: 'What does Magic Missile do?' });
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `history` | `any[]` | Array of previous chat messages |
| `systemInstruction` | `string` | System prompt defining AI behavior |
| **Returns** | `Chat` | Gemini chat session object |

**Summoned by:** `AskDMModal`

---

## Chapter 3: Portrait Generation

> *"The Weave can paint as well as it can speak."*

### `generatePortrait(prompt, parts?)`

*Conjures an AI portrait using `gemini-2.5-flash-image`. All portrait generation is channeled through this shared incantation in `lib/gemini.ts`.*

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
|:----------|:-----|:------------|
| `prompt` | `string` | Text description of the portrait |
| `parts` | `any[]` | Optional content parts array (for image-to-image mode) |
| **Returns** | `Promise<string \| null>` | Base64 data URI on success, `null` if no image produced |

**Summoned by:** `CharacterCreationWizard` (forge step), `PortraitGenerator`, `QuickRollModal`

---

## Chapter 4: Rate Limiting

> *"The Weave resists those who draw upon it too hastily."*

Rate limiting operates at **two levels**:

### Server-Side (Primary)

The Express proxy enforces per-user (20/min) and global (200/min) rate limits via `server/middleware/rateLimit.js`. These are tamper-proof — the user cannot bypass them.

### Client-Side (UX Guard)

### `checkRateLimit()`

```typescript
import { checkRateLimit } from '../utils';

checkRateLimit(); // throws if called within 2 seconds of last call
```

Enforces a 2-second cooldown between AI requests. State is stored in a module-level closure — not in `localStorage` — so it cannot be tampered with from the console.

**Throws:** `Error("Slow down, adventurer! The Weave needs a moment to settle.")`

---

## Chapter 5: The Artificer's Tools (`utils.ts`)

> *"Every adventurer carries a toolkit. These are the shared utility functions  
> that keep the Companion's magic running smoothly."*

### `calculateModifier(score)`

*The fundamental formula, as old as the game itself:*

```typescript
calculateModifier(16); // → 3
calculateModifier(8);  // → -1
```

Standard D&D modifier formula: `Math.floor((score - 10) / 2)`

---

### `recalculateCharacterStats(data)`

*Recomputes all derived attributes from current character state — like a Greater Restoration for your stat block:*

```typescript
import { recalculateCharacterStats } from '../utils';

const updated = recalculateCharacterStats(character);
// updated.ac — recalculated from equipped armor
// updated.attacks — rebuilt from equipped weapons
// updated.passivePerception — 10 + perception modifier
// updated.initiative — DEX modifier
```

**AC Calculation — The Armor Table:**

| Armor | Formula |
|:------|:--------|
| Unarmored | `10 + DEX mod` |
| Leather | `11 + DEX mod` |
| Studded Leather | `12 + DEX mod` |
| Chain Shirt | `13 + min(2, DEX mod)` |
| Scale Mail | `14 + min(2, DEX mod)` |
| Plate | `18` |
| Shield | `+2` |

**Attack Generation:** Auto-generates attack entries from equipped weapons, detecting finesse/ranged properties and applying the correct ability modifier + proficiency bonus.

---

## Chapter 6: The Compendium Helpers (`constants.tsx`)

> *"The Compendium contains all the sacred tables of the PHB.  
> These helper functions translate them into actionable magic."*

### Spell Slot Functions

#### `getSpellSlotsForLevel(className, charLevel)`

```typescript
getSpellSlotsForLevel('Wizard', 3);
// → [{ level: 1, max: 4 }, { level: 2, max: 2 }]

getSpellSlotsForLevel('Warlock', 5);
// → [{ level: 3, max: 2 }]  (Pact Magic — all slots same level)

getSpellSlotsForLevel('Fighter', 1);
// → []  (non-caster — no slots granted)
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

*For "known" casters only (Bard, Ranger, Sorcerer, Warlock). Returns 0 for prepared casters.*

```typescript
getSpellsKnownCount('Bard', 1);     // → 4
getSpellsKnownCount('Sorcerer', 5); // → 6
getSpellsKnownCount('Cleric', 5);   // → 0 (prepared caster — consults their deity)
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
isASILevel('Fighter', 6); // → true  (Fighters get extra ASIs — lucky them)
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
getSneakAttackDice(20); // → "10d6" (devastating)
```

---

### Race & Class Lookups

| Function | Signature | Returns |
|:---------|:----------|:--------|
| `getAllRaceOptions()` | `() → string[]` | Flat list of all races including subraces |
| `getRaceSpeed(name)` | `(string) → number` | Walking speed (default 30) |
| `getClassData(name)` | `(string) → ClassOption \| undefined` | Full class definition |
| `getRacialBonus(race, stat)` | `(string, StatKey) → number` | Ability score bonus |
| `getRacialBonusDisplay(race)` | `(string) → string` | Formatted string like `"+2 DEX, +1 WIS"` |
| `getRaceTraits(race)` | `(string) → RaceTraitData \| undefined` | Traits, languages, darkvision, racial spells |

---

## Chapter 7: Data Schemas

> *"Know the shape of your data as well as you know the shape of your sword."*

### `CharacterData`

The core data model. See `types.ts` for the full interface. Key nested types:

| Type | Fields |
|:-----|:-------|
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
  memberUids: string[];       // denormalized for array-contains queries
  members: { uid: string; name: string }[];
  status: 'active' | 'archived';
  currentSessionNumber: number;
  settings: CampaignSettings;
  createdAt: number;
  updatedAt: number;
}
```

---

## Chapter 8: Environment Variables

> *"Guard these secrets as you would a dragon's hoard."*

### Server-Side Only (never in browser bundle)

| Variable | Required | Description |
|:---------|:---------|:------------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key — read by the Express proxy server only |
| `PORT` | ❌ | Express server port (default: `8080`, dev: `3001`) |
| `GEMINI_FILE_URI_BASIC` | ❌ | Gemini File API URI for Basic Rules PDF |
| `GEMINI_FILE_URI_DMG` | ❌ | Gemini File API URI for DMG PDF |
| `GEMINI_FILE_URI_MM` | ❌ | Gemini File API URI for Monster Manual PDF |
| `GEMINI_FILE_URI_PHB` | ❌ | Gemini File API URI for PHB PDF |

### Client-Side (baked into JS bundle at build time)

| Variable | Required | Description |
|:---------|:---------|:------------|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |

### How Env Vars Are Injected

- **`GEMINI_API_KEY`** → Read by `server/index.js` at runtime via `process.env`. Never exposed to Vite or the browser.
- **`GEMINI_FILE_URI_*`** → Read by `server/index.js` at runtime. D&D PDF grounding URIs for context caching.
- **`VITE_*`** → Baked into the client JS bundle by Vite at build time via `import.meta.env.VITE_*`.
- **In production:** `GEMINI_API_KEY` is stored in Google Cloud Secret Manager and mounted as a Cloud Run environment variable.

---

## Chapter 9: The Vault — Firestore Service (`lib/firestore.ts`)

> *"All roads lead to the Vault. Here lie the functions that store and  
> retrieve heroes from the eternal Firestore."*

### `subscribeUserCharacters(uid, onData, onError?)`

*Establishes a real-time scrying link to a user's characters:*

```typescript
import { subscribeUserCharacters } from '../lib/firestore';

const unsubscribe = subscribeUserCharacters(
  user.uid,
  (chars) => setCharacters(chars),
  (err) => console.error(err),
);
// Call unsubscribe() to sever the connection
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `uid` | `string` | Firebase Auth UID |
| `onData` | `(chars: CharacterData[]) => void` | Callback with updated characters array |
| `onError` | `(err: Error) => void` | Optional error handler |
| **Returns** | `Unsubscribe` | Function to stop the listener |

**Query:** `where('ownerUid', '==', uid)` + `orderBy('updatedAt', 'desc')`

---

### `saveCharacter(char)`

*Inscribes a character into the Vault. **Debounced** (500ms) to prevent excessive writes during the heat of battle.*

```typescript
import { saveCharacter } from '../lib/firestore';

await saveCharacter({ ...character, updatedAt: Date.now() });
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `char` | `CharacterData` | Full character data (must include `id` and `ownerUid`) |
| **Returns** | `Promise<void>` | Resolves when write completes |

**Behavior:** Uses `setDoc` with `{ merge: true }`. Warns in console if document size exceeds 800KB (Firestore limit is 1MB).

---

### `deleteCharacter(charId)`

*Banishes a character from the Vault. Cancels any pending debounced writes.*

```typescript
import { deleteCharacter } from '../lib/firestore';

await deleteCharacter('char-uuid-123');
```

---

### `migrateLocalCharacters(uid, chars)`

*Batch-writes an array of local characters to Firestore, inscribing `ownerUid` on each.*

```typescript
import { migrateLocalCharacters } from '../lib/firestore';

await migrateLocalCharacters(user.uid, localCharacters);
```

Used by the migration banner when a Google user first signs in and has existing localStorage characters.

---

## Chapter 10: The Character Vault (`contexts/CharacterContext.tsx`)

> *"The Vault knows all. It manages every hero, whether stored in the cloud  
> or scratched onto parchment (localStorage)."*

### `useCharacters()` Hook

```typescript
import { useCharacters } from '../contexts/CharacterContext';

const {
  characters,           // CharacterData[] — all heroes in the vault
  activeCharacter,      // CharacterData | null — currently selected hero
  activeCharacterId,    // string | null
  setActiveCharacterId, // (id: string | null) => void
  createCharacter,      // (char: CharacterData) => void
  updateCharacter,      // (partial: Partial<CharacterData>) => void — updates active character
  updateCharacterById,  // (id: string, partial: Partial<CharacterData>) => void — updates any character by ID
  updatePortrait,       // (url: string) => void
  deleteCharacter,      // (id: string) => void
  isCloudUser,          // boolean — true if using Firestore
  isLoading,            // boolean — true while initial data loads
  pendingMigration,     // CharacterData[] | null — local chars awaiting import
  acceptMigration,      // () => Promise<void>
  dismissMigration,     // () => void
  saveError,            // string | null — any Firestore write error
} = useCharacters();
```

**Dual-mode behavior:**
- **Google Users** (`isCloudUser === true`): All CRUD operations write to Firestore. State updates flow from the `onSnapshot` listener.
- **Guest Adventurers** (`isCloudUser === false`): All CRUD operations write to localStorage. State managed locally.

---

## Chapter 11: The Campaign Ledger (`lib/campaigns.ts`)

> *"No adventurer fights alone. The Campaign Ledger tracks every party,  
> every alliance, and every invitation across the realm."*

### Campaign CRUD

| Function | Signature | Description |
|:---------|:----------|:------------|
| `createCampaign(data)` | `(Partial<Campaign>) → Promise<Campaign>` | Creates a new campaign, auto-generates a 6-char join code, adds creator as DM member |
| `joinCampaignByCode(code, uid, displayName, characterId?)` | `(...) → Promise<Campaign>` | Joins an existing campaign via shareable code |
| `leaveCampaign(campaignId, uid)` | `(string, string) → Promise<void>` | Removes the user from a campaign's members |
| `updateCampaign(campaignId, data)` | `(string, Partial<Campaign>) → Promise<void>` | Updates campaign fields (name, description, settings) |
| `updateMemberCharacter(campaignId, uid, characterId)` | `(string, string, string) → Promise<void>` | Updates which character a player is using in a campaign |

### Invite Functions

| Function | Signature | Description |
|:---------|:----------|:------------|
| `createInvite(invite)` | `(Partial<CampaignInvite>) → Promise<CampaignInvite>` | Creates an email-based invite for a campaign |
| `acceptInvite(inviteId, uid, displayName, characterId?)` | `(...) → Promise<void>` | Accepts a pending invite, adds user to campaign |
| `declineInvite(inviteId)` | `(string) → Promise<void>` | Declines and removes a pending invite |

### Real-time Subscriptions

| Function | Signature | Description |
|:---------|:----------|:------------|
| `subscribeUserCampaigns(uid, onData)` | `(string, callback) → Unsubscribe` | Listens to all campaigns the user belongs to |
| `subscribeToMembers(campaignId, onData)` | `(string, callback) → Unsubscribe` | Listens to the members subcollection of a campaign |
| `subscribeToMyInvites(email, onData)` | `(string, callback) → Unsubscribe` | Listens for pending invites addressed to the user's email |

### DM Tools

| Function | Signature | Description |
|:---------|:----------|:------------|
| `subscribeToDMWhispers(campaignId, onData)` | `(string, callback) → Unsubscribe` | Listens for DM whisper messages |
| `subscribeToRollRequests(campaignId, onData)` | `(string, callback) → Unsubscribe` | Listens for DM-requested rolls |
| `addEncounter(campaignId, encounter)` | `(string, Encounter) → Promise<void>` | Adds an encounter to the campaign |
| `addSessionNote(campaignId, note)` | `(string, SessionNote) → Promise<void>` | Adds a session note entry |

---

## Chapter 12: The Campaign Keeper (`contexts/CampaignContext.tsx`)

> *"The Keeper holds the state of all campaigns,  
> providing every component with the knowledge it needs."*  
> *Now also syncs `CharacterData.campaign`/`campaignId` on join, leave, and character reassignment.*

### `useCampaign()` Hook

```typescript
import { useCampaign } from '../contexts/CampaignContext';

const {
  campaigns,              // Campaign[] — all campaigns the user belongs to
  activeCampaign,         // Campaign | null — currently selected campaign
  setActiveCampaignId,    // (id: string | null) => void
  members,                // CampaignMember[] — members of the active campaign
  myRole,                 // 'dm' | 'player' | null
  isDM,                   // boolean — true if current user is DM of active campaign
  pendingInvites,         // CampaignInvite[] — invites awaiting user response
  createCampaign,         // (data: Partial<Campaign>) => Promise<Campaign>
  joinByCode,             // (code: string, characterId?: string) => Promise<void>
  acceptInvite,           // (inviteId: string, characterId?: string) => Promise<void>
  declineInvite,          // (inviteId: string) => Promise<void>
  sendInvite,             // (email: string) => Promise<void>
  updateMemberCharacter,  // (characterId: string) => Promise<void>
  leaveCampaign,          // () => Promise<void>
  isLoading,              // boolean
} = useCampaign();
```

**Key behaviors:**
- Subscribes to the user's campaigns on mount, updates in real-time
- When `activeCampaignId` changes, subscribes to that campaign's `members` subcollection
- `isDM` is derived from comparing `activeCampaign.dmId` to the current user's UID
- `pendingInvites` listens on the user's email for incoming campaign invites
- `sendInvite` creates an invite record addressed to the given email for the active campaign
- `joinByCode` syncs `CharacterData.campaign` and `campaignId` on the enrolled character
- `leaveCampaign` clears `campaign`/`campaignId` on all of the user's characters in that campaign
- `updateMemberCharacter` updates the current user's character assignment in the active campaign

---

<p align="center"><em>⚔️ Thus concludes the Spellbook. Wield these incantations wisely. ⚔️</em></p>
