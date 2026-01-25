import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
  triggerAction?: string; // Qual ação disparou o modal (ex: "Para salvar seu projeto...")
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, triggerAction }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de delay de API
    setTimeout(() => {
      setIsLoading(false);
      // Em um app real, aqui validaria com Supabase
      onLogin(name || "Usuário", email);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop com Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#102216] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header Visual */}
        <div className="relative h-32 bg-gradient-to-br from-[#13ec5b]/20 to-[#102216] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-center z-10">
                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(19,236,91,0.4)]">🌸</span>
                <h2 className="text-white font-serif italic text-xl mt-2">FloraDesign AI</h2>
            </div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 size-8 rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-black/40 flex items-center justify-center transition-all"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>

        <div className="p-8 pt-6">
            <div className="text-center mb-8">
                {triggerAction ? (
                    <div className="bg-[#13ec5b]/10 border border-[#13ec5b]/20 rounded-xl p-3 mb-4">
                        <p className="text-[#13ec5b] text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            {triggerAction}
                        </p>
                    </div>
                ) : null}
                
                <h3 className="text-2xl font-bold text-white mb-2">
                    {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
                </h3>
                <p className="text-white/50 text-xs">
                    {isRegister 
                        ? 'Salve seus projetos e acesse ferramentas profissionais.' 
                        : 'Acesse sua galeria e créditos.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {isRegister && (
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Nome</label>
                        <input 
                            type="text" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                            placeholder="Seu nome"
                        />
                    </div>
                )}
                
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">E-mail</label>
                    <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                        placeholder="seu@email.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Senha</label>
                    <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#13ec5b] transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="h-14 mt-4 bg-[#13ec5b] text-[#102216] rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(19,236,91,0.3)] hover:shadow-[0_0_30px_rgba(19,236,91,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="size-5 border-2 border-[#102216]/30 border-t-[#102216] rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>{isRegister ? 'Criar Conta Grátis' : 'Entrar'}</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-xs text-white/40 hover:text-[#13ec5b] transition-colors"
                >
                    {isRegister ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
                    <span className="font-bold underline">{isRegister ? 'Fazer Login' : 'Cadastre-se'}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
