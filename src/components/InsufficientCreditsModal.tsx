import React from 'react';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecharge: () => void;
  cost: number;
  currentCredits: number;
}

const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({ 
  isOpen, 
  onClose, 
  onRecharge, 
  cost, 
  currentCredits 
}) => {
  if (!isOpen) return null;

  const missing = cost - currentCredits;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop com Blur */}
      <div 
        className="absolute inset-0 bg-[#050806]/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-[#102216] border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center text-center p-8 animate-slide-up">
        
        {/* Ícone de Alerta Estilizado */}
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 relative group border border-red-500/20">
            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-4xl text-red-400">token</span>
            <div className="absolute -bottom-1 -right-1 bg-[#102216] rounded-full p-1">
                <span className="material-symbols-outlined text-red-500 text-xl">error</span>
            </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2 italic">Saldo Insuficiente</h2>
        
        <p className="text-white/60 text-xs leading-relaxed mb-6 px-2">
            Para realizar esta criação incrível com IA, você precisa de mais créditos.
        </p>

        {/* Card Comparativo */}
        <div className="w-full bg-[#1c271f] rounded-2xl p-4 border border-white/5 mb-6 flex items-center justify-between relative overflow-hidden">
            {/* Background progress bar effect */}
            <div className="absolute left-0 top-0 bottom-0 bg-red-500/5 w-full z-0" />
            
            <div className="flex flex-col items-center z-10 w-1/2 border-r border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Você tem</span>
                <span className="text-xl font-bold text-white">{currentCredits}</span>
            </div>
            
            <div className="flex flex-col items-center z-10 w-1/2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Necessário</span>
                <span className="text-xl font-bold text-[#13ec5b]">{cost}</span>
            </div>

            {/* Seta indicativa */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#102216] p-1 rounded-full border border-white/10 z-20">
                <span className="material-symbols-outlined text-xs text-white/40">arrow_forward</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-3">
            {/* Botão Recarregar (Destaque) */}
            <button 
                onClick={onRecharge}
                className="w-full h-14 bg-[#13ec5b] text-[#102216] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.2)] hover:shadow-[0_0_40px_rgba(19,236,91,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
                <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">add_circle</span>
                Recarregar Agora
            </button>

            {/* Botão Cancelar (Discreto) */}
            <button 
                onClick={onClose}
                className="w-full h-12 bg-transparent text-white/40 hover:text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-colors"
            >
                Agora Não
            </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
