import { useEffect } from 'react';

/** Ventana modal reutilizable. Se cierra con Escape, con la X o con clic en el fondo. */
export default function Modal({ titulo, onClose, children }) {
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alPresionar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alPresionar);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const clicFondo = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal__fondo" onMouseDown={clicFondo}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal__cabecera">
          <h2 id="modal-titulo">{titulo}</h2>
          <button type="button" className="modal__cerrar" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}
