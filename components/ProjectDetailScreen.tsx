
import React, { useState, useRef } from 'react';
import { Project } from '../types';

interface ProjectDetailScreenProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ project, onBack }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="flex-1 flex flex-col pt-24 px-6 pb-12 animate-slide-up bg-luxury-cream overflow-y-auto no-scrollbar">
      <button 
        onClick={onBack} 
        className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-luxury-rose transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar Projetos
      </button>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-serif font-bold text-luxury-slate leading-tight italic px-4">
          "{project.prompt}"
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-luxury-gold/30"></span>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <span className="h-[1px] w-6 bg-luxury-gold/30"></span>
        </div>
      </div>

      {/* CORTINA INTERATIVA EM DETALHES - SEM CORTES */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/4] max-w-[450px] mx-auto rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-black/5 touch-none bg-white"
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        <img 
            src={project.generatedImageUrl} 
            className="absolute inset-0 w-full h-full object-contain bg-slate-50" 
            alt="Depois" 
        />
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src={project.originalImageUrl} 
            className="absolute inset-0 w-full h-full object-contain bg-slate-50" 
            alt="Antes" 
          />
        </div>

        {/* BARRA DE CONTROLE */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-10"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#D4AF37] rounded-full shadow-xl flex items-center justify-center border-4 border-white">
            <div className="flex gap-1 text-white text-[8px]">
              <span>◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-slate-300 mt-8 font-black uppercase tracking-[0.3em]">
        Arraste para comparar
      </p>
    </div>
  );
};

export default ProjectDetailScreen;
