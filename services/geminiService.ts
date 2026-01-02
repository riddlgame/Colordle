
import { GoogleGenAI, Type } from "@google/genai";
import { RGB } from "../types";

export const suggestColors = async (count: number = 5): Promise<Array<{ color: RGB, name: string }>> => {
  try {
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : null;
    
    if (!apiKey) {
      console.warn("Colordle AI: API Key missing. Skipping suggestion.");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest ${count} vibrant and pleasing colors with their RGB values. Return ONLY a JSON array of objects with keys "name", "r", "g", "b".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              r: { type: Type.INTEGER },
              g: { type: Type.INTEGER },
              b: { type: Type.INTEGER },
            },
            required: ["name", "r", "g", "b"],
          }
        }
      }
    });

    const text = response.text;
    const data = JSON.parse(text ? text.trim() : '[]');
    
    return data.map((item: any) => ({
      name: item.name,
      color: { r: item.r, g: item.g, b: item.b }
    }));
  } catch (error) {
    console.error("Colordle AI: Suggestion failed", error);
    return [];
  }
};
