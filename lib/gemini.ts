
import { GoogleGenAI } from "@google/genai";
import { compressPortrait } from "../utils";

/** Primary text model — change here to update everywhere that uses this module. */
export const TEXT_MODEL = 'gemini-2.5-flash';

/** Image generation model — change here to update everywhere. */
export const IMAGE_MODEL = 'gemini-2.5-flash-image';

/** Force the SDK to use the correct API endpoint in every environment. */
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  console.log('[Gemini] getAI() called');
  console.log('[Gemini] API key present:', !!apiKey, '| length:', apiKey?.length, '| first 8:', apiKey?.substring(0, 8));
  console.log('[Gemini] baseUrl:', GEMINI_BASE_URL);
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    const msg = `Gemini API Key is missing or empty. API_KEY=${typeof process.env.API_KEY} GEMINI_API_KEY=${typeof process.env.GEMINI_API_KEY}`;
    console.error('[Gemini]', msg);
    throw new Error(msg);
  }
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { baseUrl: GEMINI_BASE_URL },
  });
  console.log('[Gemini] GoogleGenAI created successfully');
  return ai;
};

/**
 * Creates a chat session with a specific system instruction.
 */
export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  const ai = getAI();
  return ai.chats.create({
    model: TEXT_MODEL,
    history: history,
    config: {
      systemInstruction,
    }
  });
};

/**
 * Simple text generation with optional JSON response schema.
 */
export const generateWithContext = async (prompt: string, config: any = {}) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.",
      ...config,
    },
  });
  return response.text;
};

/**
 * Generate a portrait image using the image model.
 * Returns a base64 data URI on success, or null if no image was produced.
 */
export const generatePortrait = async (prompt: string, parts?: any[]): Promise<string | null> => {
  const ai = getAI();
  const contentParts = parts || [{ text: prompt }];
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: contentParts },
    config: {
      responseModalities: ['Text', 'Image'],
    },
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const raw = `data:image/png;base64,${part.inlineData.data}`;
        return compressPortrait(raw);
      }
    }
  }
  return null;
};
