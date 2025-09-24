
import React, { useState } from 'react';
import Spinner from './Spinner';

interface EditScreenProps {
  originalImage: string;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  error: string | null;
}

const EditScreen: React.FC<EditScreenProps> = ({ originalImage, onGenerate, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2 flex-shrink-0">
        <h2 className="text-2xl font-serif text-pink-800 mb-4">Your Canvas</h2>
        <div className="aspect-w-1 aspect-h-1 w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={originalImage} alt="Original space" className="object-contain w-full h-full" />
        </div>
      </div>
      <div className="lg:w-1/2 flex flex-col">
        <h2 className="text-2xl font-serif text-pink-800 mb-4">Describe Your Edit</h2>
        <p className="text-gray-600 mb-4">
          Use natural language to tell the AI what you want to change. For example: "Add a large bouquet of white lilies on the table" or "Transform this into a rustic wedding theme with sunflowers."
        </p>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Change the red roses to white orchids..."
            className="w-full flex-grow p-4 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-shadow resize-none"
            rows={6}
            disabled={isLoading}
          />
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="mt-4 w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {isLoading ? <><Spinner /> <span className="ml-2">Generating...</span></> : 'Generate Design'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditScreen;
