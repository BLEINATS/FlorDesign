import React from 'react';

interface HeaderProps {
  onViewProjects: () => void;
  onNewProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewProjects, onNewProject }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNewProject}>
            <span className="text-3xl">🌸</span>
            <h1 className="text-2xl font-serif font-bold text-pink-800">FloraDesign AI</h1>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={onViewProjects}
              className="px-4 py-2 text-pink-700 font-medium rounded-md hover:bg-rose-100 transition-colors"
            >
              Meus Projetos
            </button>
            <button
              onClick={onNewProject}
              className="px-4 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
            >
              + Novo Projeto
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
