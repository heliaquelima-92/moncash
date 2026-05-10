import React from 'react';
import { LayoutDashboard, Receipt, PiggyBank, Settings, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Home() {
  // Link direto da sua logo
  const logoUrl = "https://i.imgur.com/igiIEnb.png"; 

  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-sans">
      {/* Sidebar - Barra Lateral */}
      <aside className="w-64 border-r border-[#D5FF40]/20 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Moncash Logo" className="w-10 h-10 object-contain" />
          <span className="text-[#D5FF40] font-bold text-xl tracking-tighter">MONCASH</span>
        </div>

        <nav className="flex flex-col gap-4">
          <a href="#" className="flex items-center gap-3 text-[#111111] bg-[#D5FF40] p-3 rounded-lg font-semibold transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#D5FF40] p-3 transition-all">
            <Receipt size={20} /> Transações
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#D5FF40] p-3 transition-all">
            <PiggyBank size={20} /> Planejamento
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#D5FF40] p-3 transition-all">
            <Settings size={20} /> Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content - Conteúdo Principal */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Olá, Heliaque!</h1>
            <p className="text-gray-400">Aqui está o resumo de Maio / 2026.</p>
          </div>
          <button className="bg-[#D5FF40] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-all">
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#D5FF40]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <img src={logoUrl} alt="Moncash" className="w-16 h-16" />
            </div>
            <p className="text-gray-400 mb-2">Saldo Total</p>
            <h2 className="text-4xl font-bold text-[#D5FF40]">R$ 0,00</h2>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <ArrowUpCircle size={18} /> <span>Entradas do mês</span>
            </div>
            <h2 className="text-3xl font-bold">R$ 0,00</h2>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ArrowDownCircle size={18} /> <span>Saídas previstas</span>
            </div>
            <h2 className="text-3xl font-bold">R$ 0,00</h2>
          </div>
        </div>

        {/* Lista de Transações Recentes */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold mb-6">Últimas Atividades</h3>
          <div className="text-center py-10 text-gray-500">
            <p>Nenhuma transação cadastrada ainda.</p>
          </div>
        </div>
      </main>
    </div>
  );
}