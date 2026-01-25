import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onNew: () => void;
  onProjects: () => void;
  credits: number;
  onOpenStore: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onNew, onProjects, credits, onOpenStore }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050806]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center safe-pt transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
        <div className="relative">
            <span className="text-2xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:rotate-12 transition-transform duration-300 block">🌸</span>
            <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
            <span className="font-serif font-bold text-lg tracking-tight text-white group-hover:text-[#13ec5b] transition-colors">FloraDesign</span>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-4">
        
        {/* Credit Counter */}
        <button 
          onClick={onOpenStore}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13ec5b]/10 border border-[#13ec5b]/30 hover:bg-[#13ec5b]/20 transition-all group"
        >
          <span className="material-symbols-outlined text-[#13ec5b] text-[18px] group-hover:scale-110 transition-transform">token</span>
          <span className="text-xs font-bold text-[#13ec5b]">{credits}</span>
          <div className="w-[1px] h-3 bg-[#13ec5b]/30 mx-1"></div>
          <span className="material-symbols-outlined text-[#13ec5b] text-[14px]">add</span>
        </button>

        {/* New Project Action */}
        <button 
            onClick={onNew} 
            className="size-10 rounded-full bg-[#13ec5b] text-[#050806] flex items-center justify-center shadow-[0_0_20px_rgba(19,236,91,0.2)] hover:shadow-[0_0_30px_rgba(19,236,91,0.4)] hover:scale-105 active:scale-95 transition-all border border-[#13ec5b]" 
            title="Novo Projeto"
        >
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
