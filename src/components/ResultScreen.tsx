import React, { useState, useRef } from 'react';
import { ImageData } from '../types';

interface ResultScreenProps {
  originalImage: ImageData;
  generatedImage: ImageData;
  prompt: string;
  onSave: () => void;
  onRestart: () => void;
  onEditAgain: () => void;
  isGuest: boolean;
  onTriggerAuth: (action: string) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  originalImage,
  generatedImage,
  prompt,
  onSave,
  onRestart,
  onEditAgain,
  isGuest,
  onTriggerAuth
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

  const handleAction = (actionName: string, callback: () => void) => {
      if (isGuest) {
          onTriggerAuth(`Crie uma conta para ${actionName}`);
      } else {
          callback();
      }
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
    <div className="flex-1 flex flex-col pt-24 px-6 animate-slide-up bg-[#102216] overflow-y-auto pb-20 no-scrollbar font-display">
      
      {/* Título e Info */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13ec5b]/10 border border-[#13ec5b]/20 mb-3">
            <span className="material-symbols-outlined text-[#13ec5b] text-xs">auto_awesome</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#13ec5b]">Resultado IA</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight">Sua Visão Realizada</h2>
      </div>

      {/* Visualização de Comparação */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[500px] mx-auto rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#050806] border border-white/10 select-none touch-none aspect-[3/4] group"
        onMouseMove={onMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={onTouchMove}
      >
        {/* Imagem Gerada (Base) */}
        <img 
          src={generatedImageUrl} 
          className="absolute inset-0 w-full h-full object-contain bg-[#050806]" 
          alt="Depois" 
        />
        
        {/* WATERMARK PARA GUESTS */}
        {isGuest && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-40">
                <div className="rotate-[-30deg] border-4 border-white/50 px-8 py-4 rounded-3xl backdrop-blur-sm">
                    <p className="text-4xl font-black uppercase text-white drop-shadow-lg tracking-widest">PREVIEW</p>
                    <p className="text-center text-white font-bold tracking-[0.5em] mt-2">FLORA DESIGN AI</p>
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 mix-blend-overlay"></div>
            </div>
        )}

        {/* Imagem Original (Camada Superior com Clip) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden z-20"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src={originalImageUrl} 
            className="absolute inset-0 w-full h-full object-contain bg-[#050806] grayscale-[30%]" 
            alt="Antes" 
          />
          {/* Label Original */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/80 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
            Original
          </div>
        </div>

        {/* Label Resultado */}
        <div className="absolute top-4 right-4 bg-[#13ec5b]/90 backdrop-blur-md text-[#102216] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">
            Flora Design
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-[#13ec5b] z-30 shadow-[0_0_20px_rgba(19,236,91,0.5)]"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-[#102216] rounded-full shadow-[0_0_30px_rgba(19,236,91,0.4)] flex items-center justify-center border-2 border-[#13ec5b] group-hover:scale-110 transition-transform">
            <div className="flex gap-0.5 text-[#13ec5b]">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[9px] text-[#9db9a6] mt-6 font-black uppercase tracking-[0.3em] opacity-60">
        Arraste para comparar
      </p>

      {/* Botões de Ação - Grid 2x2 */}
      <div className="mt-8 grid grid-cols-2 gap-4 max-w-[500px] mx-auto w-full">
        
        {/* Botão Salvar (Destaque Principal) */}
        <button
          onClick={() => handleAction('salvar seu projeto', onSave)}
          className="h-20 flex flex-col items-center justify-center gap-2 bg-[#13ec5b] text-[#102216] rounded-[24px] shadow-[0_0_30px_rgba(19,236,91,0.2)] active:scale-95 transition-all relative overflow-hidden group hover:bg-[#13ec5b]/90"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-[24px]" />
          <span className="material-symbols-outlined text-2xl relative z-10">favorite</span>
          <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Salvar</span>
          {isGuest && <div className="absolute top-2 right-2 text-[#102216]/50"><span className="material-symbols-outlined text-xs">lock</span></div>}
        </button>
        
        {/* Botão Baixar (Glass Dark) */}
        <button
          onClick={() => handleAction('baixar a imagem', handleDownload)}
          className="h-20 flex flex-col items-center justify-center gap-2 bg-[#1c271f] text-white border border-white/5 rounded-[24px] shadow-lg active:scale-95 transition-all hover:bg-[#253329] hover:border-white/10 group"
        >
          <span className="material-symbols-outlined text-2xl text-white/70 group-hover:text-white transition-colors">download</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Baixar</span>
          {isGuest && <div className="absolute top-2 right-2 text-white/20"><span className="material-symbols-outlined text-xs">lock</span></div>}
        </button>

        {/* Botão Refinar (Glass Dark) */}
        <button
          onClick={() => handleAction('refinar o design', onEditAgain)}
          className="h-20 flex flex-col items-center justify-center gap-2 bg-[#1c271f] text-white border border-white/5 rounded-[24px] shadow-lg active:scale-95 transition-all hover:bg-[#253329] hover:border-white/10 group"
        >
          <span className="material-symbols-outlined text-2xl text-white/70 group-hover:text-white transition-colors">edit_note</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Refinar</span>
          {isGuest && <div className="absolute top-2 right-2 text-white/20"><span className="material-symbols-outlined text-xs">lock</span></div>}
        </button>

        {/* Botão Novo (Outline) */}
        <button
          onClick={onRestart}
          className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent text-[#13ec5b] border border-[#13ec5b]/30 rounded-[24px] shadow-lg active:scale-95 transition-all hover:bg-[#13ec5b]/5 hover:border-[#13ec5b]/50 group"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">restart_alt</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Novo</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
