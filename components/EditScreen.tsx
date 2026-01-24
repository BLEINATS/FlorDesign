
import React, { useState, useEffect } from 'react';
import { ImageData, EditConfig, EditMode } from '../types';

interface FlowerSpecies {
  id: string;
  name: string;
  emoji: string;
  colors: { name: string; hex: string }[];
}

const FLORAL_CATALOG: FlowerSpecies[] = [
  { 
    id: 'rose', name: 'Rosa', emoji: '🌹', 
    colors: [{name: 'Vermelha', hex: '#BE185D'}, {name: 'Branca', hex: '#FFFFFF'}, {name: 'Chá', hex: '#FBCFE8'}] 
  },
  { 
    id: 'tulip', name: 'Tulipa', emoji: '🌷', 
    colors: [{name: 'Amarela', hex: '#FDE047'}, {name: 'Roxa', hex: '#A855F7'}, {name: 'Rosa', hex: '#F472B6'}] 
  },
  { 
    id: 'orchid', name: 'Orquídea', emoji: '🦋', 
    colors: [{name: 'Branca', hex: '#F8FAFC'}, {name: 'Lilás', hex: '#E9D5FF'}, {name: 'Amarela', hex: '#FEF08A'}] 
  },
  { 
    id: 'lily', name: 'Lírio', emoji: '🌿', 
    colors: [{name: 'Branco', hex: '#FFFFFF'}, {name: 'Laranja', hex: '#FB923C'}] 
  },
  { 
    id: 'hydrangea', name: 'Hortênsia', emoji: '💠', 
    colors: [{name: 'Azul', hex: '#60A5FA'}, {name: 'Rosa', hex: '#F472B6'}] 
  },
  { 
    id: 'peony', name: 'Peônia', emoji: '🌺', 
    colors: [{name: 'Rosa Bebê', hex: '#FCE7F3'}, {name: 'Coral', hex: '#FDA4AF'}] 
  },
];

interface Props {
  originalImage: ImageData;
  onGenerate: (config: EditConfig) => void;
  isLoading: boolean;
  error: string | null;
  isQuotaError: boolean;
  onOpenKey: () => void;
}

