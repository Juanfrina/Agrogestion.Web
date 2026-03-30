import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../locales/es.json';
import en from '../locales/en.json';
import ro from '../locales/ro.json';

/** Inicializa i18next con los idiomas español, inglés y rumano */
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ro: { translation: ro },
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;
