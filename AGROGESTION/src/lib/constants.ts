/** Nombre de la aplicación */
export const APP_NAME = 'Agrogestión';

/** Eslogan principal que se muestra en la landing */
export const APP_SLOGAN = 'Innovación · Sostenibilidad · Productividad';

/** Idioma por defecto */
export const DEFAULT_LOCALE = 'es';

/** Idiomas que soporta la app */
export const SUPPORTED_LOCALES = ['es', 'en', 'ro'] as const;

/** Clave en localStorage pa guardar el tema */
export const THEME_KEY = 'agro-theme';

/** IDs de los estados de tarea, mapeados con la tabla de Supabase */
export const ESTADOS_TAREA = {
  PENDIENTE: 1,
  ASIGNADA: 2,
  ACEPTADA: 3,
  RECHAZADA: 4,
  EN_PROGRESO: 5,
  COMPLETADA: 6,
} as const;
