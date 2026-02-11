
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Creates a chat session with a specific system instruction.
 */
export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  const ai = getAI();
  // Fix: Move 'history' from 'config' to the root level of ai.chats.create parameters.
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
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
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.",
      ...config,
    },
  });
  return response.text;
};
