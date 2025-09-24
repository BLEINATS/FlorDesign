import React, { useState } from 'react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import { generateImage } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { Project, ImageData } from './types';

type Screen = 'upload' | 'edit' | 'result' | 'projects' | 'projectDetail';

function App() {
  const [screen, setScreen] = useState<Screen>('upload');
  const [originalImage, setOriginalImage] = useState<{ raw: ImageData, url: string } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage({ raw: imageData, url: `data:${imageData.mimeType};base64,${imageData.data}` });
    setScreen('edit');
    setError(null);
  };

  const handleGenerate = async (newPrompt: string) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setPrompt(newPrompt);

    try {
      const resultImageUrl = await generateImage(originalImage.raw, newPrompt);
      setGeneratedImageUrl(resultImageUrl);
      setScreen('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      // Stay on the edit screen to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  const resetToUpload = () => {
    setOriginalImage(null);
    setGeneratedImageUrl(null);
    setPrompt('');
    setError(null);
    setScreen('upload');
  };

  const handleSaveProject = () => {
    if (!originalImage || !generatedImageUrl) return;
    setIsSaving(true);
    const newProject: Project = {
      id: new Date().toISOString(),
      prompt,
      originalImageUrl: originalImage.url,
      generatedImageUrl,
      createdAt: new Date().toISOString(),
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setTimeout(() => {
        setIsSaving(false);
        alert('Projeto salvo com sucesso!');
        setScreen('projects');
    }, 500);
  };
  
  const handleViewProjects = () => {
    setScreen('projects');
  };
  
  const handleNewProject = () => {
      resetToUpload();
  };

  const handleDeleteProject = (id: string) => {
      setProjects(projects.filter(p => p.id !== id));
  };
  
  const handleViewProjectDetail = (id: string) => {
      setSelectedProjectId(id);
      setScreen('projectDetail');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setScreen('projects');
  };
  
  const handleEditAgain = () => {
      if(generatedImageUrl) {
          const base64Data = generatedImageUrl.split(',')[1];
          // We don't know the exact mime type from the data URL, but png is a safe bet for generated images
          const newOriginal: ImageData = { data: base64Data, mimeType: 'image/png' };
          setOriginalImage({raw: newOriginal, url: generatedImageUrl });
          setGeneratedImageUrl(null);
          setScreen('edit');
      }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'upload':
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
      case 'edit':
        if (!originalImage) {
            resetToUpload();
            return null;
        }
        return <EditScreen imageUrl={originalImage.url} onGenerate={handleGenerate} isLoading={isLoading} onBack={resetToUpload} />;
      case 'result':
        if (!originalImage || !generatedImageUrl) {
            resetToUpload();
            return null;
        }
        return (
          <ResultScreen
            originalImageUrl={originalImage.url}
            generatedImageUrl={generatedImageUrl}
            prompt={prompt}
            onSave={handleSaveProject}
            onEdit={handleEditAgain}
            onRestart={resetToUpload}
            isSaving={isSaving}
          />
        );
      case 'projects':
          return <ProjectsScreen projects={projects} onViewProject={handleViewProjectDetail} onDeleteProject={handleDeleteProject} onNewProject={handleNewProject}/>;
      case 'projectDetail':
          const project = projects.find(p => p.id === selectedProjectId);
          if(!project) {
              handleBackToProjects();
              return null;
          }
          return <ProjectDetailScreen project={project} onBack={handleBackToProjects} />;
      default:
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
    }
  };

  return (
    <div className="bg-rose-50 min-h-screen font-sans text-gray-800">
      <Header onViewProjects={handleViewProjects} onNewProject={handleNewProject} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">{error}</div>}
        {renderScreen()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Criado com 🌸 por FloraDesign AI</p>
      </footer>
    </div>
  );
}

export default App;
