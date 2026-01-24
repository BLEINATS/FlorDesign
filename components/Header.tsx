
import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onNew: () => void;
  onProjects: () => void;
  onConfigKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onNew, onProjects, onConfigKey }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 border-b border-black/5 flex justify-between items-center safe-pt">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onHome}>
        <span className="text-xl group-hover:rotate-12 transition-transform">🌸</span>
        <span className="font-serif font-bold text-lg tracking-tight hover:text-luxury-rose transition-colors">FloraDesign</span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onConfigKey}
          className="relative flex items-center gap-1 px-4 py-2 bg-luxury-gold text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-luxury-gold/80 transition-all overflow-hidden"
          title="Configurar Chave API"
        >
          <span className="animate-pulse">🔑</span>
          <span className="hidden sm:inline">Chave API</span>
          <div className="absolute inset-0 bg-white/20 animate-shine"></div>
        </button>
        <button onClick={onProjects} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-luxury-rose">Projetos</button>
        <button onClick={onNew} className="w-8 h-8 bg-luxury-slate text-white rounded-full flex items-center justify-center font-light shadow-lg hover:scale-105 active:scale-95 transition-all" title="Novo Projeto">+</button>
      </div>
    </header>
  );
};

export default Header;
