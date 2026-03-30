/**
 * @file Modal.tsx
 * @description Componente modal/diálogo sencillo.
 *
 * Esto muestra un overlay oscuro con una tarjeta centrada encima.
 * Si isOpen es false, no renderiza nada. Tiene botón × para cerrar
 * y un título opcional en la cabecera.
 */

import type { ReactNode } from 'react';

interface ModalProps {
  /** Controla si el modal se muestra o no */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Título opcional en la cabecera del modal */
  title?: string;
  /** Contenido del modal */
  children: ReactNode;
}

/**
 * Modal reutilizable con overlay oscuro y tarjeta centrada.
 * Devuelve null si isOpen es false para no renderizar nada.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      {/* Paramos la propagación para que clicar dentro no cierre el modal */}
      <div
        className="card max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con título y botón de cerrar */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="m-0">{title}</h2>}
          <button
            onClick={onClose}
            className="font-bold text-xl leading-none ml-auto"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Contenido del modal */}
        {children}
      </div>
    </div>
  );
}
