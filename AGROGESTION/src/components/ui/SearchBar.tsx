/**
 * @file SearchBar.tsx
 * @description Barra de búsqueda sencilla con icono de lupa.
 *
 * Esto renderiza un input con un icono de búsqueda a la izquierda.
 * El componente padre controla el valor y el onChange.
 */

interface SearchBarProps {
  /** Valor actual del campo de búsqueda */
  value: string;
  /** Callback cuando el usuario escribe algo */
  onChange: (value: string) => void;
  /** Texto placeholder del input */
  placeholder?: string;
}

/**
 * Barra de búsqueda con icono de lupa.
 * El input ya tiene estilos globales, aquí solo añadimos el icono.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = '🔍Buscar...',
}: SearchBarProps) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
