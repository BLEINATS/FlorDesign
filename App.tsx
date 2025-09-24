import React, { useState } from 'react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { Project, ImageData, EditMode } from './types';
import { generateImage, describeImage } from './services/geminiService';

type Screen = 'upload' | 'edit' | 'result' | 'projects' | 'projectDetail';

function App() {
  const [screen, setScreen] = useState<Screen>('upload');
  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [currentImageData, setCurrentImageData] = useState<ImageData | null>(null);
  const [generatedImageData, setGeneratedImageData] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setCurrentImageData(imageData);
    setGeneratedImageData(null);
    setPrompt('');
    setError(null);
    setScreen('edit');
  };

  const handleGenerate = async (newPrompt: string, mode: EditMode, isHighQuality: boolean) => {
    if (!currentImageData) return;
    setIsLoading(true);
    setError(null);
    setPrompt(newPrompt);
    try {
      const result = await generateImage(currentImageData, newPrompt, mode, isHighQuality);
      setGeneratedImageData(result);
      setScreen('result');
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
      // Stay on 'edit' screen to show error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescribe = async (): Promise<string | undefined> => {
    if (!currentImageData) return '';
    setIsLoading(true);
    setError(null);
    try {
        const description = await describeImage(currentImageData);
        return description;
    } catch (e: any) {
        setError(e.message || 'Falha ao gerar descrição.');
    } finally {
        setIsLoading(false);
    }
    return '';
  }

  const handleSaveProject = () => {
    if (!currentImageData || !generatedImageData || !prompt) return;
    
    const originalImageUrl = `data:${currentImageData.mimeType};base64,${currentImageData.data}`;
    const generatedImageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;

    const newProject: Project = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      originalImageUrl,
      generatedImageUrl,
      createdAt: new Date().toISOString(),
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setScreen('projects');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  
  const handleViewProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
        setCurrentProject(project);
        setScreen('projectDetail');
    }
  };

  const handleNewProject = () => {
    setCurrentImageData(null);
    setGeneratedImageData(null);
    setPrompt('');
    setError(null);
    setCurrentProject(null);
    setScreen('upload');
  };

  const handleEditAgain = () => {
    if (generatedImageData) {
        setCurrentImageData(generatedImageData);
        setGeneratedImageData(null);
        setPrompt('');
        setError(null);
        setScreen('edit');
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'upload':
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
      case 'edit':
        if (!currentImageData) {
          handleNewProject();
          return null;
        }
        return (
          <EditScreen
            originalImage={currentImageData}
            onGenerate={handleGenerate}
            onGetInspiration={handleDescribe}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'result':
        if (!currentImageData || !generatedImageData) {
          handleNewProject();
          return null;
        }
        return (
          <ResultScreen
            originalImage={currentImageData}
            generatedImage={generatedImageData}
            prompt={prompt}
            onSave={handleSaveProject}
            onRestart={handleNewProject}
            onEditAgain={handleEditAgain}
          />
        );
      case 'projects':
        return <ProjectsScreen projects={projects} onViewProject={handleViewProject} onDeleteProject={handleDeleteProject} onNewProject={handleNewProject} />;
      case 'projectDetail':
        if (!currentProject) {
            setScreen('projects');
            return null;
        }
        return <ProjectDetailScreen project={currentProject} onBack={() => setScreen('projects')} />;
      default:
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
    }
  };

  return (
    <div className="bg-rose-50 min-h-screen font-sans text-gray-800">
      <Header onViewProjects={() => setScreen('projects')} onNewProject={handleNewProject} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
