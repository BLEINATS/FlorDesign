
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
    <div className="flex-1 flex flex-col pt-24 px-6 pb-12 animate-slide-up bg-luxury-cream overflow-y-auto">
      <button 
        onClick={onBack} 
        className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"
      >
        ← Voltar Projetos
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-luxury-slate leading-tight italic">
          "{project.prompt}"
        </h2>
        <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
          Criado em {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* CORTINA INTERATIVA EM DETALHES */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] max-w-[450px] mx-auto rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 touch-none"
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        <img src={project.generatedImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Depois" />
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={project.originalImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Antes" />
        </div>

        {/* BARRA DE CONTROLE */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-10"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-luxury-gold">
            <div className="flex gap-1">
              <span className="text-luxury-gold text-[8px]">◀</span>
              <span className="text-luxury-gold text-[8px]">▶</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-slate-300 mt-4 font-bold uppercase tracking-widest">
        Deslize para comparar o antes e depois
      </p>
    </div>
  );
};

export default ProjectDetailScreen;
