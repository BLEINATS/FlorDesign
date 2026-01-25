import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import DashboardScreen from './components/DashboardScreen';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import ResultScreen from './components/ResultScreen';
import ProjectsScreen from './components/ProjectsScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import ProfileScreen from './components/ProfileScreen';
import StoreScreen from './components/StoreScreen'; 
import CatalogScreen from './components/CatalogScreen';
import ChoiceScreen from './components/ChoiceScreen'; 
import AdminDashboard from './components/admin/AdminDashboard'; 
import AuthModal from './components/AuthModal';
import LogoutModal from './components/LogoutModal'; 
import PurchaseSuccessModal from './components/PurchaseSuccessModal';
import InsufficientCreditsModal from './components/InsufficientCreditsModal'; // Importado
import useLocalStorage from './hooks/useLocalStorage';
import { generateImage, describeImage } from './services/geminiService';
import { ImageData, EditMode, Project, Screen, COSTS, User, CreditPackage, Transaction, UsageLog, AI_OPERATIONAL_COSTS } from './types';

const INITIAL_CREDITS = 0; 

// --- DADOS REAIS PARA SIMULAÇÃO ---
const MOCK_CLIENT_USER: User = {
  id: 'user-ana-silva',
  name: 'Ana Silva',
  email: 'ana.silva@studio.com',
  isGuest: false,
  isAdmin: false,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  credits: 150 // Ana começa com créditos para teste
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
      id: 'txn-001',
      userId: 'user-ana-silva',
      userName: 'Ana Silva',
      userEmail: 'ana.silva@studio.com',
      packageId: 'starter',
      packageLabel: 'Iniciante',
      creditsAmount: 50,
      price: 'R$ 29,90',
      value: 29.90,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      status: 'completed',
      paymentMethod: 'credit_card',
      billingCycle: 'one-time'
  },
  {
      id: 'txn-002',
      userId: 'user-ana-silva',
      userName: 'Ana Silva',
      userEmail: 'ana.silva@studio.com',
      packageId: 'pro',
      packageLabel: 'Profissional',
      creditsAmount: 200,
      price: 'R$ 89,90',
      value: 89.90,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      status: 'completed',
      paymentMethod: 'pix',
      billingCycle: 'one-time'
  }
];

