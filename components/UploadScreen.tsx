
import React from 'react';
import { ImageData, Project } from '../types';

interface Props {
  onImageUpload: (data: ImageData) => void;
  projects: Project[];
  onViewProject: (id?: string) => void;
}

const UploadScreen: React.FC<Props> = ({ onImageUpload, projects, onViewProject }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onImageUpload({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col pt-24 animate-slide-up bg-background-dark min-h-screen">
      <div className="mb-10 px-2">
        <h2 className="text-4xl font-serif font-bold text-white italic">Inspiração</h2>
        <p className="text-text-secondary/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Envie uma foto do espaço para começar</p>
      </div>

      <label className="flex-1 min-h-[300px] border-2 border-dashed border-primary/20 rounded-[45px] bg-surface-dark/40 flex flex-col items-center justify-center gap-6 active:bg-surface-dark transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(19,236,91,0.1)]">
          <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
        </div>
        
        <div className="text-center z-10 px-8">
          <p className="text-lg font-bold text-white tracking-tight">Escolher da Galeria</p>
          <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.4em] mt-2 opacity-60">Toque para selecionar</p>
        </div>
      </label>

      {projects.length > 0 && (
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Recentes</h3>
            <button onClick={() => onViewProject()} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">Ver todos</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 no-scrollbar">
            {projects.slice(0, 5).map(p => (
              <div 
                key={p.id} 
                onClick={() => onViewProject(p.id)}
                className="min-w-[150px] aspect-square bg-surface-dark rounded-3xl overflow-hidden shadow-xl flex-shrink-0 cursor-pointer active:scale-95 transition-all border border-white/5 flex items-center justify-center"
              >
                <img 
                  src={p.generatedImageUrl} 
                  className="w-full h-full object-contain" 
                  alt="Recent Design" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
