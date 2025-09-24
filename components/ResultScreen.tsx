
import React from 'react';

interface ResultScreenProps {
  originalImage: string;
  generatedImage: string;
  prompt: string;
  onAccept: () => void;
  onRedo: () => void;
  onEditAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ originalImage, generatedImage, prompt, onAccept, onRedo, onEditAgain }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `floradesign-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-center text-4xl font-serif text-pink-800 mb-6">Your Vision, Realized</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-center mb-2 text-gray-700">Before</h3>
          <img src={originalImage} alt="Original" className="rounded-xl shadow-lg w-full" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-center mb-2 text-gray-700">After</h3>
          <img src={generatedImage} alt="Generated" className="rounded-xl shadow-lg w-full" />
        </div>
      </div>
      <div className="bg-white/70 p-4 rounded-lg shadow-md mb-8 text-center">
        <p className="text-gray-600">Based on your prompt:</p>
        <p className="text-lg font-medium text-pink-800 italic">"{prompt}"</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={onAccept} className="bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-transform hover:scale-105 shadow-md">
          Accept & Save
        </button>
        <button onClick={handleDownload} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform hover:scale-105 shadow-md">
          Download Image
        </button>
        <button onClick={onEditAgain} className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-transform hover:scale-105 shadow-md">
          Edit This Image
        </button>
        <button onClick={onRedo} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-transform hover:scale-105 shadow-md">
          Try a Different Prompt
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
