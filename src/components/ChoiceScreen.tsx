import React from 'react';
import { ImageData, EditMode } from '../types';

interface ChoiceScreenProps {
  originalImage: ImageData;
  onSelect: (mode: EditMode) => void;
  onBack: () => void;
}

const ChoiceScreen: React.FC<ChoiceScreenProps> = ({ originalImage, onSelect, onBack }) => {
  return (
    <div className="flex flex-col h-screen bg-[#102216] font-display">
      
      {/* Top Section: Image Preview (Agora separado, sem botões em cima) */}
      <div className="flex-1 relative overflow-hidden bg-black/20">
        <img 
          src={`data:${originalImage.mimeType};base64,${originalImage.data}`} 
          className="w-full h-full object-contain" 
          alt="Original" 
        />
        
        {/* Back Button Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 pt-safe-top">
            <button 
            onClick={onBack}
            className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-black/60"
            >
            <span className="material-symbols-outlined">arrow_back</span>
            </button>
        </div>
      </div>

      {/* Bottom Section: Controls (Painel Sólido Abaixo da Imagem) */}
      <div className="bg-[#102216] p-6 pb-safe-bottom w-full z-10 border-t border-white/5 rounded-t-[32px] -mt-6 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex flex-col gap-4 pt-2">
            
            {/* Main Action - Trocar Espécie (Green) */}
            <button 
                onClick={() => onSelect('edit')}
                className="w-full h-20 bg-[#5DFF6D] rounded-[24px] flex items-center justify-center gap-3 text-[#050806] font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(93,255,109,0.3)] active:scale-95 transition-all hover:shadow-[0_0_50px_rgba(93,255,109,0.5)] hover:bg-[#4CEE5C]"
            >
                <span className="material-symbols-outlined text-2xl font-bold">edit</span>
                Trocar Espécie
            </button>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onSelect('create')}
                    className="h-16 rounded-[20px] border border-white/20 flex items-center justify-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white/5 active:scale-95 transition-all group"
                >
                    <span className="material-symbols-outlined text-lg group-hover:text-[#5DFF6D] transition-colors">add_circle</span>
                    Criar Novo
                </button>

                <button 
                    onClick={() => onSelect('humanize')}
                    className="h-16 rounded-[20px] border border-white/20 flex items-center justify-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white/5 active:scale-95 transition-all group"
                >
                    <span className="material-symbols-outlined text-lg group-hover:text-[#5DFF6D] transition-colors">auto_fix_high</span>
                    Humanizar
                </button>
            </div>

        </div>
      </div>

      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .pb-safe-bottom { padding-bottom: max(2rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

export default ChoiceScreen;
