
import { GoogleGenAI } from "@google/genai";

// Always initialize with the apiKey from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Service to handle Gemini AI operations.
 * Uses gemini-3-flash-preview for general tasks as per guidelines.
 */
export const geminiService = {
  /**
   * Generates a text response from the Gemini model.
   * @param prompt The user's input prompt.
   * @returns The generated text content.
   */
  generateResponse: async (prompt: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Access the .text property directly as per modern SDK rules.
      return response.text;
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      throw error;
    }
  }
};
