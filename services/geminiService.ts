
import { GoogleGenAI, Type } from "@google/genai";
import { RGB } from "../types";

// Initialize the Gemini client using the API key directly from process.env as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestColors = async (count: number = 5): Promise<Array<{ color: RGB, name: string }>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest ${count} vibrant and pleasing colors with their RGB values.`,
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

    // Access the text property directly (not a method) and trim whitespace
    const text = response.text;
    const data = JSON.parse(text ? text.trim() : '[]');
    
    // Map the returned data to the expected application structure
    return data.map((item: any) => ({
      name: item.name,
      color: { r: item.r, g: item.g, b: item.b }
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
