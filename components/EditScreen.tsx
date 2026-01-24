
import React, { useState, useEffect, useRef } from 'react';
import { ImageData, EditConfig, EditMode } from '../types';
import { describeImage } from '../services/geminiService';

const PRIMARY_COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Amarelo', hex: '#FACC15' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Rosa', hex: '#EC4899' },
];

const DEFAULT_FLOWERS = [
  { name: 'Tulipas', img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=200', id: 'tulipas' },
  { name: 'Lírios', img: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&q=80&w=200', id: 'lirios' },
  { name: 'Peônias', img: 'https://images.unsplash.com/photo-1563245339-6b2e4428546a?auto=format&fit=crop&q=80&w=200', id: 'peonias' },
];

const DEFAULT_FOLIAGE = ['Eucalipto', 'Samambaia', 'Costela de Adão', 'Ruscus'];

interface Props {
  originalImage: ImageData;
  onGenerate: (config: EditConfig) => void;
  isLoading: boolean;
  error: string | null;
  onRestart: () => void;
  onSave: () => void;
}

const EditScreen: React.FC<Props> = ({ originalImage, onGenerate, isLoading, error, onRestart, onSave }) => {
  const [activeMode, setActiveMode] = useState<EditMode>('edit');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Ativos e Persistência
  const [flowers, setFlowers] = useState(() => {
    const saved = localStorage.getItem('flora-custom-flowers');
    return saved ? JSON.parse(saved) : DEFAULT_FLOWERS;
  });
  const [foliages, setFoliages] = useState(() => {
    const saved = localStorage.getItem('flora-custom-foliage');
    return saved ? JSON.parse(saved) : DEFAULT_FOLIAGE;
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColorHex, setCustomColorHex] = useState<string | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [selectedFoliage, setSelectedFoliage] = useState<string[]>([]);
  
  const [isShowingAllFlowers, setIsShowingAllFlowers] = useState(false);
  const [isShowingAllFoliage, setIsShowingAllFoliage] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState<'flower' | 'foliage' | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  const [detectedSpecies, setDetectedSpecies] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser' | 'zoom' | 'pan' | null>('brush');
  const [brushSize, setBrushSize] = useState(30);
  const [zoomScale, setZoomScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const startPanPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('flora-custom-flowers', JSON.stringify(flowers));
    localStorage.setItem('flora-custom-foliage', JSON.stringify(foliages));
  }, [flowers, foliages]);

  useEffect(() => {
    const runDetection = async () => {
      try {
        const species = await describeImage(originalImage);
        setDetectedSpecies(species);
      } catch (e) {
        setDetectedSpecies("Arranjo Floral");
      }
    };
    runDetection();
  }, [originalImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
  }, []);

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

  // Added toggleFoliage function to handle selecting/deselecting foliages.
  const toggleFoliage = (foliage: string) => {
    setSelectedFoliage(prev => 
      prev.includes(foliage) ? prev.filter(f => f !== foliage) : [...prev, foliage]
    );
  };

  const handleAddNewItem = () => {
    if (!newNameInput.trim()) return;
    if (isAddingNew === 'flower') {
      setFlowers([...flowers, { name: newNameInput, id: `custom-${Date.now()}`, img: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=200' }]);
    } else {
      setFoliages([...foliages, newNameInput]);
    }
    setNewNameInput('');
    setIsAddingNew(null);
  };

  const adjustZoom = (delta: number) => {
    setZoomScale(prev => Math.max(1, Math.min(4, prev + delta)));
  };

  return (
    <div className="flex-1 w-full h-full bg-[#0a0f0b] font-display text-white overflow-hidden flex flex-col relative">
      
      {/* HEADER SUPERIOR */}
      <div className="absolute top-0 left-0 w-full z-40 p-4 pt-10 flex items-center justify-between px-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button onClick={onRestart} className="size-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white active:scale-90 transition-transform backdrop-blur-md">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="flex items-center gap-2">
            <button onClick={clearSelection} className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform backdrop-blur-md">
                <span className="material-symbols-outlined text-sm">restart_alt</span> Limpar
            </button>
        </div>

        <button onClick={onSave} className="h-10 px-6 rounded-full bg-primary text-[#102216] text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(19,236,91,0.3)] active:scale-95 transition-transform">
            Salvar
        </button>
      </div>

      {/* ÁREA DE VISUALIZAÇÃO COM MÁSCARA E ZOOM */}
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
          
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full flex items-center gap-2 pointer-events-none">
            <span className="material-symbols-outlined text-primary text-xs">edit</span>
            <span className="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Máscara de IA</span>
          </div>
        </div>

        {/* CONTROLES FLUTUANTES LATERAIS (UPGRADED) */}
        <div className="absolute right-6 top-[22%] flex flex-col gap-4 z-30">
            {/* Tool Inspector (Aparece se Pincel ou Borracha ativos) */}
            {(activeTool === 'brush' || activeTool === 'eraser') && (
              <div className="absolute right-16 top-0 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex flex-col items-center gap-2 animate-fade-in">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <div className="bg-primary rounded-full" style={{ width: brushSize/2, height: brushSize/2 }} />
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="h-32 w-2 appearance-none bg-white/10 rounded-full overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  style={{ writingMode: 'bt-lr' as any, WebkitAppearance: 'slider-vertical' }}
                />
                <span className="text-[8px] font-black text-white/40">{brushSize}px</span>
              </div>
            )}

            {/* Zoom Inspector */}
            {activeTool === 'zoom' && (
              <div className="absolute right-16 bottom-0 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex flex-col gap-2 animate-fade-in">
                <button onClick={() => adjustZoom(0.5)} className="size-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"><span className="material-symbols-outlined">add</span></button>
                <button onClick={() => adjustZoom(-0.5)} className="size-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"><span className="material-symbols-outlined">remove</span></button>
                <button onClick={() => { setZoomScale(1); setOffset({x:0,y:0}); }} className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-[8px] font-black">1:1</button>
              </div>
            )}

            {/* Tool Buttons */}
            <div className="flex flex-col gap-3 bg-black/40 backdrop-blur-md p-2 rounded-[30px] border border-white/5">
                <button onClick={() => setActiveTool('brush')} className={`size-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'brush' ? 'bg-primary text-black shadow-[0_0_20px_rgba(19,236,91,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="material-symbols-outlined">brush</span>
                </button>
                <button onClick={() => setActiveTool('eraser')} className={`size-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'eraser' ? 'bg-primary text-black shadow-[0_0_20px_rgba(19,236,91,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="material-symbols-outlined">ink_eraser</span>
                </button>
                <button onClick={() => setActiveTool('pan')} className={`size-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'pan' ? 'bg-primary text-black shadow-[0_0_20px_rgba(19,236,91,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="material-symbols-outlined">pan_tool</span>
                </button>
                <div className="h-[1px] w-6 bg-white/10 mx-auto my-1" />
                <button onClick={() => setActiveTool('zoom')} className={`size-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'zoom' ? 'bg-primary text-black shadow-[0_0_20px_rgba(19,236,91,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="material-symbols-outlined">zoom_in</span>
                </button>
            </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/70 backdrop-blur-md">
            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Design em Progresso</p>
          </div>
        )}
      </div>

      {/* BOTTOM SHEET SELEÇÃO HÍBRIDA */}
      <div className="bg-[#102216] border-t border-white/10 rounded-t-[45px] z-40 pb-12 shadow-[0_-30px_100px_rgba(0,0,0,0.9)] animate-slide-up max-h-[55vh] overflow-y-auto no-scrollbar">
        <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mt-5 mb-8" />
        
        <div className="px-8 flex flex-col gap-8">
          <div>
            <h2 className="text-white text-3xl font-serif italic">Configurações Florais</h2>
            <p className="text-primary/50 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Personalize sua visão</p>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-white/5 p-4 rounded-[30px] border border-white/5">
            <div className="flex items-center gap-3 truncate">
               <div className="size-12 min-w-[3rem] rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/10">
                  <img src={`data:${originalImage.mimeType};base64,${originalImage.data}`} className="w-full h-full object-cover" alt="Source" />
               </div>
               <div className="truncate">
                  <p className="text-[10px] text-white font-bold truncate">{detectedSpecies || 'Detectando...'}</p>
                  <p className="text-primary text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">Foto Atual</p>
               </div>
            </div>
            <span className="material-symbols-outlined text-white/10">arrow_forward</span>
            <div className="bg-[#0a0f0b] border border-primary/20 rounded-2xl p-3 flex items-center gap-3 focus-within:border-primary transition-all">
                <input 
                    type="text" 
                    value={customPrompt || selectedFlower || ""} 
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Refinar com texto..."
                    className="flex-1 bg-transparent text-white text-[10px] font-bold outline-none placeholder:text-white/20"
                />
            </div>
          </div>

          {/* TABELA GERAL */}
          <div className="flex flex-col gap-8">
            {/* CORES PRIMÁRIAS */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-rose-500" />
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Paleta Primária</span>
                </div>
                <div className="flex gap-5 overflow-x-auto no-scrollbar py-2">
                    {PRIMARY_COLORS.map(c => (
                        <button 
                            key={c.name}
                            onClick={() => { setSelectedColor(c.name); setCustomColorHex(null); }}
                            className={`size-11 rounded-full border-[3px] flex-shrink-0 transition-all ${selectedColor === c.name ? 'border-primary scale-110 shadow-[0_0_15px_rgba(19,236,91,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                            style={{ backgroundColor: c.hex }}
                        />
                    ))}
                    <div className="relative flex-shrink-0">
                      <input type="color" ref={colorInputRef} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { setCustomColorHex(e.target.value); setSelectedColor(null); }} value={customColorHex || '#13ec5b'} />
                      <button onClick={() => colorInputRef.current?.click()} className={`size-11 rounded-full flex items-center justify-center border-[3px] transition-all ${customColorHex ? 'border-primary scale-110' : 'bg-white/5 border-white/10'}`} style={customColorHex ? { backgroundColor: customColorHex } : {}}>
                        <span className={`material-symbols-outlined ${customColorHex ? 'text-black/50' : 'text-white/30'}`}>palette</span>
                      </button>
                    </div>
                </div>
            </div>

            {/* ESPÉCIES */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-primary" />
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Espécies</span>
                    </div>
                    <button onClick={() => setIsShowingAllFlowers(!isShowingAllFlowers)} className="text-primary text-[9px] font-bold uppercase tracking-widest">{isShowingAllFlowers ? 'Reduzir' : 'Ver Tudo'}</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {(isShowingAllFlowers ? flowers : flowers.slice(0, 3)).map((f: any) => (
                        <button 
                            key={f.id}
                            onClick={() => setSelectedFlower(f.name)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-[28px] border transition-all ${selectedFlower === f.name ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5'}`}
                        >
                            <img src={f.img} className="size-12 rounded-2xl object-cover shadow-xl" alt={f.name} />
                            <span className="text-[9px] text-white font-bold truncate w-full text-center">{f.name}</span>
                        </button>
                    ))}
                    {isShowingAllFlowers && (
                      <button onClick={() => setIsAddingNew('flower')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-[28px] border border-dashed border-white/20 bg-white/5 text-primary active:scale-95 transition-all">
                        <span className="material-symbols-outlined">add_circle</span>
                        <span className="text-[8px] font-black uppercase">Novo</span>
                      </button>
                    )}
                </div>
            </div>

            {/* FOLHAGENS */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-teal-400" />
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Folhagens</span>
                    </div>
                    <button onClick={() => setIsShowingAllFoliage(!isShowingAllFoliage)} className="text-primary text-[9px] font-bold uppercase tracking-widest">{isShowingAllFoliage ? 'Reduzir' : 'Ver Tudo'}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(isShowingAllFoliage ? foliages : foliages.slice(0, 4)).map((f: string) => (
                        <button 
                            key={f}
                            onClick={() => toggleFoliage(f)}
                            className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedFoliage.includes(f) ? 'bg-primary text-[#102216]' : 'bg-white/5 text-white border border-white/5'}`}
                        >
                            {f}
                        </button>
                    ))}
                    {isShowingAllFoliage && (
                      <button onClick={() => setIsAddingNew('foliage')} className="px-5 py-3 rounded-2xl border border-dashed border-primary/40 text-primary active:scale-95 transition-all flex items-center">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    )}
                </div>
            </div>
          </div>

          {/* BOTÃO FINALIZAR */}
          <div className="pt-6 flex flex-col gap-5">
            <button 
              onClick={() => {
                let finalPrompt = customPrompt || "";
                if (selectedFlower) finalPrompt += ` Espécie: ${selectedFlower}.`;
                if (customColorHex) finalPrompt += ` Cor (HEX): ${customColorHex}.`;
                else if (selectedColor) finalPrompt += ` Cor: ${selectedColor}.`;
                if (selectedFoliage.length > 0) finalPrompt += ` Folhagens: ${selectedFoliage.join(', ')}.`;
                onGenerate({ prompt: finalPrompt || "Design floral profissional", mode: 'edit', isHighQuality: true, fidelityLevel: 'balanced' });
              }}
              disabled={isLoading}
              className="w-full h-20 bg-primary text-[#102216] rounded-[32px] font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-4 shadow-[0_25px_70px_rgba(19,236,91,0.2)] active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined font-black text-2xl">auto_fix_high</span>
              Aplicar Mudanças IA
            </button>
          </div>
        </div>
      </div>

      {/* MODAL ADICIONAR ITEM */}
      {isAddingNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-sm bg-surface-dark border border-white/10 p-10 rounded-[45px] shadow-2xl">
            <h3 className="text-white text-2xl font-serif italic mb-2">Novo Ativo</h3>
            <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest mb-10 opacity-60">Sua biblioteca personalizada</p>
            <input 
              autoFocus
              type="text" 
              placeholder="Nome do ativo..." 
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl h-16 px-6 text-white text-sm outline-none focus:border-primary transition-all mb-8 font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewItem()}
            />
            <div className="flex gap-3">
              <button onClick={() => setIsAddingNew(null)} className="flex-1 h-14 rounded-2xl border border-white/5 text-white/30 font-black uppercase tracking-widest text-[9px]">Cancelar</button>
              <button onClick={handleAddNewItem} className="flex-1 h-14 rounded-2xl bg-primary text-[#102216] font-black uppercase tracking-widest text-[9px]">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default EditScreen;
