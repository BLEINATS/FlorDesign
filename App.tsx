import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import ChoiceScreen from './components/ChoiceScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { generateImage, describeImage } from './services/geminiService';
import { ImageData, EditMode, Project, Screen, EditConfig } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<EditMode>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingInspiration, setIsGettingInspiration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setError(null);
      } catch (e) {
        console.error("Erro ao abrir seletor de chave", e);
      }
    }
  };

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setScreen('choice'); // Agora vai para a tela de escolha antes do editor
  };

  const handleSelectMode = (mode: EditMode) => {
    setSelectedMode(mode);
    setScreen('edit');
  };

  const handleGenerate = async (newPrompt: string, mode: EditMode, isHighQuality: boolean) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setPrompt(newPrompt);

    try {
      // Usando a configuração completa conforme esperado pelo serviço atualizado
      const config: EditConfig = {
        prompt: newPrompt,
        mode: mode,
        isHighQuality: isHighQuality,
        fidelityLevel: 'balanced'
      };
      const result = await generateImage(originalImage, config);
      setGeneratedImage(result);
      setScreen('result');
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
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
    setScreen('choice');
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
    switch (screen) {
      case 'landing':
        return <LandingPage onStart={() => setScreen('upload')} />;
      case 'upload':
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} projects={projects.slice(0, 4)} onViewProject={handleViewProject} onNewProject={handleRestart} />;
      case 'choice':
        return originalImage ? <ChoiceScreen originalImage={originalImage} onSelect={handleSelectMode} onBack={() => setScreen('upload')} /> : null;
      case 'edit':
        if (!originalImage) return null;
        return (
          <EditScreen 
            originalImage={originalImage} 
            onGenerate={(p, m, hq) => handleGenerate(p, m, hq)} 
            onGetInspiration={(img) => handleGetInspiration(img)} 
            isLoading={isLoading || isGettingInspiration} 
            error={error} 
            onRestart={() => setScreen('choice')}
            onSave={handleSave}
          />
        );
      case 'result':
        if (!originalImage || !generatedImage) return null;
        return <ResultScreen originalImage={originalImage} generatedImage={generatedImage} prompt={prompt} onSave={handleSave} onRestart={handleRestart} onEditAgain={handleEditAgain} />;
      case 'projects':
          return <ProjectsScreen projects={projects} onViewProject={handleViewProject} onDeleteProject={handleDeleteProject} onNewProject={handleRestart}/>;
      case 'projectDetail':
          return viewingProject ? <ProjectDetailScreen project={viewingProject} onBack={handleViewProjects} /> : null;
      default:
        return <LandingPage onStart={() => setScreen('upload')} />;
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-sans text-white overflow-hidden flex flex-col">
      {screen !== 'landing' && screen !== 'edit' && screen !== 'choice' && (
        <Header onHome={() => setScreen('landing')} onNew={handleRestart} onProjects={handleViewProjects} onConfigKey={handleOpenKeySelector} />
      )}
      <main className="flex-1 relative flex flex-col">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
