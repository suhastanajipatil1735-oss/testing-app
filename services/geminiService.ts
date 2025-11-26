import { GoogleGenAI, Type } from "@google/genai";
import { TransformationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transformText = async (text: string): Promise<TransformationResult> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for text transformation

  const response = await ai.models.generateContent({
    model: modelId,
    contents: text,
    config: {
      systemInstruction: `You are an AI model inside a simple web app called "Text Magic Lite".
Your task is extremely simple.
Whenever the user enters any sentence, you must return the following 3 outputs in JSON format:

1. "summary" → The short 1-line summary of the user’s input.
2. "emoji_version" → Convert the sentence into an emoji-style fun version.
3. "formal_version" → Convert the sentence into a more professional and formal version.

Rules:
• Always return only JSON. No extra text.
• JSON Keys should be exactly: summary, emoji_version, formal_version
• Do not include markdown. Only plain JSON.
• The app should work even if the user inputs a small phrase or incomplete sentence.

Examples:
Input: "running late"
Output: { "summary": "User is behind schedule.", "emoji_version": "🏃‍♂️ Running late! ⏰😬", "formal_version": "I am currently running behind schedule." }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "The short 1-line summary of the user’s input." },
          emoji_version: { type: Type.STRING, description: "Convert the sentence into an emoji-style fun version." },
          formal_version: { type: Type.STRING, description: "Convert the sentence into a more professional and formal version." },
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