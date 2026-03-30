/**
 * @file Button.tsx
 * @description Botón genérico reutilizable de la app.
 *
 * Esto envuelve un <button> normal y le aplica las clases CSS
 * que ya tenemos definidas (btn-primary, btn-secondary, etc.).
 * Además soporta un estado de "loading" que muestra un texto de carga.
 */

import type { ButtonHTMLAttributes } from 'react';

/** Props del botón — extiende las props nativas de <button> */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual del botón: primary, secondary, danger o accent */
  variant?: 'primary' | 'secondary' | 'danger' | 'accent';
  /** Si es true, muestra texto de carga y deshabilita el botón */
  loading?: boolean;
}

/**
 * Botón reutilizable que mapea la variante a las clases CSS globales.
 * Acepta todas las props nativas de un botón HTML.
 */
export default function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  /** Mapeamos la variante a la clase CSS correspondiente */
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`${variantClass} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
}
