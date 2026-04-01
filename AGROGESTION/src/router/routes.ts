/**
 * @file routes.ts
 * @description Constantes de rutas — todas las URLs de la app en un solo sitio.
 *
 * Así si cambiamos una ruta, solo se toca aquí y no en 50 archivos.
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRO: '/registro',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/usuarios',
  GERENTE: '/gerente',
  GERENTE_TERRENOS: '/gerente/terrenos',
  GERENTE_TAREAS: '/gerente/tareas',
  CAPATAZ: '/capataz',
  CAPATAZ_TAREAS: '/capataz/tareas',
  CAPATAZ_TRABAJADORES: '/capataz/trabajadores',
  TRABAJADOR: '/trabajador',
  TRABAJADOR_TAREAS: '/trabajador/mis-tareas',
  PROFILE: '/perfil',
} as const;
