import React, { useState } from 'react';
import { CreditPackage } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface StoreScreenProps {
  currentCredits: number;
  onBuy: (pkg: CreditPackage, cycle: 'one-time' | 'monthly' | 'yearly', finalPrice: number) => void;
  onBack: () => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ currentCredits, onBuy, onBack }) => {
  const [packages] = useLocalStorage<CreditPackage[]>('flora-credit-packages', [
      { id: 'starter', credits: 50, price: 'R$ 29,90', label: 'Iniciante' },
      { id: 'pro', credits: 200, price: 'R$ 89,90', label: 'Profissional', popular: true },
      { id: 'studio', credits: 500, price: 'R$ 199,90', label: 'Studio' },
  ]);

  const [billingCycle, setBillingCycle] = useState<'one-time' | 'monthly' | 'yearly'>('one-time');

  // Função auxiliar para converter string de preço em número
  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  // Função para formatar número em moeda
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Calcula o preço baseado no ciclo escolhido
  const calculatePrice = (basePriceStr: string) => {
    const basePrice = parsePrice(basePriceStr);
    
    if (billingCycle === 'monthly') {
        const discounted = basePrice * 0.90; // 10% off
        return {
            value: discounted,
            display: formatCurrency(discounted),
            label: '/mês'
        };
    }
    
    if (billingCycle === 'yearly') {
        const discountedMonthly = basePrice * 0.80; // 20% off base
        const totalYearly = discountedMonthly * 12;
        return {
            value: totalYearly,
            display: formatCurrency(totalYearly),
            label: '/ano',
            monthlyEquivalent: formatCurrency(discountedMonthly)
        };
    }

    return {
        value: basePrice,
        display: formatCurrency(basePrice),
        label: ''
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-[#102216] min-h-screen text-white font-display animate-slide-up relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#13ec5b]/10 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-safe-top z-10">
        <button 
          onClick={onBack}
          className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold tracking-tight">Loja de Créditos</h2>
        <div className="size-10" /> 
      </div>

      <main className="flex-1 px-6 pb-10 overflow-y-auto no-scrollbar z-10">
        
        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-[#1c271f] to-[#102216] border border-[#13ec5b]/30 rounded-[32px] p-6 text-center mb-8 shadow-[0_0_40px_rgba(19,236,91,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-9xl text-[#13ec5b]">token</span>
            </div>
            
            <p className="text-[#9db9a6] text-xs font-black uppercase tracking-[0.3em] mb-2">Seu Saldo Atual</p>
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="material-symbols-outlined text-4xl text-[#13ec5b]">token</span>
                <span className="text-6xl font-black text-white">{currentCredits}</span>
            </div>
            <p className="text-white/40 text-[10px] font-medium">Créditos FloraDesign</p>
        </div>

        {/* TOGGLE DE CICLO DE COBRANÇA */}
        <div className="flex justify-center mb-8">
            <div className="bg-[#1c271f] p-1 rounded-2xl border border-white/10 flex relative w-full max-w-md">
                <button 
                    onClick={() => setBillingCycle('one-time')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all relative z-10 ${billingCycle === 'one-time' ? 'text-[#102216] bg-[#13ec5b] shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                    Avulso
                </button>
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-[#102216] bg-[#13ec5b] shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                    Mensal
                    <span className="absolute -top-2 right-1 bg-red-500 text-white text-[7px] px-1.5 py-0.5 rounded-full animate-pulse">-10%</span>
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all relative z-10 ${billingCycle === 'yearly' ? 'text-[#102216] bg-[#13ec5b] shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                    Anual
                    <span className="absolute -top-2 right-1 bg-[#13ec5b] text-[#102216] border border-[#102216] text-[7px] px-1.5 py-0.5 rounded-full animate-pulse">-20%</span>
                </button>
            </div>
        </div>

        <h3 className="text-center text-xl font-serif italic mb-6">
            {billingCycle === 'one-time' ? 'Recarga Única' : billingCycle === 'monthly' ? 'Assinatura Mensal' : 'Plano Anual'}
        </h3>

        {/* Packages Grid - DYNAMIC */}
        <div className="flex flex-col gap-4">
            {packages.map((pkg) => {
                const pricing = calculatePrice(pkg.price);
                
                return (
                    <button
                        key={pkg.id}
                        onClick={() => onBuy(pkg, billingCycle, pricing.value)}
                        className={`relative p-6 rounded-[24px] border transition-all active:scale-95 flex flex-col sm:flex-row items-center justify-between group ${
                            pkg.popular 
                            ? 'bg-[#13ec5b] border-[#13ec5b] text-[#102216] shadow-[0_0_30px_rgba(19,236,91,0.3)]' 
                            : 'bg-[#1c271f] border-white/10 text-white hover:border-white/30'
                        }`}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#102216] text-[#13ec5b] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#13ec5b]">
                                Mais Vendido
                            </div>
                        )}

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${pkg.popular ? 'bg-[#102216]/20' : 'bg-white/5'}`}>
                                <span className="material-symbols-outlined text-2xl">
                                    {billingCycle === 'one-time' ? 'token' : 'event_repeat'}
                                </span>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-lg leading-none mb-1">
                                    {pkg.credits} Créditos
                                    {billingCycle !== 'one-time' && <span className="text-[10px] opacity-70 ml-1">/mês</span>}
                                </h4>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${pkg.popular ? 'text-[#102216]/70' : 'text-white/40'}`}>
                                    {pkg.label}
                                </p>
                            </div>
                        </div>

                        <div className="text-right mt-4 sm:mt-0 w-full sm:w-auto flex flex-col items-end">
                            <span className="block font-bold text-xl">
                                {pricing.display}
                                <span className="text-xs font-medium opacity-60 ml-1">{pricing.label}</span>
                            </span>
                            
                            {billingCycle === 'yearly' && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${pkg.popular ? 'text-[#102216]/60' : 'text-[#13ec5b]'}`}>
                                    Equivale a {pricing.monthlyEquivalent}/mês
                                </span>
                            )}
                            
                            {billingCycle === 'monthly' && (
                                <span className={`text-[9px] line-through opacity-50 ${pkg.popular ? 'text-[#102216]' : 'text-white'}`}>
                                    {pkg.price}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Info Section */}
        <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec5b]">info</span>
                Vantagens da Assinatura
            </h4>
            <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-white/70">
                    <span className="material-symbols-outlined text-[#13ec5b] text-sm">check</span>
                    <span>Créditos acumulativos (não expiram enquanto ativo)</span>
                </li>
                <li className="flex gap-3 text-xs text-white/70">
                    <span className="material-symbols-outlined text-[#13ec5b] text-sm">check</span>
                    <span>Acesso prioritário a novos recursos (Humanização 3D)</span>
                </li>
                <li className="flex gap-3 text-xs text-white/70">
                    <span className="material-symbols-outlined text-[#13ec5b] text-sm">check</span>
                    <span>Cancele a qualquer momento sem multa</span>
                </li>
            </ul>
        </div>

      </main>

      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StoreScreen;
