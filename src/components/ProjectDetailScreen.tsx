import React, { useState, useRef } from 'react';
import { Project } from '../types';

interface ProjectDetailScreenProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ project, onBack }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // Função de Download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = project.generatedImageUrl;
    link.download = `flora-design-${project.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lógica de Movimento (Idêntica à Landing Page)
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };
  const onMouseDown = (e: React.MouseEvent) => handleMove(e.clientX);

  return (
    <div className="flex-1 flex flex-col pt-24 px-6 pb-12 animate-slide-up bg-[#102216] overflow-y-auto no-scrollbar font-display min-h-screen">
      
      {/* Header de Navegação */}
      <div className="flex items-center justify-between mb-6">
        <button 
            onClick={onBack} 
            className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors active:scale-90"
        >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        
        {/* Botão de Download (Novo) */}
        <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#13ec5b]/10 border border-[#13ec5b]/30 rounded-full text-[#13ec5b] text-[10px] font-black uppercase tracking-widest hover:bg-[#13ec5b]/20 transition-all active:scale-95"
        >
            <span className="material-symbols-outlined text-sm">download</span>
            Baixar
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-white leading-tight italic px-4">
          "{project.prompt}"
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-[#13ec5b]/30"></span>
            <p className="text-[9px] text-[#9db9a6] font-black uppercase tracking-[0.3em]">
                {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <span className="h-[1px] w-6 bg-[#13ec5b]/30"></span>
        </div>
      </div>

      {/* CORTINA INTERATIVA (Estilo Landing Page) */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0">
          <div 
            ref={containerRef}
            className="relative w-full max-w-[450px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-[0_20px_80px_-20px_rgba(19,236,91,0.15)] bg-[#050806] ring-1 ring-white/10 select-none touch-none cursor-ew-resize group"
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
          >
            {/* Camada Fundo (Depois/Resultado) */}
            <div className="absolute inset-0">
               <img src={project.generatedImageUrl} className="w-full h-full object-contain bg-[#050806]" alt="Depois" />
               <div className="absolute top-4 right-4 px-3 py-1 bg-[#13ec5b]/90 backdrop-blur-md rounded-full text-[8px] text-[#050806] font-black uppercase tracking-[0.2em] shadow-lg z-20 pointer-events-none">
                 Flora Design
               </div>
               {/* Sombra sutil para profundidade */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050806]/50 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
            
            {/* Camada Topo (Antes/Original) - Recortada */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden z-10 bg-[#050806]"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img src={project.originalImageUrl} className="absolute inset-0 w-full h-full object-contain grayscale-[30%]" alt="Antes" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] text-white font-black uppercase tracking-[0.2em] border border-white/10 pointer-events-none">
                Original
              </div>
               <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* Manipulador (Barra Vertical) */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-[#13ec5b] z-30 shadow-[0_0_20px_rgba(19,236,91,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#050806] rounded-full shadow-[0_0_30px_rgba(19,236,91,0.4)] flex items-center justify-center border-2 border-[#13ec5b] group-hover:scale-110 transition-transform duration-300">
                <div className="flex gap-0.5 text-[#13ec5b] text-[8px]">
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </div>
              </div>
            </div>

            {/* Dica Flutuante (Arrastar) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[7px] text-white/80 font-black uppercase tracking-[0.4em] shadow-xl z-20 whitespace-nowrap pointer-events-none flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="material-symbols-outlined text-xs animate-pulse">touch_app</span>
              Comparar
            </div>
          </div>
      </div>
      
      {/* Botão de Ação Principal (Download Grande) */}
      <div className="mt-8 px-4">
          <button 
            onClick={handleDownload}
            className="w-full h-14 bg-[#13ec5b] text-[#102216] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
              <span className="material-symbols-outlined text-xl">download</span>
              Baixar Imagem
          </button>
      </div>

    </div>
  );
};

export default ProjectDetailScreen;
