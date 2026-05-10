import React from 'react';
import { LayoutDashboard, Receipt, PiggyBank, Settings, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Home() {
  // Link direto da sua logo
  const logoUrl = "https://i.imgur.com/igiIEnb.png"; 

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111111] text-white font-sans pb-20 md:pb-0">
      
      {/* Sidebar - Computador */}
      <aside className="hidden md:flex w-64 border-r border-[#D5FF40]/10 p-6 flex-col gap-8 bg-[#111111]">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
          {/* Nome removido conforme você pediu, apenas a logo premium agora! */}
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <a href="#" className="flex items-center gap-4 text-[#111111] bg-[#D5FF40] p-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(213,255,64,0.15)]">
            <LayoutDashboard size={22} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-[#D5FF40] hover:bg-white/5 p-4 rounded-xl transition-all font-medium">
            <Receipt size={22} /> Transações
          </a>
          <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-[#D5FF40] hover:bg-white/5 p-4 rounded-xl transition-all font-medium">
            <PiggyBank size={22} /> Planejamento
          </a>
          <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-[#D5FF40] hover:bg-white/5 p-4 rounded-xl transition-all font-medium">
            <Settings size={22} /> Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content - Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        {/* Header Celular (Mostra a logo e o botão de + no mobile) */}
        <div className="md:hidden flex justify-between items-center mb-8">
           <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
           <button className="bg-[#D5FF40] text-black p-3 rounded-full shadow-[0_0_15px_rgba(213,255,64,0.2)]">
             <Plus size={24} strokeWidth={3} />
           </button>
        </div>

        {/* Header Principal */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Olá, Heliaque!</h1>
            <p className="text-gray-400 mt-1">Aqui está o resumo de <span className="text-white font-medium">Maio / 2026</span></p>
          </div>
          <button className="hidden md:flex bg-[#D5FF40] text-black px-7 py-3.5 rounded-full font-bold items-center gap-2 hover:brightness-110 hover:scale-105 transition-all shadow-[0_0_20px_rgba(213,255,64,0.2)]">
            <Plus size={20} strokeWidth={3} /> Nova Transação
          </button>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-6 md:p-8 rounded-3xl border border-[#D5FF40]/30 relative overflow-hidden shadow-lg">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none">
               <img src={logoUrl} alt="Background" className="w-32 h-32" />
            </div>
            <p className="text-gray-400 mb-2 font-medium">Saldo Disponível</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#D5FF40]">R$ 0,00</h2>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-3xl border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-green-400 mb-3 font-medium">
              <ArrowUpCircle size={20} /> <span>Entradas do mês</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">R$ 0,00</h2>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-3xl border border-white/5 shadow-md">
            <div className="flex items-center gap-2 text-red-400 mb-3 font-medium">
              <ArrowDownCircle size={20} /> <span>Saídas previstas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">R$ 0,00</h2>
          </div>
        </div>

        {/* Lista de Transações Recentes */}
        <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-white/5 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Últimas Atividades</h3>
            <a href="#" className="text-[#D5FF40] text-sm font-semibold hover:underline">Ver todas</a>
          </div>
          <div className="text-center py-16 text-gray-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
            <p>Nenhuma transação cadastrada ainda.</p>
          </div>
        </div>
      </main>

      {/* Menu Mobile - Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#111111]/90 backdrop-blur-md border-t border-white/5 flex justify-around p-4 z-50 pb-safe">
        <a href="#" className="flex flex-col items-center gap-1 text-[#D5FF40]">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <Receipt size={24} />
          <span className="text-[10px] font-medium">Transações</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <PiggyBank size={24} />
          <span className="text-[10px] font-medium">Metas</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <Settings size={24} />
          <span className="text-[10px] font-medium">Ajustes</span>
        </a>
      </nav>
      
    </div>
  );
}