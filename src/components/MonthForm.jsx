import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function MonthForm({ title, initialName, submitLabel, onSubmit, onClose }) {
  const [name, setName] = useState(initialName || '');

  useEffect(() => {
    setName(initialName || '');
  }, [initialName]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Nome do mês</span>
          <input autoFocus value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
