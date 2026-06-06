import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Edit3,
  Moon,
  Plus,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react';
import BlockForm from './components/BlockForm';
import BillForm from './components/BillForm';
import MonthForm from './components/MonthForm';
import { getBlockSubtotal, getMonthBlockCount, getMonthTotals } from './utils/calculations';
import { duplicateMonth } from './utils/duplicate';
import { currency } from './utils/money';
import { createId, loadNotebook, normalizeNotebook, saveNotebook } from './utils/storage';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
});

function currentMonthName() {
  const name = monthFormatter.format(new Date());
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function nextMonthName(name) {
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  const match = String(name).match(
    /(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i,
  );

  if (!match) return `${name} - cópia`;

  const index = months.indexOf(match[1].toLowerCase());
  const nextIndex = (index + 1) % 12;
  const year = Number(match[2]) + (nextIndex === 0 ? 1 : 0);
  const next = `${months[nextIndex]} de ${year}`;
  return next.charAt(0).toUpperCase() + next.slice(1);
}

function formatDate(date) {
  if (!date) return 'Sem vencimento';
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export default function App() {
  const [notebook, setNotebook] = useState(() => loadNotebook());
  const [view, setView] = useState('home');
  const [selectedMonthId, setSelectedMonthId] = useState(() => loadNotebook().months[0]?.id || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('caderno-theme') || 'dark');
  const [modal, setModal] = useState(null);
  const importInputRef = useRef(null);

  const selectedMonth = useMemo(
    () => notebook.months.find((month) => month.id === selectedMonthId) || notebook.months[0] || null,
    [notebook.months, selectedMonthId],
  );

  useEffect(() => {
    saveNotebook(notebook);
  }, [notebook]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('caderno-theme', theme);
  }, [theme]);

  useEffect(() => {
    importSharedBackup();
  }, []);

  async function importSharedBackup() {
    const params = new URLSearchParams(window.location.search);
    const sharedStatus = params.get('shared-backup');
    if (!sharedStatus) return;

    window.history.replaceState({}, '', window.location.pathname);

    if (sharedStatus !== '1') {
      window.alert('Não foi possível receber o backup compartilhado. Use o botão Importar.');
      return;
    }

    if (!('caches' in window)) {
      window.alert('Este navegador não entregou o backup compartilhado. Use o botão Importar.');
      return;
    }

    try {
      const cache = await caches.open('caderno-contas-share-v1');
      const response = await cache.match('/shared-backup.json');

      if (!response) {
        window.alert('Não encontrei um backup JSON compartilhado. Use o botão Importar.');
        return;
      }

      const text = await response.text();
      await cache.delete('/shared-backup.json');
      const imported = normalizeNotebook(JSON.parse(text));

      if (!window.confirm('Importar este backup JSON e substituir os dados atuais?')) return;

      setNotebook(imported);
      setSelectedMonthId(imported.months[0]?.id || null);
      setView('home');
    } catch {
      window.alert('Não foi possível importar o backup compartilhado. Confira se o arquivo é um JSON válido.');
    }
  }

  function updateNotebook(updater) {
    setNotebook((current) => normalizeNotebook(updater(current)));
  }

  function createMonth(name) {
    const month = {
      id: createId(),
      name,
      createdAt: new Date().toISOString(),
      blocks: [],
    };

    updateNotebook((current) => ({ months: [...current.months, month] }));
    setSelectedMonthId(month.id);
    setModal(null);
  }

  function renameMonth(monthId, name) {
    updateNotebook((current) => ({
      months: current.months.map((month) => (month.id === monthId ? { ...month, name } : month)),
    }));
    setModal(null);
  }

  function removeMonth(monthId) {
    const month = notebook.months.find((item) => item.id === monthId);
    if (!month || !window.confirm(`Excluir "${month.name}"?`)) return;

    const nextMonths = notebook.months.filter((item) => item.id !== monthId);
    updateNotebook(() => ({ months: nextMonths }));
    setSelectedMonthId(nextMonths[0]?.id || null);
    setView('home');
  }

  function confirmDuplicate(name) {
    if (!selectedMonth) return;
    const copy = duplicateMonth(selectedMonth, name);
    updateNotebook((current) => ({ months: [...current.months, copy] }));
    setSelectedMonthId(copy.id);
    setModal(null);
  }

  function createBlock(title) {
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? { ...month, blocks: [...month.blocks, { id: createId(), title, bills: [] }] }
          : month,
      ),
    }));
    setModal(null);
  }

  function renameBlock(blockId, title) {
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? {
              ...month,
              blocks: month.blocks.map((block) => (block.id === blockId ? { ...block, title } : block)),
            }
          : month,
      ),
    }));
    setModal(null);
  }

  function removeBlock(blockId) {
    if (!window.confirm('Excluir este bloco e todas as contas dele?')) return;
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? { ...month, blocks: month.blocks.filter((block) => block.id !== blockId) }
          : month,
      ),
    }));
  }

  function saveBill(blockId, data, billId = null) {
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? {
              ...month,
              blocks: month.blocks.map((block) =>
                block.id === blockId
                  ? {
                      ...block,
                      bills: billId
                        ? block.bills.map((bill) => (bill.id === billId ? { ...bill, ...data } : bill))
                        : [...block.bills, { id: createId(), ...data }],
                    }
                  : block,
              ),
            }
          : month,
      ),
    }));
    setModal(null);
  }

  function removeBill(blockId, billId) {
    if (!window.confirm('Excluir esta conta?')) return;
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? {
              ...month,
              blocks: month.blocks.map((block) =>
                block.id === blockId
                  ? { ...block, bills: block.bills.filter((bill) => bill.id !== billId) }
                  : block,
              ),
            }
          : month,
      ),
    }));
  }

  function setBillStatus(blockId, billId, status) {
    updateNotebook((current) => ({
      months: current.months.map((month) =>
        month.id === selectedMonthId
          ? {
              ...month,
              blocks: month.blocks.map((block) =>
                block.id === blockId
                  ? {
                      ...block,
                      bills: block.bills.map((bill) =>
                        bill.id === billId ? { ...bill, status } : bill,
                      ),
                    }
                  : block,
              ),
            }
          : month,
      ),
    }));
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(normalizeNotebook(notebook), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caderno-contas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = normalizeNotebook(JSON.parse(String(reader.result)));
        setNotebook(imported);
        setSelectedMonthId(imported.months[0]?.id || null);
        setView('home');
      } catch {
        window.alert('Não foi possível importar este arquivo JSON.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      {view === 'home' ? (
        <HomeView
          months={notebook.months}
          selectedMonthId={selectedMonth?.id || null}
          onSelectMonth={setSelectedMonthId}
          onOpenMonth={(monthId) => {
            setSelectedMonthId(monthId);
            setView('month');
          }}
          onNewMonth={() =>
            setModal({
              type: 'month',
              title: 'Novo caderno do mês',
              initialName: currentMonthName(),
              submitLabel: 'Criar',
              onSubmit: createMonth,
            })
          }
          onDuplicate={() =>
            selectedMonth &&
            setModal({
              type: 'duplicate',
              title: 'Duplicar mês',
              initialName: nextMonthName(selectedMonth.name),
              submitLabel: 'Duplicar',
              onSubmit: confirmDuplicate,
            })
          }
          onRemoveMonth={removeMonth}
          onExport={exportBackup}
          onImport={() => importInputRef.current?.click()}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          theme={theme}
        />
      ) : (
        <MonthView
          month={selectedMonth}
          onBack={() => setView('home')}
          onRenameMonth={() =>
            selectedMonth &&
            setModal({
              type: 'rename-month',
              title: 'Editar nome do mês',
              initialName: selectedMonth.name,
              submitLabel: 'Salvar',
              onSubmit: (name) => renameMonth(selectedMonth.id, name),
            })
          }
          onNewBlock={() => setModal({ type: 'block', onSubmit: createBlock })}
          onEditBlock={(block) =>
            setModal({
              type: 'block',
              initialTitle: block.title,
              onSubmit: (title) => renameBlock(block.id, title),
            })
          }
          onRemoveBlock={removeBlock}
          onNewBill={(blockId) => setModal({ type: 'bill', blockId })}
          onEditBill={(blockId, bill) => setModal({ type: 'bill', blockId, bill })}
          onRemoveBill={removeBill}
          onSetBillStatus={setBillStatus}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          theme={theme}
        />
      )}

      <input
        ref={importInputRef}
        className="hidden-input"
        type="file"
        accept="application/json,.json"
        onChange={importBackup}
      />

      {(modal?.type === 'month' || modal?.type === 'duplicate' || modal?.type === 'rename-month') && (
        <MonthForm
          title={modal.title}
          initialName={modal.initialName}
          submitLabel={modal.submitLabel}
          onSubmit={modal.onSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'block' && (
        <BlockForm
          initialTitle={modal.initialTitle}
          onSubmit={modal.onSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'bill' && (
        <BillForm
          bill={modal.bill}
          onSubmit={(data) => saveBill(modal.blockId, data, modal.bill?.id)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function AppHeader({ onExport, onImport, onToggleTheme, theme }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-icon">
          <img src="/logo.png" alt="" />
        </span>
        <div>
          <h1>Meu Caderno de Contas</h1>
          <p>Simples, visual e seu.</p>
        </div>
      </div>
      <div className="header-actions">
        {onExport && (
          <button className="secondary-button" type="button" onClick={onExport}>
            <Download size={16} />
            Backup
          </button>
        )}
        {onImport && (
          <button className="secondary-button" type="button" onClick={onImport}>
            <Upload size={16} />
            Importar
          </button>
        )}
        <ThemeButton theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
}

function ThemeButton({ theme, onToggleTheme }) {
  return (
    <button className="icon-button theme-button" type="button" onClick={onToggleTheme} aria-label="Alternar tema">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function HomeView({
  months,
  selectedMonthId,
  onSelectMonth,
  onOpenMonth,
  onNewMonth,
  onDuplicate,
  onRemoveMonth,
  onExport,
  onImport,
  onToggleTheme,
  theme,
}) {
  return (
    <>
      <AppHeader
        onExport={onExport}
        onImport={onImport}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
      <main className="page-shell">
        <div className="section-title-row">
          <div>
            <h2>Seus cadernos</h2>
            <p>Um caderno por mês. Crie, duplique ou abra para editar.</p>
          </div>
          <div className="toolbar">
            <button className="secondary-button" type="button" disabled={!selectedMonthId} onClick={onDuplicate}>
              <Copy size={16} />
              Duplicar mês
            </button>
            <button className="primary-button" type="button" onClick={onNewMonth}>
              <Plus size={17} />
              Novo mês
            </button>
          </div>
        </div>

        {months.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={42} />}
            title="Nenhum mês criado ainda"
            text="Crie seu primeiro caderno para começar."
            actionLabel="Criar primeiro mês"
            onAction={onNewMonth}
          />
        ) : (
          <div className="month-grid">
            {months.map((month) => (
              <MonthCard
                key={month.id}
                month={month}
                selected={month.id === selectedMonthId}
                onSelect={() => onSelectMonth(month.id)}
                onOpen={() => onOpenMonth(month.id)}
                onRemove={() => onRemoveMonth(month.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function MonthCard({ month, selected, onSelect, onOpen, onRemove }) {
  const totals = getMonthTotals(month);

  return (
    <article className={`month-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <h3>{month.name}</h3>
      <p>{getMonthBlockCount(month)} blocos</p>
      <dl>
        <div>
          <dt>Total</dt>
          <dd>{currency.format(totals.total)}</dd>
        </div>
        <div className="paid">
          <dt>Pago</dt>
          <dd>{currency.format(totals.paid)}</dd>
        </div>
        <div className="pending">
          <dt>Pendente</dt>
          <dd>{currency.format(totals.pending)}</dd>
        </div>
      </dl>
      <div className="card-actions">
        <button
          className="primary-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          Abrir
        </button>
        <button
          className="icon-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          aria-label="Excluir mês"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}

function MonthView({
  month,
  onBack,
  onRenameMonth,
  onNewBlock,
  onEditBlock,
  onRemoveBlock,
  onNewBill,
  onEditBill,
  onRemoveBill,
  onSetBillStatus,
  onToggleTheme,
  theme,
}) {
  if (!month) {
    return (
      <>
        <MonthHeader
          title="Nenhum mês selecionado"
          subtitle="Volte para escolher um caderno."
          onBack={onBack}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
        <main className="page-shell" />
      </>
    );
  }

  const totals = getMonthTotals(month);

  return (
    <>
      <MonthHeader
        title={month.name}
        subtitle={`${month.blocks.length} ${month.blocks.length === 1 ? 'bloco' : 'blocos'}`}
        onBack={onBack}
        onRenameMonth={onRenameMonth}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
      <main className="page-shell month-page">
        <div className="summary-grid">
          <SummaryCard label="Total do mês" value={totals.total} />
          <SummaryCard label="Total pago" value={totals.paid} tone="paid" />
          <SummaryCard label="Total pendente" value={totals.pending} tone="pending" />
        </div>

        <div className="section-title-row compact">
          <h2>Blocos</h2>
          <button className="primary-button" type="button" onClick={onNewBlock}>
            <Plus size={17} />
            Novo bloco
          </button>
        </div>

        {month.blocks.length === 0 ? (
          <div className="empty-blocks">
            Nenhum bloco ainda. Crie categorias como "Contas fixas", "Cartão de crédito", "Mercado"...
          </div>
        ) : (
          <div className="block-list">
            {month.blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onNewBill={() => onNewBill(block.id)}
                onEditBlock={() => onEditBlock(block)}
                onRemoveBlock={() => onRemoveBlock(block.id)}
                onEditBill={(bill) => onEditBill(block.id, bill)}
                onRemoveBill={(billId) => onRemoveBill(block.id, billId)}
                onSetBillStatus={(billId, status) => onSetBillStatus(block.id, billId, status)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function MonthHeader({ title, subtitle, onBack, onRenameMonth, onToggleTheme, theme }) {
  return (
    <header className="month-header">
      <div className="month-heading">
        <button className="icon-button ghost" type="button" onClick={onBack} aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="month-title-line">
            <h1>{title}</h1>
            {onRenameMonth && (
              <button className="mini-icon-button" type="button" onClick={onRenameMonth} aria-label="Editar mês">
                <Edit3 size={15} />
              </button>
            )}
          </div>
          <p>{subtitle}</p>
        </div>
      </div>
      <ThemeButton theme={theme} onToggleTheme={onToggleTheme} />
    </header>
  );
}

function SummaryCard({ label, value, tone = 'default' }) {
  return (
    <article className={`summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{currency.format(value)}</strong>
    </article>
  );
}

function BlockCard({
  block,
  onNewBill,
  onEditBlock,
  onRemoveBlock,
  onEditBill,
  onRemoveBill,
  onSetBillStatus,
}) {
  return (
    <article className="block-card">
      <div className="block-header">
        <div>
          <h3>{block.title}</h3>
          <p>Subtotal: {currency.format(getBlockSubtotal(block))}</p>
        </div>
        <div className="block-actions">
          <button className="dark-button" type="button" onClick={onNewBill}>
            <Plus size={16} />
            Conta
          </button>
          <button className="icon-button ghost" type="button" onClick={onEditBlock} aria-label="Editar bloco">
            <Edit3 size={17} />
          </button>
          <button className="icon-button ghost" type="button" onClick={onRemoveBlock} aria-label="Excluir bloco">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {block.bills.length === 0 ? (
        <div className="empty-bills">Sem contas neste bloco.</div>
      ) : (
        <div className="bill-list">
          {block.bills.map((bill) => (
            <BillRow
              key={bill.id}
              bill={bill}
              onEdit={() => onEditBill(bill)}
              onRemove={() => onRemoveBill(bill.id)}
              onSetStatus={(status) => onSetBillStatus(bill.id, status)}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function BillRow({ bill, onEdit, onRemove, onSetStatus }) {
  const installmentPart = `Parcela ${bill.installment?.current || 1}/${bill.installment?.total || 1}`;
  const title = bill.isInstallment
    ? `${bill.installment?.description || bill.name} — ${installmentPart} — ${currency.format(bill.amount)}`
    : bill.name;

  return (
    <div className="bill-row">
      <div className="bill-main">
        <div className="bill-title-line">
          <strong>{title}</strong>
          {bill.isInstallment && (
            <span className="pill neutral">
              {installmentPart}
            </span>
          )}
          <StatusBadge status={bill.status} />
        </div>
        <p>Vence em {formatDate(bill.dueDate)}</p>
        {bill.note && <small>{bill.note}</small>}
      </div>
      <div className="bill-side">
        <strong>{currency.format(bill.amount)}</strong>
        <div className="status-actions">
          <button
            className={`status-button paid ${bill.status === 'pago' ? 'active' : ''}`}
            type="button"
            onClick={() => onSetStatus('pago')}
            aria-label="Marcar como pago"
          >
            <CheckCircle2 size={16} />
          </button>
          <button
            className={`status-button pending ${bill.status === 'pendente' ? 'active' : ''}`}
            type="button"
            onClick={() => onSetStatus('pendente')}
            aria-label="Marcar como pendente"
          >
            <Clock3 size={16} />
          </button>
          <button
            className={`status-button late ${bill.status === 'atrasado' ? 'active' : ''}`}
            type="button"
            onClick={() => onSetStatus('atrasado')}
            aria-label="Marcar como atrasado"
          >
            <AlertTriangle size={16} />
          </button>
          <button className="icon-button ghost" type="button" onClick={onEdit} aria-label="Editar conta">
            <Edit3 size={17} />
          </button>
          <button className="icon-button ghost" type="button" onClick={onRemove} aria-label="Excluir conta">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const label = {
    pago: 'Pago',
    pendente: 'Pendente',
    atrasado: 'Atrasado',
  }[status];

  return <span className={`pill ${status}`}>{label}</span>;
}

function EmptyState({ icon, title, text, actionLabel, onAction }) {
  return (
    <section className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="primary-button" type="button" onClick={onAction}>
        <Plus size={17} />
        {actionLabel}
      </button>
    </section>
  );
}
