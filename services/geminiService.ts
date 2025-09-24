
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<{ imageData: string; text: string | null; mimeType: string; } | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let newImageData: string | null = null;
    let newMimeType: string = 'image/png';
    let newText: string | null = null;

    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                newImageData = part.inlineData.data;
                newMimeType = part.inlineData.mimeType;
            } else if (part.text) {
                newText = part.text;
            }
        }
    }

    if (newImageData) {
        return { imageData: newImageData, text: newText, mimeType: newMimeType };
    }
    
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI Generation Failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI image generation.");
  }
}
