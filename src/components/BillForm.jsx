import { useEffect, useState } from 'react';
import Modal from './Modal';
import { formatMoneyInput, parseMoney } from '../utils/money';

const today = new Date().toISOString().slice(0, 10);

const emptyBill = {
  name: '',
  amount: '',
  dueDate: today,
  status: 'pendente',
  note: '',
  isInstallment: false,
  installmentDescription: '',
  installmentCurrent: 1,
  installmentTotal: 2,
};

export default function BillForm({ bill, onSubmit, onClose }) {
  const [form, setForm] = useState(emptyBill);

  useEffect(() => {
    if (!bill) {
      setForm(emptyBill);
      return;
    }

    setForm({
      name: bill.name || '',
      amount: formatMoneyInput(bill.amount),
      dueDate: bill.dueDate || today,
      status: bill.status || 'pendente',
      note: bill.note || '',
      isInstallment: Boolean(bill.isInstallment),
      installmentDescription: bill.installment?.description || bill.name || '',
      installmentCurrent: bill.installment?.current || 1,
      installmentTotal: bill.installment?.total || 2,
    });
  }, [bill]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.isInstallment ? form.installmentDescription.trim() : form.name.trim();
    if (!name) return;

    onSubmit({
      name,
      amount: parseMoney(form.amount),
      dueDate: form.dueDate,
      status: form.status,
      note: form.note.trim(),
      isInstallment: form.isInstallment,
      installment: form.isInstallment
        ? {
            description: form.installmentDescription.trim() || name,
            current: Math.max(1, Number(form.installmentCurrent) || 1),
            total: Math.max(1, Number(form.installmentTotal) || 1),
          }
        : null,
    });
  }

  return (
    <Modal title={bill ? 'Editar conta' : 'Nova conta'} onClose={onClose} className="bill-modal">
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Nome</span>
          <input
            autoFocus
            placeholder="Ex: Aluguel"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </label>

        <div className="form-grid">
          <label>
            <span>{form.isInstallment ? 'Valor da parcela (R$)' : 'Valor (R$)'}</span>
            <input
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={(event) => update('amount', event.target.value)}
            />
          </label>
          <label>
            <span>{form.isInstallment ? 'Data de vencimento' : 'Vencimento'}</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => update('dueDate', event.target.value)}
            />
          </label>
        </div>

        <label>
          <span>Status</span>
          <select value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </label>

        <label>
          <span>Observação</span>
          <textarea
            placeholder="Opcional"
            value={form.note}
            onChange={(event) => update('note', event.target.value)}
          />
        </label>

        <label className="check-panel">
          <input
            type="checkbox"
            checked={form.isInstallment}
            onChange={(event) => update('isInstallment', event.target.checked)}
          />
          <span>Esta conta é parcelada</span>
        </label>

        {form.isInstallment && (
          <div className="installment-panel">
            <label>
              <span>Descrição da compra parcelada</span>
              <input
                value={form.installmentDescription}
                onChange={(event) => update('installmentDescription', event.target.value)}
              />
            </label>
            <div className="form-grid">
              <label>
                <span>Parcela atual</span>
                <input
                  type="number"
                  min="1"
                  value={form.installmentCurrent}
                  onChange={(event) => update('installmentCurrent', event.target.value)}
                />
              </label>
              <label>
                <span>Total de parcelas</span>
                <input
                  type="number"
                  min="1"
                  value={form.installmentTotal}
                  onChange={(event) => update('installmentTotal', event.target.value)}
                />
              </label>
            </div>
            <p>
              A observação opcional fica no campo "Observação" acima.
            </p>
          </div>
        )}

        <div className="form-actions">
          <button className="primary-button" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
