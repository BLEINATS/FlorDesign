
import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { generateImage } from './services/geminiService';
import { ImageData, Project, Screen, EditConfig } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [activeConfig, setActiveConfig] = useState<EditConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isPermissionError: boolean } | null>(null);

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
    setError(null);
    setScreen('edit');
  };

  const handleGenerate = async (config: EditConfig) => {
    if (!originalImage) return;
    setIsLoading(true);
    setError(null);
    setActiveConfig(config);

    try {
      const result = await generateImage(originalImage, config);
      setGeneratedImage(result);
      setScreen('result');
    } catch (e: any) {
      const errorMsg = e.message || '';
      const isPermission = errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED');
      
      setError({ 
        message: isPermission 
          ? 'Erro de Acesso (403). Sua chave de API pode não estar habilitada para modelos de imagem no Google Cloud Console.' 
          : errorMsg || 'Erro ao processar imagem.', 
        isPermissionError: isPermission 
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
          onRestart={() => setScreen('upload')}
          onSave={handleSave}
        />
      ) : null;
      case 'result': return (originalImage && generatedImage && activeConfig) ? (
        <ResultScreen 
          generatedImage={generatedImage} 
          originalImage={originalImage} 
          prompt={activeConfig.prompt || activeConfig.mode} 
          onSave={handleSave} 
          onRestart={() => setScreen('upload')} 
          onEditAgain={() => setScreen('edit')} 
        />
      ) : null;
      case 'projects': return <ProjectsScreen projects={projects} onViewProject={(id) => {
          const p = projects.find(proj => proj.id === id);
          if (p) { setViewingProject(p); setScreen('projectDetail'); }
        }} onDeleteProject={(id) => setProjects(projects.filter(p => p.id !== id))} onNewProject={() => setScreen('upload')} />;
      case 'projectDetail': return viewingProject ? <ProjectDetailScreen project={viewingProject} onBack={() => setScreen('projects')} /> : null;
      default: return <LandingPage onStart={() => setScreen('upload')} />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background-dark text-white overflow-hidden relative">
      {screen !== 'landing' && screen !== 'edit' && (
        <Header 
          onHome={() => setScreen('landing')}
          onNew={() => setScreen('upload')} 
          onProjects={() => setScreen('projects')} 
          onConfigKey={handleOpenKeySelector}
        />
      )}
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderContent()}
      </main>

      {/* Alerta de Erro Visual apenas para feedback */}
      {error && screen === 'edit' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] z-[60] animate-slide-up">
           <div className="bg-surface-dark border border-red-500/50 p-8 rounded-[35px] shadow-[0_30px_90px_rgba(0,0,0,0.8)] text-center">
              <div className="size-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Ops! Algo deu errado</h3>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                {error.message}
              </p>
              <button 
                onClick={() => setError(null)}
                className="w-full py-4 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
              >
                Tentar Novamente
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
