"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Trash2, X, Plus } from 'lucide-react';

const CATEGORIAS_GASTO = [
  { id: 'alimentacao', nome: 'Alimentação', icone: '🍔', cor: '#fbbf24' },
  { id: 'transporte', nome: 'Transporte', icone: '🚗', cor: '#60a5fa' },
  { id: 'moradia', nome: 'Moradia', icone: '🏠', cor: '#a78bfa' },
  { id: 'saude', nome: 'Saúde', icone: '💊', cor: '#f87171' },
  { id: 'educacao', nome: 'Educação', icone: '📚', cor: '#34d399' },
  { id: 'lazer', nome: 'Lazer', icone: '🎬', cor: '#f472b6' },
  { id: 'compras', nome: 'Compras', icone: '🛍️', cor: '#fb923c' },
  { id: 'outros', nome: 'Outros', icone: '🏷️', cor: '#9ca3af' }
];

export default function Gastos() {
  const router = useRouter();
  const logoUrl = "https://i.imgur.com/igiIEnb.png";

  const [gastos, setGastos] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  // Campos do Formulário
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('outros');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarGastos();
  }, []);

  const carregarGastos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const dataAtual = new Date();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    const { data } = await supabase
      .from('gastos')
      .select('*')
      .eq('usuario_id', user.id)
      .gte('data', `${ano}-${mes}-01`)
      .lte('data', `${ano}-${mes}-31`)
      .order('data', { ascending: false });

    setGastos(data || []);
  };

  const handleSalvarGasto = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0 || !descricao.trim()) return;

    setSalvando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dataAtual = new Date().toISOString().split('T')[0];

      await supabase.from('gastos').insert({
        usuario_id: user?.id,
        descricao,
        valor: valorNum,
        categoria,
        data: dataAtual
      });

      setModalAberto(false);
      setValor('');
      setDescricao('');
      setCategoria('outros');
      carregarGastos();
    } catch (error) {
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Deletar este gasto?')) return;
    await supabase.from('gastos').delete().eq('id', id);
    carregarGastos();
  };

  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
  const gastosFiltrados = filtroCategoria === 'todos' ? gastos : gastos.filter(g => g.categoria === filtroCategoria);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-moncash-darker text-moncash-text">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-moncash-border p-6 flex-col bg-moncash-dark">
        <img src={logoUrl} alt="Logo" className="w-32 mb-10" />
        <nav className="flex flex-col gap-2 flex-1">
          <button onClick={() => router.push('/')} className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl hover:text-white hover:bg-moncash-card transition-all">🏠 Início</button>
          <button className="flex items-center gap-4 bg-moncash-lime text-moncash-darker p-3 rounded-xl font-bold">💸 Gastos</button>
          <button onClick={() => router.push('/ajustes')} className="flex items-center gap-4 text-moncash-text-muted p-3 rounded-xl hover:text-white hover:bg-moncash-card transition-all">⚙️ Ajustes</button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 animate-slide-up">
        
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/')} className="md:hidden p-2 bg-moncash-card rounded-full text-moncash-text-muted hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">💸 Gastos Avulsos</h1>
        </header>

        {/* Resumo */}
        <div className="bg-moncash-card p-6 rounded-3xl border border-moncash-border shadow-lg text-center mb-6">
          <p className="text-sm text-moncash-text-muted mb-1">Total de Gastos (Mês)</p>
          <p className="text-4xl font-bold text-moncash-warning tabular-nums">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Botão Adicionar */}
        <button onClick={() => setModalAberto(true)} className="w-full bg-moncash-lime hover:brightness-110 text-moncash-darker font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(213,255,64,0.15)] flex justify-center items-center gap-2 mb-8">
          <Plus size={20} /> Informar Gasto
        </button>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button onClick={() => setFiltroCategoria('todos')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filtroCategoria === 'todos' ? 'bg-moncash-lime text-moncash-darker' : 'bg-moncash-card text-moncash-text-muted hover:text-white'}`}>
            Todos
          </button>
          {CATEGORIAS_GASTO.map((cat) => (
            <button key={cat.id} onClick={() => setFiltroCategoria(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${filtroCategoria === cat.id ? 'bg-moncash-lime text-moncash-darker' : 'bg-moncash-card text-moncash-text-muted hover:text-white'}`}>
              <span>{cat.icone}</span> {cat.nome}
            </button>
          ))}
        </div>

        {/* Lista de Gastos */}
        <div className="space-y-3 pb-20">
          {gastosFiltrados.length === 0 ? (
            <div className="text-center py-10 bg-moncash-card rounded-3xl border border-dashed border-moncash-border-light">
              <span className="text-4xl mb-3 block">💸</span>
              <p className="text-moncash-text-muted">Nenhum gasto registrado</p>
            </div>
          ) : (
            gastosFiltrados.map((gasto) => {
              const categoriaInfo = CATEGORIAS_GASTO.find(c => c.id === gasto.categoria) || CATEGORIAS_GASTO[7];
              return (
                <div key={gasto.id} className="bg-moncash-card p-4 rounded-2xl flex items-center gap-4 border border-moncash-border hover:border-moncash-border-light transition-colors">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-moncash-darker border border-moncash-border-light">
                    {categoriaInfo.icone}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{gasto.descricao}</p>
                    <p className="text-[10px] text-moncash-text-muted uppercase">{categoriaInfo.nome}</p>
                  </div>
                  <p className="font-bold text-moncash-warning tabular-nums">R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <button onClick={() => handleDeletar(gasto.id)} className="w-8 h-8 rounded-full bg-moncash-error/10 text-moncash-error flex items-center justify-center hover:bg-moncash-error hover:text-white transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* Navegação Mobile Inferior */}
      <nav className="md:hidden fixed bottom-0 w-full bg-moncash-darker/95 backdrop-blur-md border-t border-moncash-border flex justify-around p-3 z-40 pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-moncash-text-muted">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-moncash-lime">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium">Gastos</span>
        </button>
        <button onClick={() => router.push('/ajustes')} className="flex flex-col items-center gap-1 text-moncash-text-muted hover:text-white">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>

      {/* MODAL DE NOVO GASTO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-moncash-card w-full max-w-md rounded-3xl border border-moncash-border shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Informar Gasto</h2>
              <button onClick={() => setModalAberto(false)} className="text-moncash-text-muted hover:text-white bg-moncash-darker rounded-full p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Valor (R$)</label>
                <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0.00" className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-4 font-bold text-xl outline-none" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Descrição</label>
                <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Supermercado, Gasolina..." className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-4 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-moncash-text-muted uppercase tracking-wider mb-2">Categoria</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIAS_GASTO.map((cat) => (
                    <button key={cat.id} onClick={() => setCategoria(cat.id)} className={`p-2 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-1 ${categoria === cat.id ? 'border-moncash-lime bg-moncash-lime/10' : 'border-moncash-border bg-moncash-darker hover:border-moncash-text-muted'}`}>
                      <span className="text-xl">{cat.icone}</span>
                      <span className="text-[9px] text-moncash-text-muted truncate w-full">{cat.nome}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSalvarGasto} disabled={salvando} className="w-full bg-moncash-lime text-moncash-darker font-bold py-4 rounded-xl mt-4 hover:brightness-110 transition-all">
                {salvando ? 'Salvando...' : 'Salvar Gasto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}