"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Receipt, PiggyBank, Settings, Plus, ArrowUpCircle, ArrowDownCircle, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  const logoUrl = "https://i.imgur.com/igiIEnb.png"; 

  // Verificação de Segurança (O Cadeado)
  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não tiver sessão, manda para o login
        router.push('/login');
      } else {
        // Se tiver, guarda os dados do utilizador e destranca a tela
        setUsuario(session.user);
        setCarregando(false);
      }
    };

    verificarSessao();

    // Fica a ouvir caso o utilizador faça logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Ecrã de Carregamento enquanto verifica a chave
  if (carregando) {
    return (
      <div className="min-h-screen bg-moncash-darker flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <img src={logoUrl} alt="Moncash" className="h-16 mx-auto mb-6 animate-pulse-lime drop-shadow-[0_0_15px_rgba(213,255,64,0.2)]" />
          <div className="w-10 h-10 border-4 border-moncash-lime/20 border-t-moncash-lime rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Se passou no teste de segurança, mostra a Dashboard!
  const nomeUtilizador = usuario?.user_metadata?.nome || 'Utilizador';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text font-sans pb-20 md:pb-0 selection:bg-moncash-lime selection:text-moncash-darker">
      
      {/* Sidebar - Computador */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col gap-8 bg-moncash-dark z-10 relative">
        <div className="flex justify-center items-center py-4 animate-fade-in">
          <img src={logoUrl} alt="Logo Moncash" className="w-40 h-auto object-contain drop-shadow-[0_0_15px_rgba(213,255,64,0.2)]" />
        </div>

        <nav className="flex flex-col gap-2 mt-2 flex-1">
          <a href="#" className="flex items-center gap-4 text-moncash-darker bg-moncash-lime p-4 rounded-xl font-bold transition-all animate-glow">
            <LayoutDashboard size={22} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-secondary hover:text-moncash-lime hover:bg-moncash-card p-4 rounded-xl transition-all font-medium">
            <Receipt size={22} /> Transações
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-secondary hover:text-moncash-lime hover:bg-moncash-card p-4 rounded-xl transition-all font-medium">
            <PiggyBank size={22} /> Planejamento
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-secondary hover:text-moncash-lime hover:bg-moncash-card p-4 rounded-xl transition-all font-medium">
            <Settings size={22} /> Configurações
          </a>
        </nav>

        {/* Botão de Sair */}
        <button onClick={handleLogout} className="flex items-center gap-4 text-moncash-error hover:bg-moncash-error/10 p-4 rounded-xl transition-all font-medium mt-auto">
          <LogOut size={22} /> Sair
        </button>
      </aside>

      {/* Main Content - Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full animate-slide-up">
        
        {/* Header Celular */}
        <div className="md:hidden flex justify-between items-center mb-8">
           <img src={logoUrl} alt="Logo Moncash" className="w-28 h-auto object-contain" />
           <button onClick={handleLogout} className="text-moncash-error p-2">
             <LogOut size={24} />
           </button>
        </div>

        {/* Header Principal */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Olá, <span className="text-moncash-lime">{nomeUtilizador.split(' ')[0]}</span>!
            </h1>
            <p className="text-moncash-text-muted mt-1">Aqui está o resumo de <span className="text-white font-medium">Maio / 2026</span></p>
          </div>
          <button className="hidden md:flex bg-moncash-lime text-moncash-darker px-7 py-3.5 rounded-full font-bold items-center gap-2 hover:brightness-110 hover:scale-105 transition-all animate-glow">
            <Plus size={20} strokeWidth={3} /> Nova Transação
          </button>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="bg-gradient-to-br from-moncash-card to-moncash-dark p-6 md:p-8 rounded-3xl border border-moncash-lime/30 shadow-lg group hover:border-moncash-lime/50 transition-colors">
            <p className="text-moncash-text-secondary mb-2 font-medium">Saldo Disponível</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-moncash-lime drop-shadow-[0_0_10px_rgba(213,255,64,0.3)]">R$ 0,00</h2>
          </div>
          
          <div className="bg-moncash-card hover:bg-moncash-card-hover p-6 md:p-8 rounded-3xl border border-moncash-border shadow-md transition-colors">
            <div className="flex items-center gap-2 text-moncash-success mb-3 font-medium">
              <ArrowUpCircle size={20} /> <span>Entradas do mês</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">R$ 0,00</h2>
          </div>
          
          <div className="bg-moncash-card hover:bg-moncash-card-hover p-6 md:p-8 rounded-3xl border border-moncash-border shadow-md transition-colors">
            <div className="flex items-center gap-2 text-moncash-error mb-3 font-medium">
              <ArrowDownCircle size={20} /> <span>Saídas previstas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">R$ 0,00</h2>
          </div>
        </div>

        {/* Lista de Transações Recentes */}
        <div className="bg-moncash-card rounded-3xl p-6 md:p-8 border border-moncash-border shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Últimas Atividades</h3>
            <a href="#" className="text-moncash-lime text-sm font-semibold hover:underline">Ver todas</a>
          </div>
          <div className="text-center py-16 text-moncash-text-muted bg-moncash-darker rounded-2xl border border-dashed border-moncash-border-light">
            <p>Nenhuma transação cadastrada ainda.</p>
          </div>
        </div>
      </main>

      {/* Menu Mobile - Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/90 backdrop-blur-md border-t border-moncash-border flex justify-around p-4 z-50 pb-safe">
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-lime">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <Receipt size={24} />
          <span className="text-[10px] font-medium">Transações</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <Plus size={36} className="bg-moncash-lime text-moncash-darker rounded-full p-2 -mt-6 shadow-lime" />
          <span className="text-[10px] font-medium text-moncash-lime">Nova</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <PiggyBank size={24} />
          <span className="text-[10px] font-medium">Metas</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <Settings size={24} />
          <span className="text-[10px] font-medium">Ajustes</span>
        </a>
      </nav>
      
    </div>
  );
}