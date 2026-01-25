import React, { useState, ChangeEvent } from 'react';
import { ImageData, Project } from '../types';

interface UploadScreenProps {
  onImageUpload: (imageData: ImageData) => void;
  isLoading: boolean;
  projects: Project[];
  onViewProject: (id: string) => void;
  onNewProject: () => void;
  onBack: () => void; // Nova prop para voltar
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, isLoading, projects, onViewProject, onBack }) => {
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

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col pt-24 animate-slide-up bg-background-dark min-h-screen relative">
      
      {/* Botão Voltar */}
      <div className="absolute top-0 left-0 w-full p-6 z-10">
        <button 
          onClick={onBack}
          className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto text-center w-full">
        <div className="mb-10 px-2">
            <h2 className="text-4xl font-serif font-bold text-white italic">Inspiração</h2>
            <p className="text-text-secondary/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Envie uma foto do espaço para começar</p>
        </div>

        <label
            htmlFor="file-upload"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`p-12 border-4 border-dashed rounded-[45px] cursor-pointer transition-all block relative overflow-hidden group ${
            isDragging ? 'border-primary bg-primary/10' : 'border-primary/20 bg-surface-dark/40 hover:border-primary/40'
            }`}
        >
            <input id="file-upload" type="file" accept="image/*" onChange={onFileInputChange} className="hidden" />
            
            {/* Decorative background element */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="flex flex-col items-center justify-center text-gray-600 relative z-10">
                <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(19,236,91,0.1)] mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
                </div>
                
                <h2 className="text-lg font-bold text-white tracking-tight">Escolher da Galeria</h2>
                <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.4em] mt-2 opacity-60">Toque ou arraste para selecionar</p>
                <p className="text-[10px] text-white/30 mt-6 font-medium">Suporta: JPEG, PNG, WEBP</p>
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Processando...</p>
                </div>
            )}
        </label>
        
        {error && <p className="mt-4 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs font-bold">{error}</p>}

        {projects && projects.length > 0 && (
            <div className="mt-16 text-left animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 px-2">Ou continue um projeto</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {projects.slice(0, 4).map((project) => (
                        <div
                                key={project.id}
                                onClick={() => onViewProject(project.id)}
                                className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-transform active:scale-95 border border-white/5 aspect-square"
                            >
                                <img src={project.generatedImageUrl} alt={project.prompt} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate">{project.prompt}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default UploadScreen;
