import { GoogleGenAI, Modality, GenerateContentResponse, FinishReason } from '@google/genai';
import { ImageData, EditMode } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });
const imageEditModel = 'gemini-2.5-flash-image-preview';
const textModel = 'gemini-2.5-flash';

const getSystemInstruction = (mode: EditMode): string => {
  if (mode === 'edit') {
    return `Você é uma IA especialista em paisagismo e design floral para eventos como festas, buffets, casamentos, aniversários e festas de debutantes. Sua especialidade é harmonizar espaços usando flores. Como um assistente de edição de fotos de alta precisão, sua única tarefa é aplicar as edições solicitadas. Mantenha 100% da imagem original intacta, exceto pelas áreas especificamente mencionadas no comando. Não adicione, remova ou altere NADA que não tenha sido explicitamente pedido. Priorize o fotorrealismo, a iluminação consistente e as sombras corretas.`;
  }
  // mode === 'create'
  return `Você é um assistente de design de interiores e eventos. Sua tarefa é adicionar de forma fotorrealista os objetos descritos no prompt à imagem fornecida. Integre os novos elementos perfeitamente, prestando atenção à perspectiva, escala, iluminação e sombras da cena original. Não altere os elementos que já existem na imagem original. Se o prompt for complexo, tente posicionar os múltiplos itens de forma lógica no espaço.`;
};

export const generateImage = async (
  imageData: ImageData,
  prompt: string,
  mode: EditMode,
  isHighQuality: boolean
): Promise<ImageData> => {
  try {
    const systemInstruction = getSystemInstruction(mode);
    let fullPrompt = `${systemInstruction}\n\nComando do usuário: "${prompt}"`;
    
    if (isHighQuality) {
        fullPrompt += "\n\nInstrução de Qualidade: Gere a imagem resultante com o máximo de detalhes, clareza e fidelidade de textura possíveis, como se fosse capturada por uma câmera profissional. Evite artefatos de compressão ou aparência borrada.";
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: imageEditModel,
      contents: {
        parts: [
          { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
          { text: fullPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        if (finishReason === 'SAFETY') {
            throw new Error('A imagem não foi gerada devido aos filtros de segurança da IA. Tente um comando mais simples ou uma imagem diferente.');
        }
        throw new Error(`A geração foi interrompida por um motivo inesperado: ${finishReason}.`);
    }

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }

    throw new Error('Nenhuma imagem foi gerada pela IA. Tente um comando diferente.');

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message && error.message.includes('429')) {
         throw new Error('Você atingiu o limite de uso da API. Por favor, aguarde um minuto e tente novamente.');
    }
    throw new Error(error.message || 'Falha ao gerar imagem: ocorreu um erro desconhecido.');
  }
};

export const describeImage = async (imageData: ImageData): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageData.data,
                            mimeType: imageData.mimeType,
                        },
                    },
                    { text: "Você é um designer floral especialista. Descreva esta imagem em um prompt conciso e eficaz que possa ser usado para recriar este estilo de decoração ou arranjo floral. Foque nos elementos principais, cores e estilo." },
                ]
            }
        });
        return response.text.trim();
    } catch(error: any) {
        console.error("Error describing image:", error);
        if (error.message && error.message.includes('429')) {
             throw new Error('Você atingiu o limite de uso da API. Por favor, aguarde um minuto e tente novamente.');
        }
        throw new Error(error.message || 'Falha ao descrever a imagem.');
    }
};