
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { generateImage, describeImage } from './services/geminiService';
import { ImageData, Project, Screen, EditConfig } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [activeConfig, setActiveConfig] = useState<EditConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);

  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  // Função para abrir o seletor de chave do AI Studio
  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Conforme as regras, assumimos sucesso imediato após abrir o seletor
        setError(null); 
        console.log("Seletor de chave aberto. Erros limpos.");
      } catch (e) {
        console.error("Erro ao abrir seletor de chave", e);
      }
    }
  };

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setError(null);
    setScreen('edit');
  };

  const handleGenerate = async (config: EditConfig) => {
    if (!originalImage) return;
    setIsLoading(true);
    setError(null);
    setActiveConfig(config);

    try {
      // O geminiService cria uma nova instância de GoogleGenAI a cada chamada
      // para garantir que pegue a chave mais recente do process.env.API_KEY
      const result = await generateImage(originalImage, config);
      setGeneratedImage(result);
      setScreen('result');
    } catch (e: any) {
      const errorMsg = e.message || 'Erro desconhecido';
      // Detecta se é erro de cota ou projeto não encontrado (comum em chaves mal configuradas)
      const isQuota = errorMsg.includes('429') || 
                      errorMsg.includes('quota') || 
                      errorMsg.includes('exhausted') ||
                      errorMsg.includes('entity was not found');
      
      setError({ 
        message: isQuota 
          ? 'LIMITE ATINGIDO: O Google exige uma chave de API própria para este volume de uso. Clique na chave dourada no topo.' 
          : errorMsg, 
        isQuota 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!originalImage || !generatedImage || !activeConfig) return;
    const newProject: Project = {
      id: Date.now().toString(),
      prompt: activeConfig.prompt || activeConfig.mode,
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

  const renderContent = () => {
    switch (screen) {
      case 'landing': return <LandingPage onStart={() => setScreen('upload')} />;
      case 'upload': return <UploadScreen onImageUpload={handleImageUpload} projects={projects} onViewProject={(id) => {
          if (typeof id === 'string') {
            const p = projects.find(proj => proj.id === id);
            if (p) { setViewingProject(p); setScreen('projectDetail'); }
          } else {
            setScreen('projects');
          }
      }} />;
      case 'edit': return originalImage ? (
        <EditScreen 
          originalImage={originalImage} 
          onGenerate={handleGenerate} 
          isLoading={isLoading} 
          error={error?.message || null} 
          isQuotaError={error?.isQuota || false}
          onOpenKey={handleOpenKeySelector}
        />
      ) : null;
      case 'result': return (originalImage && generatedImage && activeConfig) ? (
        <ResultScreen 
          generatedImage={generatedImage} 
          originalImage={originalImage} 
          prompt={activeConfig.prompt || activeConfig.mode} 
          onSave={handleSave} 
          onRestart={() => setScreen('upload')} 
          onEditAgain={handleEditAgain} 
        />
      ) : null;
      case 'projects': return <ProjectsScreen 
        projects={projects} 
        onViewProject={(id) => {
          const p = projects.find(proj => proj.id === id);
          if (p) { setViewingProject(p); setScreen('projectDetail'); }
        }} 
        onDeleteProject={(id) => setProjects(projects.filter(p => p.id !== id))} 
        onNewProject={() => setScreen('upload')} 
      />;
      case 'projectDetail': return viewingProject ? (
        <ProjectDetailScreen project={viewingProject} onBack={() => setScreen('projects')} />
      ) : null;
      default: return <LandingPage onStart={() => setScreen('upload')} />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-luxury-cream text-luxury-slate font-sans overflow-hidden">
      {screen !== 'landing' && (
        <Header 
          onNew={() => setScreen('upload')} 
          onProjects={() => setScreen('projects')} 
          onConfigKey={handleOpenKeySelector}
        />
      )}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
