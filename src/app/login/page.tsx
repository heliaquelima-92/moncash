"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!email.includes('@')) {
      setErro('Email inválido');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (modo === 'registro' && !nome.trim()) {
      setErro('Digite seu nome');
      return;
    }

    setCarregando(true);

    try {
      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        window.location.href = '/'; // Redireciona para a Dashboard
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { data: { nome } }
        });
        if (error) throw error;
        setSucesso('Conta criada! Agora você já pode entrar.');
        setModo('login');
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login')) setErro('Email ou senha incorretos');
      else if (error.message.includes('already registered')) setErro('Este email já está cadastrado');
      else setErro('Erro ao processar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-moncash-darker flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-moncash-lime/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-moncash-lime/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mb-10 text-center">
        <img src="https://i.imgur.com/igiIEnb.png" alt="Moncash" className="h-20 mx-auto drop-shadow-lg" />
        <p className="text-moncash-text-muted text-sm mt-3">Seu controle financeiro inteligente</p>
      </motion.div>

      {/* Card de Login */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-10 w-full max-w-sm">
        <div className="bg-moncash-card border border-moncash-border p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {modo === 'registro' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-medium text-moncash-text-secondary mb-1">Nome</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-3 outline-none transition-colors" disabled={carregando} />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-moncash-text-secondary mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-3 outline-none transition-colors" disabled={carregando} />
            </div>

            <div>
              <label className="block text-sm font-medium text-moncash-text-secondary mb-1">Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" className="w-full bg-moncash-dark border border-moncash-border focus:border-moncash-lime text-white rounded-xl p-3 outline-none transition-colors" disabled={carregando} />
            </div>

            {erro && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-moncash-error/10 border border-moncash-error/30 rounded-xl p-3">
                <p className="text-moncash-error text-sm text-center font-medium">{erro}</p>
              </motion.div>
            )}

            {sucesso && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-moncash-success/10 border border-moncash-success/30 rounded-xl p-3">
                <p className="text-moncash-success text-sm text-center font-medium">{sucesso}</p>
              </motion.div>
            )}

            <button type="submit" disabled={carregando} className="w-full bg-moncash-lime hover:bg-moncash-lime-dark text-moncash-darker font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(213,255,64,0.2)] hover:shadow-[0_0_25px_rgba(213,255,64,0.4)] flex justify-center items-center h-12 mt-2">
              {carregando ? <div className="w-5 h-5 border-2 border-moncash-darker/30 border-t-moncash-darker rounded-full animate-spin" /> : (modo === 'login' ? 'Entrar' : 'Criar conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setErro(''); setSucesso(''); }} className="text-moncash-text-muted hover:text-moncash-lime transition-colors text-sm font-medium">
              {modo === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}