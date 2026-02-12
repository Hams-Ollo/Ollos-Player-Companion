
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

/** Primary text model — change here to update everywhere that uses this module. */
const TEXT_MODEL = 'gemini-2.5-flash';

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("Gemini API Key is missing. Ensure GEMINI_API_KEY is set in your .env file.");
  }
  return new GoogleGenAI({ apiKey });
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
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      ...config,
    },
  });
  return response.text;
};
