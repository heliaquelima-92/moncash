"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Receipt, Settings, PiggyBank, Plus, ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Ajustes() {
  const router = useRouter();
  const logoUrl = "https://i.imgur.com/igiIEnb.png";

  // Controlos de formulário
  const [tipoConta, setTipoConta] = useState<'fixa' | 'temporaria'>('fixa');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSalvarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilizador não autenticado');

      const valorFormatado = parseFloat(valor.replace(',', '.'));
      const vencimentoNum = parseInt(vencimento);

      if (tipoConta === 'fixa') {
        // Grava na tabela de Contas Fixas
        const { error } = await supabase.from('contas_fixas').insert({
          usuario_id: user.id,
          nome,
          valor: valorFormatado,
          vencimento: vencimentoNum,
          valor_fixo: true
        });
        if (error) throw error;
      } else {
        // Grava como Conta Temporária diretamente no mês atual
        const dataAtual = new Date();
        const { error } = await supabase.from('contas_mes').insert({
          usuario_id: user.id,
          tipo: 'temporaria',
          nome,
          valor: valorFormatado,
          vencimento: vencimentoNum,
          mes: dataAtual.getMonth() + 1, // Mês atual
          ano: dataAtual.getFullYear(),
          pago: false
        });
        if (error) throw error;
      }

      setMensagem('Conta adicionada com sucesso! 🎉');
      setNome('');
      setValor('');
      setVencimento('');
    } catch (error: any) {
      setMensagem('Erro ao salvar: ' + error.message);
    } finally {
      setSalvando(false);
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text font-sans pb-20 md:pb-0">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark">
        <img src={logoUrl} alt="Logo" className="w-32 mb-10" />
        <nav className="flex flex-col gap-2 flex-1">
          <button onClick={() => router.push('/')} className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all">🏠 Início</button>
          <button className="flex items-center gap-4 text-moncash-text-muted hover:text-white hover:bg-moncash-card p-3 rounded-xl transition-all">💸 Gastos</button>
          <button className="flex items-center gap-4 bg-moncash-lime text-moncash-darker p-3 rounded-xl font-bold">⚙️ Ajustes</button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 animate-slide-up">
        
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/')} className="md:hidden p-2 bg-moncash-card rounded-full text-moncash-text-muted hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            ⚙️ Ajustes e Cadastros
          </h1>
        </header>

        {/* Separador de Tipo de Conta */}
        <div className="bg-moncash-card p-6 rounded-3xl border border-moncash-border shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Adicionar Nova Conta</h2>
          
          <div className="flex bg-moncash-darker rounded-xl p-1 mb-6 border border-moncash-border-light">
            <button 
              onClick={() => setTipoConta('fixa')} 
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${tipoConta === 'fixa' ? 'bg-moncash-lime text-moncash-darker shadow-md' : 'text-moncash-text-muted hover:text-white'}`}
            >
              🔄 Conta Fixa
            </button>
            <button 
              onClick={() => setTipoConta('temporaria')} 
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${tipoConta === 'temporaria' ? 'bg-orange-400 text-moncash-darker shadow-md' : 'text-moncash-text-muted hover:text-white'}`}
            >
              ⚡ Temporária
            </button>
          </div>

          <form onSubmit={handleSalvarConta} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Nome da Conta</label>
              <input 
                type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder={tipoConta === 'fixa' ? "Ex: Energia, Internet..." : "Ex: Conserto do Carro..."} 
                className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-4 outline-none transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Valor (R$)</label>
                <input 
                  type="number" step="0.01" required value={valor} onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-4 outline-none transition-all font-bold" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Dia do Vencimento</label>
                <input 
                  type="number" min="1" max="31" required value={vencimento} onChange={(e) => setVencimento(e.target.value)}
                  placeholder="Ex: 10" 
                  className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-4 outline-none transition-all" 
                />
              </div>
            </div>

            {mensagem && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold ${mensagem.includes('Erro') ? 'bg-moncash-error/20 text-moncash-error' : 'bg-moncash-lime/20 text-moncash-lime'}`}>
                {mensagem}
              </div>
            )}

            <button disabled={salvando} type="submit" className="w-full bg-moncash-lime hover:brightness-110 text-moncash-darker font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(213,255,64,0.15)] flex justify-center items-center gap-2 mt-4">
              {salvando ? <div className="w-5 h-5 border-2 border-moncash-darker/30 border-t-moncash-darker rounded-full animate-spin" /> : <><Save size={20} /> Salvar Conta</>}
            </button>
          </form>
        </div>

      </main>

      {/* Navegação Mobile Inferior */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-3 z-40 pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-moncash-lime">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-moncash-text-muted">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium">Gastos</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-moncash-lime">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}