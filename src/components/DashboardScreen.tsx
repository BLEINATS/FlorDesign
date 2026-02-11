import React, { useState } from 'react';
import { Project, EditMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationModal from './NotificationModal';

interface DashboardScreenProps {
  projects: Project[];
  onNewProject: (mode?: EditMode, prompt?: string, bypassChoice?: boolean) => void;
  onViewProject: (id: string) => void;
  onNavigateToProjects: () => void;
  onViewProfile: () => void;
  userName?: string;
  credits: number;
  onOpenStore: () => void;
  onNavigateToLanding: () => void;
  onNavigateToCatalog: () => void; 
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  projects, 
  onNewProject, 
  onViewProject, 
  onNavigateToProjects,
  onViewProfile,
  userName = "Visitante",
  credits,
  onOpenStore,
  onNavigateToLanding,
  onNavigateToCatalog
}) => {
  const { t, language, setLanguage } = useLanguage();
  
  // Imagem de folha para o fundo do card (Monstera escura/elegante)
  const leafImage = "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=800";

  // --- NOTIFICATION STATE ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Bem-vindo!', message: 'Comece a criar designs incríveis com FloraDesign AI.', time: 'Agora', type: 'gift', read: false },
    { id: '2', title: 'Dica Pro', message: 'Use o modo Humanização para renderizações 3D realistas.', time: '2h atrás', type: 'info', read: false },
    { id: '3', title: 'Atualização', message: 'Novas espécies de Orquídeas adicionadas ao catálogo.', time: '1d atrás', type: 'success', read: true },
  ]);

  // --- LANGUAGE MENU STATE ---
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleOpenNotifications = () => {
    setShowNotifications(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#102216] min-h-screen text-white font-display relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 pt-safe-top bg-[#102216]/90 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
        <button 
            onClick={onNavigateToLanding}
            className="group relative flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors"
        >
            <div className="absolute inset-0 bg-[#13ec5b]/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="material-symbols-outlined text-3xl text-[#13ec5b] transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110">
                eco
            </span>
        </button>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={onOpenStore}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13ec5b]/10 border border-[#13ec5b]/30 active:scale-95 transition-all"
            >
                <span className="material-symbols-outlined text-[#13ec5b] text-[18px]">token</span>
                <span className="text-xs font-bold text-[#13ec5b]">{credits}</span>
                <span className="material-symbols-outlined text-[#13ec5b] text-[14px] ml-1 bg-[#13ec5b]/20 rounded-full">add</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
                <button 
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors active:scale-90 border border-white/5"
                >
                    <span className="material-symbols-outlined text-xl">language</span>
                </button>
                
                {showLanguageMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
                        <div className="absolute top-12 right-0 bg-[#1c271f] border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 w-36 z-50 flex flex-col gap-1 animate-fade-in overflow-hidden">
                            <button onClick={() => { setLanguage('pt'); setShowLanguageMenu(false); }} className={`px-4 py-3 rounded-xl text-xs font-bold text-left hover:bg-white/5 flex items-center gap-3 transition-colors ${language === 'pt' ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'text-white/70'}`}>
                                <span className="text-base">🇧🇷</span> Português
                            </button>
                            <button onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }} className={`px-4 py-3 rounded-xl text-xs font-bold text-left hover:bg-white/5 flex items-center gap-3 transition-colors ${language === 'en' ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'text-white/70'}`}>
                                <span className="text-base">🇺🇸</span> English
                            </button>
                            <button onClick={() => { setLanguage('es'); setShowLanguageMenu(false); }} className={`px-4 py-3 rounded-xl text-xs font-bold text-left hover:bg-white/5 flex items-center gap-3 transition-colors ${language === 'es' ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'text-white/70'}`}>
                                <span className="text-base">🇪🇸</span> Español
                            </button>
                        </div>
                    </>
                )}
            </div>

            <button 
                onClick={handleOpenNotifications}
                className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors relative active:scale-90"
            >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-[#102216] animate-pulse"></span>
            )}
            </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        
        <div className="px-6 pt-6 pb-4">
            <h1 className="text-2xl font-bold leading-tight">
                {t('dash_welcome')} <span className="text-[#13ec5b]">FloraDesign</span>
            </h1>
        </div>

        <div className="px-6 mb-8">
            <div 
                // "Criar Agora" (Geral) NÃO pula a tela de escolha (bypass = false)
                onClick={() => onNewProject('edit', undefined, false)}
                className="rounded-[32px] overflow-hidden bg-[#0a160f] shadow-2xl border border-white/5 group relative h-56 cursor-pointer transition-all hover:border-[#13ec5b]/30"
            >
                {/* Folha de Fundo (Lado Direito) */}
                <div className="absolute top-0 right-0 h-full w-3/4 opacity-50 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-70 transition-all duration-700 ease-out">
                    <img 
                        src={leafImage}
                        alt="Leaf Background" 
                        className="w-full h-full object-cover object-center"
                        style={{ 
                            maskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)'
                        }}
                    />
                </div>
                
                {/* Gradiente de Leitura (Esquerda para Direita) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a160f] via-[#0a160f]/90 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-start z-10">
                    {/* Badge */}
                    <div className="bg-[#13ec5b]/10 border border-[#13ec5b]/20 px-3 py-1.5 rounded-full mb-3 backdrop-blur-md">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#13ec5b] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                            {t('dash_new_creation')}
                        </span>
                    </div>
                    
                    {/* Título */}
                    <h3 className="text-3xl font-serif italic text-white mb-2 leading-tight drop-shadow-lg">
                        {t('dash_start_project')}
                    </h3>
                    
                    {/* Descrição */}
                    <p className="text-[11px] text-white/70 font-medium max-w-[240px] mb-6 leading-relaxed">
                        {t('dash_start_desc')}
                    </p>
                    
                    {/* Botão */}
                    <button 
                        className="bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl font-black uppercase tracking-wider text-[10px] shadow-[0_0_20px_rgba(19,236,91,0.2)] group-hover:shadow-[0_0_30px_rgba(19,236,91,0.4)] transition-all flex items-center gap-2 group-hover:scale-105"
                    >
                        {t('dash_create_now')}
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="px-6 mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {t('dash_quick_tools')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    // "Studio IA" (Ferramenta Rápida) PULA a tela de escolha (bypass = true)
                    onClick={() => onNewProject('edit', undefined, true)}
                    className="bg-[#1c271f] p-5 rounded-[24px] border border-white/5 flex flex-col items-start gap-4 hover:border-[#13ec5b]/30 transition-all group active:scale-95 text-left relative overflow-hidden"
                >
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 rounded-full border border-white/5 text-[8px] text-[#13ec5b] font-bold z-20">
                        5 {t('dash_credits')}
                    </div>
                    
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#13ec5b] via-transparent to-[#13ec5b] opacity-60 blur-sm animate-[spin_4s_linear_infinite]" />
                        <div className="absolute -inset-[1px] rounded-full border border-[#13ec5b]/30" />
                        
                        <div className="size-10 rounded-full bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] relative z-10 border border-[#13ec5b]/20">
                            <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h4 className="font-bold text-white mb-1">{t('dash_studio_ia')}</h4>
                        <p className="text-[10px] text-[#9db9a6] font-medium uppercase tracking-wider">{t('dash_studio_desc')}</p>
                    </div>
                </button>

                <button 
                    // "Humanização" (Ferramenta Rápida) PULA a tela de escolha (bypass = true)
                    onClick={() => onNewProject('humanize', undefined, true)}
                    className="bg-[#1c271f] p-5 rounded-[24px] border border-white/5 flex flex-col items-start gap-4 hover:border-[#13ec5b]/30 transition-all group active:scale-95 text-left relative overflow-hidden"
                >
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 rounded-full border border-white/5 text-[8px] text-[#13ec5b] font-bold z-20">
                        10 {t('dash_credits')}
                    </div>
                    
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#13ec5b] via-transparent to-[#13ec5b] opacity-60 blur-sm animate-[spin_4s_linear_infinite]" />
                        <div className="absolute -inset-[1px] rounded-full border border-[#13ec5b]/30" />

                        <div className="size-10 rounded-full bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] relative z-10 border border-[#13ec5b]/20">
                            <span className="material-symbols-outlined">view_in_ar</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h4 className="font-bold text-white mb-1">{t('dash_humanize')}</h4>
                        <p className="text-[10px] text-[#9db9a6] font-medium uppercase tracking-wider">{t('dash_humanize_desc')}</p>
                    </div>
                </button>
            </div>
        </div>

        <div className="px-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{t('dash_recents')}</h3>
                <button onClick={onNavigateToProjects} className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-widest hover:underline">{t('dash_view_all')}</button>
            </div>

            <div className="flex flex-col gap-3">
                {projects.length === 0 ? (
                    <div className="p-8 rounded-[24px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="material-symbols-outlined text-3xl mb-2">image_not_supported</span>
                        <p className="text-xs">{t('dash_no_projects')}</p>
                    </div>
                ) : (
                    projects.slice(0, 3).map((project) => (
                        <button 
                            key={project.id}
                            onClick={() => onViewProject(project.id)}
                            className="flex items-center gap-4 p-3 bg-[#1c271f] rounded-[20px] border border-white/5 hover:bg-[#253329] transition-colors group text-left"
                        >
                            <div className="size-16 rounded-2xl overflow-hidden bg-black/20 flex-shrink-0">
                                <img src={project.generatedImageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate mb-1">{project.prompt}</h4>
                                <p className="text-[10px] text-[#9db9a6] font-medium uppercase tracking-wider">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-white/20 group-hover:text-[#13ec5b] transition-colors">chevron_right</span>
                        </button>
                    ))
                )}
            </div>
        </div>

      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#102216]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom pt-2 px-6 z-50 h-[88px]">
        <div className="flex items-end justify-between max-w-md mx-auto h-full pb-4">
            
            <button className="flex flex-col items-center gap-1.5 group w-14">
                <span className="material-symbols-outlined text-[#13ec5b] text-[26px]">home</span>
                <span className="text-[10px] font-bold text-[#13ec5b]">{t('nav_home')}</span>
            </button>

            <button onClick={onNavigateToProjects} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">architecture</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_projects')}</span>
            </button>

            <div className="relative -top-6">
                <button 
                    // Botão central Studio IA PULA a tela de escolha
                    onClick={() => onNewProject('edit', undefined, true)}
                    className="flex flex-col items-center justify-center bg-[#13ec5b] size-16 rounded-full shadow-[0_0_30px_rgba(19,236,91,0.3)] border-[6px] border-[#102216] active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-[#102216] font-bold text-[28px]">magic_button</span>
                </button>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#13ec5b] whitespace-nowrap">{t('dash_studio_ia')}</span>
            </div>

            {/* Catalog Button (Now Active) */}
            <button onClick={onNavigateToCatalog} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">local_florist</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_catalog')}</span>
            </button>

            <button onClick={onViewProfile} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">person</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_profile')}</span>
            </button>

        </div>
      </nav>

      <NotificationModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        notifications={notifications as any}
        onMarkAllRead={handleMarkAllRead}
      />

      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .pb-safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default DashboardScreen;
