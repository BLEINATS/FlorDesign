
import React from 'react';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] text-[40rem]">🌸</div>
      </div>
      
      <div className="animate-slide-up z-10">
        <span className="inline-block px-4 py-1 border border-luxury-gold text-luxury-gold rounded-full text-[10px] uppercase tracking-[0.3em] font-bold mb-6">
          Premium AI Experience
        </span>
        <h1 className="text-6xl font-serif font-bold leading-tight mb-6">
          A Arte Floral, <br/>
          <span className="italic font-normal text-luxury-rose">Redefinida.</span>
        </h1>
        <p className="text-slate-500 font-light text-lg mb-12 max-w-xs mx-auto">
          Transforme ambientes com a precisão da inteligência artificial botânica.
        </p>
        
        <button
          onClick={onStart}
          className="w-full max-w-xs py-5 bg-luxury-slate text-white rounded-2xl shadow-2xl active:scale-95 transition-all font-bold uppercase tracking-widest text-sm"
        >
          Iniciar Projeto
        </button>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-luxury-slate"></div>
        <span className="text-[10px] uppercase tracking-widest font-black">Slide to Bloom</span>
      </div>
    </div>
  );
};

export default LandingPage;
