"use client";

import React, { useEffect } from 'react';
import { useDados } from '@/hooks/useDados';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { contasTemporarias, contasFixas, parceladas, totalGastosAvulsos, loading } = useDados();
  const router = useRouter();
  const logoUrl = "https://i.imgur.com/igiIEnb.png";

  // Verificação de Segurança
  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    verificarSessao();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-moncash-darker flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-moncash-lime/20 border-t-moncash-lime rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark">
        <img src={logoUrl} alt="Logo" className="w-32 mb-10" />
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-4 bg-moncash-lime text-moncash-darker p-3 rounded-xl font-bold">
            🏠 Início
          </button>
          {/* Botão Gastos (Ainda vamos criar a página) */}
          <button onClick={() => router.push('/gastos')} className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl hover:text-white hover:bg-moncash-card transition-all">
            💸 Gastos
          </button>
          {/* Botão Ajustes (Clicável!) */}
          <button onClick={() => router.push('/ajustes')} className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl hover:text-white hover:bg-moncash-card transition-all">
            ⚙️ Ajustes
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 text-moncash-error p-3 rounded-xl hover:bg-moncash-error/10 transition-all mt-auto font-medium">
          <LogOut size={20} /> Sair
        </button>
      </aside>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 space-y-6 animate-fade-in">
        
        {/* Header Mobile com botão de Sair */}
        <div className="md:hidden flex justify-between items-center mb-2">
           <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
           <button onClick={handleLogout} className="text-moncash-error p-2">
             <LogOut size={20} />
           </button>
        </div>

        {/* Seletor de Mês */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-4">
            <button className="p-2 bg-moncash-card rounded-lg text-moncash-text-muted hover:text-white"><ChevronLeft size={20}/></button>
            <h2 className="text-2xl font-bold">Maio 2026</h2>
            <button className="p-2 bg-moncash-card rounded-lg text-moncash-text-muted hover:text-white"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* Resumo de Gastos Avulsos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-moncash-card p-5 rounded-2xl border border-moncash-border">
            <p className="text-[10px] uppercase tracking-wider text-moncash-text-muted mb-1">Gastos Avulsos</p>
            <p className="text-2xl font-bold text-moncash-warning">
              R$ {totalGastosAvulsos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-moncash-card p-5 rounded-2xl border border-moncash-border">
            <p className="text-[10px] uppercase tracking-wider text-moncash-text-muted mb-1">Saldo Atual</p>
            <p className="text-2xl font-bold text-moncash-lime">R$ 5.500,00</p>
          </div>
        </div>

        {/* LISTAS DE CONTAS */}
        <div className="space-y-8">
          
          {/* CONTAS TEMPORÁRIAS */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-moncash-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="text-orange-400">⚡</span> Contas Temporárias
              </h3>
              <span className="text-[10px] bg-moncash-card px-2 py-1 rounded text-moncash-text-muted">{contasTemporarias.length} itens</span>
            </div>
            <div className="space-y-2">
              {contasTemporarias.length > 0 ? contasTemporarias.map((conta: any) => (
                <div key={conta.id} className="bg-moncash-card p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <div>
                    <p className="font-semibold text-white">{conta.nome}</p>
                    <p className="text-[10px] text-moncash-text-muted uppercase">Vencimento: dia {conta.vencimento}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white tabular-nums">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker transition-all">+</button>
                  </div>
                </div>
              )) : (
                <p className="text-center py-4 text-xs text-moncash-text-muted italic bg-moncash-card/30 rounded-2xl border border-dashed border-moncash-border">Nenhuma conta temporária este mês.</p>
              )}
            </div>
          </section>

          {/* CONTAS FIXAS */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-moncash-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="text-blue-400">🔄</span> Contas Fixas
              </h3>
              <span className="text-[10px] bg-moncash-card px-2 py-1 rounded text-moncash-text-muted">{contasFixas.length} itens</span>
            </div>
            <div className="space-y-2">
              {contasFixas.length > 0 ? contasFixas.map((conta: any) => (
                <div key={conta.id} className="bg-moncash-card p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <div>
                    <p className="font-semibold text-white">{conta.nome}</p>
                    <p className="text-[10px] text-moncash-text-muted uppercase">Vencimento: dia {conta.vencimento}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white tabular-nums">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker transition-all">+</button>
                  </div>
                </div>
              )) : (
                 <p className="text-center py-4 text-xs text-moncash-text-muted italic bg-moncash-card/30 rounded-2xl border border-dashed border-moncash-border">Nenhuma conta fixa cadastrada.</p>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Navegação Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-3 z-40 pb-safe">
        <button className="flex flex-col items-center gap-1 text-moncash-lime">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button onClick={() => router.push('/gastos')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium">Gastos</span>
        </button>
        <button onClick={() => router.push('/ajustes')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-moncash-lime transition-colors">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}