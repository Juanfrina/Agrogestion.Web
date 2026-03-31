/**
 * @file InputField.tsx
 * @description Campo de formulario reutilizable con label, validación visual y error.
 *
 * Muestra borde verde si el campo es válido, rojo si tiene error,
 * y el mensaje de error debajo. Para campos de contraseña incluye
 * un botón ojo para mostrar/ocultar el texto.
 */

import { useState } from 'react';

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
  /** Callback cuando el input pierde el foco (para validación en tiempo real) */
  onBlur?: () => void;
  /** Mensaje de error — si existe, se muestra debajo del input */
  error?: string;
  /** Si el campo ha sido validado y es correcto */
  valid?: boolean;
  /** Placeholder del input */
  placeholder?: string;
  /** Si el campo es obligatorio */
  required?: boolean;
  /** Máximo de caracteres permitidos */
  maxLength?: number;
  /** Texto de ayuda debajo del input */
  hint?: string;
}

/**
 * Campo de formulario con label + input + error/hint.
 * Si type="password", muestra un botón para alternar visibilidad.
 */
export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  valid,
  placeholder,
  required,
  maxLength,
  hint,
}: InputFieldProps) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const inputClass = error ? 'input-error' : valid ? 'input-valid' : '';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
        {label}
        {required && <span style={{ color: 'var(--color-error)' }}> *</span>}
      </label>

      <div className={`input-wrapper ${isPassword ? 'input-wrapper--password' : ''}`}>
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={inputClass}
          autoComplete={isPassword ? 'current-password' : name}
        />
        {isPassword && (
          <button
            type="button"
            className="input-toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '🙉'}
          </button>
        )}
      </div>

      {error && <span className="form-error">{error}</span>}
      {!error && hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}
