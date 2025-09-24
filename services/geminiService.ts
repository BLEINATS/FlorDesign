import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateImage(
  originalImage: { data: string; mimeType: string },
  prompt: string
): Promise<string> {
  try {
    // FIX: Use the 'gemini-2.5-flash-image-preview' model for image editing tasks.
    const model = 'gemini-2.5-flash-image-preview';

    // FIX: Prepare the image and text parts for the multimodal prompt.
    const imagePart = {
      inlineData: {
        data: originalImage.data,
        mimeType: originalImage.mimeType,
      },
    };
    
    // Add a strict instruction to prevent the AI from making unprompted changes.
    const instruction = `Você é um assistente de edição de fotos de alta precisão. Sua única tarefa é aplicar as edições solicitadas pelo usuário na imagem fornecida, e nada mais. Mantenha 100% da imagem original intacta, exceto pelas áreas diretamente mencionadas no comando. Não adicione, remova ou altere nenhum elemento que não tenha sido explicitamente pedido. A solicitação do usuário é: `;

    const textPart = {
      text: instruction + prompt,
    };

    // FIX: Call the Gemini API to generate content with both image and text inputs.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, textPart],
      },
      // FIX: Specify that the response can contain both image and text, which is required for this model.
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // FIX: Extract the generated image data from the response parts.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // FIX: Return the image as a data URL string.
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    // FIX: Throw an error if no image was found in the API response.
    throw new Error('Nenhuma imagem foi gerada. Tente um prompt diferente.');

  } catch (error) {
    console.error("Erro ao gerar imagem com a API Gemini:", error);
    // FIX: Propagate a user-friendly error message for better UX.
    throw new Error('Ocorreu um erro ao se comunicar com a IA. Por favor, tente novamente.');
  }
}