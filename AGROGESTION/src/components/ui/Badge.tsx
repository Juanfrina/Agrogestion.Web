/**
 * @file Badge.tsx
 * @description Componente de insignia/badge para mostrar roles y estados.
 *
 * Esto pinta una etiquetita de color según la variante que le pases.
 * Para los roles (admin, gerente, etc.) usa las clases CSS que ya tenemos.
 * Para estados (success, warning, error) usa estilos inline con las CSS vars.
 */

import type { ReactNode } from 'react';

/** Las variantes que acepta el badge */
type BadgeVariant =
  | 'admin'
  | 'gerente'
  | 'capataz'
  | 'trabajador'
  | 'success'
  | 'warning'
  | 'error';

interface BadgeProps {
  /** Qué estilo visual queremos */
  variant: BadgeVariant;
  /** Contenido del badge (texto, iconos, lo que sea) */
  children: ReactNode;
}

/**
 * Estilos inline para las variantes que no tienen clase CSS propia.
 * Usamos las variables CSS del tema para que se adapten a dark mode.
 */
const customStyles: Record<string, React.CSSProperties> = {
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  warning: {
    backgroundColor: 'var(--color-accent)',
    color: '#78350f',
  },
  error: {
    backgroundColor: 'var(--color-error-light)',
    color: 'var(--color-error)',
  },
};

/** Las variantes que tienen clase CSS dedicada en index.css */
const cssVariants = ['admin', 'gerente', 'capataz', 'trabajador'];

/**
 * Badge reutilizable — muestra una etiqueta con color según la variante.
 */
export default function Badge({ variant, children }: BadgeProps) {
  /** Si la variante tiene clase CSS propia, la usamos; si no, estilos inline */
  const hasCssClass = cssVariants.includes(variant);
  const className = hasCssClass ? `badge badge-${variant}` : 'badge';
  const style = hasCssClass ? undefined : customStyles[variant];

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}
