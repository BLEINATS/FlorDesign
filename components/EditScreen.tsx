import React, { useState, useRef } from 'react';
import { ImageData, EditMode } from '../types';
import Spinner from './Spinner';
import { AddCircleIcon, EditWandIcon, FloorPlanIcon, HighQualityIcon, MagicWandIcon, SparklesIcon } from './icons';

interface EditScreenProps {
  onGenerate: (prompt: string, mode: EditMode, isHighQuality: boolean) => Promise<void>;
  onGetInspiration: (imageForInspiration: ImageData) => Promise<string | undefined>;
  isLoading: boolean;
  error: string | null;
}

const EditScreen: React.FC<EditScreenProps> = ({
  onGenerate,
  onGetInspiration,
  isLoading,
  error,
}) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<EditMode>('edit');
  const [isHighQuality, setIsHighQuality] = useState(false);
  const inspirationImageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || mode === 'humanize') { // Allow empty prompt for humanize
      onGenerate(prompt, mode, isHighQuality);
    }
  };

  const handleInspirationImageUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        const inspirationPrompt = await onGetInspiration({ data: base64Data, mimeType: file.type });
        if (inspirationPrompt) {
          setPrompt(inspirationPrompt);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'edit':
        return 'Ex: troque as flores por lírios';
      case 'create':
        return 'Ex: adicione um arco de flores na entrada';
      case 'humanize':
        return 'Ex: estilo moderno com cozinha aberta (opcional)';
      default:
        return 'Descreva sua ideia...';
    }
  };

  return (
    <div className="bg-white/80 p-8 rounded-xl shadow-lg backdrop-blur-md">
      <h2 className="text-3xl font-serif text-pink-800 mb-6">Descreva sua ideia</h2>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setMode('edit')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all text-center ${mode === 'edit' ? 'border-pink-500 bg-rose-50 shadow-inner' : 'border-gray-200 hover:border-pink-300'}`}
        >
          <EditWandIcon className="h-7 w-7 mb-2 text-pink-600" />
          <span className="font-semibold text-pink-800">Editar Imagem</span>
          <span className="text-xs text-gray-500 mt-1">Modificar ou ajustar elementos.</span>
        </button>
        <button
          onClick={() => setMode('create')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all text-center ${mode === 'create' ? 'border-pink-500 bg-rose-50 shadow-inner' : 'border-gray-200 hover:border-pink-300'}`}
        >
          <AddCircleIcon className="h-7 w-7 mb-2 text-pink-600" />
          <span className="font-semibold text-pink-800">Adicionar Elementos</span>
          <span className="text-xs text-gray-500 mt-1">Inserir novos objetos na cena.</span>
        </button>
        <button
          onClick={() => setMode('humanize')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all text-center ${mode === 'humanize' ? 'border-pink-500 bg-rose-50 shadow-inner' : 'border-gray-200 hover:border-pink-300'}`}
        >
          <FloorPlanIcon className="h-7 w-7 mb-2 text-pink-600" />
          <span className="font-semibold text-pink-800">Humanizar Planta</span>
          <span className="text-xs text-gray-500 mt-1">Converter plantas 2D em 3D.</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-40 p-4 pr-12 bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow resize-none"
            disabled={isLoading}
          />
          <input
            type="file"
            ref={inspirationImageInputRef}
            onChange={(e) => handleInspirationImageUpload(e.target.files ? e.target.files[0] : null)}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={() => inspirationImageInputRef.current?.click()}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 text-slate-300 hover:text-pink-400 rounded-full transition-colors disabled:opacity-50"
            title="Inspirar-se com uma imagem"
          >
            <MagicWandIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isHighQuality}
              onChange={(e) => setIsHighQuality(e.target.checked)}
              className="h-5 w-5 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
            />
            <HighQualityIcon className="h-5 w-5 text-pink-500" />
            <span className="font-medium text-gray-700">Alta Qualidade</span>
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-wait"
            disabled={isLoading || (!prompt.trim() && mode !== 'humanize')}
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
  );
};

export default EditScreen;