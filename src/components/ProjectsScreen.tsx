import React from 'react';
import { Project, EditMode } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectsScreenProps {
  projects: Project[];
  onViewProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: (mode?: EditMode) => void;
  onNavigateToHome: () => void;
  onViewProfile: () => void;
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ 
  projects, 
  onViewProject, 
  onDeleteProject, 
  onNewProject,
  onNavigateToHome,
  onViewProfile
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#102216] min-h-screen relative overflow-hidden font-display">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 pt-24 px-6 no-scrollbar animate-slide-up">
        <div className="flex justify-between items-center mb-10">
            <div>
            <h2 className="text-3xl font-serif font-bold text-white italic">Galeria</h2>
            <p className="text-[9px] text-[#13ec5b] font-black uppercase tracking-[0.3em] mt-1">Meus Designs Florais</p>
            </div>
        </div>
        
        {projects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-12 bg-[#1c271f]/50 rounded-[40px] border border-white/5 py-20 mt-10">
            <span className="text-5xl mb-6 grayscale opacity-30 filter drop-shadow-lg">🌸</span>
            <h3 className="text-xl font-bold text-white mb-2 italic">Espaço vazio</h3>
            <p className="text-[10px] text-[#9db9a6]/60 font-black uppercase tracking-[0.2em] mb-8">
                Seus projetos salvos aparecerão aqui
            </p>
            <button
                onClick={() => onNewProject('edit')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors active:scale-95"
            >
                Começar Design
            </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-10">
            {projects.map((project) => (
                <ProjectCard
                key={project.id}
                project={project}
                onView={onViewProject}
                onDelete={onDeleteProject}
                />
            ))}
            </div>
        )}
      </main>

      {/* --- BOTTOM NAVIGATION BAR (Projects Active) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#102216]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom pt-2 px-6 z-50 h-[88px]">
        <div className="flex items-end justify-between max-w-md mx-auto h-full pb-4">
            
            {/* Início */}
            <button onClick={onNavigateToHome} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">home</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">Início</span>
            </button>

            {/* Projetos (Active) */}
            <button className="flex flex-col items-center gap-1.5 group w-14">
                <span className="material-symbols-outlined text-[#13ec5b] text-[26px]">architecture</span>
                <span className="text-[10px] font-bold text-[#13ec5b]">Projetos</span>
            </button>

            {/* Studio IA (Center Floating) */}
            <div className="relative -top-6">
                <button 
                    onClick={() => onNewProject('edit')}
                    className="flex flex-col items-center justify-center bg-[#13ec5b] size-16 rounded-full shadow-[0_0_30px_rgba(19,236,91,0.3)] border-[6px] border-[#102216] active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-[#102216] font-bold text-[28px]">magic_button</span>
                </button>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#13ec5b] whitespace-nowrap">Studio IA</span>
            </div>

            {/* Catálogo */}
            <button className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">local_florist</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">Catálogo</span>
            </button>

            {/* Perfil */}
            <button onClick={onViewProfile} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">person</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">Perfil</span>
            </button>

        </div>
      </nav>

      <style>{`
        .pb-safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProjectsScreen;
