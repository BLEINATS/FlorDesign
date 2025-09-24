import React from 'react';
import { DownloadIcon, EditIcon, RestartIcon, SaveIcon } from './icons';

interface ResultScreenProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  prompt: string;
  onSave: () => void;
  onEdit: () => void;
  onRestart: () => void;
  isSaving: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  originalImageUrl,
  generatedImageUrl,
  prompt,
  onSave,
  onEdit,
  onRestart,
  isSaving
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `floradesign-ai-${prompt.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-pink-800 mb-2">Sua Criação Mágica!</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Aqui está o resultado da sua ideia. Você pode salvar, editar mais um pouco ou começar de novo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="text-center">
          <h3 className="text-2xl font-serif text-pink-800 mb-4">Antes</h3>
          <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
             <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-serif text-pink-800 mb-4">Depois</h3>
          <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden border-4 border-pink-400">
            <img src={generatedImageUrl} alt={prompt} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-rose-50 rounded-lg shadow-sm text-center">
        <p className="text-gray-600">Seu comando:</p>
        <p className="text-xl font-semibold text-pink-800 mt-1">"{prompt}"</p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
        >
          <SaveIcon className="h-5 w-5" />
          {isSaving ? 'Salvando...' : 'Salvar Projeto'}
        </button>
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          <DownloadIcon className="h-5 w-5" />
          Baixar Imagem
        </button>
        <button
          onClick={onEdit}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-700 font-semibold border-2 border-pink-200 rounded-lg hover:bg-rose-100 transition-colors"
        >
          <EditIcon className="h-5 w-5" />
          Editar Novamente
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-gray-600 font-semibold hover:text-pink-800 hover:bg-rose-100 rounded-lg transition-colors"
        >
          <RestartIcon className="h-5 w-5" />
          Começar de Novo
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
