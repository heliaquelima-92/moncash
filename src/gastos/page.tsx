"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDados } from '@/hooks/useDados';
import { supabase } from '@/lib/supabase';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { contasTemporarias, contasFixas, parceladas, totalGastosAvulsos, loading } = useDados();
  const logoUrl = "https://i.imgur.com/igiIEnb.png";

  // Verificação de Segurança (Cadeado)
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

  // Tela de Carregamento enquanto busca os dados
  if (loading) {
    return (
      <div className="min-h-screen bg-moncash-darker flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-moncash-lime/30 border-t-moncash-lime rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text font-sans pb-20 md:pb-0">
      
      {/* Sidebar - Computador */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark z-10 relative">
        <div className="flex justify-start items-center mb-10">
          <img src={logoUrl} alt="Logo Moncash" className="w-32 h-auto object-contain" />
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {/* Início (Página Atual) */}
          <button className="flex items-center gap-4 text-moncash-darker bg-moncash-lime p-3 rounded-xl font-bold shadow-[0_0_15px_rgba(213,255,64,0.15)] transition-all">
            <span className="text-xl">🏠</span> Início
          </button>
          
          {/* Gastos (Navegação ativada!) */}
          <button onClick={() => router.push('/gastos')} className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium">
            <span className="text-xl">💸</span> Gastos
          </button>
          
          {/* Relatórios (Em breve) */}
          <button className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium opacity-50">
            <span className="text-xl">📊</span> Relatórios
          </button>
          
          {/* Configurações / Ajustes (Navegação ativada!) */}
          <button onClick={() => router.push('/ajustes')} className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium">
            <span className="text-xl">⚙️</span> Configurações
          </button>
        </nav>

        {/* Botão de Sair */}
        <button onClick={handleLogout} className="flex items-center gap-4 text-moncash-error hover:bg-moncash-error/10 p-3 rounded-xl transition-all font-medium mt-auto">
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl mx-auto w-full">
        
        {/* Header Mobile */}
        <div className="md:hidden flex justify-between items-center p-6 border-b border-moncash-border/50 bg-moncash-darker/80 backdrop-blur-md sticky top-0 z-30">
           <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
           <button onClick={handleLogout} className="text-moncash-error p-2 bg-moncash-error/10 rounded-full">
             <LogOut size={16} />
           </button>
        </div>

        <div className="p-4 md:p-8 space-y-6">
          
          {/* Seletor de Mês */}
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <button className="p-2 text-moncash-text-muted hover:text-white bg-moncash-card rounded-lg"><ChevronLeft size={20} /></button>
              <h2 className="text-2xl font-bold text-white">Maio 2026</h2>
              <button className="p-2 text-moncash-text-muted hover:text-white bg-moncash-card rounded-lg"><ChevronRight size={20} /></button>
            </div>
          </div>

          {/* Resumo de Gastos e Saldo */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-moncash-card p-5 rounded-2xl border border-moncash-border">
              <p className="text-[10px] uppercase tracking-wider text-moncash-text-muted mb-1">Gastos Avulsos</p>
              <p className="text-2xl font-bold text-moncash-warning tabular-nums">
                R$ {totalGastosAvulsos ? totalGastosAvulsos.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-moncash-card p-5 rounded-2xl border border-moncash-border">
              <p className="text-[10px] uppercase tracking-wider text-moncash-text-muted mb-1">Saldo Atual</p>
              <p className="text-2xl font-bold text-moncash-lime tabular-nums">R$ 5.500,00</p>
            </motion.div>
          </div>

          {/* Listas de Contas */}
          <div className="space-y-6 mt-8">
            
            {/* Contas Temporárias */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-moncash-text-muted uppercase tracking-wider flex items-center gap-2">
                  <span className="text-orange-400">⚡</span> CONTAS TEMPORÁRIAS
                </h2>
                <span className="text-xs text-moncash-text-muted">{contasTemporarias?.length || 0} itens</span>
              </div>
              <div className="space-y-2">
                {contasTemporarias?.length > 0 ? contasTemporarias.map((conta: any) => (
                  <div key={conta.id} className="bg-moncash-card p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{conta.nome}</p>
                      <p className="text-xs text-moncash-text-muted mt-0.5">Vence dia {conta.vencimento}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-white tabular-nums">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker text-white transition-all">+</button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-4 text-xs text-moncash-text-muted italic bg-moncash-card/30 rounded-2xl border border-dashed border-moncash-border">Nenhuma conta temporária.</p>
                )}
              </div>
            </div>

            {/* Contas Fixas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-moncash-text-muted uppercase tracking-wider flex items-center gap-2">
                  <span className="text-blue-400">🔄</span> CONTAS FIXAS
                </h2>
                <span className="text-xs text-moncash-text-muted">{contasFixas?.length || 0} itens</span>
              </div>
              <div className="space-y-2">
                {contasFixas?.length > 0 ? contasFixas.map((conta: any) => (
                  <div key={conta.id} className="bg-moncash-card p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-moncash-lime/30 text-moncash-lime">FIXA</span>
                      <p className="font-medium text-white mt-1">{conta.nome}</p>
                      <p className="text-xs text-moncash-text-muted mt-0.5">Vence dia {conta.vencimento}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-white tabular-nums">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker text-white transition-all">+</button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-4 text-xs text-moncash-text-muted italic bg-moncash-card/30 rounded-2xl border border-dashed border-moncash-border">Nenhuma conta fixa cadastrada.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Navegação Mobile Inferior */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-3 z-40 pb-safe">
        <button className="flex flex-col items-center gap-1 text-moncash-lime">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button onClick={() => router.push('/gastos')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium">Gastos</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-moncash-text-muted opacity-50">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">Relatórios</span>
        </button>
        <button onClick={() => router.push('/ajustes')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white transition-colors">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}