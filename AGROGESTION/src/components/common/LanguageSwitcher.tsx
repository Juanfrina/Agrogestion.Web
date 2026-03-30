/**
 * @file LanguageSwitcher.tsx
 * @description Desplegable de selección de idioma con soporte para ES, EN y RO.
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../lib/i18n';

type Lang = 'es' | 'en' | 'ro';

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
];

/**
 * Selector de idioma tipo dropdown.
 * Muestra "Idioma" con una flechita; al hacer clic se despliegan las opciones.
 */
export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [lang, setLang] = useState<Lang>((i18n.language as Lang) || 'es');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const changeLang = (l: Lang) => {
    setLang(l);
    i18n.changeLanguage(l);
    setOpen(false);
  };

  /** Cierra el dropdown si se hace clic fuera */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-switcher__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{current.flag}</span>
        <span>{t('common.language')}</span>
        <span className={`lang-switcher__arrow ${open ? 'lang-switcher__arrow--open' : ''}`}>▾</span>
      </button>

      {open && (
        <ul className="lang-switcher__menu" role="listbox">
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                className={`lang-switcher__option ${l.code === lang ? 'lang-switcher__option--active' : ''}`}
                onClick={() => changeLang(l.code)}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
