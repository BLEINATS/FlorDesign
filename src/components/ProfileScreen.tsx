import React, { useState, useRef, ChangeEvent } from 'react';
import { Project, EditMode, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';
import ResetDataModal from './ResetDataModal';
import { TERMS_OF_USE } from '../data/termsOfUse'; // Importando os termos

interface ProfileScreenProps {
  projects: Project[];
  onNavigateToHome: () => void;
  onNavigateToProjects: () => void;
  onNewProject: (mode?: EditMode) => void;
  onNavigateToCatalog: () => void;
  user: User | null;
  onUpdateUser: (data: Partial<User>) => void;
  onLogout: () => void;
}

type ModalType = 'editProfile' | 'changePassword' | 'help' | 'terms' | 'language' | null;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  projects, 
  onNavigateToHome, 
  onNavigateToProjects,
  onNewProject,
  onNavigateToCatalog,
  user,
  onUpdateUser,
  onLogout
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [editName, setEditName] = useState(user?.name || '');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUser = {
    name: user ? user.name : "Visitante",
    role: user ? user.email : "Faça login para salvar",
    avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    level: user ? "Membro Flora" : "Entusiasta"
  };

  const stats = [
    { label: t('prof_projects'), value: projects.length, icon: "architecture" },
    { label: t('prof_favorites'), value: "0", icon: "favorite" },
    { label: t('prof_level'), value: user ? "1" : "-", icon: "military_tech" },
  ];

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            showToast("Por favor, selecione uma imagem válida.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
      if (editName.trim()) {
          const updates: Partial<User> = { name: editName };
          if (newAvatar) {
              updates.avatar = newAvatar;
          }
          onUpdateUser(updates);
          showToast(t('prof_save_success'));
          setActiveModal(null);
          setNewAvatar(null);
      }
  };

  const handleChangePassword = () => {
      if (oldPassword && newPassword) {
          showToast(t('prof_pass_success'));
          setOldPassword('');
          setNewPassword('');
          setActiveModal(null);
      } else {
          showToast("Preencha todos os campos.");
      }
  };

  const toggleNotifications = () => {
      setNotificationsEnabled(!notificationsEnabled);
      showToast(notificationsEnabled ? "Notificações desativadas." : "Notificações ativadas.");
  };

  const handleResetData = () => {
      localStorage.removeItem('flora-design-projects');
      window.location.reload();
  };

  const getLanguageLabel = (lang: Language) => {
      switch(lang) {
          case 'pt': return 'Português (Brasil)';
          case 'en': return 'English';
          case 'es': return 'Español';
          default: return 'Português';
      }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#102216] min-h-screen text-white font-display relative overflow-hidden animate-slide-up">
      
      {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-full shadow-xl animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span className="text-xs font-bold uppercase tracking-wide">{toastMessage}</span>
          </div>
      )}

      <ResetDataModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetData}
      />

      <div className="flex items-center justify-between p-6 pt-safe-top bg-[#102216]/90 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
        <h2 className="text-lg font-bold tracking-tight text-white">{t('prof_title')}</h2>
        <button 
            onClick={() => setShowSettings(true)}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors active:rotate-90 duration-300"
        >
           <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar px-6 pt-6">
        
        <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4 group cursor-pointer" onClick={() => {
                if (user) {
                    setEditName(user.name);
                    setNewAvatar(null);
                    setActiveModal('editProfile');
                }
            }}>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#13ec5b] via-transparent to-[#13ec5b] opacity-70 blur-sm animate-[spin_4s_linear_infinite]" />
                <div className="absolute -inset-[2px] rounded-full border border-[#13ec5b]/30" />
                
                <div className="relative size-32 rounded-full p-1 bg-[#102216] z-10">
                    <img src={displayUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-[#102216]" />
                    {user && (
                         <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="material-symbols-outlined text-white">edit</span>
                         </div>
                    )}
                </div>
                {user && (
                    <button className="absolute bottom-1 right-1 z-20 size-8 bg-[#13ec5b] border-2 border-[#102216] rounded-full flex items-center justify-center text-[#102216] shadow-lg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm font-bold">edit</span>
                    </button>
                )}
            </div>
            <h1 className="text-2xl font-bold text-white">{displayUser.name}</h1>
            <p className="text-[#9db9a6] text-xs font-bold uppercase tracking-widest mt-1">{displayUser.role}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#1c271f] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[#13ec5b]/50 text-xl mb-1">{stat.icon}</span>
                    <span className="text-xl font-bold text-white">{stat.value}</span>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</span>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2 px-2">{t('prof_general')}</h3>
            
            <button 
                onClick={() => setActiveModal('language')}
                className="flex items-center gap-4 p-4 bg-[#1c271f] rounded-2xl border border-white/5 hover:bg-[#253329] active:scale-[0.98] transition-all group"
            >
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined">language</span>
                </div>
                <div className="flex-1 text-left">
                    <h4 className="font-bold text-white text-sm">{t('prof_language')}</h4>
                    <p className="text-[10px] text-[#9db9a6]">{getLanguageLabel(language)}</p>
                </div>
                <span className="material-symbols-outlined text-white/20">chevron_right</span>
            </button>

             <button 
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-4 p-4 bg-[#1c271f] rounded-2xl border border-white/5 hover:bg-red-900/20 active:scale-[0.98] transition-all group mt-4"
            >
                <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined">delete_forever</span>
                </div>
                <div className="flex-1 text-left">
                    <h4 className="font-bold text-red-400 text-sm">{t('prof_reset')}</h4>
                    <p className="text-[10px] text-red-400/60">Cache</p>
                </div>
            </button>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">{t('prof_version')} 1.0.0 Beta</p>
        </div>

      </main>

      {/* --- SETTINGS OVERLAY --- */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-[#102216] animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-6 pt-safe-top border-b border-white/5 bg-[#102216]">
                <h2 className="text-lg font-bold text-white">{t('prof_settings')}</h2>
                <button 
                    onClick={() => setShowSettings(false)}
                    className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                    <h3 className="text-[#13ec5b] text-xs font-black uppercase tracking-widest mb-4">{t('prof_account')}</h3>
                    <div className="bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden">
                        <button 
                            onClick={() => {
                                setEditName(user?.name || '');
                                setNewAvatar(null);
                                setActiveModal('editProfile');
                            }}
                            className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-sm font-bold text-white">{t('prof_edit_profile')}</span>
                            <span className="material-symbols-outlined text-white/30 text-lg">chevron_right</span>
                        </button>
                        <button 
                            onClick={() => setActiveModal('changePassword')}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-sm font-bold text-white">{t('prof_change_pass')}</span>
                            <span className="material-symbols-outlined text-white/30 text-lg">chevron_right</span>
                        </button>
                    </div>
                </section>

                <section>
                    <h3 className="text-[#13ec5b] text-xs font-black uppercase tracking-widest mb-4">{t('prof_preferences')}</h3>
                    <div className="bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="w-full flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-white/50">notifications</span>
                                <span className="text-sm font-bold text-white">{t('prof_notifications')}</span>
                            </div>
                            <button 
                                onClick={toggleNotifications}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-[#13ec5b]' : 'bg-white/10'}`}
                            >
                                <div className={`size-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        <button 
                            onClick={() => showToast("Em breve: Tema Claro")}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-white/50">dark_mode</span>
                                <span className="text-sm font-bold text-white">{t('prof_theme')}</span>
                            </div>
                            <span className="text-xs text-white/40 font-bold uppercase">Dark</span>
                        </button>
                    </div>
                </section>

                <section>
                    <h3 className="text-[#13ec5b] text-xs font-black uppercase tracking-widest mb-4">{t('prof_support')}</h3>
                    <div className="bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden">
                        <button 
                            onClick={() => setActiveModal('help')}
                            className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-sm font-bold text-white">{t('prof_help')}</span>
                            <span className="material-symbols-outlined text-white/30 text-lg">open_in_new</span>
                        </button>
                        <button 
                            onClick={() => setActiveModal('terms')}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-sm font-bold text-white">{t('prof_terms')}</span>
                            <span className="material-symbols-outlined text-white/30 text-lg">description</span>
                        </button>
                    </div>
                </section>

                {user && (
                    <button 
                        onClick={() => {
                            onLogout();
                            setShowSettings(false);
                        }}
                        className="w-full h-14 rounded-2xl border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {t('prof_logout')}
                    </button>
                )}
            </div>
        </div>
      )}

      {/* MODAL CONTENT */}
      {activeModal && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-[#1c271f] border border-white/10 rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
                  
                  {activeModal === 'language' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-6 text-center">{t('prof_language')}</h3>
                        <div className="space-y-3">
                            {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setActiveModal(null);
                                    }}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${language === lang ? 'bg-[#13ec5b]/20 border-[#13ec5b] text-[#13ec5b]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    <span className="font-bold">{getLanguageLabel(lang)}</span>
                                    {language === lang && <span className="material-symbols-outlined">check</span>}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl bg-white/5 text-white font-bold uppercase text-xs hover:bg-white/10 mt-4">Cancelar</button>
                      </>
                  )}

                  {activeModal === 'editProfile' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-6 text-center">{t('prof_edit_profile')}</h3>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative size-24 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img 
                                    src={newAvatar || displayUser.avatar} 
                                    alt="Avatar Preview" 
                                    className="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-[#13ec5b] transition-colors" 
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Nome</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl bg-white/5 text-white/60 font-bold uppercase text-xs hover:bg-white/10">Cancelar</button>
                                <button onClick={handleSaveProfile} className="flex-1 h-12 rounded-xl bg-[#13ec5b] text-[#102216] font-bold uppercase text-xs hover:bg-[#13ec5b]/90">Salvar</button>
                            </div>
                        </div>
                      </>
                  )}

                  {activeModal === 'changePassword' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-6 text-center">{t('prof_change_pass')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Senha Atual</label>
                                <input 
                                    type="password" 
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Nova Senha</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl bg-white/5 text-white/60 font-bold uppercase text-xs hover:bg-white/10">Cancelar</button>
                                <button onClick={handleChangePassword} className="flex-1 h-12 rounded-xl bg-[#13ec5b] text-[#102216] font-bold uppercase text-xs hover:bg-[#13ec5b]/90">Alterar</button>
                            </div>
                        </div>
                      </>
                  )}

                  {activeModal === 'help' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">{t('prof_help')}</h3>
                        <div className="text-white/70 text-sm space-y-4 mb-6 overflow-y-auto pr-2">
                            <p><strong>Como usar o Studio IA?</strong><br/>Carregue uma foto, use o pincel para marcar a área que deseja alterar e descreva sua ideia (ex: "Rosas vermelhas").</p>
                            <p><strong>O que é Humanização?</strong><br/>Transforma esboços ou modelos 3D simples em imagens fotorrealistas de alta qualidade.</p>
                        </div>
                        <button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl bg-white/5 text-white font-bold uppercase text-xs hover:bg-white/10 mt-auto">Fechar</button>
                      </>
                  )}

                  {activeModal === 'terms' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">{t('prof_terms')}</h3>
                        <div className="text-white/70 text-sm space-y-6 mb-6 overflow-y-auto pr-2 text-left">
                            {TERMS_OF_USE.map((term, index) => (
                                <div key={index}>
                                    <h4 className="text-white font-bold mb-1">{term.title}</h4>
                                    <p className="text-xs leading-relaxed">{term.content}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl bg-[#13ec5b] text-[#102216] font-bold uppercase text-xs hover:bg-[#13ec5b]/90 mt-auto shadow-lg">Li e Concordo</button>
                      </>
                  )}

              </div>
          </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#102216]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom pt-2 px-6 z-50 h-[88px]">
        <div className="flex items-end justify-between max-w-md mx-auto h-full pb-4">
            
            <button onClick={onNavigateToHome} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">home</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_home')}</span>
            </button>

            <button onClick={onNavigateToProjects} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">architecture</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_projects')}</span>
            </button>

            <div className="relative -top-6">
                <button 
                    onClick={() => onNewProject('edit')}
                    className="flex flex-col items-center justify-center bg-[#13ec5b] size-16 rounded-full shadow-[0_0_30px_rgba(19,236,91,0.3)] border-[6px] border-[#102216] active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-[#102216] font-bold text-[28px]">magic_button</span>
                </button>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#13ec5b] whitespace-nowrap">{t('dash_studio_ia')}</span>
            </div>

            <button onClick={onNavigateToCatalog} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">local_florist</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_catalog')}</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 group w-14">
                <span className="material-symbols-outlined text-[#13ec5b] text-[26px]">person</span>
                <span className="text-[10px] font-bold text-[#13ec5b]">{t('nav_profile')}</span>
            </button>

        </div>
      </nav>

      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .pb-safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProfileScreen;
