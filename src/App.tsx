import React, { useState } from 'react';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { generateImage, describeImage } from './services/geminiService';
// FIX: Imported Screen type to resolve multiple type errors related to the 'screen' state variable.
import { ImageData, EditMode, Project, Screen } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingInspiration, setIsGettingInspiration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setScreen('edit');
  };

  const handleGenerate = async (newPrompt: string, mode: EditMode, isHighQuality: boolean) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setPrompt(newPrompt);

    try {
      const result = await generateImage(originalImage, newPrompt, mode, isHighQuality);
      setGeneratedImage(result);
      setScreen('result');
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
      // Stay on edit screen to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInspiration = async (imageForInspiration: ImageData): Promise<string | undefined> => {
      setIsGettingInspiration(true);
      setError(null);
      try {
          const description = await describeImage(imageForInspiration);
          return description;
      } catch (e: any) {
          setError(e.message || 'Falha ao obter inspiração.');
      } finally {
          setIsGettingInspiration(false);
      }
  };

  const handleSave = () => {
    if (!originalImage || !generatedImage) return;

    const newProject: Project = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      prompt,
      originalImageUrl: `data:${originalImage.mimeType};base64,${originalImage.data}`,
      generatedImageUrl: `data:${generatedImage.mimeType};base64,${generatedImage.data}`,
      createdAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
    setScreen('projects');
  };
  
  const handleEditAgain = () => {
    if (!generatedImage) return;
    setOriginalImage(generatedImage);
    setGeneratedImage(null);
    setScreen('edit');
  };

  const handleRestart = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setScreen('upload');
  };

  const handleViewProjects = () => {
      setViewingProject(null);
      setScreen('projects');
  }
  
  const handleViewProject = (id: string) => {
      const project = projects.find(p => p.id === id);
      if (project) {
          setViewingProject(project);
          setScreen('projectDetail');
      }
  };

  const handleDeleteProject = (id: string) => {
      setProjects(projects.filter(p => p.id !== id));
  };


  const renderScreen = () => {
    const showHeader = screen !== 'landing';

    switch (screen) {
      case 'landing':
        return <LandingPage onStart={() => setScreen('upload')} />;
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto"><UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} projects={projects.slice(0, 4)} onViewProject={handleViewProject} onNewProject={handleRestart} /></div>
        );
      case 'edit':
        if (!originalImage) {
            handleRestart();
            return null;
        }
        return (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="w-full">
              <h2 className="text-3xl font-serif text-pink-800 mb-4 text-center lg:text-left">Sua Imagem</h2>
              <div className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                  <img src={`data:${originalImage.mimeType};base64,${originalImage.data}`} alt="Original para edição" className="w-full h-full object-contain" />
              </div>
            </div>
            <EditScreen onGenerate={handleGenerate} onGetInspiration={(img) => handleGetInspiration(img)} isLoading={isLoading || isGettingInspiration} error={error} />
          </div>
        );
      case 'result':
        if (!originalImage || !generatedImage) {
            handleRestart();
            return null;
        }
        return <ResultScreen originalImage={originalImage} generatedImage={generatedImage} prompt={prompt} onSave={handleSave} onRestart={handleRestart} onEditAgain={handleEditAgain} />;
      case 'projects':
          return <ProjectsScreen projects={projects} onViewProject={handleViewProject} onDeleteProject={handleDeleteProject} onNewProject={handleRestart}/>;
      case 'projectDetail':
          if (!viewingProject) {
              handleViewProjects();
              return null;
          }
          return <ProjectDetailScreen project={viewingProject} onBack={handleViewProjects} />;
      default:
        return <LandingPage onStart={() => setScreen('upload')} />;
    }
  };

  return (
    <div className="bg-rose-50 min-h-screen font-sans text-gray-800">
      {screen !== 'landing' && <Header onViewProjects={handleViewProjects} onNewProject={handleRestart} />}
      <main className="py-8 px-4">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
