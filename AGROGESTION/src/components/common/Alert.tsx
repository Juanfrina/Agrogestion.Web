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
const alertClasses: Record<string, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};

/**
 * Alerta reutilizable — muestra un mensaje con estilo según el tipo.
 * Si le pasas onClose, aparece el botón × para descartarla.
 */
export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-md ${alertClasses[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-bold text-lg leading-none alert-close"
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}
