
import React, { useState, useRef, useEffect } from 'react';
import { ImageData } from '../types';
import { DownloadIcon, EditIcon, RestartIcon, SaveIcon } from './icons';

interface ResultScreenProps {
  originalImage: ImageData;
  generatedImage: ImageData;
  prompt: string;
  onSave: () => void;
  onRestart: () => void;
  onEditAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  originalImage,
  generatedImage,
  prompt,
  onSave,
  onRestart,
  onEditAgain,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const originalImageUrl = `data:${originalImage.mimeType};base64,${originalImage.data}`;
  const generatedImageUrl = `data:${generatedImage.mimeType};base64,${generatedImage.data}`;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const safePrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `flora-design-${safePrompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col pt-16 px-6 animate-slide-up bg-luxury-cream overflow-y-auto pb-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-luxury-slate">Visão Final</h2>
        <p className="text-xs text-slate-400 mt-1 italic">"{prompt}"</p>
      </div>

      {/* SISTEMA DE CORTINA (BEFORE/AFTER SLIDER) */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] max-w-[450px] mx-auto rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 select-none touch-none"
        onMouseMove={onMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={onTouchMove}
      >
        {/* Imagem Alterada (Depois) - Base */}
        <img src={generatedImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Depois" />
        
        {/* Imagem Original (Antes) - Camada Superior com Clip */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={originalImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Antes" />
          <div className="absolute top-4 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/20">
            Original
          </div>
        </div>

        {/* Label Depois */}
        <div 
          className="absolute top-4 right-6 px-3 py-1 bg-luxury-rose/80 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/20 transition-opacity"
          style={{ opacity: sliderPos > 85 ? 0 : 1 }}
        >
          Design IA
        </div>

        {/* Barra e Handle da Cortina */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm cursor-ew-resize z-10"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-luxury-gold">
            <div className="flex gap-1">
              <span className="text-luxury-gold text-xs">◀</span>
              <span className="text-luxury-gold text-xs">▶</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest animate-pulse">
        Arraste o círculo para comparar
      </p>

      {/* Botões de Ação Otimizados */}
      <div className="mt-8 grid grid-cols-2 gap-3 max-w-[450px] mx-auto w-full">
        <button
          onClick={onSave}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-luxury-rose text-white rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <SaveIcon className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Salvar</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white text-luxury-slate rounded-2xl shadow-lg border border-black/5 active:scale-95 transition-all"
        >
          <DownloadIcon className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Baixar</span>
        </button>
        <button
          onClick={onEditAgain}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white text-luxury-slate rounded-2xl shadow-lg border border-black/5 active:scale-95 transition-all"
        >
          <EditIcon className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Refinar</span>
        </button>
        <button
          onClick={onRestart}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-luxury-slate text-white rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <RestartIcon className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Novo</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
