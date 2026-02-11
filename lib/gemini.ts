/**
 * Centralized Gemini AI Client with PDF Context Caching
 * 
 * This module provides a shared AI client that leverages Google's Gemini
 * Context Caching to ground all AI responses in the actual D&D 5e reference
 * documents (PHB, DMG, MM, Basic Rules).
 * 
 * Architecture:
 *   1. File URIs (from upload-pdfs.js) are read from env vars at build time
 *   2. On first AI call, a CachedContent is created referencing those files
 *   3. All text-based AI components share the same cache for accurate answers
 *   4. Image generation components bypass caching (not supported by image models)
 * 
 * The cache lives on Google's servers with a configurable TTL.
 * No vector DB, no backend, no additional infrastructure required.
 */

import { GoogleGenAI } from "@google/genai";
import type { Content, Part } from "@google/genai";

// ==========================================
// Configuration
// ==========================================

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || '';

// Primary model for text generation with context caching
const CACHED_MODEL = 'gemini-3-flash-preview';

// Fallback model when caching is unavailable
const FALLBACK_MODEL = 'gemini-3-flash-preview';

// Cache TTL — how long the cached context persists on Google's servers
const CACHE_TTL = '3600s'; // 1 hour

// File URIs injected at build time from .env via Vite
const FILE_URIS = {
  PHB: process.env.GEMINI_FILE_URI_PHB || '',
  DMG: process.env.GEMINI_FILE_URI_DMG || '',
  MM: process.env.GEMINI_FILE_URI_MM || '',
  BASIC: process.env.GEMINI_FILE_URI_BASIC || '',
};

// System instruction for D&D context
const DND_SYSTEM_INSTRUCTION = `You are an expert Dungeon Master and rules authority for Dungeons & Dragons 5th Edition. You have access to the official reference documents including the Player's Handbook, Dungeon Master's Guide, Monster Manual, and Basic Rules.

CORE DIRECTIVES:
- Answer questions using the provided reference documents as your primary source of truth.
- When citing rules, reference the specific book and page number when possible (e.g., "PHB p.72").
- If the reference documents don't cover a topic, clearly state that and provide your best knowledge.
- Be precise about game mechanics: spell slots, action economy, damage types, conditions, etc.
- Distinguish between RAW (Rules As Written) and common house rules.

FORMATTING RULES:
- Use **Markdown** for all responses.
- Use **Bold** for key terms, dice rolls (e.g., **1d6**), and mechanic names.
- Use tables when listing item stats, spell details, or level progression.
- Use bullet points for lists of properties or options.
- Be concise but thorough — players need accurate info quickly during sessions.`;

// ==========================================
// Singleton State
// ==========================================

let aiClient: GoogleGenAI | null = null;
let cachedContentName: string | null = null;
let cacheCreationPromise: Promise<string | null> | null = null;
let cacheExpiry: number = 0;

// ==========================================
// Core Functions
// ==========================================

/**
 * Returns the shared GoogleGenAI client instance.
 */
