import React from 'react';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDataModal: React.FC<ResetDataModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop com Blur Intenso */}
      <div 
        className="absolute inset-0 bg-[#050806]/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-[#102216] border border-red-500/30 rounded-[40px] shadow-[0_0_100px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col items-center text-center p-8 animate-slide-up">
        
        {/* Ícone Animado de Perigo */}
        <div className="size-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 relative group border border-red-500/20">
            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-4xl text-red-500 animate-pulse">delete_forever</span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2 italic">Tem certeza?</h2>
        
        <p className="text-white/60 text-sm leading-relaxed mb-8 px-2">
            Isso apagará <strong>todos os seus projetos</strong>, configurações e histórico salvos neste dispositivo. <br/><br/>
            <span className="text-red-400 font-bold uppercase text-[10px] tracking-widest">Esta ação é irreversível.</span>
        </p>

        <div className="w-full flex flex-col gap-3">
            {/* Botão Confirmar (Perigo) */}
            <button 
                onClick={onConfirm}
                className="w-full h-14 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
                <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">delete</span>
                Sim, Apagar Tudo
            </button>

            {/* Botão Cancelar (Neutro) */}
            <button 
                onClick={onClose}
                className="w-full h-14 bg-transparent border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDataModal;
