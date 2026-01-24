
import React, { useState, useRef } from 'react';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
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

  // Imagens Reais: Uma igreja vazia (Antes) e uma decorada com flores brancas luxuosas (Depois)
  const imageBefore = "https://images.unsplash.com/photo-1471341971476-3446ee03bd7c?auto=format&fit=crop&q=100&w=1600";
  const imageAfter = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=100&w=1600";

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-luxury-cream relative overflow-y-auto no-scrollbar">
      
      {/* Seção Hero */}
      <div className="pt-16 pb-6 px-8 text-center animate-slide-up z-10 w-full">
        <div className="inline-block px-4 py-1.5 border border-luxury-gold/30 text-luxury-gold rounded-full text-[9px] uppercase tracking-[0.4em] font-black mb-6 bg-white/60 backdrop-blur-xl">
          Visualização Botânica Premium
        </div>
        <h1 className="text-4xl font-serif font-bold leading-tight mb-2 text-luxury-slate">
          A Arte Floral, <br/>
          <span className="italic font-normal text-luxury-rose">Redefinida.</span>
        </h1>
        <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mb-6 max-w-xs mx-auto opacity-70">
          Transforme qualquer espaço com inteligência artificial.
        </p>
      </div>

      {/* CORTINA INTERATIVA - REALISMO PURO (SEM FILTROS ARTIFICIAIS) */}
      <div className="w-full px-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/5] max-w-[400px] mx-auto rounded-[45px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/5 select-none touch-none cursor-ew-resize group border-[12px] border-white"
          onMouseMove={onMouseMove}
          onMouseDown={(e) => handleMove(e.clientX)}
          onTouchMove={onTouchMove}
        >
          {/* LADO "DEPOIS" (Ambiente Decorado) */}
          <div className="absolute inset-0">
             <img 
               src={imageAfter} 
               className="w-full h-full object-cover" 
               alt="Depois" 
             />
             
             {/* Tag Depois */}
             <div className="absolute top-10 right-10 px-6 py-2 bg-luxury-gold/90 backdrop-blur-2xl rounded-2xl text-[11px] text-white font-black uppercase tracking-[0.3em] border border-white/30 shadow-2xl z-20">
               Design
             </div>
          </div>
          
          {/* LADO "ANTES" (Ambiente Vazio) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden z-10"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img 
              src={imageBefore} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Antes" 
            />
            
            {/* Tag Antes */}
            <div className="absolute top-10 left-10 px-6 py-2 bg-black/50 backdrop-blur-2xl rounded-2xl text-[11px] text-white font-black uppercase tracking-[0.3em] border border-white/20 shadow-2xl">
              Espaço
            </div>
          </div>

          {/* Slider Central Minimalista */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white z-30 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-luxury-gold group-hover:scale-110 transition-transform duration-300">
              <div className="flex gap-1.5 text-luxury-gold text-[10px]">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>

          {/* Instrução Inferior Glass */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-[9px] text-white font-black uppercase tracking-[0.5em] shadow-2xl z-20 whitespace-nowrap pointer-events-none">
            Toque e Arraste
          </div>
        </div>
      </div>

      {/* BOTÃO ELEGANTE COM GLASSMORPHISM */}
      <div className="w-full px-10 pb-16 animate-slide-up flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
        
        <button
          onClick={onStart}
          className="w-full max-w-[300px] py-6 px-4 bg-white/20 backdrop-blur-[45px] border border-white/50 text-luxury-slate rounded-[35px] shadow-[0_35px_70px_-12px_rgba(0,0,0,0.15)] active:scale-95 active:bg-white/30 transition-all duration-300 flex items-center justify-center gap-4 group relative overflow-hidden"
        >
          {/* Reflexo de Vidro Dinâmico */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-35deg] animate-shine" />
          
          <span className="text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap relative z-10">
            Iniciar Novo Projeto
          </span>
          <span className="text-2xl group-hover:translate-x-2 transition-transform relative z-10 leading-none text-luxury-gold">→</span>
        </button>
        
        <div className="mt-10 flex flex-col items-center gap-3 opacity-30">
           <p className="text-[7px] text-slate-500 uppercase tracking-[1em] font-black">
            Powered by Gemini AI Technology
          </p>
          <div className="w-12 h-[1px] bg-luxury-gold/60" />
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-35deg); }
          100% { transform: translateX(250%) skewX(-35deg); }
        }
        .animate-shine {
          animation: shine 6s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LandingPage;
