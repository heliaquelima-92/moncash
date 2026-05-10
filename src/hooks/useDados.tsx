"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const DadosContext = createContext<any>({});

export function DadosProvider({ children }: { children: React.ReactNode }) {
  const [contasMes, setContasMes] = useState<any[]>([]);
const [gastosAvulsos, setGastosAvulsos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros de data (Maio 2026 como exemplo conforme seu briefing)
  const [mes, setMes] = useState(5);
  const [ano, setAno] = useState(2026);

  const carregarDados = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Buscar Contas do Mês (Fixas, Temporárias e Parceladas)
    const { data: contas } = await supabase
      .from('contas_mes')
      .select('*')
      .eq('usuario_id', user.id)
      .eq('mes', mes)
      .eq('ano', ano);

    // 2. Buscar Gastos Avulsos (Dia a dia)
    const { data: gastos } = await supabase
      .from('gastos')
      .select('*')
      .eq('usuario_id', user.id)
      .gte('data', `${ano}-${mes}-01`)
      .lte('data', `${ano}-${mes}-31`);

    setContasMes(contas || []);
    setGastosAvulsos(gastos || []);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  // Cálculos de Totais
  const totalGastosAvulsos = gastosAvulsos.reduce((acc: number, g: any) => acc + g.valor, 0);
  
  const contasTemporarias = contasMes.filter((c: any) => c.tipo === 'temporaria');
  const contasFixas = contasMes.filter((c: any) => c.tipo === 'fixa');
  const parceladas = contasMes.filter((c: any) => c.tipo === 'parcelada');

  return (
    <DadosContext.Provider value={{ 
      contasTemporarias, 
      contasFixas, 
      parceladas, 
      totalGastosAvulsos,
      loading,
      mes, 
      ano 
    }}>
      {children}
    </DadosContext.Provider>
  );
}

export const useDados = () => useContext(DadosContext);