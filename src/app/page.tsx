import React from 'react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#111111', color: '#D5FF40', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #D5FF40', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>MONCASH</h1>
        <p style={{ color: '#ffffff', margin: '10px 0 0 0' }}>Seu controle financeiro inteligente.</p>
      </header>

      <main>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ border: '2px solid #D5FF40', padding: '20px', borderRadius: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Saldo Atual</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>R$ 0,00</p>
          </div>
          <div style={{ border: '1px solid #ffffff', padding: '20px', borderRadius: '15px', color: '#ffffff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Próximos Pagamentos</h3>
            <p style={{ margin: 0 }}>Nenhuma conta pendente.</p>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '50px', fontSize: '0.8rem', color: '#666' }}>
        Sistema operando em nuvem.
      </footer>
    </div>
  );
}