// Mock de uso para a Ana Silva (para o admin ver custos)
const MOCK_USAGE_LOGS: UsageLog[] = [
    { id: 'log-1', userId: 'user-ana-silva', action: 'generate', costInBrl: 0.02, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    { id: 'log-2', userId: 'user-ana-silva', action: 'humanize', costInBrl: 0.05, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    { id: 'log-3', userId: 'user-ana-silva', action: 'generate', costInBrl: 0.02, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<EditMode>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingInspiration, setIsGettingInspiration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  
  // NOVO ESTADO: Controla se devemos pular a tela de escolha (ChoiceScreen)
  const [bypassChoiceScreen, setBypassChoiceScreen] = useState(false);

  // --- AUTH & USER STATE ---
  const [user, setUser] = useLocalStorage<User | null>('flora-user', null);
  const [allUsers, setAllUsers] = useLocalStorage<User[]>('flora-db-users', [MOCK_CLIENT_USER]);
  const [guestUsageCount, setGuestUsageCount] = useLocalStorage<number>('flora-guest-usage', 0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [authTriggerAction, setAuthTriggerAction] = useState<string>('');

  // --- PURCHASE SUCCESS STATE ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPurchasedCredits, setLastPurchasedCredits] = useState(0);

  // --- INSUFFICIENT CREDITS STATE ---
  const [insufficientCreditsData, setInsufficientCreditsData] = useState<{cost: number} | null>(null);

  const [projects, setProjects] = useLocalStorage<Project[]>('flora-design-projects', []);
  const [credits, setCredits] = useLocalStorage<number>('flora-credits', INITIAL_CREDITS);
  
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('flora-transactions', MOCK_TRANSACTIONS);
  const [usageLogs, setUsageLogs] = useLocalStorage<UsageLog[]>('flora-usage-logs', MOCK_USAGE_LOGS);
  
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  useEffect(() => {
      if (allUsers.length === 0) setAllUsers([MOCK_CLIENT_USER]);
      if (transactions.length === 0) setTransactions(MOCK_TRANSACTIONS);
      if (usageLogs.length === 0) setUsageLogs(MOCK_USAGE_LOGS);
  }, []);

  // SINCRONIZAÇÃO DE CRÉDITOS:
  useEffect(() => {
    if (user) {
        setAllUsers(prevUsers => prevUsers.map(u => 
            u.id === user.id ? { ...u, credits: credits } : u
        ));
    }
  }, [credits]);

  const requireAuth = (actionName: string): boolean => {
      if (user) return true;
      setAuthTriggerAction(actionName);
      setShowAuthModal(true);
      return false;
  };

  const handleLogin = (name: string, email: string) => {
      const isAdmin = email === 'admin@flora.com';
      const userExists = allUsers.find(u => u.email === email);
      let activeUser: User;

      if (userExists) {
          const finalName = (name === "Usuário" && userExists.name && userExists.name !== "Usuário") 
                            ? userExists.name 
                            : name;

          activeUser = { ...userExists, name: finalName, isAdmin };
          setAllUsers(allUsers.map(u => u.id === activeUser.id ? activeUser : u));
          setCredits(userExists.credits || 0);
      } else {
          activeUser = {
              id: `user-${Date.now()}`,
              name,
              email,
              isGuest: false,
              isAdmin: isAdmin,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
              createdAt: new Date().toISOString(),
              credits: 0 
          };
          setAllUsers([...allUsers, activeUser]);
          setCredits(0);
      }
      
      setUser(activeUser);
      setShowAuthModal(false);

      if (isAdmin) {
          setScreen('admin');
      }
  };

  const handleLogoutRequest = () => setShowLogoutModal(true);

  const performLogout = () => {
      setUser(null);
      setCredits(0); 
      setScreen('landing');
      setShowLogoutModal(false);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
      if (user) {
          const updatedUser = { ...user, ...updatedData };
          setUser(updatedUser);
          
          setAllUsers(allUsers.map(u => 
              (u.id === user.id || u.email === user.email) ? { ...u, ...updatedData } : u
          ));
      }
  };

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setPrompt(initialPrompt || '');
    setError(null);
    
    // LÓGICA DE BYPASS: Se bypassChoiceScreen for true, vai direto para EditScreen com o modo selecionado
    if (bypassChoiceScreen) {
        setScreen('edit');
    } else {
        setScreen('choice'); 
    }
  };

  const handleChoiceSelect = (mode: EditMode) => {
    setSelectedMode(mode);
    setScreen('edit');
  };

  const calculateCost = (mode: EditMode): number => {
      return mode === 'humanize' ? COSTS.HUMANIZE : COSTS.STANDARD;
  };

  const handleGenerate = async (newPrompt: string, mode: EditMode, isHighQuality: boolean) => {
    if (!originalImage) return;

    if (!user) {
        if (guestUsageCount >= 1) {
            requireAuth("continuar gerando");
            return;
        }
        setGuestUsageCount(prev => prev + 1);
    } else {
        const cost = calculateCost(mode);
        if (credits < cost) {
            // SUBSTITUIÇÃO: Em vez de window.confirm, usamos o estado do modal
            setInsufficientCreditsData({ cost });
            return;
        }
        setCredits(prev => prev - cost);
    }

    setIsLoading(true);
    setError(null);
    setPrompt(newPrompt);

    try {
      const result = await generateImage(originalImage, {
        prompt: newPrompt,
        mode: mode,
        isHighQuality: isHighQuality,
        fidelityLevel: 'balanced'
      });
      
      setGeneratedImage(result);
      setScreen('result');

      if (user) {
          const realCost = mode === 'humanize' ? AI_OPERATIONAL_COSTS.HUMANIZE : AI_OPERATIONAL_COSTS.STANDARD;
          const newLog: UsageLog = {
              id: `log-${Date.now()}`,
              userId: user.id,
              action: mode === 'humanize' ? 'humanize' : 'generate',
              costInBrl: realCost,
              date: new Date().toISOString()
          };
          setUsageLogs([...usageLogs, newLog]);
      }

    } catch (e: any) {
      if (user) {
         const cost = calculateCost(mode);
         setCredits(prev => prev + cost); 
      }
      console.error("Erro na geração:", e);
      setError(e.message || 'Ocorreu um erro. Seus créditos foram estornados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredits = (pkg: CreditPackage, cycle: 'one-time' | 'monthly' | 'yearly', finalPrice: number) => {
      if (!requireAuth("comprar créditos")) return;

      setIsLoading(true);
      
      setTimeout(() => {
          const creditsToAdd = cycle === 'yearly' ? pkg.credits * 12 : pkg.credits;
          setCredits(prev => prev + creditsToAdd);
          
          const formattedPrice = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          
          let label = pkg.label;
          if (cycle === 'monthly') label += ' (Mensal)';
          if (cycle === 'yearly') label += ' (Anual)';

          const newTransaction: Transaction = {
              id: `txn-${Date.now()}`,
              userId: user!.id,
              userName: user!.name,
              userEmail: user!.email,
              packageId: pkg.id,
              packageLabel: label,
              creditsAmount: creditsToAdd,
              price: formattedPrice,
              value: finalPrice,
              date: new Date().toISOString(),
              status: 'completed',
              paymentMethod: 'credit_card',
              billingCycle: cycle
          };
          
          setTransactions([newTransaction, ...transactions]);
          setIsLoading(false);
          setLastPurchasedCredits(creditsToAdd);
          setShowSuccessModal(true);
      }, 1500);
  };

  const handleCloseSuccessModal = () => {
      setShowSuccessModal(false);
      setScreen('dashboard');
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
    if (!requireAuth("salvar seu projeto")) return;
    if (!originalImage || !generatedImage) return;

    const newProject: Project = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      prompt,
      originalImageUrl: `data:${originalImage.mimeType};base64,${originalImage.data}`,
      generatedImageUrl: `data:${generatedImage.mimeType};base64,${generatedImage.data}`,
      createdAt: new Date().toISOString(),
      cost: selectedMode === 'humanize' ? COSTS.HUMANIZE : COSTS.STANDARD
    };
    setProjects([newProject, ...projects]);
    setScreen('projects');
  };
  
  const handleEditAgain = () => {
    if (!requireAuth("refinar o design")) return;
    if (!generatedImage) return;
    setOriginalImage(generatedImage);
    setGeneratedImage(null);
    setScreen('edit');
  };

  // ATUALIZADO: Aceita bypassChoice para pular a tela de escolha (usado nos botões de atalho)
  const handleRestart = (mode: EditMode = 'edit', promptFromCatalog?: string, bypassChoice: boolean = false) => {
    if (promptFromCatalog && originalImage) {
        setPrompt(promptFromCatalog);
        setInitialPrompt(promptFromCatalog);
        setScreen('edit');
        return;
    }
    if (!originalImage) {
        setOriginalImage(null);
        setGeneratedImage(null);
    }
    setPrompt(promptFromCatalog || '');
    setInitialPrompt(promptFromCatalog || '');
    setError(null);
    setSelectedMode(mode);
    setBypassChoiceScreen(bypassChoice); // Define se deve pular a tela de escolha
    setScreen('upload');
  };

  const handleViewProjects = () => {
      if (!requireAuth("ver seus projetos")) return;
      setViewingProject(null);
      setScreen('projects');
  }

  const handleViewCatalog = () => setScreen('catalog');
  
  const handleViewProject = (id: string) => {
      const project = projects.find(p => p.id === id);
      if (project) {
          setViewingProject(project);
          setScreen('projectDetail');
      }
  };

  const handleDeleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));
  
  const handleViewProfile = () => {
      if (!requireAuth("acessar seu perfil")) return;
      if (user?.isAdmin) setScreen('admin');
      else setScreen('profile');
  }

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return <LandingPage onStart={() => setScreen('dashboard')} />;
      case 'dashboard':
        return (
          <DashboardScreen 
            projects={user ? projects : []} 
            onNewProject={handleRestart} 
            onViewProject={handleViewProject}
            onNavigateToProjects={handleViewProjects}
            onViewProfile={handleViewProfile}
            credits={user ? credits : 0} 
            onOpenStore={() => { if(requireAuth("acessar a loja")) setScreen('store'); }}
            userName={user?.name}
            onNavigateToLanding={() => setScreen('landing')}
            onNavigateToCatalog={handleViewCatalog}
          />
        );
      case 'store':
        return (
            <StoreScreen 
                currentCredits={credits}
                onBuy={handleBuyCredits}
                onBack={() => setScreen('dashboard')}
            />
        );
      case 'admin':
        return (
            <AdminDashboard 
                onBack={() => setScreen('dashboard')}
                onLogout={handleLogoutRequest}
            />
        );
      case 'catalog':
        return (
            <CatalogScreen 
                onNavigateToHome={() => setScreen('dashboard')}
                onNavigateToProjects={handleViewProjects}
                onNewProject={(mode, prompt) => handleRestart(mode, prompt, true)} // Catálogo sempre pula escolha
                onViewProfile={handleViewProfile}
            />
        );
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <UploadScreen 
              onImageUpload={handleImageUpload} 
              isLoading={isLoading} 
              projects={user ? projects.slice(0, 4) : []} 
              onViewProject={handleViewProject} 
              onNewProject={() => handleRestart('edit', undefined, false)}
              onBack={() => setScreen('dashboard')}
            />
          </div>
        );
      case 'choice':
        if (!originalImage) { handleRestart(); return null; }
        return (
          <ChoiceScreen 
            originalImage={originalImage} 
            onSelect={handleChoiceSelect} 
            onBack={() => setScreen('upload')} 
          />
        );
      case 'edit':
        if (!originalImage) { handleRestart(); return null; }
        return (
          <div className="w-full h-full flex flex-col">
            <EditScreen 
              originalImage={originalImage}
              initialMode={selectedMode}
              initialPrompt={initialPrompt}
              onGenerate={handleGenerate} 
              onGetInspiration={(img) => handleGetInspiration(img)} 
              isLoading={isLoading || isGettingInspiration} 
              error={error} 
              onRestart={() => setScreen('upload')}
              onSave={handleSave}
              currentCredits={user ? credits : 999} 
            />
          </div>
        );
      case 'result':
        if (!originalImage || !generatedImage) { handleRestart(); return null; }
        return (
            <ResultScreen 
                originalImage={originalImage} 
                generatedImage={generatedImage} 
                prompt={prompt} 
                onSave={handleSave} 
                onRestart={() => handleRestart('edit', undefined, false)} 
                onEditAgain={handleEditAgain}
                isGuest={!user} 
                onTriggerAuth={(action) => requireAuth(action)}
            />
        );
      case 'projects':
          return (
            <ProjectsScreen 
                projects={projects} 
                onViewProject={handleViewProject} 
                onDeleteProject={handleDeleteProject} 
                onNewProject={() => handleRestart('edit', undefined, false)}
                onNavigateToHome={() => setScreen('dashboard')}
                onViewProfile={handleViewProfile}
                onNavigateToCatalog={handleViewCatalog}
            />
          );
      case 'projectDetail':
          if (!viewingProject) { handleViewProjects(); return null; }
          return <ProjectDetailScreen project={viewingProject} onBack={handleViewProjects} />;
      case 'profile':
          return (
            <ProfileScreen 
              projects={projects}
              onNavigateToHome={() => setScreen('dashboard')}
              onNavigateToProjects={handleViewProjects}
              onNewProject={() => handleRestart('edit', undefined, false)}
              onNavigateToCatalog={handleViewCatalog}
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onLogout={handleLogoutRequest}
            />
          );
      default:
        return <LandingPage onStart={() => setScreen('dashboard')} />;
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-sans text-white">
      {screen !== 'landing' && screen !== 'dashboard' && screen !== 'edit' && screen !== 'choice' && screen !== 'upload' && screen !== 'profile' && screen !== 'store' && screen !== 'catalog' && screen !== 'admin' && (
        <Header 
            onHome={() => setScreen('dashboard')} 
            onNew={() => handleRestart('edit', undefined, false)} 
            onProjects={handleViewProjects} 
            credits={user ? credits : 0}
            onOpenStore={() => { if(requireAuth("acessar a loja")) setScreen('store'); }}
        />
      )}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        triggerAction={authTriggerAction}
      />

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={performLogout}
      />

      <PurchaseSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        creditsAdded={lastPurchasedCredits}
      />

      {/* NOVO MODAL DE CRÉDITOS INSUFICIENTES */}
      <InsufficientCreditsModal 
        isOpen={!!insufficientCreditsData}
        onClose={() => setInsufficientCreditsData(null)}
        onRecharge={() => {
            setInsufficientCreditsData(null);
            setScreen('store');
        }}
        cost={insufficientCreditsData?.cost || 0}
        currentCredits={credits}
      />

      {isLoading && screen === 'store' && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
             <div className="w-16 h-16 border-4 border-[#13ec5b]/20 border-t-[#13ec5b] rounded-full animate-spin mb-4"></div>
             <p className="text-[#13ec5b] font-black uppercase tracking-widest animate-pulse">Processando Compra...</p>
          </div>
      )}

      <main className="flex-1 relative flex flex-col">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
