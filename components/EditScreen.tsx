import React, { useState } from 'react';
import Spinner from './Spinner';
import { LightbulbIcon } from './icons';

interface EditScreenProps {
  imageUrl: string;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  onBack: () => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ imageUrl, onGenerate, isLoading, onBack }) => {
  const [prompt, setPrompt] = useState('');
  
  const suggestions = [
    "Adicione mais flores cor-de-rosa",
    "Torne o fundo mais vibrante",
    "Crie um estilo de aquarela",
    "Adicione uma borboleta delicada",
    "Remova as folhas secas"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-serif text-pink-800 mb-6">Sua Imagem</h2>
        <div className="w-full aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={imageUrl} alt="Uploaded for editing" className="w-full h-full object-contain" />
        </div>
        <button onClick={onBack} className="mt-4 text-pink-600 hover:underline">
          Trocar imagem
        </button>
      </div>
      
      <div className="sticky top-24">
        <h2 className="text-3xl font-serif text-pink-800 mb-6">Descreva sua magia</h2>
        <p className="text-gray-600 mb-4">
          O que você gostaria de mudar ou adicionar? Seja descritivo!
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            placeholder="Ex: 'Adicione lírios brancos e rosas na parte superior, e faça o vaso parecer de cristal.'"
            disabled={isLoading}
          />

          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
            <LightbulbIcon className="h-6 w-6 text-rose-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-rose-800">💡 Dica:</h4>
              <p className="text-sm text-rose-700">
                Seja específico em seus comandos. Em vez de "melhore a imagem", diga "troque as flores vermelhas por orquídeas brancas". Quanto mais específico, melhor o resultado.
              </p>
            </div>
          </div>

          <div className="my-4">
            <p className="text-sm text-gray-500 mb-2">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPrompt(s)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-rose-100 text-pink-800 rounded-full hover:bg-rose-200 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Spinner />
                Gerando...
              </>
            ) : (
              'Florescer!'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditScreen;