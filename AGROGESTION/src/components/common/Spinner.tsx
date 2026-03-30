/**
 * @file Spinner.tsx
 * @description Spinner de carga reutilizable.
 *
 * Esto muestra la animación de carga que ya tenemos en CSS (.spinner).
 * Puedes elegir tamaño (sm, md, lg) y añadir un texto debajo.
 */

interface SpinnerProps {
  /** Tamaño del spinner: sm (1rem), md (por defecto del CSS), lg (3rem) */
  size?: 'sm' | 'md' | 'lg';
  /** Texto opcional que se muestra debajo del spinner */
  text?: string;
}

/** Mapeamos los tamaños a valores CSS */
const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { width: '1rem', height: '1rem' },
  md: {},
  lg: { width: '3rem', height: '3rem' },
};

/**
 * Spinner de carga — usa la clase .spinner de index.css.
 * El tamaño por defecto (md) usa el tamaño que ya tiene el CSS.
 */
export default function Spinner({ size = 'md', text }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="spinner" style={sizeStyles[size]} />
      {text && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {text}
        </p>
      )}
    </div>
  );
}
