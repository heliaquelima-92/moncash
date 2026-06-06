import { createId } from './storage';

export function duplicateMonth(month, name) {
  return {
    id: createId(),
    name,
    createdAt: new Date().toISOString(),
    blocks: month.blocks.map((block) => ({
      ...block,
      id: createId(),
      bills: block.bills
        .map((bill) => duplicateBill(bill))
        .filter(Boolean),
    })),
  };
}

function duplicateBill(bill) {
  if (bill.isInstallment) {
    const current = Number(bill.installment?.current || 1);
    const total = Number(bill.installment?.total || 1);
    if (current >= total) return null;

    return {
      ...bill,
      id: createId(),
      status: 'pendente',
      installment: {
        ...bill.installment,
        current: current + 1,
        total,
      },
    };
  }

  return {
    ...bill,
    id: createId(),
    status: 'pendente',
  };
}
