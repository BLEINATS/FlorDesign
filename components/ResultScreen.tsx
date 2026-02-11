import React, { useState, useRef } from 'react';
import { ImageData } from '../types';

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
    link.download = `flora-design-vision.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col pt-20 px-6 animate-slide-up bg-luxury-cream overflow-y-auto pb-10 no-scrollbar">
      
      {/* Visualização de Comparação - Ajustada para não cortar */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[500px] mx-auto rounded-[40px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-white ring-1 ring-black/5 select-none touch-none aspect-[3/4]"
        onMouseMove={onMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={onTouchMove}
      >
        {/* Imagem Gerada (Base) */}
        <img 
          src={generatedImageUrl} 
          className="absolute inset-0 w-full h-full object-contain bg-slate-50" 
          alt="Depois" 
        />
        
        {/* Imagem Original (Camada Superior com Clip) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src={originalImageUrl} 
            className="absolute inset-0 w-full h-full object-contain bg-slate-50" 
            alt="Antes" 
          />
        </div>

        {/* Slider Handle (Círculo Dourado) */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/40 backdrop-blur-sm z-20"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#D4AF37] rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
            <div className="flex gap-1">
              <span className="text-white text-[10px]">◀</span>
              <span className="text-white text-[10px]">▶</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.2em]">
        ARRASTE O CÍRCULO PARA COMPARAR
      </p>

      {/* Botões de Ação - Conforme Screenshot */}
      <div className="mt-10 grid grid-cols-2 gap-4 max-w-[500px] mx-auto w-full">
        <button
          onClick={onSave}
          className="h-20 flex flex-col items-center justify-center gap-1.5 bg-[#BE185D] text-white rounded-[24px] shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>favorite</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Salvar</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="h-20 flex flex-col items-center justify-center gap-1.5 bg-white text-slate-800 border border-slate-100 rounded-[24px] shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>download</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Baixar</span>
        </button>

        <button
          onClick={onEditAgain}
          className="h-20 flex flex-col items-center justify-center gap-1.5 bg-white text-slate-800 border border-slate-100 rounded-[24px] shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>edit_note</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Refinar</span>
        </button>

        <button
          onClick={onRestart}
          className="h-20 flex flex-col items-center justify-center gap-1.5 bg-[#1e293b] text-white rounded-[24px] shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined rotate-180" style={{ fontSize: '24px' }}>sync</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Novo</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
