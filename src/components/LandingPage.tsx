import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const imageBefore = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=100&w=1600";
  const imageAfter = "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=100&w=1600";

  return (
    <div className="flex-1 flex flex-col bg-[#050806] relative h-[100dvh] overflow-hidden font-display">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#13ec5b]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-[#13ec5b]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container - Flex Column com Justify Between para ocupar a tela toda */}
      <div className="w-full h-full flex flex-col justify-between pt-safe-top pb-safe-bottom relative z-10">
        
        {/* HEADER SECTION */}
        <div className="px-6 pt-6 text-center flex flex-col items-center justify-center shrink-0 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#13ec5b]/30 bg-[#13ec5b]/5 rounded-full mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#13ec5b] animate-pulse shadow-[0_0_10px_#13ec5b]"></span>
            <span className="text-[#13ec5b] text-[8px] uppercase tracking-[0.3em] font-black">
              {t('landing_badge')}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight mb-2 text-white drop-shadow-2xl">
            {t('landing_title_1')} <br/>
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#13ec5b] to-emerald-400">
              {t('landing_title_2')}
            </span>
          </h1>
          
          {/* FIX: Removido line-clamp-2 e aumentado max-w para exibir texto completo */}
          <p className="text-white/60 font-medium text-[10px] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            {t('landing_subtitle')}
          </p>
        </div>

        {/* SLIDER SECTION - Flexible Height */}
        <div className="w-full px-6 flex-1 flex items-center justify-center min-h-0 py-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div 
            ref={containerRef}
            className="relative w-full max-w-[340px] h-full max-h-[50vh] aspect-[3/4] rounded-[32px] overflow-hidden shadow-[0_20px_80px_-20px_rgba(19,236,91,0.15)] bg-[#102216] ring-1 ring-white/10 select-none touch-none cursor-ew-resize group"
            onMouseMove={onMouseMove}
            onMouseDown={(e) => handleMove(e.clientX)}
            onTouchMove={onTouchMove}
          >
            <div className="absolute inset-0">
               <img src={imageAfter} className="w-full h-full object-cover" alt="Depois" />
               <div className="absolute top-4 right-4 px-3 py-1 bg-[#13ec5b]/90 backdrop-blur-md rounded-full text-[8px] text-[#050806] font-black uppercase tracking-[0.2em] shadow-lg z-20">
                 {t('landing_with_ai')}
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#050806]/80 via-transparent to-transparent opacity-60" />
            </div>
            
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden z-10 bg-[#050806]"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img src={imageBefore} className="absolute inset-0 w-full h-full object-cover grayscale-[30%]" alt="Antes" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] text-white font-black uppercase tracking-[0.2em] border border-white/10">
                {t('landing_original')}
              </div>
               <div className="absolute inset-0 bg-black/20" />
            </div>

            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-[#13ec5b] z-30 shadow-[0_0_20px_rgba(19,236,91,0.8)]"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#050806] rounded-full shadow-[0_0_30px_rgba(19,236,91,0.4)] flex items-center justify-center border-2 border-[#13ec5b] group-hover:scale-110 transition-transform duration-300">
                <div className="flex gap-0.5 text-[#13ec5b] text-[8px]">
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[7px] text-white/80 font-black uppercase tracking-[0.4em] shadow-xl z-20 whitespace-nowrap pointer-events-none flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs animate-pulse">touch_app</span>
              {t('landing_drag')}
            </div>
          </div>
        </div>

        {/* CTA BUTTON SECTION */}
        <div className="w-full px-8 pb-8 flex flex-col items-center shrink-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onStart}
            className="w-full max-w-[320px] h-[56px] bg-[#13ec5b] text-[#050806] rounded-[20px] shadow-[0_0_40px_rgba(19,236,91,0.3)] hover:shadow-[0_0_60px_rgba(19,236,91,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[20px]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap relative z-10">
              {t('landing_cta')}
            </span>
            <span className="material-symbols-outlined text-lg relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

      </div>

      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .pb-safe-bottom { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

export default LandingPage;
