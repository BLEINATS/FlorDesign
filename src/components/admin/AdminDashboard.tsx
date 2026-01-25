import React, { useState, useEffect } from 'react';
import { User, CreditPackage, SystemSettings, Transaction, UsageLog } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'pricing' | 'finance' | 'settings'>('users');
  
  const [allUsers] = useLocalStorage<User[]>('flora-db-users', []);
  const [packages, setPackages] = useLocalStorage<CreditPackage[]>('flora-credit-packages', [
      { id: 'starter', credits: 50, price: 'R$ 29,90', label: 'Iniciante' },
      { id: 'pro', credits: 200, price: 'R$ 89,90', label: 'Profissional', popular: true },
      { id: 'studio', credits: 500, price: 'R$ 199,90', label: 'Studio' },
  ]);
  const [settings, setSettings] = useLocalStorage<SystemSettings>('flora-admin-settings', {
      geminiApiKey: '',
      stripePublicKey: '',
      stripeSecretKey: '',
      currency: 'BRL'
  });
  const [transactions] = useLocalStorage<Transaction[]>('flora-transactions', []);
  const [usageLogs] = useLocalStorage<UsageLog[]>('flora-usage-logs', []);

  const [editingPkg, setEditingPkg] = useState<CreditPackage | null>(null);
  const [tempSettings, setTempSettings] = useState<SystemSettings>(settings);
  const [toast, setToast] = useState<string | null>(null);
  
  const [financeSearch, setFinanceSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const showToast = (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = () => {
      setSettings(tempSettings);
      showToast("Configurações salvas!");
  };

  const handleSavePackage = (pkg: CreditPackage) => {
      const exists = packages.find(p => p.id === pkg.id);
      if (exists) {
          setPackages(packages.map(p => p.id === pkg.id ? pkg : p));
      } else {
          setPackages([...packages, pkg]);
      }
      setEditingPkg(null);
      showToast("Pacote atualizado!");
  };

  const handleDeletePackage = (id: string) => {
      if(confirm('Excluir este pacote?')) {
          setPackages(packages.filter(p => p.id !== id));
      }
  };

  const getTransactionUserName = (t: Transaction) => {
      const user = allUsers.find(u => u.id === t.userId) || allUsers.find(u => u.email === t.userEmail);
      return user ? user.name : (t.userName || 'Cliente Desconhecido');
  };

  // --- LÓGICA DE FILTRAGEM FINANCEIRA ---
  const filteredTransactions = transactions.filter(t => {
      const userName = getTransactionUserName(t).toLowerCase();
      const matchesSearch = userName.includes(financeSearch.toLowerCase()) ||
                            t.userEmail.toLowerCase().includes(financeSearch.toLowerCase());
      
      let matchesDate = true;
      if (startDate || endDate) {
          const txnDate = new Date(t.date).getTime();
          const start = startDate ? new Date(startDate).setHours(0,0,0,0) : 0;
          const end = endDate ? new Date(endDate).setHours(23,59,59,999) : Infinity;
          matchesDate = txnDate >= start && txnDate <= end;
      }

      return matchesSearch && matchesDate;
  });

  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed');
  const totalRevenue = completedTransactions.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
  const totalSales = completedTransactions.length;
  
  // Custo Total de API (Geral)
  const totalApiCost = usageLogs.reduce((acc, curr) => acc + curr.costInBrl, 0);
  const totalProfit = totalRevenue - totalApiCost;

  // --- CÁLCULO FINANCEIRO POR USUÁRIO ---
  const getUserFinancials = (user: User) => {
      // 1. Receita (Quanto ele pagou)
      const revenue = transactions
          .filter(t => (t.userId === user.id || t.userEmail === user.email) && t.status === 'completed')
          .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
      
      // 2. Custo (Quanto ele gastou de API)
      const cost = usageLogs
          .filter(l => l.userId === user.id)
          .reduce((acc, curr) => acc + curr.costInBrl, 0);

      // 3. Lucro
      const profit = revenue - cost;

      return { revenue, cost, profit };
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050806] min-h-screen font-display text-white animate-fade-in">
      
      {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-full shadow-xl font-bold uppercase text-xs tracking-widest animate-slide-up whitespace-nowrap">
              {toast}
          </div>
      )}

      {/* Header Admin */}
      <div className="bg-[#102216] border-b border-white/10 p-4 md:p-6 pt-safe-top flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
            <div className="size-8 md:size-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <span className="material-symbols-outlined text-red-500 text-lg md:text-2xl">admin_panel_settings</span>
            </div>
            <div>
                <h1 className="text-base md:text-lg font-bold text-white leading-tight">Super Admin</h1>
                <p className="text-[8px] md:text-[10px] text-white/40 font-black uppercase tracking-widest">Painel de Controle</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-[#13ec5b]/10 hover:bg-[#13ec5b]/20 text-[#13ec5b] text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">smartphone</span>
                <span className="hidden sm:inline">Acessar App</span>
            </button>
            <button onClick={onLogout} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span>
                Sair
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* Sidebar Desktop */}
          <aside className="w-64 bg-[#102216]/50 border-r border-white/5 hidden md:flex flex-col p-4 gap-2">
              <SidebarItem icon="group" label="Clientes" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
              <SidebarItem icon="payments" label="Preços & Planos" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
              <SidebarItem icon="attach_money" label="Financeiro" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
              <SidebarItem icon="settings" label="Configurações API" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </aside>

          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-white/5 bg-[#102216] no-scrollbar shrink-0">
              <MobileTab label="Clientes" icon="group" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
              <MobileTab label="Preços" icon="payments" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
              <MobileTab label="Financeiro" icon="attach_money" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
              <MobileTab label="APIs" icon="settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#050806] pb-20 md:pb-6">
              
              {/* --- USERS TAB (Com Lucro Real) --- */}
              {activeTab === 'users' && (
                  <div className="max-w-6xl mx-auto animate-slide-up">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl md:text-2xl font-serif italic">Base de Clientes</h2>
                          <div className="bg-white/5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold">
                              Total: <span className="text-[#13ec5b]">{allUsers.length}</span>
                          </div>
                      </div>

                      <div className="hidden md:block bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-white/5 text-white/40 uppercase text-[10px] font-black tracking-widest">
                                  <tr>
                                      <th className="p-4">Usuário</th>
                                      <th className="p-4">Status</th>
                                      <th className="p-4">Créditos</th>
                                      <th className="p-4 text-right">Receita (LTV)</th>
                                      <th className="p-4 text-right">Custo API</th>
                                      <th className="p-4 text-right">Lucro Real</th>
                                      <th className="p-4 text-right">Cadastro</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                  {allUsers.length === 0 ? (
                                      <tr><td colSpan={7} className="p-8 text-center text-white/30">Nenhum usuário registrado.</td></tr>
                                  ) : (
                                      allUsers.map(u => {
                                          const fin = getUserFinancials(u);
                                          return (
                                              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                  <td className="p-4 flex items-center gap-3">
                                                      <img src={u.avatar} className="size-8 rounded-full bg-black object-cover" alt="" />
                                                      <div>
                                                          <span className="font-bold block">{u.name}</span>
                                                          <span className="text-[10px] text-white/50">{u.email}</span>
                                                      </div>
                                                  </td>
                                                  <td className="p-4">
                                                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${u.isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-[#13ec5b]/20 text-[#13ec5b]'}`}>
                                                          {u.isAdmin ? 'Admin' : 'Cliente'}
                                                      </span>
                                                  </td>
                                                  <td className="p-4">
                                                      <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg w-fit">
                                                          <span className="material-symbols-outlined text-[#13ec5b] text-sm">token</span>
                                                          <span className="font-bold text-[#13ec5b]">{u.credits || 0}</span>
                                                      </div>
                                                  </td>
                                                  <td className="p-4 text-right font-medium text-white">
                                                      R$ {fin.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                  </td>
                                                  <td className="p-4 text-right text-red-400 font-medium">
                                                      - R$ {fin.cost.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                                                  </td>
                                                  <td className="p-4 text-right">
                                                      <span className={`font-bold ${fin.profit >= 0 ? 'text-[#13ec5b]' : 'text-red-500'}`}>
                                                          R$ {fin.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                      </span>
                                                  </td>
                                                  <td className="p-4 text-right text-white/40 text-xs">
                                                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                                  </td>
                                              </tr>
                                          );
                                      })
                                  )}
                              </tbody>
                          </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden flex flex-col gap-3">
                        {allUsers.map(u => {
                            const fin = getUserFinancials(u);
                            return (
                                <div key={u.id} className="bg-[#1c271f] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={u.avatar} className="size-10 rounded-full bg-black object-cover" alt="" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-sm text-white">{u.name}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${u.isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-[#13ec5b]/20 text-[#13ec5b]'}`}>
                                                    {u.isAdmin ? 'Admin' : 'Cliente'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/60 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-3 bg-white/5 p-2 rounded-lg">
                                        <span className="text-[9px] uppercase text-white/40 font-bold">Saldo Atual:</span>
                                        <span className="material-symbols-outlined text-[#13ec5b] text-sm">token</span>
                                        <span className="font-bold text-[#13ec5b]">{u.credits || 0}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                                        <div className="text-center">
                                            <p className="text-[8px] uppercase text-white/40 font-bold">Receita</p>
                                            <p className="text-xs font-bold text-white">R$ {fin.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] uppercase text-white/40 font-bold">Custo AI</p>
                                            <p className="text-xs font-bold text-red-400">- R$ {fin.cost.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] uppercase text-white/40 font-bold">Lucro</p>
                                            <p className={`text-xs font-bold ${fin.profit >= 0 ? 'text-[#13ec5b]' : 'text-red-500'}`}>
                                                R$ {fin.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                      </div>
                  </div>
              )}

              {/* ... (Resto do componente mantido igual) ... */}
              {activeTab === 'pricing' && (
                  <div className="max-w-3xl mx-auto animate-slide-up">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl md:text-2xl font-serif italic">Tabela de Preços</h2>
                          <button 
                            onClick={() => setEditingPkg({ id: `pkg-${Date.now()}`, credits: 100, price: 'R$ 0,00', label: 'Novo Plano' })}
                            className="bg-[#13ec5b] text-[#102216] px-3 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#13ec5b]/90 transition-colors flex items-center gap-1"
                          >
                              <span className="material-symbols-outlined text-sm">add</span>
                              Novo
                          </button>
                      </div>

                      <div className="grid gap-4">
                          {packages.map(pkg => (
                              <div key={pkg.id} className="bg-[#1c271f] p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-[#13ec5b]/30 transition-all gap-4">
                                  <div className="flex items-center gap-4">
                                      <div className="size-10 md:size-12 rounded-full bg-white/5 flex items-center justify-center text-[#13ec5b] shrink-0">
                                          <span className="material-symbols-outlined text-xl md:text-2xl">token</span>
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-base md:text-lg">{pkg.label}</h3>
                                            {pkg.popular && (
                                                <span className="bg-[#13ec5b]/20 text-[#13ec5b] text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">Popular</span>
                                            )}
                                          </div>
                                          <p className="text-white/50 text-xs md:text-sm">{pkg.credits} Créditos • {pkg.price}</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                      <button onClick={() => setEditingPkg(pkg)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white flex-1 sm:flex-none flex justify-center">
                                          <span className="material-symbols-outlined">edit</span>
                                      </button>
                                      <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-red-500/70 hover:text-red-500 flex-1 sm:flex-none flex justify-center">
                                          <span className="material-symbols-outlined">delete</span>
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Modal de Edição de Pacote */}
                      {editingPkg && (
                          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                              <div className="bg-[#1c271f] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
                                  <h3 className="text-lg font-bold mb-4">Editar Pacote</h3>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-[10px] font-black uppercase text-white/40">Nome do Plano</label>
                                          <input type="text" value={editingPkg.label} onChange={e => setEditingPkg({...editingPkg, label: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#13ec5b]" />
                                      </div>
                                      <div className="flex gap-4">
                                          <div className="flex-1">
                                              <label className="text-[10px] font-black uppercase text-white/40">Créditos</label>
                                              <input type="number" value={editingPkg.credits} onChange={e => setEditingPkg({...editingPkg, credits: parseInt(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#13ec5b]" />
                                          </div>
                                          <div className="flex-1">
                                              <label className="text-[10px] font-black uppercase text-white/40">Preço</label>
                                              <input type="text" value={editingPkg.price} onChange={e => setEditingPkg({...editingPkg, price: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#13ec5b]" />
                                          </div>
                                      </div>
                                      <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer border border-transparent hover:border-white/10">
                                          <input type="checkbox" checked={editingPkg.popular} onChange={e => setEditingPkg({...editingPkg, popular: e.target.checked})} className="accent-[#13ec5b] size-4" />
                                          <span className="text-sm">Marcar como "Mais Popular"</span>
                                      </label>
                                      <div className="flex gap-3 pt-2">
                                          <button onClick={() => setEditingPkg(null)} className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase">Cancelar</button>
                                          <button onClick={() => handleSavePackage(editingPkg)} className="flex-1 py-3 rounded-lg bg-[#13ec5b] text-[#102216] text-xs font-bold uppercase hover:bg-[#13ec5b]/90">Salvar</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* --- FINANCE TAB (Com Lucro Líquido) --- */}
              {activeTab === 'finance' && (
                  <div className="max-w-5xl mx-auto animate-slide-up">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                          <h2 className="text-xl md:text-2xl font-serif italic">Contas a Receber</h2>
                          <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 w-full sm:w-auto justify-center">
                              <span className="material-symbols-outlined text-sm">download</span>
                              Exportar Relatório
                          </button>
                      </div>

                      {/* KPI Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                          <div className="bg-[#1c271f] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Faturamento</span>
                              <div className="flex items-center gap-1">
                                  <span className="text-lg md:text-xl font-bold text-white">
                                      R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                              </div>
                          </div>
                          <div className="bg-[#1c271f] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Custo Operacional</span>
                              <div className="flex items-center gap-1">
                                  <span className="text-lg md:text-xl font-bold text-red-400">
                                      - R$ {totalApiCost.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                                  </span>
                              </div>
                          </div>
                          <div className="bg-[#1c271f] p-4 rounded-2xl border border-white/5 flex flex-col gap-1 relative overflow-hidden">
                              <div className={`absolute inset-0 opacity-10 ${totalProfit >= 0 ? 'bg-[#13ec5b]' : 'bg-red-500'}`} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Lucro Líquido</span>
                              <div className="flex items-center gap-1">
                                  <span className={`text-lg md:text-xl font-bold ${totalProfit >= 0 ? 'text-[#13ec5b]' : 'text-red-500'}`}>
                                      R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                              </div>
                          </div>
                          <div className="bg-[#1c271f] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Margem</span>
                              <div className="flex items-center gap-1">
                                  <span className="text-lg md:text-xl font-bold text-white">
                                      {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'}%
                                  </span>
                              </div>
                          </div>
                      </div>

                      {/* Filtros */}
                      <div className="bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden mb-4 p-4 flex flex-col md:flex-row gap-4">
                          <div className="flex-1 flex items-center gap-3 bg-black/20 rounded-xl px-3 border border-white/5">
                              <span className="material-symbols-outlined text-white/30">search</span>
                              <input 
                                  type="text" 
                                  placeholder="Filtrar por cliente..." 
                                  value={financeSearch}
                                  onChange={(e) => setFinanceSearch(e.target.value)}
                                  className="bg-transparent text-sm text-white w-full h-10 outline-none placeholder:text-white/20"
                              />
                          </div>
                          <div className="flex gap-2">
                              <div className="flex flex-col">
                                <label className="text-[8px] font-black uppercase text-white/40 ml-1 mb-1">De</label>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-black/20 text-white text-xs border border-white/5 rounded-xl px-3 h-10 outline-none focus:border-[#13ec5b] appearance-none"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-[8px] font-black uppercase text-white/40 ml-1 mb-1">Até</label>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-black/20 text-white text-xs border border-white/5 rounded-xl px-3 h-10 outline-none focus:border-[#13ec5b] appearance-none"
                                />
                              </div>
                          </div>
                      </div>

                      {/* Tabela de Transações */}
                      <div className="hidden md:block bg-[#1c271f] rounded-2xl border border-white/5 overflow-hidden">
                          <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm whitespace-nowrap">
                                  <thead className="bg-white/5 text-white/40 uppercase text-[10px] font-black tracking-widest">
                                      <tr>
                                          <th className="p-4">Data</th>
                                          <th className="p-4">Cliente</th>
                                          <th className="p-4">Pacote</th>
                                          <th className="p-4">Valor</th>
                                          <th className="p-4">Método</th>
                                          <th className="p-4">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5">
                                      {filteredTransactions.length === 0 ? (
                                          <tr><td colSpan={6} className="p-8 text-center text-white/30">Nenhuma transação encontrada.</td></tr>
                                      ) : (
                                          filteredTransactions.map(t => (
                                              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                                  <td className="p-4 text-white/60 text-xs">
                                                      {new Date(t.date).toLocaleString('pt-BR')}
                                                  </td>
                                                  <td className="p-4">
                                                      <div className="flex flex-col">
                                                          <span className="font-bold text-white">{getTransactionUserName(t)}</span>
                                                          <span className="text-[10px] text-white/40">{t.userEmail}</span>
                                                      </div>
                                                  </td>
                                                  <td className="p-4">
                                                      <span className="bg-white/5 px-2 py-1 rounded text-xs">
                                                          {t.packageLabel} ({t.creditsAmount} cr)
                                                      </span>
                                                  </td>
                                                  <td className="p-4 font-bold text-[#13ec5b]">
                                                      {t.price}
                                                  </td>
                                                  <td className="p-4 text-xs text-white/60 capitalize">
                                                      {t.paymentMethod.replace('_', ' ')}
                                                  </td>
                                                  <td className="p-4">
                                                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                                                          t.status === 'completed' ? 'bg-[#13ec5b]/20 text-[#13ec5b]' : 
                                                          t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                                                          'bg-red-500/20 text-red-500'
                                                      }`}>
                                                          {t.status === 'completed' ? 'Pago' : t.status}
                                                      </span>
                                                  </td>
                                              </tr>
                                          ))
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>

                      {/* Mobile Cards (Finance) */}
                      <div className="md:hidden flex flex-col gap-3">
                        {filteredTransactions.length === 0 ? (
                            <div className="p-8 text-center text-white/30 bg-[#1c271f] rounded-xl border border-white/5">
                                Nenhuma transação encontrada.
                            </div>
                        ) : (
                            filteredTransactions.map(t => (
                                <div key={t.id} className="bg-[#1c271f] p-4 rounded-xl border border-white/5">
                                   <div className="flex justify-between mb-3 border-b border-white/5 pb-2">
                                      <span className="text-xs text-white/50">{new Date(t.date).toLocaleDateString()}</span>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-black ${t.status === 'completed' ? 'bg-[#13ec5b]/20 text-[#13ec5b]' : 'bg-red-500/20 text-red-500'}`}>{t.status === 'completed' ? 'Pago' : t.status}</span>
                                   </div>
                                   <div className="flex justify-between items-center mb-2">
                                      <div>
                                         <p className="font-bold text-sm text-white">{getTransactionUserName(t)}</p>
                                         <p className="text-[10px] text-white/50">{t.packageLabel} ({t.creditsAmount} cr)</p>
                                      </div>
                                      <div className="text-right">
                                         <p className="font-bold text-[#13ec5b] text-base">{t.price}</p>
                                         <p className="text-[9px] text-white/40 capitalize">{t.paymentMethod.replace('_', ' ')}</p>
                                      </div>
                                   </div>
                                </div>
                            ))
                        )}
                      </div>
                  </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === 'settings' && (
                  <div className="max-w-2xl mx-auto animate-slide-up pb-10">
                      <h2 className="text-xl md:text-2xl font-serif italic mb-6">Configurações do Sistema</h2>
                      
                      <div className="space-y-6">
                          {/* Gemini Section */}
                          <section className="bg-[#1c271f] p-4 md:p-6 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3 mb-6">
                                  <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                      <span className="material-symbols-outlined">auto_awesome</span>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-white">Google Gemini AI</h3>
                                      <p className="text-xs text-white/50">Motor de geração</p>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-[10px] font-black uppercase text-white/40 block mb-2">API Key</label>
                                      <div className="flex gap-2">
                                          <input 
                                            type="password" 
                                            value={tempSettings.geminiApiKey} 
                                            onChange={e => setTempSettings({...tempSettings, geminiApiKey: e.target.value})}
                                            placeholder="AIzaSy..."
                                            className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-mono tracking-wide focus:border-[#13ec5b] outline-none transition-colors"
                                          />
                                      </div>
                                  </div>
                              </div>
                          </section>

                          {/* Stripe Section */}
                          <section className="bg-[#1c271f] p-4 md:p-6 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3 mb-6">
                                  <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                      <span className="material-symbols-outlined">credit_card</span>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-white">Stripe Payments</h3>
                                      <p className="text-xs text-white/50">Gateway de pagamento</p>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Publishable Key</label>
                                      <input 
                                        type="text" 
                                        value={tempSettings.stripePublicKey} 
                                        onChange={e => setTempSettings({...tempSettings, stripePublicKey: e.target.value})}
                                        placeholder="pk_test_..."
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-mono tracking-wide focus:border-[#13ec5b] outline-none transition-colors"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Secret Key</label>
                                      <input 
                                        type="password" 
                                        value={tempSettings.stripeSecretKey} 
                                        onChange={e => setTempSettings({...tempSettings, stripeSecretKey: e.target.value})}
                                        placeholder="sk_test_..."
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm font-mono tracking-wide focus:border-[#13ec5b] outline-none transition-colors"
                                      />
                                  </div>
                              </div>
                          </section>

                          <button 
                            onClick={handleSaveSettings}
                            className="w-full py-4 bg-[#13ec5b] text-[#102216] rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(19,236,91,0.3)] hover:shadow-[0_0_50px_rgba(19,236,91,0.5)] transition-all active:scale-95"
                          >
                              Salvar Configurações
                          </button>
                      </div>
                  </div>
              )}

          </main>
      </div>
      
      <style>{`
        .pt-safe-top { padding-top: max(1.5rem, env(safe-area-inset-top)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-[#13ec5b] text-[#102216] font-bold shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
    >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-sm">{label}</span>
    </button>
);

const MobileTab = ({ label, icon, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-4 px-6 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors flex flex-col items-center gap-1 min-w-[80px] ${active ? 'border-[#13ec5b] text-[#13ec5b]' : 'border-transparent text-white/40'}`}
    >
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {label}
    </button>
);

export default AdminDashboard;
