
import { GoogleGenAI } from '@google/genai';
import { ImageData, EditConfig } from '../types';

export const generateImage = async (
  imageData: ImageData,
  config: EditConfig
): Promise<ImageData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Flash: gemini-2.5-flash-image | Pro: gemini-3-pro-image-preview
  const modelName = config.isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  let systemPrompt = "";
  if (config.mode === 'humanize') {
    systemPrompt = "TASK: ULTIMATE PHOTO REALISM. INSTRUCTION: Transform this image into a high-end, hyper-realistic architectural photograph. Enhance lighting, textures of petals, and shadows. Do not change the layout, only increase the realism of the flowers significantly.";
  } else if (config.mode === 'create') {
    systemPrompt = `TASK: FLORAL CREATION. INSTRUCTION: Add new floral elements to the scene. Design: ${config.prompt}. Match the existing environment's lighting, perspective and camera lens perfectly.`;
  } else {
    systemPrompt = `TASK: FLORAL EDITING. INSTRUCTION: Modify the existing floral arrangement. Change to: ${config.prompt}. Keep the overall structure of the room identical, focusing on replacing the species mentioned.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
          { text: systemPrompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error('O Google não retornou resultado. Tente novamente em 1 minuto.');

    const part = candidate.content.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return {
        data: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
    
    throw new Error('O modelo não gerou uma imagem válida. Tente simplificar o pedido ou usar o Modo Flash.');
  } catch (error: any) {
    if (error.message?.includes('429')) {
      throw new Error('Limite de uso atingido. O Google bloqueou temporariamente para evitar custos. Tente novamente em 60 segundos.');
    }
    throw error;
  }
};

export const describeImage = async (imageData: ImageData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
        { text: "Describe this floral arrangement style in 5 words." },
      ]
    }
  });
  return response.text || '';
};
