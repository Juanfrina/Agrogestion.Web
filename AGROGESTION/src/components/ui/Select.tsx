/**
 * @file Select.tsx
 * @description Componente select tipado y reutilizable.
 *
 * Esto envuelve un <select> nativo y le da una API más limpia
 * con opciones tipadas. El select ya tiene estilos globales en index.css.
 */

interface SelectOption {
  /** Valor que se envía al seleccionar */
  value: string | number;
  /** Texto que se muestra al usuario */
  label: string;
}

interface SelectProps {
  /** Array de opciones disponibles */
  options: SelectOption[];
  /** Valor seleccionado actualmente */
  value: string | number;
  /** Callback cuando el usuario cambia la selección */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Atributo name del select (para formularios) */
  name?: string;
  /** Texto de la primera opción deshabilitada (tipo "Selecciona...") */
  placeholder?: string;
  /** Clases CSS extra si hacen falta */
  className?: string;
}

/**
 * Select tipado — renderiza las opciones y un placeholder deshabilitado.
 */
export default function Select({
  options,
  value,
  onChange,
  name,
  placeholder,
  className = '',
}: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    >
      {/* Opción placeholder que no se puede seleccionar */}
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
