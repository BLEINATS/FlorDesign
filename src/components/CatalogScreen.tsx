import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlowerItem } from '../types';
import { searchFlowers, trackDownload } from '../services/unsplashService';

interface CatalogScreenProps {
  onNavigateToHome: () => void;
  onNavigateToProjects: () => void;
  // ATUALIZADO: Aceita bypassChoice
  onNewProject: (mode?: 'edit', initialPrompt?: string, bypassChoice?: boolean) => void;
  onViewProfile: () => void;
}

const CatalogScreen: React.FC<CatalogScreenProps> = ({ 
  onNavigateToHome, 
  onNavigateToProjects,
  onNewProject,
  onViewProfile
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFlower, setSelectedFlower] = useState<FlowerItem | null>(null);
  
  const [displayedFlowers, setDisplayedFlowers] = useState<FlowerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
      { id: 'all', label: t('cat_filter_all') },
      { id: 'classic', label: t('cat_filter_classic') },
      { id: 'tropical', label: t('cat_filter_tropical') },
      { id: 'foliage', label: t('cat_filter_foliage') },
      { id: 'dried', label: "Boho/Secas" }, 
      { id: 'wild', label: t('cat_filter_wild') },
  ];

  useEffect(() => {
      const fetchFlowers = async () => {
          setIsLoading(true);
          try {
              let results = await searchFlowers(searchTerm);
              
              if (activeCategory !== 'all' && !searchTerm) {
                  results = results.filter(f => f.category === activeCategory);
              }
              
              setDisplayedFlowers(results);
          } catch (e) {
              console.error(e);
          } finally {
              setIsLoading(false);
          }
      };

      const timeoutId = setTimeout(fetchFlowers, 500); 
      return () => clearTimeout(timeoutId);
  }, [searchTerm, activeCategory]);

  const handleUseFlower = (flower: FlowerItem) => {
      if (flower.downloadLocation) {
          trackDownload(flower.downloadLocation);
      }
      // CORREÇÃO: Ao usar uma flor do catálogo, PULA a escolha (bypass = true) e vai direto editar
      onNewProject('edit', `Adicione ${flower.name} (${flower.scientificName})`, true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#102216] min-h-screen relative overflow-hidden font-display animate-slide-up">
      
      {/* Search Header */}
      <div className="px-6 pt-safe-top pb-4 bg-[#102216]/95 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
        <div className="mb-4">
            <h2 className="text-2xl font-serif font-bold text-white italic">{t('cat_title')}</h2>
            <p className="text-[10px] text-[#13ec5b] font-black uppercase tracking-[0.3em] mt-1">{t('cat_subtitle')}</p>
        </div>

        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30">search</span>
            <input 
                type="text" 
                placeholder={t('cat_search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white text-sm outline-none focus:border-[#13ec5b] transition-colors placeholder:text-white/20"
            />
            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 size-4 border-2 border-[#13ec5b]/30 border-t-[#13ec5b] rounded-full animate-spin" />
            )}
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                        activeCategory === cat.id 
                        ? 'bg-[#13ec5b] text-[#102216] border-[#13ec5b]' 
                        : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* Grid Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-6 pt-6 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
            {displayedFlowers.map(flower => (
                <div 
                    key={flower.id}
                    onClick={() => setSelectedFlower(flower)}
                    className="bg-[#1c271f] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#13ec5b]/30 transition-all active:scale-95 relative"
                >
                    <div className="aspect-square relative overflow-hidden">
                        <img src={flower.image} alt={flower.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                        
                        {flower.photographer && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[7px] text-white/70">Foto: {flower.photographer}</p>
                            </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-sm leading-tight truncate">{flower.name}</h3>
                            <p className="text-[9px] text-white/60 italic mt-0.5 truncate">{flower.scientificName}</p>
                        </div>
                        <button className="absolute top-2 right-2 size-8 rounded-full bg-black/40 backdrop-blur-md text-[#13ec5b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
        {displayedFlowers.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">local_florist</span>
                <p className="text-xs">Nenhuma flor encontrada</p>
            </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedFlower && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedFlower(null)} />
              
              <div className="bg-[#102216] w-full max-w-md rounded-t-[40px] sm:rounded-[40px] border border-white/10 overflow-hidden relative animate-slide-up shadow-2xl max-h-[90vh] flex flex-col">
                  
                  <div className="relative h-64 shrink-0">
                      <img src={selectedFlower.image} alt={selectedFlower.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102216] to-transparent" />
                      
                      {selectedFlower.photographer && (
                        <a 
                            href={`${selectedFlower.photographerUrl}?utm_source=FloraDesignAI&utm_medium=referral`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute bottom-4 left-4 text-[9px] text-white/60 hover:text-white underline z-20"
                        >
                            Foto por {selectedFlower.photographer} / Unsplash
                        </a>
                      )}

                      <button 
                        onClick={() => setSelectedFlower(null)}
                        className="absolute top-4 right-4 size-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>

                  <div className="p-8 -mt-12 relative z-10 flex-1 overflow-y-auto">
                      <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="text-3xl font-serif font-bold text-white italic">{selectedFlower.name}</h2>
                            <p className="text-[#13ec5b] text-sm font-medium italic">{selectedFlower.scientificName}</p>
                          </div>
                      </div>

                      <div className="flex gap-2 mb-6">
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60 border border-white/5">
                              {selectedFlower.season}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60 border border-white/5">
                              {selectedFlower.category}
                          </span>
                      </div>

                      <p className="text-white/70 text-sm leading-relaxed mb-8">
                          {selectedFlower.description}
                      </p>

                      <div className="mb-8">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Paleta Natural</h4>
                          <div className="flex gap-3">
                              {selectedFlower.colors.map((color, idx) => (
                                  <div key={idx} className="size-8 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: color }} />
                              ))}
                          </div>
                      </div>

                      <button 
                        onClick={() => handleUseFlower(selectedFlower)}
                        className="w-full h-14 bg-[#13ec5b] text-[#102216] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <span className="material-symbols-outlined text-xl">magic_button</span>
                          {t('cat_use')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Bottom Nav */}
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
                    // CORREÇÃO: Botão central Studio IA PULA a tela de escolha
                    onClick={() => onNewProject('edit', undefined, true)}
                    className="flex flex-col items-center justify-center bg-[#13ec5b] size-16 rounded-full shadow-[0_0_30px_rgba(19,236,91,0.3)] border-[6px] border-[#102216] active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-[#102216] font-bold text-[28px]">magic_button</span>
                </button>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#13ec5b] whitespace-nowrap">{t('dash_studio_ia')}</span>
            </div>

            {/* Catálogo (Active) */}
            <button className="flex flex-col items-center gap-1.5 group w-14">
                <span className="material-symbols-outlined text-[#13ec5b] text-[26px]">local_florist</span>
                <span className="text-[10px] font-bold text-[#13ec5b]">{t('nav_catalog')}</span>
            </button>

            <button onClick={onViewProfile} className="flex flex-col items-center gap-1.5 group w-14 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors text-[26px]">person</span>
                <span className="text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">{t('nav_profile')}</span>
            </button>

        </div>
      </nav>
    </div>
  );
};

export default CatalogScreen;
