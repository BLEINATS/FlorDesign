import React, { useState, ChangeEvent } from 'react';
// FIX: Import Project type to use in props
import { ImageData, Project } from '../types';

interface UploadScreenProps {
  onImageUpload: (imageData: ImageData) => void;
  isLoading: boolean;
  // FIX: Added missing props to match what's passed from App.tsx
  projects: Project[];
  onViewProject: (id: string) => void;
  onNewProject: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, isLoading, projects, onViewProject }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione um arquivo de imagem (JPEG, PNG, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onabort = () => setError('Leitura do arquivo abortada.');
    reader.onerror = () => setError('Falha ao ler o arquivo.');
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        onImageUpload({ data: base64Data, mimeType: file.type });
      } else {
        setError('Não foi possível processar o arquivo de imagem.');
      }
    };
    reader.readAsDataURL(file);
  };
  
  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  // FIX: Corrected DragEvent type from HTMLDivElement to HTMLLabelElement to match the element it's attached to.
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  // FIX: Corrected DragEvent type from HTMLDivElement to HTMLLabelElement to match the element it's attached to.
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  // FIX: Corrected DragEvent type from HTMLDivElement to HTMLLabelElement to match the element it's attached to.
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  return (
    <div className="max-w-3xl mx-auto text-center">
      <label
        htmlFor="file-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`p-12 border-4 border-dashed rounded-xl cursor-pointer transition-colors block ${
          isDragging ? 'border-pink-500 bg-rose-50' : 'border-pink-200 hover:border-pink-400'
        }`}
      >
        <input id="file-upload" type="file" accept="image/*" onChange={onFileInputChange} className="hidden" />
        <div className="flex flex-col items-center justify-center text-gray-600">
            <span className="text-6xl mb-4">🖼️</span>
            <h2 className="text-2xl font-semibold text-pink-800">Arraste e solte uma imagem aqui</h2>
            <p className="mt-2">ou</p>
            <span
              className="mt-4 px-6 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors pointer-events-none"
            >
              Selecione um arquivo
            </span>
            <p className="text-sm text-gray-500 mt-4">Suporta: JPEG, PNG, WEBP, GIF</p>
        </div>
      </label>
      {isLoading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-pink-700">
           <p className="text-lg">Processando imagem...</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

      {projects && projects.length > 0 && (
          <div className="mt-16">
              <h3 className="text-2xl font-serif text-pink-800 mb-6">Ou continue um projeto recente</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {projects.map((project) => (
                       <div
                            key={project.id}
                            onClick={() => onViewProject(project.id)}
                            className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                        >
                            <img src={project.generatedImageUrl} alt={project.prompt} className="aspect-square w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <p className="absolute bottom-0 left-0 p-2 text-white text-sm font-semibold truncate w-full group-hover:whitespace-normal">{project.prompt}</p>
                       </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default UploadScreen;
