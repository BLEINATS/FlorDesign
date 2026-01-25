import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop com Blur Intenso */}
      <div 
        className="absolute inset-0 bg-[#050806]/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-[#102216] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center text-center p-8 animate-slide-up">
        
        {/* Ícone Animado */}
        <div className="size-24 rounded-full bg-[#13ec5b]/10 flex items-center justify-center mb-6 relative group">
            <div className="absolute inset-0 rounded-full border border-[#13ec5b]/20 animate-ping opacity-20"></div>
            <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(19,236,91,0.4)] animate-bounce">👋</span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2 italic">Já vai embora?</h2>
        
        <p className="text-white/60 text-sm leading-relaxed mb-8 px-4">
            Esperamos ver você em breve para criar mais jardins incríveis. Seus projetos salvos estarão te esperando.
        </p>

        <div className="w-full flex flex-col gap-3">
            {/* Botão Ficar (Destaque) */}
            <button 
                onClick={onClose}
                className="w-full h-14 bg-[#13ec5b] text-[#102216] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
                Quero Ficar
            </button>

            {/* Botão Sair (Discreto) */}
            <button 
                onClick={onConfirm}
                className="w-full h-14 bg-transparent border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sair da Conta
            </button>
        </div>

        <div className="mt-6">
            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">FloraDesign AI</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
