import { GoogleGenAI, Type } from "@google/genai";
import { TransformationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transformText = async (text: string): Promise<TransformationResult> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for text transformation

  const response = await ai.models.generateContent({
    model: modelId,
    contents: text,
    config: {
      systemInstruction: `
        You are an AI text transformation engine for 'Text Magic Lite'.
        Your task is to take any input text and return a JSON object with exactly three transformations:
        1. "summary": A concise 1-line summary.
        2. "emoji_version": The text converted into a fun, emoji-heavy style.
        3. "formal_version": The text rewritten in a professional, formal tone.
        
        Ensure the output is strictly valid JSON matching the schema.
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A short 1-line summary" },
          emoji_version: { type: Type.STRING, description: "Fun emoji version" },
          formal_version: { type: Type.STRING, description: "Professional formal version" },
        },
        required: ["summary", "emoji_version", "formal_version"],
      },
    },
  });

  const responseText = response.text;

  if (!responseText) {
    throw new Error("No response received from Gemini.");
  }

  try {
    return JSON.parse(responseText) as TransformationResult;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Received invalid JSON from the model.");
  }
};