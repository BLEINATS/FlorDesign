
import React from 'react';

interface HeaderProps {
  onNewProject: () => void;
  onViewProjects: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onViewProjects }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 z-50 flex justify-between items-center">
      <h1 onClick={onNewProject} className="text-2xl font-serif text-pink-800 cursor-pointer">
        FloraDesign AI
      </h1>
      <nav className="flex items-center space-x-4">
        <button onClick={onNewProject} className="text-gray-600 hover:text-pink-600 transition-colors">New Project</button>
        <button onClick={onViewProjects} className="text-gray-600 hover:text-pink-600 transition-colors">My Projects</button>
      </nav>
    </header>
  );
};

export default Header;
