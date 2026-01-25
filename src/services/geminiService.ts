import { GoogleGenAI } from '@google/genai';
import { ImageData, EditConfig, SystemSettings } from '../types';

// Imagem de exemplo para o modo de simulação
const MOCK_RESULT_IMAGE_URL = "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=800";

const getMockImageBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Erro ao carregar imagem mock:", e);
        return ""; 
    }
};

// Função auxiliar para obter a API Key (Prioridade: Admin Settings > Env Var)
const getApiKey = (): string => {
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Tenta ler do LocalStorage do Admin
    if (typeof window !== 'undefined') {
        try {
            const savedSettings = window.localStorage.getItem('flora-admin-settings');
            if (savedSettings) {
                const parsed: SystemSettings = JSON.parse(savedSettings);
                if (parsed.geminiApiKey && parsed.geminiApiKey.trim() !== '') {
                    apiKey = parsed.geminiApiKey;
                }
            }
        } catch (e) {
            // Ignora erro de parse
        }
    }
    return apiKey;
};

export const generateImage = async (
  imageData: ImageData,
  config: EditConfig
): Promise<ImageData> => {
  const apiKey = getApiKey();

  // --- MODO SIMULAÇÃO ---
  if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey.includes('undefined') || apiKey.trim() === '') {
      console.warn("⚠️ MODO SIMULAÇÃO: Chave de API não encontrada. Gerando resultado simulado.");
      await new Promise(resolve => setTimeout(resolve, 4000)); 
      const mockBase64 = await getMockImageBase64(MOCK_RESULT_IMAGE_URL);
      return {
          data: mockBase64 || imageData.data, 
          mimeType: "image/jpeg"
      };
  }

  // --- MODO REAL ---
  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash-image'; 

  let systemPrompt = "";
  
  // CORREÇÃO: Agora o modo Humanize TAMBÉM recebe as especificações do usuário
  if (config.mode === 'humanize') {
    systemPrompt = `REFINAMENTO FOTORREALISTA (HUMANIZAÇÃO):
    Transforme esta imagem em uma fotografia de alta resolução (8K) com realismo extremo.
    
    DIRETRIZES DE ESTILO E CONTEÚDO:
    ${config.prompt ? `O usuário solicitou especificamente: "${config.prompt}". Siga estas instruções rigorosamente para as plantas e cores.` : 'Mantenha a estrutura original, aplicando texturas realistas de plantas e iluminação natural.'}
    
    DETALHES TÉCNICOS:
    - Foque na textura natural das pétalas, folhas e materiais.
    - Aplique luz volumétrica e sombras suaves (Global Illumination).
    - Nitidez profissional e profundidade de campo cinematográfica.
    - Se for um esboço/3D simples, converta para foto real.`;
  } else {
    systemPrompt = `RE-ESTILIZAÇÃO FLORAL: 
    Modifique a área mascarada da imagem original conforme estas especificações: "${config.prompt}". 
    
    DIRETRIZES:
    - Mantenha o ambiente, iluminação e os vasos originais intactos onde não houver máscara.
    - Foque exclusivamente em trocar ou adicionar as flores e folhagens com fidelidade fotográfica absoluta. 
    - Se o usuário especificou cores (HEX) e espécies, siga rigorosamente a paleta.
    - Integração perfeita com a luz da cena original.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
          { text: systemPrompt },
        ],
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
    console.warn("⚠️ Falha na API Real. Ativando fallback de simulação.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockBase64 = await getMockImageBase64(MOCK_RESULT_IMAGE_URL);
    return {
        data: mockBase64 || imageData.data,
        mimeType: "image/jpeg"
    };
  }
};

export const describeImage = async (imageData: ImageData): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey.trim() === '') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return "Sugestão Simulada: Arranjo sofisticado de Rosas Brancas com Eucalipto e toques de Lavanda. (Modo Demo)";
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
          { text: "Identifique as flores principais nesta imagem e retorne apenas o nome delas." },
        ]
      }
    });
    return response.text?.trim() || 'Flores Identificadas';
  } catch (e) {
    console.error("Erro ao descrever imagem:", e);
    return 'Arranjo Floral (Simulado)';
  }
};
