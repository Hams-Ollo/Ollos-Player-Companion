import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { CharacterData } from "../types";

export const generateWithContext = async (prompt: string, config: Partial<GenerateContentParameters['config']> = {}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config
  });
  return response.text;
};

export const createChatWithContext = async (history: any[], systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
    history
  });
};