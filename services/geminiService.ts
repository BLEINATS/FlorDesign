
import { GoogleGenAI } from '@google/genai';
import { ImageData, EditConfig } from '../types';

export const generateImage = async (
  imageData: ImageData,
  config: EditConfig
): Promise<ImageData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-2.5-flash-image';

  let systemPrompt = "";
  if (config.mode === 'humanize') {
    systemPrompt = "REFINAMENTO FOTORREALISTA: Aplique realismo fotográfico extremo (8K) nesta decoração floral. Foque na textura natural das pétalas, luz volumétrica e nitidez profissional.";
  } else {
    systemPrompt = `RE-ESTILIZAÇÃO FLORAL: Modifique a área mascarada da imagem original conforme estas especificações: "${config.prompt}". 
    Mantenha o ambiente e os vasos originais, focando exclusivamente em trocar ou adicionar as flores e folhagens com fidelidade fotográfica absoluta. 
    Se o usuário especificou cores e espécies, siga rigorosamente.`;
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
    if (!candidate) throw new Error('Nenhum resultado retornado pela IA.');

    const part = candidate.content.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return {
        data: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
    
    throw new Error('Falha no processamento da imagem pela IA.');
  } catch (error: any) {
    console.error("Erro Gemini API:", error);
    throw error;
  }
};

export const describeImage = async (imageData: ImageData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
          { text: "Identifique as flores principais nesta imagem e retorne apenas o nome delas (ex: Rosas Vermelhas). Se for um mix, diga 'Arranjo Misto'." },
        ]
      }
    });
    return response.text?.trim() || 'Flores';
  } catch (e) {
    return 'Rosas Brancas';
  }
};
