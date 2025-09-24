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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-serif text-pink-800">Meus Projetos</h2>
        <button
            onClick={onNewProject}
            className="px-4 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
        >
            + Novo Projeto
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-16 px-6 bg-rose-50 rounded-lg">
          <span className="text-5xl">🖼️</span>
          <h3 className="mt-4 text-2xl font-semibold text-pink-800">Nenhum projeto salvo ainda</h3>
          <p className="mt-2 text-gray-600">
            Clique em "+ Novo Projeto" para começar a criar sua primeira obra de arte floral com IA.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
