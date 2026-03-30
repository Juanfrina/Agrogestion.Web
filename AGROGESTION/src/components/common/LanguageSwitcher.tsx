/**
 * @file LanguageSwitcher.tsx
 * @description Selector de idioma (placeholder por ahora).
 *
 * Esto muestra dos botones "ES" y "EN" para cambiar el idioma.
 * De momento la lógica de i18n no está conectada — solo está la UI lista
 * para cuando integremos react-i18next o similar.
 */

import { useState } from 'react';
import i18n from '../../lib/i18n';

type Lang = 'es' | 'en' | 'ro';

/**
 * Selector de idioma — botones para español, inglés y rumano.
 * El botón activo se resalta con el color primario.
 */
export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>((i18n.language as Lang) || 'es');

  const changeLang = (l: Lang) => {
    setLang(l);
    i18n.changeLanguage(l);
  };

  /** Estilos base para los botones de idioma */
  const baseStyle: React.CSSProperties = {
    padding: '0.25rem 0.75rem',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'var(--transition-fast)',
  };

  /** Estilo del botón activo */
  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-text-on-primary)',
    borderColor: 'var(--color-primary)',
  };

  /** Estilo del botón inactivo */
  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
  };

  return (
    <div className="flex">
      <button
        onClick={() => changeLang('es')}
        style={{
          ...(lang === 'es' ? activeStyle : inactiveStyle),
          borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
        }}
      >
        ES
      </button>
      <button
        onClick={() => changeLang('en')}
        style={{
          ...(lang === 'en' ? activeStyle : inactiveStyle),
          borderLeft: 'none',
        }}
      >
        EN
      </button>
      <button
        onClick={() => changeLang('ro')}
        style={{
          ...(lang === 'ro' ? activeStyle : inactiveStyle),
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          borderLeft: 'none',
        }}
      >
        RO
      </button>
    </div>
  );
}
