import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="text-center py-16 px-4">
      <span className="text-7xl">🌸</span>
      <h1 className="mt-6 text-5xl font-extrabold font-serif text-pink-800">
        Dê vida às suas ideias florais com Inteligência Artificial
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
        Transforme suas fotos de ambientes e eventos. Adicione, remova ou modifique arranjos florais com um simples comando. Perfeito para designers, decoradores e amantes de flores.
      </p>
      <button
        onClick={onStart}
        className="mt-10 px-10 py-4 bg-pink-600 text-white text-lg font-bold rounded-full hover:bg-pink-700 transition-transform hover:scale-105 shadow-lg"
      >
        Começar a Criar
      </button>

      <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white/50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-pink-700">Edição Precisa</h3>
            <p className="mt-2 text-gray-600">Altere cores, tipos de flores ou remova elementos indesejados mantendo o realismo da foto original.</p>
        </div>
        <div className="p-6 bg-white/50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-pink-700">Criação Ilimitada</h3>
            <p className="mt-2 text-gray-600">Adicione novos arranjos, vasos e decorações em qualquer lugar da imagem. Sua imaginação é o limite.</p>
        </div>
        <div className="p-6 bg-white/50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-pink-700">Inspiração Instantânea</h3>
            <p className="mt-2 text-gray-600">Não sabe por onde começar? Deixe a IA analisar sua imagem e sugerir prompts criativos para você.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
