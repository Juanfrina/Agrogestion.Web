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

/** Mapeamos los tamaños a clases Tailwind */
const sizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: '',
  lg: 'w-12 h-12',
};

/**
 * Spinner de carga — usa la clase .spinner de index.css.
 * El tamaño por defecto (md) usa el tamaño que ya tiene el CSS.
 */
export default function Spinner({ size = 'md', text }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`spinner ${sizeClasses[size]}`} />
      {text && (
        <p className="text-(--color-text-muted) text-sm">
          {text}
        </p>
      )}
    </div>
  );
}
