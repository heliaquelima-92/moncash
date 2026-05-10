"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function Home() {
  const logoUrl = "https://i.imgur.com/igiIEnb.png"; 

  // Controle de Modais (Visual)
  const [modalGastoAberto, setModalGastoAberto] = useState(false);
  const [modalLancamentoAberto, setModalLancamentoAberto] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text font-sans pb-20 md:pb-0 selection:bg-moncash-lime selection:text-moncash-darker">
      
      {/* Sidebar Lateral (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark z-10 relative">
        <div className="flex justify-start items-center mb-10">
          <img src={logoUrl} alt="Logo Moncash" className="w-32 h-auto object-contain" />
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <a href="#" className="flex items-center gap-4 text-moncash-darker bg-moncash-lime p-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(213,255,64,0.15)]">
            <span className="text-xl">🏠</span> Início
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium">
            <span className="text-xl">💸</span> Gastos
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium">
            <span className="text-xl">📊</span> Relatórios
          </a>
          <a href="#" className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all font-medium">
            <span className="text-xl">⚙️</span> Configurações
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl mx-auto w-full">
        
        {/* Header Mobile */}
        <div className="md:hidden flex justify-between items-center p-6 border-b border-moncash-border/50 bg-moncash-darker/80 backdrop-blur-md sticky top-0 z-30">
           <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
           <div className="flex items-center gap-3 text-right">
             <div>
               <p className="text-[10px] text-moncash-text-muted">Bom dia</p>
               <p className="text-sm font-bold">Heliaque Lima</p>
             </div>
             <div className="w-10 h-10 bg-moncash-lime rounded-full flex items-center justify-center text-moncash-darker font-bold text-lg">
               H
             </div>
           </div>
        </div>

        <div className="p-4 md:p-8 space-y-6">
          
          {/* Seletor de Mês */}
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <button className="p-2 text-moncash-text-muted hover:text-white bg-moncash-card rounded-lg"><ChevronLeft size={20} /></button>
              <h2 className="text-2xl font-bold text-white">Maio 2026</h2>
              <button className="p-2 text-moncash-text-muted hover:text-white bg-moncash-card rounded-lg"><ChevronRight size={20} /></button>
            </div>
            <p className="text-xs text-moncash-text-muted">Dia de referência: 10</p>
          </div>

          {/* Saldo Disponível */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-moncash-card p-6 rounded-2xl border border-moncash-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-moncash-text-muted mb-1">Saldo Disponível</p>
                <p className="text-3xl font-bold text-moncash-lime tabular-nums">R$ 5.500,00</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-moncash-text-muted mb-1">Inicial</p>
                <p className="text-lg font-semibold text-white tabular-nums">R$ 5.500,00</p>
              </div>
            </div>
            <div className="h-1.5 bg-moncash-border rounded-full overflow-hidden mt-4">
              <div className="h-full rounded-full bg-moncash-lime w-[20%]" />
            </div>
            <p className="text-xs text-moncash-text-muted mt-2 text-center">20% das contas pagas</p>
          </motion.div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setModalGastoAberto(true)} className="bg-moncash-card p-4 rounded-2xl flex items-center gap-3 hover:border-moncash-lime/50 transition-all border border-transparent">
              <div className="w-12 h-12 rounded-xl bg-moncash-warning/10 flex items-center justify-center"><span className="text-2xl">💸</span></div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">Informar Gasto</p>
                <p className="text-[10px] text-moncash-text-muted mt-0.5">Registrar despesa</p>
              </div>
            </button>
            <button onClick={() => setModalLancamentoAberto(true)} className="bg-moncash-card p-4 rounded-2xl flex items-center gap-3 hover:border-moncash-lime/50 transition-all border border-transparent">
              <div className="w-12 h-12 rounded-xl bg-moncash-lime/10 flex items-center justify-center"><span className="text-2xl">💰</span></div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">Lançamento</p>
                <p className="text-[10px] text-moncash-text-muted mt-0.5">Renda extra</p>
              </div>
            </button>
          </div>

          {/* Listas de Contas */}
          <div className="space-y-6 mt-8">
            
            {/* Contas Fixas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-moncash-text-muted uppercase tracking-wider flex items-center gap-2">
                  <span className="text-blue-400">🔄</span> CONTAS FIXAS
                </h2>
                <span className="text-xs text-moncash-text-muted">1 itens</span>
              </div>
              <div className="bg-moncash-card p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-moncash-lime/30 text-moncash-lime">FIXA</span>
                    <p className="font-medium text-white mt-1">Energia</p>
                    <p className="text-xs text-moncash-text-muted mt-0.5">Vence dia 10</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-moncash-lime border border-moncash-lime/30 px-3 py-1.5 rounded-lg">Definir valor</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker text-white transition-all">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Parceladas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-moncash-text-muted uppercase tracking-wider flex items-center gap-2">
                  <span className="text-orange-400">📦</span> PARCELADAS
                </h2>
                <span className="text-xs text-moncash-text-muted">1 itens</span>
              </div>
              <div className="bg-moncash-card p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-purple-400/30 text-purple-400">PARCELA</span>
                    <p className="font-medium text-white mt-1">IEO (1/3)</p>
                    <p className="text-xs text-moncash-text-muted mt-0.5">Vence dia 10</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white tabular-nums">R$ 133,00</p>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-moncash-dark hover:bg-moncash-lime hover:text-moncash-darker text-white transition-all">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cofrinho */}
            <div>
              <h2 className="text-xs font-bold text-moncash-text-muted uppercase tracking-wider flex items-center gap-2 mb-3">
                <span>🐷</span> COFRINHO
              </h2>
              <div className="bg-moncash-card p-4 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">🐷</div>
                  <p className="text-xl font-bold text-white tabular-nums">R$ 2.000,00</p>
                </div>
                <button className="bg-moncash-lime text-moncash-darker font-bold text-sm px-4 py-2 rounded-xl">Adicionar</button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Navegação Mobile Inferior */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-3 z-40 pb-safe">
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-lime">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium">Gastos</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">Relatórios</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-moncash-text-muted">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </a>
      </nav>
    </div>
  );
}