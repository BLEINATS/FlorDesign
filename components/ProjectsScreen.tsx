import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectsScreenProps {
  projects: Project[];
  onViewProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ projects, onViewProject, onDeleteProject, onNewProject }) => {
  return (
    <div className="flex-1 flex flex-col pt-24 px-6 pb-12 animate-slide-up bg-background-dark min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white italic">Galeria</h2>
          <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mt-1">Meus Designs Florais</p>
        </div>
        <button
            onClick={onNewProject}
            className="size-12 bg-primary text-background-dark rounded-full shadow-[0_0_20px_rgba(19,236,91,0.3)] flex items-center justify-center transition-transform active:scale-90"
        >
            <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-12 bg-surface-dark/30 rounded-[40px] border border-white/5 py-20">
          <span className="text-5xl mb-6 grayscale opacity-30">🌸</span>
          <h3 className="text-xl font-bold text-white mb-2 italic">Espaço vazio</h3>
          <p className="text-[10px] text-text-secondary/60 font-black uppercase tracking-[0.2em] mb-8">
            Seus projetos salvos aparecerão aqui
          </p>
          <button
            onClick={onNewProject}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10"
          >
            Começar Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
    </div>
  );
};

export default ProjectsScreen;
