import React from 'react';
import { Project } from '../types';
import { TrashIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onView
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      onDelete(project.id);
    }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
      onClick={() => onView(project.id)}
    >
      <img src={project.generatedImageUrl} alt={project.prompt} className="h-64 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-white font-semibold truncate group-hover:whitespace-normal">{project.prompt}</p>
        <p className="text-xs text-gray-300">{new Date(project.createdAt).toLocaleDateString()}</p>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 p-2 bg-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-opacity"
        aria-label="Delete project"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ProjectCard;
