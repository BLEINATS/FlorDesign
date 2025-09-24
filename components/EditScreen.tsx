import React, { useState } from 'react';
import { ImageData, EditMode } from '../types';
import Spinner from './Spinner';
import { CreateIcon, EditWandIcon, LightbulbIcon, SparklesIcon, HighQualityIcon } from './icons';

interface EditScreenProps {
  originalImage: ImageData;
  onGenerate: (prompt: string, mode: EditMode, isHighQuality: boolean) => Promise<void>;
  onGetInspiration: () => Promise<string | undefined>;
  isLoading: boolean;
  error: string | null;
}

const EditScreen: React.FC<EditScreenProps> = ({
  originalImage,
  onGenerate,
  onGetInspiration,
  isLoading,
  error,
}) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<EditMode>('edit');
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [isGettingInspiration, setIsGettingInspiration] = useState(false);

  const imageUrl = `data:${originalImage.mimeType};base64,${originalImage.data}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, mode, isHighQuality);
    }
  };

  const handleGetInspirationClick = async () => {
    setIsGettingInspiration(true);
    try {
        const inspirationPrompt = await onGetInspiration();
        if (inspirationPrompt) {
            setPrompt(inspirationPrompt);
        }
    } finally {
        setIsGettingInspiration(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left Column: Image */}
      <div className="w-full">
         <h2 className="text-3xl font-serif text-pink-800 mb-4 text-center lg:text-left">Imagem Original</h2>
         <div className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={imageUrl} alt="Original para edição" className="w-full h-full object-contain" />
         </div>
      </div>

      {/* Right Column: Controls */}
      <div className="bg-white/80 p-8 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-serif text-pink-800 mb-6">Descreva sua ideia</h2>
        
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                onClick={() => setMode('edit')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${mode === 'edit' ? 'border-pink-500 bg-rose-50' : 'border-gray-200 hover:border-pink-300'}`}
            >
                <EditWandIcon className="h-8 w-8 mb-2 text-pink-600"/>
                <span className="font-semibold text-pink-800">Editar Imagem</span>
                <span className="text-xs text-gray-500 text-center mt-1">Modificar, remover ou ajustar elementos existentes.</span>
            </button>
            <button 
                onClick={() => setMode('create')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${mode === 'create' ? 'border-pink-500 bg-rose-50' : 'border-gray-200 hover:border-pink-300'}`}
            >
                <CreateIcon className="h-8 w-8 mb-2 text-pink-600"/>
                <span className="font-semibold text-pink-800">Adicionar Elementos</span>
                 <span className="text-xs text-gray-500 text-center mt-1">Inserir novos objetos ou decorações na cena.</span>
            </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'edit' ? 'Ex: "troque as rosas vermelhas por lírios brancos" ou "remova o vaso da mesa"' : 'Ex: "adicione um grande arranjo de girassóis no centro da mesa"'}
              className="w-full h-36 p-4 pr-12 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow resize-none"
              disabled={isLoading}
            />
             <button
                type="button"
                onClick={handleGetInspirationClick}
                disabled={isGettingInspiration || isLoading}
                className="absolute top-3 right-3 p-2 text-pink-600 hover:bg-rose-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Obter inspiração da imagem"
            >
                {isGettingInspiration ? <Spinner /> : <LightbulbIcon className="h-6 w-6" />}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input 
                    type="checkbox"
                    checked={isHighQuality}
                    onChange={(e) => setIsHighQuality(e.target.checked)}
                    className="h-5 w-5 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                />
                <HighQualityIcon className="h-5 w-5 text-pink-600"/>
                <span className="font-medium">Alta Qualidade</span>
              </label>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-wait"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Gerar Magia</span>
                  </>
                )}
              </button>
          </div>

        </form>
        
        {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>}
      </div>
    </div>
  );
};

export default EditScreen;
