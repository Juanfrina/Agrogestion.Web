/**
 * @file useTheme.ts
 * @description Hook para manejar el tema claro/oscuro de la app.
 *
 * Guarda la preferencia en localStorage bajo la clave 'agro-theme'
 * y añade/quita la clase 'dark' en el <html>. Así Tailwind sabe
 * qué estilos dark: aplicar sin necesidad de media queries.
 *
 * @example
 * const { isDark, toggle } = useTheme();
 * <button onClick={toggle}>{isDark ? '☀️' : '🌙'}</button>
 */

import { useState, useEffect } from 'react';

/** Clave en localStorage donde guardamos si el tema es oscuro */
const STORAGE_KEY = 'agro-theme';

/**
 * Hook que gestiona el modo oscuro / claro.
 *
 * @returns isDark (boolean) y toggle (función para cambiar)
 */
export function useTheme() {
  /** Leemos la preferencia guardada; si no hay nada, usamos light */
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark';
  });

  /**
   * Cada vez que cambia isDark, actualizamos la clase del <html>
   * y guardamos en localStorage para que persista entre recargas.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  /** Alterna entre dark y light */
  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
}
