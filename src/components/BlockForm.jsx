import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function BlockForm({ initialTitle, onSubmit, onClose }) {
  const [title, setTitle] = useState(initialTitle || '');

  useEffect(() => {
    setTitle(initialTitle || '');
  }, [initialTitle]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <Modal title={initialTitle ? 'Editar bloco' : 'Novo bloco'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Título</span>
          <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
