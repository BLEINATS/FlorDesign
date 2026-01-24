
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
    <div className="flex-1 flex flex-col pt-24 px-6 pb-12 animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-luxury-slate">Meus Projetos</h2>
        <button
            onClick={onNewProject}
            className="w-10 h-10 bg-luxury-rose text-white rounded-full shadow-lg flex items-center justify-center font-bold"
        >
            +
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-12 bg-white rounded-[40px] border border-black/5">
          <span className="text-5xl mb-6">🌸</span>
          <h3 className="text-xl font-serif font-bold text-luxury-slate mb-2">Sua galeria está vazia</h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
            Comece um novo projeto para visualizar suas criações aqui.
          </p>
          <button
            onClick={onNewProject}
            className="px-8 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-[10px]"
          >
            Criar Primeiro Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
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
