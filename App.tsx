
import React, { useState, useCallback } from 'react';
import { Screen, Project } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      base64Url: `data:${file.type};base64,${await base64EncodedDataPromise}`
    };
  };
  
  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const { base64Url } = await fileToGenerativePart(file);
      setOriginalImage(base64Url);
      setCurrentMimeType(file.type);
      setScreen(Screen.EDIT);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setCurrentPrompt(prompt);

    try {
      const base64Data = originalImage.split(',')[1];
      const result = await editImageWithGemini(base64Data, currentMimeType, prompt);
      if(result && result.imageData){
        setGeneratedImage(`data:${result.mimeType};base64,${result.imageData}`);
        setScreen(Screen.RESULT);
      } else {
        throw new Error("AI did not return an image. It might be due to safety policies or an invalid prompt.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setScreen(Screen.EDIT); // Stay on edit screen to allow retry
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, currentMimeType]);

  const handleAccept = useCallback(() => {
    if (!originalImage || !generatedImage || !currentPrompt) return;
    const newProject: Project = {
      id: new Date().toISOString(),
      originalImage,
      generatedImage,
      prompt: currentPrompt,
      createdAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
    setOriginalImage(null);
    setGeneratedImage(null);
    setCurrentPrompt('');
    setScreen(Screen.UPLOAD);
  }, [originalImage, generatedImage, currentPrompt, projects, setProjects]);
  
  const handleRedo = useCallback(() => {
    setGeneratedImage(null);
    setCurrentPrompt('');
    setScreen(Screen.EDIT);
  }, []);

  const handleEditAgain = useCallback(() => {
    if (!generatedImage) return;
    setOriginalImage(generatedImage);
    setGeneratedImage(null);
    setCurrentPrompt('');
    setScreen(Screen.EDIT);
  }, [generatedImage]);

  const handleNewProject = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setCurrentPrompt('');
    setError(null);
    setScreen(Screen.UPLOAD);
  }, []);
  
  const handleViewProjects = useCallback(() => setScreen(Screen.PROJECTS), []);
  const handleDeleteProject = useCallback((id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  }, [projects, setProjects]);


  const renderScreen = () => {
    switch (screen) {
      case Screen.UPLOAD:
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
      case Screen.EDIT:
        return <EditScreen originalImage={originalImage!} onGenerate={handleGenerate} isLoading={isLoading} error={error} />;
      case Screen.RESULT:
        return <ResultScreen 
                  originalImage={originalImage!} 
                  generatedImage={generatedImage!}
                  prompt={currentPrompt}
                  onAccept={handleAccept} 
                  onRedo={handleRedo} 
                  onEditAgain={handleEditAgain} 
                />;
      case Screen.PROJECTS:
        return <ProjectsScreen projects={projects} onDeleteProject={handleDeleteProject} />;
      default:
        return <UploadScreen onImageUpload={handleImageUpload} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-sans text-gray-800">
      <Header onNewProject={handleNewProject} onViewProjects={handleViewProjects} />
      <main className="p-4 sm:p-8 pt-24">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