const EditScreen: React.FC<Props> = ({ originalImage, onGenerate, isLoading, error, isQuotaError, onOpenKey }) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<EditMode>('edit');
  const [quality, setQuality] = useState(false);
  const [retryTimer, setRetryTimer] = useState<number | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isQuotaError && !retryTimer) setRetryTimer(60);
    if (retryTimer && retryTimer > 0) {
      interval = setInterval(() => setRetryTimer(prev => (prev ? prev - 1 : null)), 1000);
    } else if (retryTimer === 0) setRetryTimer(null);
    return () => clearInterval(interval);
  }, [isQuotaError, retryTimer]);

  const selectFlower = (species: FlowerSpecies, colorName: string) => {
    const newPrompt = `Substitua todas as flores atuais por ${species.name}s na cor ${colorName}. Mantenha o estilo do vaso e o realismo fotográfico.`;
    setPrompt(newPrompt);
    setMode('edit');
    setShowCatalog(false);
  };

  const handleSubmit = () => {
    onGenerate({ 
      prompt: mode === 'humanize' ? 'Realismo fotográfico extremo, texturas botânicas 8k' : prompt, 
      mode, 
      isHighQuality: quality, 
      fidelityLevel: 'balanced' 
    });
  };

  return (
    <div className="flex-1 flex flex-col pt-16 animate-slide-up relative h-[calc(100dvh-64px)] bg-luxury-cream overflow-hidden">
      
      {/* Botão do Catálogo Floral - Z-INDEX 110 para ficar acima do Drawer */}
      <button 
        onClick={() => setShowCatalog(!showCatalog)}
        className={`absolute right-4 top-20 z-[110] w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all shadow-2xl border ${
          showCatalog ? 'bg-luxury-slate text-white border-white/20' : 'bg-white text-luxury-gold border-luxury-gold/20'
        }`}
      >
        <span className="text-2xl">{showCatalog ? '✕' : '💐'}</span>
        <span className="text-[7px] font-black uppercase tracking-widest mt-1">
          {showCatalog ? 'Fechar' : 'Espécies'}
        </span>
      </button>

      {/* Drawer do Catálogo - FIXED z-100 */}
      {showCatalog && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCatalog(false)} />
          <div className="w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col animate-slide-left relative z-[101]">
            <div className="p-8 border-b border-black/5 bg-luxury-cream/80">
              <h3 className="font-serif font-bold text-2xl text-luxury-slate">Boutique Floral</h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">Escolha uma flor para sua visão</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
              {FLORAL_CATALOG.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-luxury-slate">{item.name}s</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {item.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => selectFlower(item, color.name)}
                        className="flex items-center gap-4 px-5 py-4 bg-luxury-cream rounded-3xl border border-black/5 active:scale-95 transition-all shadow-sm group"
                      >
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white shadow-xl group-hover:scale-110 transition-transform" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
               <div className="bg-luxury-slate text-white text-[10px] py-4 rounded-2xl text-center uppercase tracking-widest font-black shadow-xl">
                 Seleção Botânica IA
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Visualização da Imagem Central */}
      <div className="flex-1 overflow-hidden px-6 pt-4 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[420px] aspect-[3/4] bg-slate-200 rounded-[40px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
          <img 
            src={`data:${originalImage.mimeType};base64,${originalImage.data}`} 
            className="w-full h-full object-cover" 
            alt="Base de edição" 
          />
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-20">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-white/10 border-t-luxury-rose rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">🌸</div>
              </div>
              <p className="text-white mt-8 font-serif italic text-lg tracking-[0.1em]">
                Compondo sua visão...
              </p>
              <div className="mt-2 flex gap-1">
                <div className="w-1.5 h-1.5 bg-luxury-rose rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-luxury-rose rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-luxury-rose rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painel de Controle Inferior */}
      <div className="glass rounded-t-[50px] px-8 pt-10 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-white/80 z-30 max-h-[60%] overflow-y-auto no-scrollbar safe-pb">
        
        {/* MODOS DE OPERAÇÃO - RESTAURADOS */}
        <div className="mb-8">
          <div className="flex bg-black/5 p-1.5 rounded-[28px] gap-1 shadow-inner">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === 'create' ? 'bg-white text-luxury-rose shadow-xl scale-[1.02]' : 'text-slate-400'
              }`}
            >
              Criar
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === 'edit' ? 'bg-white text-luxury-rose shadow-xl scale-[1.02]' : 'text-slate-400'
              }`}
            >
              Mudar
            </button>
            <button
              onClick={() => setMode('humanize')}
              className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === 'humanize' ? 'bg-white text-luxury-rose shadow-xl scale-[1.02]' : 'text-slate-400'
              }`}
            >
              Humanizar
            </button>
          </div>
        </div>

        {/* Campo de Texto Dinâmico */}
        {mode !== 'humanize' ? (
          <div className="relative mb-8">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'create' ? "O que deseja criar no espaço?" : "Descreva a alteração ou use o catálogo..."}
              className="w-full h-28 p-6 bg-white/40 rounded-[32px] focus:ring-2 focus:ring-luxury-gold/20 outline-none transition-all placeholder:text-slate-300 font-medium text-sm resize-none border border-black/5 shadow-inner"
            />
            {prompt && (
              <button 
                onClick={() => setPrompt('')}
                className="absolute right-4 bottom-4 w-10 h-10 bg-slate-200/50 rounded-full text-xs flex items-center justify-center text-slate-500 active:scale-90"
              >✕</button>
            )}
          </div>
        ) : (
          <div className="mb-8 p-6 bg-luxury-rose/5 rounded-[32px] border border-luxury-rose/10 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">✨</span>
            <p className="text-[10px] text-luxury-rose font-black uppercase tracking-[0.2em] mb-1">Modo Realismo Extremo</p>
            <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
              Foco em luz, sombra e texturas orgânicas sem alterar seu design.
            </p>
          </div>
        )}

        {/* Qualidade e Botão Gerar */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center px-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-slate">Alta Fidelidade</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Processamento Premium</span>
            </div>
            <button 
              onClick={() => setQuality(!quality)}
              className={`w-16 h-8 rounded-full transition-all relative ${quality ? 'bg-luxury-gold shadow-lg shadow-luxury-gold/20' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${quality ? 'translate-x-9' : 'translate-x-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || retryTimer !== null || (mode !== 'humanize' && !prompt.trim())}
            className={`w-full py-7 rounded-[32px] shadow-2xl active:scale-95 transition-all font-black uppercase tracking-[0.4em] text-[12px] ${
              retryTimer ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' : 'bg-luxury-rose text-white'
            }`}
          >
            {isLoading ? 'IA Trabalhando...' : retryTimer ? `Aguarde ${retryTimer}s` : 'Transformar'}
          </button>
        </div>

        {error && (
          <div className="mt-8 p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-start gap-4 animate-slide-up">
             <span className="text-xl">⚠️</span>
             <div className="flex-1">
               <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mb-1">Aviso do Sistema</p>
               <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{error}</p>
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default EditScreen;
