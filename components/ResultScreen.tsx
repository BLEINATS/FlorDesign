import React from 'react';
import { ImageData } from '../types';
import { DownloadIcon, EditIcon, RestartIcon, SaveIcon } from './icons';

interface ResultScreenProps {
  originalImage: ImageData;
  generatedImage: ImageData;
  prompt: string;
  onSave: () => void;
  onRestart: () => void;
  onEditAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  originalImage,
  generatedImage,
  prompt,
  onSave,
  onRestart,
  onEditAgain,
}) => {
  const originalImageUrl = `data:${originalImage.mimeType};base64,${originalImage.data}`;
  const generatedImageUrl = `data:${generatedImage.mimeType};base64,${generatedImage.data}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const safePrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `floradesign-ai-${safePrompt || 'imagem'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-pink-800">Sua Visão, Florescida! ✨</h2>
        <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
          Baseado na sua instrução: <span className="font-semibold text-pink-700">"{prompt}"</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Original Image */}
        <div className="text-center">
            <h3 className="text-2xl font-serif text-pink-800 mb-4">Antes</h3>
            <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain" />
            </div>
        </div>
        
        {/* Generated Image */}
        <div className="text-center">
            <h3 className="text-2xl font-serif text-pink-800 mb-4">Depois</h3>
            <div className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden border-4 border-pink-400">
                <img src={generatedImageUrl} alt={prompt} className="w-full h-full object-contain" />
            </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors"
        >
          <SaveIcon className="h-5 w-5" />
          <span>Salvar Projeto</span>
        </button>
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-700 font-semibold border-2 border-pink-600 rounded-lg hover:bg-rose-100 transition-colors"
        >
          <DownloadIcon className="h-5 w-5" />
          <span>Baixar Imagem</span>
        </button>
        <button
          onClick={onEditAgain}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <EditIcon className="h-5 w-5" />
          <span>Editar Novamente</span>
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RestartIcon className="h-5 w-5" />
          <span>Novo Projeto</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
