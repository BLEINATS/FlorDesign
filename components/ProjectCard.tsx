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
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      onDelete(project.id);
    }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-surface-dark/50 border border-white/5 transition-all hover:scale-[1.02] hover:border-primary/30"
      onClick={() => onView(project.id)}
    >
      {/* Container da Imagem em Quadrado */}
      <div className="aspect-square w-full bg-black/40 flex items-center justify-center overflow-hidden">
        <img 
          src={project.generatedImageUrl} 
          alt={project.prompt} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* Info Overlay (Gradiente mais sutil) */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-8">
        <p className="text-[10px] text-white font-bold truncate pr-6">{project.prompt}</p>
        <p className="text-[8px] text-text-secondary/60 font-black uppercase tracking-widest mt-0.5">
          {new Date(project.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Botão de Deletar (Discreto) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 size-8 bg-black/40 backdrop-blur-md text-white/40 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
        aria-label="Delete project"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>
  );
};

export default ProjectCard;
