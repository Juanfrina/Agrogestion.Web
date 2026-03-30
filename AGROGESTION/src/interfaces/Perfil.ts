/**
 * @file Perfil.ts
 * @description Re-exportación de la interfaz Perfil desde lib/types.
 *
 * Esto existe por compatibilidad — algunos archivos importan Perfil desde aquí
 * en vez de desde lib/types. Así no se rompe nada si alguien usa una ruta u otra.
 */

export type { Perfil } from '../lib/types';
