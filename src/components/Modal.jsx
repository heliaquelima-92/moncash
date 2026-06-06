import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, className = '' }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
