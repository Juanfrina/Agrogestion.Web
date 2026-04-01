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

/** Todas las variantes usan clases CSS en index.css */
const cssVariants = ['admin', 'gerente', 'capataz', 'trabajador', 'success', 'warning', 'error'];

/**
 * Badge reutilizable — muestra una etiqueta con color según la variante.
 */
export default function Badge({ variant, children }: BadgeProps) {
  const className = cssVariants.includes(variant) ? `badge badge-${variant}` : 'badge';

  return (
    <span className={className}>
      {children}
    </span>
  );
}