export function getAI(): GoogleGenAI {
  if (!aiClient) {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
    }
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

/**
 * Checks whether PDF file URIs are configured.
 */
export function hasReferenceDocsConfigured(): boolean {
  return !!(FILE_URIS.PHB || FILE_URIS.BASIC);
}

/**
 * Returns the list of configured file URIs as Part objects for the cache.
 */
function getFileDataParts(): Part[] {
  const parts: Part[] = [];

  for (const [label, uri] of Object.entries(FILE_URIS)) {
    if (uri) {
      parts.push({
        fileData: {
          fileUri: uri,
          mimeType: 'application/pdf',
        },
      } as Part);
    }
  }

  return parts;
}

/**
 * Creates or retrieves the cached content reference.
 * Returns the cache name string, or null if caching is unavailable.
 * 
 * This function is idempotent and handles concurrent calls safely.
 */
async function ensureCache(): Promise<string | null> {
  // No file URIs configured — caching not possible
  if (!hasReferenceDocsConfigured()) {
    return null;
  }

  // Cache still valid
  if (cachedContentName && Date.now() < cacheExpiry) {
    return cachedContentName;
  }

  // Another call is already creating the cache — wait for it
  if (cacheCreationPromise) {
    return cacheCreationPromise;
  }

  // Create new cache
  cacheCreationPromise = createCache();
  const result = await cacheCreationPromise;
  cacheCreationPromise = null;
  return result;
}

async function createCache(): Promise<string | null> {
  try {
    const ai = getAI();
    const fileParts = getFileDataParts();

    if (fileParts.length === 0) {
      console.warn('[Gemini] No file URIs configured — running without PDF context');
      return null;
    }

    console.log(`[Gemini] Creating cached context with ${fileParts.length} reference document(s)...`);

    const cache = await ai.caches.create({
      model: CACHED_MODEL,
      config: {
        contents: [{
          role: 'user',
          parts: fileParts,
        }] as Content[],
        systemInstruction: DND_SYSTEM_INSTRUCTION,
        ttl: CACHE_TTL,
      },
    });

    cachedContentName = cache.name || null;

    // Track expiry locally (parse TTL seconds, subtract 60s buffer)
    const ttlSeconds = parseInt(CACHE_TTL) || 3600;
    cacheExpiry = Date.now() + (ttlSeconds - 60) * 1000;

    console.log(`[Gemini] Cache created: ${cachedContentName}`);
    console.log(`[Gemini] Cache expires in ~${ttlSeconds / 60} minutes`);

    return cachedContentName;
  } catch (err) {
    console.error('[Gemini] Failed to create cache:', err);
    cachedContentName = null;
    cacheExpiry = 0;
    return null;
  }
}

// ==========================================
// Public API — Used by Components
// ==========================================

/**
 * Generate content with PDF context caching.
 * Falls back gracefully to uncached calls if caching is unavailable.
 * 
 * @param prompt - The user's prompt / question
 * @param options - Optional overrides for system instruction, response format, etc.
 * @returns The generated text response
 */
export async function generateWithContext(
  prompt: string,
  options?: {
    systemInstruction?: string;
    responseMimeType?: string;
  }
): Promise<string> {
  const ai = getAI();
  const cacheName = await ensureCache();

  if (cacheName) {
    // Cached path — reference documents are in context
    const response = await ai.models.generateContent({
      model: CACHED_MODEL,
      contents: prompt,
      config: {
        cachedContent: cacheName,
        ...(options?.responseMimeType && { responseMimeType: options.responseMimeType }),
      },
    });
    return response.text || '';
  } else {
    // Fallback — no PDF context, use model's training knowledge
    const response = await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents: prompt,
      config: {
        systemInstruction: options?.systemInstruction || DND_SYSTEM_INSTRUCTION,
        ...(options?.responseMimeType && { responseMimeType: options.responseMimeType }),
      },
    });
    return response.text || '';
  }
}

/**
 * Create a chat session with PDF context caching.
 * Used by AskDMModal for multi-turn conversations.
 * 
 * @param history - Previous conversation messages
 * @param systemInstruction - Optional override (used only in fallback mode)
 * @returns A chat session object
 */
export async function createChatWithContext(
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  systemInstruction?: string,
) {
  const ai = getAI();
  const cacheName = await ensureCache();

  if (cacheName) {
    return ai.chats.create({
      model: CACHED_MODEL,
      config: {
        cachedContent: cacheName,
      },
      history,
    });
  } else {
    return ai.chats.create({
      model: FALLBACK_MODEL,
      config: {
        systemInstruction: systemInstruction || DND_SYSTEM_INSTRUCTION,
      },
      history,
    });
  }
}

/**
 * Pre-warm the cache on app initialization.
 * Call this early (e.g., in App.tsx useEffect) so the cache is ready
 * before the user opens any AI feature.
 * 
 * This is fire-and-forget — failures are logged but don't block the app.
 */
export async function initializeCache(): Promise<void> {
  if (!API_KEY || !hasReferenceDocsConfigured()) {
    console.log('[Gemini] Skipping cache init — no API key or file URIs configured');
    return;
  }

  try {
    await ensureCache();
  } catch (err) {
    console.warn('[Gemini] Cache pre-warm failed (will retry on first use):', err);
  }
}

/**
 * Get cache status for display in UI (e.g., settings or status indicator).
 */
export function getCacheStatus(): {
  configured: boolean;
  active: boolean;
  model: string;
  documentCount: number;
  expiresIn: number | null;
} {
  const documentCount = Object.values(FILE_URIS).filter(Boolean).length;
  const active = !!(cachedContentName && Date.now() < cacheExpiry);
  const expiresIn = active ? Math.max(0, Math.round((cacheExpiry - Date.now()) / 1000)) : null;

  return {
    configured: hasReferenceDocsConfigured(),
    active,
    model: active ? CACHED_MODEL : FALLBACK_MODEL,
    documentCount,
    expiresIn,
  };
}
