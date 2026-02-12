
import { getAuth } from 'firebase/auth';
import { compressPortrait } from "../utils";

/** Primary text model — change here to update everywhere that uses this module. */
export const TEXT_MODEL = 'gemini-2.5-flash';

/** Image generation model — change here to update everywhere. */
export const IMAGE_MODEL = 'gemini-2.5-flash-image';

/**
 * Get the current user's Firebase ID token for authenticating with the proxy.
 * Returns null if the user is not signed in or token retrieval fails.
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
};

/**
 * Make an authenticated request to our API proxy.
 * All AI calls go through our server — the API key never touches the browser.
 */
const proxyFetch = async (endpoint: string, body: Record<string, unknown>): Promise<any> => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('You must be signed in to use AI features.');
  }

  const response = await fetch(`/api/gemini/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    const data = await response.json();
    throw new Error(data.message || 'Slow down, adventurer! The Weave needs a moment to settle.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'AI request failed' }));
    throw new Error(data.error || `AI request failed (${response.status})`);
  }

  return response.json();
};

/**
 * Creates a stateless chat interaction with the AI.
 * Sends the full history each time; the proxy handles the Gemini chat session.
 * Returns an object compatible with the old chat.sendMessage() pattern.
 */
export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  // Return a chat-like object with a sendMessage method
  return {
    sendMessage: async ({ message }: { message: string }) => {
      const data = await proxyFetch('chat', {
        message,
        history,
        systemInstruction,
      });
      return { text: data.text || null };
    },
  };
};

/**
 * Simple text generation with optional JSON response schema.
 */
export const generateWithContext = async (prompt: string, config: any = {}) => {
  const data = await proxyFetch('generate', { prompt, config });
  return data.text;
};

/**
 * Generate a portrait image using the image model.
 * Returns a base64 data URI on success, or null if no image was produced.
 * Portrait compression is handled client-side after receiving the proxy response.
 */
export const generatePortrait = async (prompt: string, parts?: any[]): Promise<string | null> => {
  const data = await proxyFetch('portrait', { prompt, parts });

  if (data.imageDataUri) {
    return compressPortrait(data.imageDataUri);
  }
  return null;
};
