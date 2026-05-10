"use client";

import React from 'react';
import { useDados } from '@/hooks/useDados';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { contasTemporarias, contasFixas, parceladas, totalGastosAvulsos, loading } = useDados();
  const logoUrl = "https://i.imgur.com/igiIEnb.png";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark">
        <img src={logoUrl} alt="Logo" className="w-32 mb-10" />
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-4 bg-moncash-lime text-moncash-darker p-3 rounded-xl font-bold">🏠 Início</button>
          <button className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl">💸 Gastos</button>
          <button className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl">⚙️ Ajustes</button>
        </nav>
      </aside>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 space-y-6">
        
        {/* Seletor de Mês */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-4">
            <button className="p-2 bg-moncash-card rounded-lg text-moncash-text-muted"><ChevronLeft /></button>
            <h2 className="text-2xl font-bold">Maio 2026</h2>
            <button className="p-2 bg-moncash-card rounded-lg text-moncash-text-muted"><ChevronRight /></button>
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
          
          {/* 1. CONTAS TEMPORÁRIAS (A nova categoria que você pediu) */}
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
                    <p className="text-[10px] text-moncash-text-muted uppercase">Vencimento: {conta.vencimento}</p>
                  </div>
                  <p className="font-bold text-white">R$ {conta.valor.toFixed(2)}</p>
                </div>
              )) : (
                <p className="text-center py-4 text-xs text-moncash-text-muted italic bg-moncash-card/30 rounded-2xl border border-dashed border-moncash-border">Nenhuma conta temporária este mês.</p>
              )}
            </div>
          </section>

          {/* 2. CONTAS FIXAS */}
          <section>
            <h3 className="text-xs font-bold text-moncash-text-muted uppercase tracking-widest flex items-center gap-2 mb-3">
              <span className="text-blue-400">🔄</span> Contas Fixas
            </h3>
            <div className="space-y-2">
              {contasFixas.map((conta: any) => (
                <div key={conta.id} className="bg-moncash-card p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <p className="font-semibold text-white">{conta.nome}</p>
                  <button className="w-8 h-8 rounded-full bg-moncash-dark text-white">+</button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Navegação Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-4">
        <button className="flex flex-col items-center gap-1 text-moncash-lime">🏠<span className="text-[10px]">Início</span></button>
        <button className="flex flex-col items-center gap-1 text-moncash-text-muted">💸<span className="text-[10px]">Gastos</span></button>
        <button className="flex flex-col items-center gap-1 text-moncash-text-muted">⚙️<span className="text-[10px]">Ajustes</span></button>
      </nav>
    </div>
  );
}