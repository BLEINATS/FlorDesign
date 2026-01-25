import React, { useState, useEffect, useRef } from 'react';
import { ImageData, EditConfig, EditMode, COSTS, FlowerItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { FLOWERS_DATA } from '../data/catalogData';

// ... (imports e declarações globais mantidos)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PRIMARY_COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Amarelo', hex: '#FACC15' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Roxo', hex: '#9333EA' },
  { name: 'Laranja', hex: '#F97316' },
];

const DEFAULT_FOLIAGE = ['Eucalipto', 'Samambaia', 'Costela de Adão', 'Ruscus', 'Hera'];

interface Props {
  originalImage: ImageData;
  initialMode?: EditMode;
  initialPrompt?: string; 
  onGenerate: (prompt: string, mode: EditMode, isHighQuality: boolean) => void;
  onGetInspiration: (img: ImageData) => Promise<string | undefined>;
  isLoading: boolean;
  error: string | null;
  onRestart: () => void;
  onSave: () => void;
  currentCredits: number;
}

const EditScreen: React.FC<Props> = ({ 
    originalImage, 
    initialMode = 'edit', 
    initialPrompt = '', 
    onGenerate, 
    onGetInspiration, 
    isLoading, 
    error, 
    onRestart, 
    onSave, 
    currentCredits 
}) => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<EditMode>(initialMode);
  const [customPrompt, setCustomPrompt] = useState(initialPrompt); 
  
  const [recentFlowers, setRecentFlowers] = useState<FlowerItem[]>(() => {
      return FLOWERS_DATA.slice(0, 4);
  });

  const [foliages, setFoliages] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('flora-custom-foliage');
        return saved ? JSON.parse(saved) : DEFAULT_FOLIAGE;
    }
    return DEFAULT_FOLIAGE;
  });
  
  const [customColors, setCustomColors] = useState<{name: string, hex: string}[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('flora-custom-colors');
        return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColorHex, setCustomColorHex] = useState<string | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [selectedFoliage, setSelectedFoliage] = useState<string[]>([]);
  
  const [openSection, setOpenSection] = useState<'colors' | 'flowers' | 'foliage' | null>('flowers');
  const [isAddingNew, setIsAddingNew] = useState<'foliage' | 'color' | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogTarget, setCatalogTarget] = useState<'flower' | 'foliage'>('flower');
  const [catalogSearch, setCatalogSearch] = useState('');

  const [newNameInput, setNewNameInput] = useState('');
  const [newColorValue, setNewColorValue] = useState('#13ec5b');

  const [activeTool, setActiveTool] = useState<'brush' | 'eraser' | 'zoom' | 'pan' | null>('brush');
  const [brushSize, setBrushSize] = useState(30);
  const [zoomScale, setZoomScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [uiVisible, setUiVisible] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [showCommandOverlay, setShowCommandOverlay] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const startPanPos = useRef({ x: 0, y: 0 });

  const currentCost = activeMode === 'humanize' ? COSTS.HUMANIZE : COSTS.STANDARD;
  const hasSufficientCredits = currentCredits >= currentCost;

  useEffect(() => {
      if (initialPrompt) setCustomPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    try {
        localStorage.setItem('flora-custom-foliage', JSON.stringify(foliages));
        localStorage.setItem('flora-custom-colors', JSON.stringify(customColors));
    } catch (e) {
        console.warn("LocalStorage cheio. Preferências não salvas para evitar crash.");
    }
  }, [foliages, customColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
  }, []);

  // ... (Speech Recognition logic maintained) ...
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR'; 

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCustomPrompt(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (['not-allowed', 'no-speech', 'service-not-allowed', 'permission-denied'].includes(event.error)) {
             console.warn("Aviso de reconhecimento de voz:", event.error);
        } else {
             console.error("Erro no reconhecimento de fala:", event.error);
        }
        
        setIsListening(false);
        
        let message = t('edit_voice_error');
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            message = t('edit_voice_denied');
            setShowCommandOverlay(true);
        } else {
            setShowCommandOverlay(true);
        }
        
        setVoiceError(message);
        setTimeout(() => setVoiceError(null), 4000);
      };
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };
  }, [t]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setShowCommandOverlay(true);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setCustomPrompt('');
      setShowCommandOverlay(true);
      setVoiceError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setVoiceError("Erro ao iniciar microfone.");
      }
    }
  };

  const closeCommandOverlay = () => {
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setShowCommandOverlay(false);
    setVoiceError(null);
  };

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handlePointerDown = (e: any) => {
    if (activeTool === 'pan') {
      isPanning.current = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startPanPos.current = { x: clientX - offset.x, y: clientY - offset.y };
      return;
    }
    if (activeTool !== 'brush' && activeTool !== 'eraser') return;
    isDrawing.current = true;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); }
  };

  const handlePointerMove = (e: any) => {
    if (activeTool === 'pan' && isPanning.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setOffset({ x: clientX - startPanPos.current.x, y: clientY - startPanPos.current.y });
      return;
    }
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (activeTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(19, 236, 91, 0.4)'; 
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#13ec5b';
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.shadowBlur = 0;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    isPanning.current = false;
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const clearSelection = () => {
    setSelectedColor(null);
    setCustomColorHex(null);
    setSelectedFlower(null);
    setSelectedFoliage([]);
    setCustomPrompt('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  };

  const toggleFoliage = (foliage: string) => {
    setSelectedFoliage(prev => 
      prev.includes(foliage) ? prev.filter(f => f !== foliage) : [...prev, foliage]
    );
  };

  const handleAddNewItem = () => {
    if (!newNameInput.trim()) return;
    
    if (isAddingNew === 'foliage') {
      setFoliages([...foliages, newNameInput]);
    } else if (isAddingNew === 'color') {
      setCustomColors([...customColors, { name: newNameInput, hex: newColorValue }]);
    }

    setNewNameInput('');
    setNewColorValue('#13ec5b');
    setIsAddingNew(null);
  };

  const handleSelectFromCatalog = (flower: FlowerItem) => {
      if (catalogTarget === 'flower') {
          setSelectedFlower(flower.name);
          if (!recentFlowers.find(f => f.id === flower.id)) {
              setRecentFlowers([flower, ...recentFlowers].slice(0, 10));
          }
      } else {
          // Foliage logic
          toggleFoliage(flower.name);
          // Adiciona à lista rápida se não estiver
          if (!foliages.includes(flower.name)) {
              setFoliages([...foliages, flower.name]);
          }
      }
      setShowCatalogModal(false);
  };

  const adjustZoom = (delta: number) => {
    setZoomScale(prev => Math.max(1, Math.min(4, prev + delta)));
  };

  const toggleUi = () => setUiVisible(!uiVisible);

  const toggleSection = (section: 'colors' | 'flowers' | 'foliage') => {
      setOpenSection(openSection === section ? null : section);
  };

  const getActiveColorName = () => {
      if (customColorHex) return 'Personalizada';
      if (selectedColor) return selectedColor;
      return '';
  };

  const executeGeneration = () => {
    let finalPrompt = customPrompt || "";
    
    // Só adiciona detalhes específicos se NÃO for humanização (ou se o usuário quiser, mas agora a UI esconde)
    if (activeMode !== 'humanize') {
        if (selectedFlower) finalPrompt += ` Espécie: ${selectedFlower}.`;
        if (customColorHex) finalPrompt += ` Cor (HEX): ${customColorHex}.`;
        else if (selectedColor) finalPrompt += ` Cor: ${selectedColor}.`;
        if (selectedFoliage.length > 0) finalPrompt += ` Folhagens: ${selectedFoliage.join(', ')}.`;
    }
    
    onGenerate(finalPrompt || (activeMode === 'humanize' ? "Humanização realista" : "Design floral profissional"), activeMode, true);
    closeCommandOverlay();
  };

  // Helper para buscar imagem da folhagem
  const getFoliageImage = (name: string) => {
      const item = FLOWERS_DATA.find(f => f.name.toLowerCase() === name.toLowerCase() || f.name.toLowerCase().includes(name.toLowerCase()));
      return item ? item.image : null;
  };

  // Filtragem dinâmica do catálogo no modal
  const filteredCatalog = FLOWERS_DATA.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          f.scientificName.toLowerCase().includes(catalogSearch.toLowerCase());
    
    // Se o alvo for folhagem, prioriza ou filtra folhagens
    if (catalogTarget === 'foliage') {
        return matchesSearch && f.category === 'foliage';
    }
    // Se for flor, mostra tudo (ou poderia excluir folhagens, mas deixamos flexível)
    return matchesSearch;
  });

  return (
    <div className="flex-1 w-full h-full bg-[#0a0f0b] font-display text-white overflow-hidden flex flex-col relative select-none">
      
      {/* ... (Header e Canvas mantidos iguais) ... */}
      <div className={`absolute top-0 left-0 w-full z-50 p-4 pt-safe-top flex items-start justify-between pointer-events-none transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={onRestart} 
          className="pointer-events-auto size-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white active:scale-90 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        
        <div className="flex items-center gap-3 pointer-events-auto">
            <button 
              onClick={clearSelection} 
              className="size-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/80 active:scale-90 transition-all shadow-lg"
              title="Limpar Máscara"
            >
                <span className="material-symbols-outlined text-xl">restart_alt</span>
            </button>

            <button 
              onClick={onSave} 
              className="h-10 px-5 rounded-full bg-[#13ec5b] text-[#102216] text-[11px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(19,236,91,0.4)] active:scale-95 transition-transform flex items-center gap-2"
            >
                <span>{t('edit_save')}</span>
            </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full flex-1 bg-[#050806] overflow-hidden"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div 
          className="w-full h-full origin-center transition-transform duration-300 ease-out"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomScale})` }}
        >
          <img src={`data:${originalImage.mimeType};base64,${originalImage.data}`} className="w-full h-full object-contain pointer-events-none" alt="Original" />
          <canvas ref={canvasRef} className="absolute inset-0 z-10 touch-none" />
        </div>

        {/* ... (Ferramentas flutuantes mantidas) ... */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4 transition-all duration-300 ${uiVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            
            {(activeTool === 'brush' || activeTool === 'eraser') && (
               <div className="h-48 w-8 flex items-center justify-center relative group">
                  <div className="absolute h-full w-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                     <div 
                        className="absolute bottom-0 w-full bg-[#13ec5b] transition-all duration-75"
                        style={{ height: `${brushSize}%` }}
                     />
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                    style={{ writingMode: 'bt-lr' as any, WebkitAppearance: 'slider-vertical' }}
                  />
                  <div className="absolute left-[-40px] bg-black/60 backdrop-blur text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
                     {brushSize}px
                  </div>
               </div>
            )}

            <div className="flex flex-col gap-2 bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl mt-2">
                <button 
                    onClick={toggleListening}
                    className={`size-9 rounded-full flex items-center justify-center transition-all duration-200 relative group shadow-lg mb-1 ${isListening || showCommandOverlay ? 'bg-red-500 text-white animate-pulse' : 'bg-[#13ec5b] text-[#102216] hover:scale-110'}`}
                    title="Comando de Voz"
                >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>

                <div className="w-4 h-[1px] bg-white/10 mx-auto my-1" />
                <ToolButton icon="visibility" isActive={false} onClick={toggleUi} label="Ocultar" />
                <div className="w-4 h-[1px] bg-white/10 mx-auto my-1" />
                <ToolButton icon="brush" isActive={activeTool === 'brush'} onClick={() => setActiveTool('brush')} />
                <ToolButton icon="ink_eraser" isActive={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
                <ToolButton icon="pan_tool" isActive={activeTool === 'pan'} onClick={() => setActiveTool('pan')} />
                <div className="w-4 h-[1px] bg-white/10 mx-auto my-1" />
                <ToolButton icon="zoom_in" isActive={activeTool === 'zoom'} onClick={() => activeTool === 'zoom' ? setZoomScale(1) : setActiveTool('zoom')} />
            </div>
        </div>

        {activeTool === 'zoom' && uiVisible && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 animate-fade-in z-40">
                <button onClick={() => adjustZoom(-0.5)} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20"><span className="material-symbols-outlined text-lg">remove</span></button>
                <span className="flex items-center justify-center w-10 text-[10px] font-bold text-white">{Math.round(zoomScale * 100)}%</span>
                <button onClick={() => adjustZoom(0.5)} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20"><span className="material-symbols-outlined text-lg">add</span></button>
            </div>
        )}

        {!uiVisible && (
            <button 
                onClick={toggleUi}
                className="absolute bottom-8 right-8 z-50 size-12 rounded-full bg-[#13ec5b]/20 backdrop-blur-md border border-[#13ec5b]/50 text-[#13ec5b] flex items-center justify-center shadow-[0_0_20px_rgba(19,236,91,0.2)] animate-pulse"
            >
                <span className="material-symbols-outlined">visibility_off</span>
            </button>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/70 backdrop-blur-md">
            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Criando Design...</p>
          </div>
        )}
      </div>

      {showCommandOverlay && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-md flex flex-col items-center gap-8">
             <div className={`relative size-32 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500/20 scale-110' : 'bg-white/5'}`}>
                {isListening && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping opacity-20" />
                        <div className="absolute inset-2 rounded-full border border-red-500/30 animate-pulse" />
                    </>
                )}
                <button 
                    onClick={toggleListening}
                    className={`size-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? 'bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <span className="material-symbols-outlined text-5xl">{isListening ? 'mic' : 'mic_none'}</span>
                </button>
             </div>

             <div className="text-center space-y-2 w-full">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
                    {isListening ? t('edit_voice_listening') : t('edit_voice_hint')}
                </p>
                {voiceError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-2 px-4 rounded-lg inline-block mb-2 animate-bounce">
                        {voiceError}
                    </div>
                )}
                <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ex: 'Adicione rosas vermelhas e folhagens tropicais aqui...'"
                    className="w-full bg-transparent border-b border-white/20 text-center text-2xl font-serif text-white placeholder:text-white/20 focus:outline-none focus:border-primary pb-4 resize-none min-h-[100px]"
                    autoFocus
                />
             </div>

             <div className="flex gap-4 w-full">
                <button 
                    onClick={closeCommandOverlay}
                    className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={executeGeneration}
                    className="flex-1 h-14 rounded-2xl bg-[#13ec5b] text-[#102216] font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">auto_fix_high</span>
                    Executar
                </button>
             </div>
          </div>
        </div>
      )}

      {/* PAINEL INFERIOR (Configurações) */}
      <div className={`bg-[#102216] border-t border-white/10 rounded-t-[35px] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-in-out max-h-[70vh] flex flex-col ${uiVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}>
        
        <div className="w-full pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>
        
        <div className="px-6 pb-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white text-xl font-serif italic">{t('edit_config')}</h2>
                    <p className="text-primary/60 text-[9px] font-black uppercase tracking-[0.3em]">
                        {activeMode === 'humanize' ? t('edit_humanize_title') : t('edit_customize_title')}
                    </p>
                </div>
            </div>
            
            <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-white/30 text-lg group-focus-within:text-primary transition-colors">edit_note</span>
                </div>
                <input 
                    type="text" 
                    value={customPrompt} 
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={activeMode === 'humanize' ? "Descreva o estilo (ex: Piso madeira, luz quente...)" : t('edit_placeholder_edit')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-10 pr-12 text-white text-xs font-medium outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                />
                <button 
                    onClick={() => setShowCommandOverlay(true)}
                    className="absolute inset-y-0 right-2 flex items-center justify-center size-10 my-auto text-primary hover:text-white transition-colors z-20"
                    title="Comando de voz"
                >
                    <span className="material-symbols-outlined text-2xl drop-shadow-[0_0_5px_rgba(19,236,91,0.5)]">mic</span>
                </button>
            </div>
          </div>

          {/* CONDICIONAL: Só mostra Cores/Espécies/Folhagens se NÃO for Humanização */}
          {activeMode !== 'humanize' && (
              <div className="flex flex-col gap-3">
                {/* CORES */}
                <AccordionItem 
                    title={t('edit_colors')} 
                    icon="palette" 
                    isOpen={openSection === 'colors'} 
                    onClick={() => toggleSection('colors')}
                    summary={getActiveColorName()}
                >
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
                        <button 
                            onClick={() => setIsAddingNew('color')} 
                            className="size-10 rounded-full flex-shrink-0 flex items-center justify-center border border-dashed border-white/30 bg-white/5 text-primary hover:bg-white/10 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                        <button 
                            onClick={() => colorInputRef.current?.click()} 
                            className={`size-10 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${customColorHex ? 'border-primary bg-primary text-black' : 'bg-white/5 border-white/10 text-white/50'}`}
                        >
                            <span className="material-symbols-outlined text-lg">colorize</span>
                            <input type="color" ref={colorInputRef} className="hidden" onChange={(e) => { setCustomColorHex(e.target.value); setSelectedColor(null); }} />
                        </button>
                        {customColors.map((c, idx) => (
                            <button 
                                key={`custom-${idx}`}
                                onClick={() => { setSelectedColor(c.name); setCustomColorHex(c.hex); }}
                                className={`size-10 rounded-full border-2 flex-shrink-0 transition-all shadow-sm flex items-center justify-center ${selectedColor === c.name ? 'border-primary scale-110' : 'border-transparent ring-1 ring-white/10'}`}
                                style={{ backgroundColor: c.hex }}
                            >
                                {selectedColor === c.name && <span className="material-symbols-outlined text-[14px] text-white drop-shadow-md font-bold">check</span>}
                            </button>
                        ))}
                        <div className="w-[1px] h-8 bg-white/10 mx-1" />
                        {PRIMARY_COLORS.map(c => (
                            <button 
                                key={c.name}
                                onClick={() => { setSelectedColor(c.name); setCustomColorHex(null); }}
                                className={`size-10 rounded-full border-2 flex-shrink-0 transition-all shadow-sm flex items-center justify-center ${selectedColor === c.name ? 'border-primary scale-110' : 'border-transparent ring-1 ring-white/10'}`}
                                style={{ backgroundColor: c.hex }}
                            >
                            {selectedColor === c.name && <span className="material-symbols-outlined text-[14px] text-black/50 font-bold">check</span>}
                            </button>
                        ))}
                    </div>
                </AccordionItem>

                {/* ESPÉCIES (Com Catálogo) */}
                <AccordionItem 
                    title={t('edit_species')} 
                    icon="local_florist" 
                    isOpen={openSection === 'flowers'} 
                    onClick={() => toggleSection('flowers')}
                    summary={selectedFlower || ''}
                >
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
                        <button 
                            onClick={() => { setCatalogTarget('flower'); setShowCatalogModal(true); }} 
                            className="size-14 rounded-2xl bg-white/5 border border-dashed border-white/20 flex-shrink-0 flex flex-col items-center justify-center text-primary active:scale-95 hover:bg-white/10 transition-all gap-1"
                        >
                            <span className="material-symbols-outlined text-xl">search</span>
                            <span className="text-[8px] font-black uppercase tracking-wider">Catálogo</span>
                        </button>

                        {recentFlowers.map((f: FlowerItem) => (
                            <button 
                                key={f.id}
                                onClick={() => setSelectedFlower(f.name)}
                                className={`relative size-14 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 group ${selectedFlower === f.name ? 'border-primary shadow-[0_0_15px_rgba(19,236,91,0.3)]' : 'border-transparent'}`}
                            >
                                <img src={f.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={f.name} />
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${selectedFlower === f.name ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-white text-lg font-bold">check</span>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                                    <p className="text-[8px] text-white text-center font-medium truncate">{f.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </AccordionItem>

                {/* FOLHAGENS (Agora com Cards Visuais) */}
                <AccordionItem 
                    title={t('edit_foliage')} 
                    icon="eco" 
                    isOpen={openSection === 'foliage'} 
                    onClick={() => toggleSection('foliage')}
                    summary={selectedFoliage.length > 0 ? `${selectedFoliage.length} selecionados` : ''}
                >
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
                        <button 
                            onClick={() => setIsAddingNew('foliage')}
                            className="size-14 rounded-2xl bg-primary/5 border border-dashed border-primary/40 flex-shrink-0 flex flex-col items-center justify-center text-primary active:scale-95 hover:bg-primary/10 transition-all gap-1"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            <span className="text-[8px] font-black uppercase tracking-wider">{t('edit_add')}</span>
                        </button>

                        <button 
                            onClick={() => { setCatalogTarget('foliage'); setShowCatalogModal(true); }}
                            className="size-14 rounded-2xl bg-white/5 border border-dashed border-white/20 flex-shrink-0 flex flex-col items-center justify-center text-white/70 active:scale-95 hover:bg-white/10 transition-all gap-1"
                        >
                            <span className="material-symbols-outlined text-xl">search</span>
                            <span className="text-[8px] font-black uppercase tracking-wider">Catálogo</span>
                        </button>

                        {foliages.map((f: string) => {
                            const img = getFoliageImage(f);
                            const isSelected = selectedFoliage.includes(f);
                            
                            return (
                                <button 
                                    key={f}
                                    onClick={() => toggleFoliage(f)}
                                    className={`relative size-14 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 group ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(19,236,91,0.3)]' : 'border-transparent'}`}
                                >
                                    {img ? (
                                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={f} />
                                    ) : (
                                        <div className="w-full h-full bg-white/10 flex items-center justify-center p-1">
                                            <span className="text-[8px] text-white text-center font-bold leading-tight">{f}</span>
                                        </div>
                                    )}
                                    
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                        <span className="material-symbols-outlined text-white text-lg font-bold">check</span>
                                    </div>
                                    
                                    {img && (
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                                            <p className="text-[8px] text-white text-center font-medium truncate">{f}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </AccordionItem>
              </div>
          )}

          <div className="mt-2">
              <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                      {t('edit_cost')}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${hasSufficientCredits ? 'bg-[#13ec5b]/10 border-[#13ec5b]/30 text-[#13ec5b]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                      <span className="material-symbols-outlined text-[14px]">token</span>
                      <span className="text-[10px] font-bold">{currentCost} {t('dash_credits')}</span>
                  </div>
              </div>
              
              <button 
                  onClick={executeGeneration}
                  disabled={isLoading}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50 ${
                      hasSufficientCredits 
                      ? 'bg-primary text-[#102216] shadow-[0_10px_30px_rgba(19,236,91,0.15)] hover:shadow-[0_10px_40px_rgba(19,236,91,0.25)]' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                      {hasSufficientCredits ? 'auto_fix_high' : 'block'}
                  </span>
                  {hasSufficientCredits 
                      ? (activeMode === 'humanize' ? t('edit_humanize_btn') : t('edit_generate')) 
                      : t('edit_insufficient')}
              </button>
              
              {!hasSufficientCredits && (
                  <p className="text-center text-[9px] text-red-400 mt-2 font-medium">
                      {t('edit_recharge_msg')}
                  </p>
              )}
          </div>

        </div>
      </div>

      {/* MODAL DE ADIÇÃO RÁPIDA (Cores/Folhagens) */}
      {isAddingNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-[#1c271f] border border-white/10 p-6 rounded-[30px] shadow-2xl">
            <div className="flex items-center gap-3 mb-6 justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                    {isAddingNew === 'foliage' ? 'eco' : 'palette'}
                </span>
                <h3 className="text-white text-lg font-serif italic">
                    {isAddingNew === 'foliage' ? 'Nova Folhagem' : 'Nova Cor'}
                </h3>
            </div>
            
            {isAddingNew === 'color' && (
                <div className="flex justify-center mb-6">
                    <label className="size-20 rounded-full border-4 border-white/10 shadow-xl overflow-hidden cursor-pointer relative group">
                        <input 
                            type="color" 
                            value={newColorValue} 
                            onChange={(e) => setNewColorValue(e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-black/10 transition-colors">
                            <span className="material-symbols-outlined text-white mix-blend-difference opacity-50">colorize</span>
                        </div>
                    </label>
                </div>
            )}

            <input 
              autoFocus
              type="text" 
              placeholder={isAddingNew === 'color' ? "Nome da cor (ex: Azul Real)..." : "Digite o nome..."}
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl h-12 px-4 text-white text-sm outline-none focus:border-primary transition-all mb-6 font-bold text-center placeholder:text-white/20"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewItem()}
            />
            <div className="flex gap-3">
              <button onClick={() => setIsAddingNew(null)} className="flex-1 h-10 rounded-xl bg-white/5 text-white/40 font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-colors">Cancelar</button>
              <button onClick={handleAddNewItem} className="flex-1 h-10 rounded-xl bg-primary text-[#102216] font-black uppercase tracking-widest text-[9px] hover:bg-primary/90 transition-colors shadow-lg">Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CATÁLOGO (Seleção de Espécies) */}
      {showCatalogModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCatalogModal(false)} />
              
              <div className="bg-[#102216] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border border-white/10 overflow-hidden relative animate-slide-up shadow-2xl max-h-[80vh] flex flex-col">
                  
                  <div className="p-6 pb-2 border-b border-white/5 bg-[#102216]">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-serif italic text-white">
                              {catalogTarget === 'flower' ? 'Selecionar Espécie' : 'Selecionar Folhagem'}
                          </h3>
                          <button onClick={() => setShowCatalogModal(false)} className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white">
                              <span className="material-symbols-outlined">close</span>
                          </button>
                      </div>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-lg">search</span>
                          <input 
                              type="text" 
                              placeholder="Buscar no catálogo..." 
                              value={catalogSearch}
                              onChange={(e) => setCatalogSearch(e.target.value)}
                              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white text-xs outline-none focus:border-primary transition-colors"
                              autoFocus
                          />
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
                      {filteredCatalog.map(flower => (
                          <button 
                              key={flower.id}
                              onClick={() => handleSelectFromCatalog(flower)}
                              className="bg-[#1c271f] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all text-left"
                          >
                              <div className="aspect-square relative">
                                  <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                  <div className="absolute bottom-2 left-2 right-2">
                                      <p className="text-white font-bold text-xs truncate">{flower.name}</p>
                                      <p className="text-[8px] text-white/60 italic truncate">{flower.scientificName}</p>
                                  </div>
                              </div>
                          </button>
                      ))}
                      {filteredCatalog.length === 0 && (
                          <div className="col-span-2 text-center py-8 text-white/30">
                              <p className="text-xs">Nenhum resultado encontrado</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .pt-safe-top { padding-top: max(1rem, env(safe-area-inset-top)); }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

const ToolButton = ({ icon, isActive, onClick, label }: { icon: string, isActive: boolean, onClick: () => void, label?: string }) => (
    <button 
        onClick={onClick}
        className={`size-9 rounded-full flex items-center justify-center transition-all duration-200 relative group ${isActive ? 'bg-[#13ec5b] text-black shadow-[0_0_15px_rgba(19,236,91,0.4)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        title={label}
    >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
);

const AccordionItem = ({ title, icon, isOpen, onClick, children, summary }: { title: string, icon: string, isOpen: boolean, onClick: () => void, children: React.ReactNode, summary?: string }) => (
    <div className={`bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.07] border-white/10' : ''}`}>
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'}`}>
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                </div>
                <div className="text-left">
                    <span className={`text-sm font-bold tracking-wide block ${isOpen ? 'text-white' : 'text-white/70'}`}>{title}</span>
                    {!isOpen && summary && <span className="text-[9px] text-primary block mt-0.5 font-medium truncate max-w-[150px]">{summary}</span>}
                </div>
            </div>
            <span className={`material-symbols-outlined text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
        <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="p-4 pt-0">
                {children}
            </div>
        </div>
    </div>
);

export default EditScreen;
