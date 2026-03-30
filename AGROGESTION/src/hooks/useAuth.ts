/**
 * @file useAuth.ts
 * @description Hook de conveniencia para autenticación.
 *
 * Esto envuelve el store de Zustand y añade valores derivados
 * como isAdmin, isGerente, etc. Así los componentes no tienen que
 * comparar manualmente el id_rol cada vez — solo preguntan "¿eres admin?" y listo.
 *
 * @example
 * const { perfil, isGerente, isAuthenticated } = useAuth();
 * if (isGerente) { // mostrar dashboard de gerente }
 */

import { useAuthStore } from '../store/authStore';
import { Rol } from '../lib/types';

/**
 * Devuelve el nombre legible del rol a partir de su id.
 * Útil para mostrar "Gerente" en vez de "2" en la interfaz.
 *
 * @param id_rol - El id numérico del rol
 * @returns El nombre del rol en español
 */
function getRoleName(id_rol: number): string {
  switch (id_rol) {
    case Rol.ADMIN:
      return 'Administrador';
    case Rol.GERENTE:
      return 'Gerente';
    case Rol.CAPATAZ:
      return 'Capataz';
    case Rol.TRABAJADOR:
      return 'Trabajador';
    default:
      return 'Desconocido';
  }
}

/**
 * Hook de autenticación con valores derivados.
 * Combina el store de Zustand con comprobaciones de rol ya hechas.
 *
 * @returns Todo el estado de auth + booleanos de rol + nombre del rol
 */
export function useAuth() {
  const store = useAuthStore();

  return {
    ...store,
    /** true si el usuario es Administrador */
    isAdmin: store.perfil?.id_rol === Rol.ADMIN,
    /** true si el usuario es Gerente */
    isGerente: store.perfil?.id_rol === Rol.GERENTE,
    /** true si el usuario es Capataz */
    isCapataz: store.perfil?.id_rol === Rol.CAPATAZ,
    /** true si el usuario es Trabajador */
    isTrabajador: store.perfil?.id_rol === Rol.TRABAJADOR,
    /** true si hay una sesión activa */
    isAuthenticated: !!store.session,
    /** Nombre legible del rol ("Gerente", "Capataz", etc.) o null si no hay perfil */
    roleName: store.perfil ? getRoleName(store.perfil.id_rol) : null,
  };
}
