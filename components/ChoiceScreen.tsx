
import React, { useState } from 'react';
import { ImageData, EditMode } from '../types';

interface ChoiceScreenProps {
  originalImage: ImageData;
  onSelect: (mode: EditMode) => void;
  onBack: () => void;
}

const ChoiceScreen: React.FC<ChoiceScreenProps> = ({ originalImage, onSelect, onBack }) => {
  const [brushSize, setBrushSize] = useState(30);

  return (
    <div className="flex-1 relative flex flex-col bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img 
          src={`data:${originalImage.mimeType};base64,${originalImage.data}`} 
          className="w-full h-full object-cover blur-sm"
          alt="Original" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start">
        <button 
          onClick={onBack}
          className="size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* Vertical Slider on the Left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
        <div className="h-48 w-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex flex-col items-center py-4 relative">
          <span className="text-[8px] font-black uppercase tracking-widest mb-4 opacity-50 rotate-90">Size</span>
          <div className="flex-1 w-0.5 bg-white/10 rounded-full relative">
            <div 
              className="absolute w-6 h-6 bg-[#13ec5b] rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(19,236,91,0.6)] cursor-pointer"
              style={{ bottom: `${brushSize}%` }}
              onMouseDown={(e) => {
                // Simplified drag for demo
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Menu Button on the Right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <button className="size-16 rounded-full bg-[#13ec5b] shadow-[0_0_30px_rgba(19,236,91,0.4)] flex items-center justify-center text-black active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl font-bold">grid_view</span>
        </button>
      </div>

      {/* Bottom Floating Control Panel */}
      <div className="mt-auto p-10 z-20 animate-slide-up">
        <div className="bg-[#102216]/90 backdrop-blur-3xl border border-white/5 rounded-[45px] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.8)] max-w-sm mx-auto">
          {/* Main Action */}
          <button 
            onClick={() => onSelect('edit')}
            className="w-full bg-[#13ec5b] h-20 rounded-[28px] flex items-center justify-center gap-4 text-[#102216] font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_40px_rgba(19,236,91,0.2)] active:scale-95 transition-all mb-4"
          >
            <span className="material-symbols-outlined font-black text-2xl">edit</span>
            Trocar Espécie
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onSelect('create')}
              className="h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Criar Novo
            </button>
            <button 
              onClick={() => onSelect('humanize')}
              className="h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">auto_fix_high</span>
              Humanizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoiceScreen;
