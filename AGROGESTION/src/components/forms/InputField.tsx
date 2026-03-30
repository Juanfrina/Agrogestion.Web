/**
 * @file InputField.tsx
 * @description Campo de formulario reutilizable con label y error.
 *
 * Esto renderiza un label, un input y opcionalmente un mensaje de error.
 * El input ya tiene estilos globales en index.css (borde, focus ring, etc.).
 * Si hay error, se muestra debajo con la clase "form-error".
 */

interface InputFieldProps {
  /** Texto del label */
  label: string;
  /** Atributo name del input (también se usa como id) */
  name: string;
  /** Tipo del input (text, email, password, etc.) */
  type?: string;
  /** Valor actual del campo */
  value: string;
  /** Callback cuando el usuario escribe */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Mensaje de error — si existe, se muestra debajo del input */
  error?: string;
  /** Placeholder del input */
  placeholder?: string;
  /** Si el campo es obligatorio */
  required?: boolean;
  /** Máximo de caracteres permitidos */
  maxLength?: number;
}

/**
 * Campo de formulario con label + input + mensaje de error.
 * El input usa los estilos globales; el error usa la clase "form-error".
 */
export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  maxLength,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
        {label}
        {required && <span style={{ color: 'var(--color-error)' }}> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
