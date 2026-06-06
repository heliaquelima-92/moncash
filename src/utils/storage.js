const STORAGE_KEY = 'meu-caderno-de-contas:v1';

export function loadNotebook() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { months: [] };
    return normalizeNotebook(JSON.parse(stored));
  } catch {
    return { months: [] };
  }
}

export function saveNotebook(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeNotebook(data)));
}

export function normalizeNotebook(data) {
  const months = Array.isArray(data?.months) ? data.months : [];

  return {
    months: months.map((month) => ({
      id: month.id || createId(),
      name: month.name || 'Novo mês',
      createdAt: month.createdAt || new Date().toISOString(),
      blocks: Array.isArray(month.blocks)
        ? month.blocks.map((block) => ({
            id: block.id || createId(),
            title: block.title || 'Novo bloco',
            bills: Array.isArray(block.bills)
              ? block.bills.map((bill) => normalizeBill(bill))
              : [],
          }))
        : [],
    })),
  };
}

export function normalizeBill(bill) {
  const isInstallment = Boolean(bill.isInstallment || bill.installment);
  const installment = bill.installment || {};
  const current = Number(installment.current ?? bill.installmentCurrent ?? 1);
  const total = Number(installment.total ?? bill.installmentTotal ?? 1);

  return {
    id: bill.id || createId(),
    name: bill.name || installment.description || 'Conta',
    amount: Number(bill.amount || installment.amount || 0),
    dueDate: bill.dueDate || '',
    status: normalizeStatus(bill.status),
    note: bill.note || '',
    isInstallment,
    installment: isInstallment
      ? {
          description: installment.description || bill.name || '',
          current: Number.isFinite(current) && current > 0 ? current : 1,
          total: Number.isFinite(total) && total > 0 ? total : 1,
        }
      : null,
  };
}

export function normalizeStatus(status) {
  const value = String(status || 'pendente').toLowerCase();
  if (['pago', 'pendente', 'atrasado'].includes(value)) return value;
  return 'pendente';
}

export function createId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
