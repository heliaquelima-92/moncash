export function getBlockSubtotal(block) {
  return block.bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
}

export function getMonthTotals(month) {
  const bills = month.blocks.flatMap((block) => block.bills);

  return bills.reduce(
    (totals, bill) => {
      const amount = Number(bill.amount || 0);
      totals.total += amount;

      if (bill.status === 'pago') {
        totals.paid += amount;
      } else {
        totals.pending += amount;
      }

      return totals;
    },
    { total: 0, paid: 0, pending: 0 },
  );
}

export function getMonthBlockCount(month) {
  return month.blocks.length;
}
