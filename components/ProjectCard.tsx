
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
      <div className="relative">
        <img src={project.generatedImage} alt={project.prompt} className="w-full h-56 object-cover" />
        <button 
            onClick={() => onDelete(project.id)} 
            className="absolute top-2 right-2 bg-white/70 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Delete project"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="text-gray-700 italic truncate" title={project.prompt}>"{project.prompt}"</p>
      </div>
    </div>
  );
};

export default ProjectCard;
