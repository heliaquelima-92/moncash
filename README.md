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
- Instalação como PWA no celular.
- Recebimento de backup JSON por compartilhamento quando o navegador/sistema suportar Web Share Target.
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

## PWA

Depois de publicar em HTTPS, abra o app no celular e use a opção do navegador para instalar/adicionar à tela inicial.

Em navegadores compatíveis, o app também registra um alvo de compartilhamento para receber arquivos `.json`. Caso o sistema não ofereça essa opção, a importação manual pelo botão `Importar` continua funcionando normalmente.
