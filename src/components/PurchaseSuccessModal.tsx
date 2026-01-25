import React, { useEffect, useRef } from 'react';

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsAdded: number;
}

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({ isOpen, onClose, creditsAdded }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efeito de Confetes (Canvas Leve)
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#13ec5b', '#FFFFFF', '#FFD700', '#102216'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 100, // Começa do centro, um pouco pra baixo
        vx: (Math.random() - 0.5) * 15, // Explosão horizontal
        vy: (Math.random() - 1) * 15 - 5, // Explosão vertical pra cima
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.2,
        drag: 0.96
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.rotation += p.rotationSpeed;
        p.size *= 0.99; // Diminui levemente

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Remove partículas muito pequenas ou fora da tela
        if (p.size < 0.5 || p.y > canvas.height) {
            particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050806]/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Canvas de Confetes */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[201]" />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-[#102216] border border-[#13ec5b]/30 rounded-[40px] shadow-[0_0_100px_rgba(19,236,91,0.2)] overflow-hidden flex flex-col items-center text-center p-8 animate-slide-up z-[202]">
        
        {/* Glow de Fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#13ec5b]/10 blur-[60px] pointer-events-none" />

        {/* Ícone Animado */}
        <div className="size-28 rounded-full bg-[#13ec5b] flex items-center justify-center mb-6 relative shadow-[0_0_40px_rgba(19,236,91,0.4)] animate-bounce">
            <span className="material-symbols-outlined text-[#102216] text-6xl font-bold">check</span>
            
            {/* Partículas decorativas CSS */}
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
            <div className="absolute -bottom-1 -left-2 text-xl animate-pulse delay-100">🎉</div>
        </div>

        <h2 className="text-3xl font-serif font-bold text-white mb-2 italic">Parabéns!</h2>
        <p className="text-[#13ec5b] text-xs font-black uppercase tracking-[0.3em] mb-6">Compra Confirmada</p>
        
        <div className="bg-[#1c271f] border border-white/5 rounded-2xl p-4 w-full mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-6xl">token</span>
            </div>
            <p className="text-white/60 text-xs mb-1">Você recebeu</p>
            <p className="text-4xl font-bold text-white flex items-center justify-center gap-2">
                <span className="text-[#13ec5b]">+</span>{creditsAdded}
                <span className="text-sm font-normal text-white/40 mt-2">créditos</span>
            </p>
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-8 px-2">
            Muito obrigado por apoiar o FloraDesign AI. Estamos ansiosos para ver o que você vai criar!
        </p>

        <button 
            onClick={onClose}
            className="w-full h-14 bg-[#13ec5b] text-[#102216] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
            <span>Continuar Criando</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
