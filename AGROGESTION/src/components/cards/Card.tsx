/**
 * @file Card.tsx
 * @description Componente tarjeta genérico.
 *
 * Esto es un simple wrapper con la clase "card" de nuestro CSS.
 * Opcionalmente puede tener un título (h3) y un onClick.
 * Perfecto para envolver contenido en una caja bonita.
 */

import type { ReactNode } from 'react';

interface CardProps {
  /** Contenido de la tarjeta */
  children: ReactNode;
  /** Clases CSS extra por si quieres personalizar */
  className?: string;
  /** Callback si la tarjeta es clickeable */
  onClick?: () => void;
  /** Título opcional que se renderiza como h3 dentro de la card */
  title?: string;
}

/**
 * Tarjeta reutilizable — aplica la clase "card" y opcionalmente un título.
 */
export default function Card({ children, className = '', onClick, title }: CardProps) {
  return (
    <div
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {title && <h3 className="mb-3">{title}</h3>}
      {children}
    </div>
  );
}
