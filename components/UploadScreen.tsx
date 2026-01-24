
import React from 'react';
import { ImageData, Project } from '../types';

interface Props {
  onImageUpload: (data: ImageData) => void;
  projects: Project[];
  // FIX: Updated onViewProject to accept an optional string ID, allowing navigation to specific projects from the upload screen.
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
    <div className="flex-1 p-6 flex flex-col pt-24 animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-luxury-slate">Inspiração</h2>
        <p className="text-slate-400 text-sm">Envie uma foto do espaço para começar</p>
      </div>

      <label className="flex-1 min-h-[300px] border-2 border-dashed border-luxury-gold/30 rounded-[40px] bg-white flex flex-col items-center justify-center gap-4 active:bg-luxury-cream transition-colors cursor-pointer group">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="w-20 h-20 bg-luxury-cream rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
          <span className="text-4xl text-luxury-gold">✨</span>
        </div>
        <div className="text-center">
          <p className="font-bold text-luxury-slate">Escolher da Galeria</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Toque para selecionar</p>
        </div>
      </label>

      {projects.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-luxury-slate">Recentes</h3>
            {/* FIX: Explicitly call onViewProject without arguments for the "View All" functionality. */}
            <button onClick={() => onViewProject()} className="text-[10px] font-bold text-luxury-rose uppercase">Ver todos</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
            {projects.slice(0, 3).map(p => (
              // FIX: Wrapped recent project thumbnails in a clickable div to allow viewing details directly from here.
              <div 
                key={p.id} 
                onClick={() => onViewProject(p.id)}
                className="min-w-[140px] aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
              >
                <img src={p.generatedImageUrl} className="w-full h-full object-cover" alt="Recent" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
