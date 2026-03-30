/**
 * @file Alert.tsx
 * @description Banner de alerta para mostrar mensajes al usuario.
 *
 * Esto muestra un mensaje con fondo de color según el tipo:
 * success (verde), error (rojo), warning (amarillo), info (azul/primario).
 * Opcionalmente tiene un botón × para cerrarlo.
 */

interface AlertProps {
  /** Tipo de alerta que determina el color */
  type: 'success' | 'error' | 'warning' | 'info';
  /** El mensaje que se muestra */
  message: string;
  /** Si se pasa, muestra un botón × para cerrar la alerta */
  onClose?: () => void;
}

/** Estilos según el tipo de alerta, usando las CSS vars del tema */
const alertStyles: Record<string, React.CSSProperties> = {
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7',
  },
  error: {
    backgroundColor: 'var(--color-error-light)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error)',
  },
  warning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid var(--color-accent)',
  },
  info: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    border: '1px solid var(--color-primary)',
  },
};

/**
 * Alerta reutilizable — muestra un mensaje con estilo según el tipo.
 * Si le pasas onClose, aparece el botón × para descartarla.
 */
export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-[var(--radius-md)]"
      style={alertStyles[type]}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-bold text-lg leading-none"
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}
