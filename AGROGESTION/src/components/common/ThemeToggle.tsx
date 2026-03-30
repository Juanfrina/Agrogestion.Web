/**
 * @file ThemeToggle.tsx
 * @description Botoncito para cambiar entre tema claro y oscuro.
 *
 * Esto usa el hook useTheme para alternar entre dark y light.
 * Muestra un emoji de sol ☀️ si estamos en oscuro (para ir a claro)
 * o una luna 🌙 si estamos en claro (para ir a oscuro).
 */

import { useTheme } from '../../hooks/useTheme';

/**
 * Toggle de tema — un botón simple con emoji que cambia el modo.
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-[var(--radius-md)]"
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        fontSize: '1.25rem',
        lineHeight: 1,
        transition: 'var(--transition-fast)',
      }}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
