
import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectsScreenProps {
  projects: Project[];
  onDeleteProject: (id: string) => void;
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ projects, onDeleteProject }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-serif text-pink-800 mb-4">Your Gallery is Empty</h2>
        <p className="text-gray-600">
          Once you create and save a design, it will appear here. Start a new project to begin!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-serif text-pink-800 mb-8 text-center">My Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onDelete={onDeleteProject} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsScreen;
