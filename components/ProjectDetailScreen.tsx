import React from 'react';
import { Project } from '../types';

interface ProjectDetailScreenProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ project, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={onBack} className="mb-8 text-pink-600 hover:underline">
        &larr; Voltar para Meus Projetos
      </button>

      <div className="text-center mb-12">
        <p className="text-lg text-gray-600">Projeto criado em {new Date(project.createdAt).toLocaleString()}</p>
        <h2 className="text-4xl font-serif text-pink-800 mt-2">
            "{project.prompt}"
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="text-center">
          <h3 className="text-2xl font-serif text-pink-800 mb-4">Imagem Original</h3>
          <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
             <img src={project.originalImageUrl} alt="Original" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-serif text-pink-800 mb-4">Imagem Gerada</h3>
          <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden border-4 border-pink-400">
            <img src={project.generatedImageUrl} alt={project.prompt} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailScreen;
