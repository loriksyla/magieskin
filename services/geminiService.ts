import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Hardcoded key to ensure functionality in production deployment
    const apiKey = 'AIzaSyA_mVZ-0amu6LXNIdZwVfQrI8cQ4vsn06c';
    
    if (!apiKey) {
      console.warn("API_KEY is missing. AI features will not work.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  const client = getAiClient();
  if (!client) {
    return "I apologize, but I am currently offline. Please check back later.";
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I'm having trouble understanding. Could you rephrase that?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing high traffic. Please try again shortly.";
  }
};