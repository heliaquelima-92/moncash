# Meu Caderno de Contas

Aplicação React + Vite para organizar contas mensais em cadernos, blocos e contas.

## Recursos

- Criação, edição, exclusão e duplicação de meses.
- Blocos/categorias dentro de cada mês.
- Contas com nome, valor, vencimento, status e observação opcional.
- Contas parceladas com avanço automático ao duplicar mês.
- Totais por bloco, total do mês, total pago e total pendente.
- Salvamento local no navegador via `localStorage`.
- Backup e importação por arquivo JSON.
- Sem Supabase, banco de dados, login, autenticação ou backend.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Dados

Os dados ficam somente no navegador. Use o botão `Backup` para baixar um JSON e `Importar` para restaurar ou migrar dados.
