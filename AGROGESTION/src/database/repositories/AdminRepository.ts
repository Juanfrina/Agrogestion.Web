/**
 * @file AdminRepository.ts
 * @description Repositorio de administración — operaciones que solo el admin puede hacer.
 *
 * Aquí van las consultas para gestionar usuarios: listar todos, cambiar roles,
 * dar de baja, reactivar y sacar estadísticas generales.
 *
 * Solo el usuario con rol ADMIN debería poder llamar a estas funciones.
 */

import { supabase } from '../supabase/Client';
import type { Perfil } from '../../lib/types';

export const AdminRepository = {
  /**
   * Trae todos los usuarios con la info de su rol.
   * Incluye los dados de baja — el admin puede ver todo.
   *
   * @returns Lista completa de perfiles con su rol
   */
  async getAllUsers(): Promise<(Perfil & { rol?: { nombre: string } })[]> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*, rol:rol!id_rol(nombre)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Cambia el rol de un usuario.
   * Por ejemplo, ascender a un trabajador a capataz.
   *
   * @param userId - UUID del usuario
   * @param rolId  - Nuevo id de rol (1=Admin, 2=Gerente, 3=Capataz, 4=Trabajador)
   */
  async updateUserRole(userId: string, rolId: number): Promise<void> {
    const { error } = await supabase
      .from('perfiles')
      .update({ id_rol: rolId })
      .eq('id', userId);
    if (error) throw error;
  },

  /**
   * Borrado lógico de un usuario — pone fecha_baja a ahora.
   * El usuario ya no podrá acceder, pero su historial se conserva.
   *
   * @param userId - UUID del usuario a dar de baja
   */
  async softDeleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('perfiles')
      .update({ fecha_baja: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  /**
   * Reactiva un usuario que estaba dado de baja — pone fecha_baja a null.
   *
   * @param userId - UUID del usuario a reactivar
   */
  async reactivateUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('perfiles')
      .update({ fecha_baja: null })
      .eq('id', userId);
    if (error) throw error;
  },

  /**
   * Saca estadísticas generales: cuántos usuarios hay de cada rol.
   * Útil para el dashboard del admin.
   *
   * @returns Objeto con el conteo por cada rol
   */
  async getStats(): Promise<{ admins: number; gerentes: number; capataces: number; trabajadores: number; total: number }> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id_rol')
      .is('fecha_baja', null);
    if (error) throw error;

    const perfiles = data ?? [];
    return {
      admins: perfiles.filter((p) => p.id_rol === 1).length,
      gerentes: perfiles.filter((p) => p.id_rol === 2).length,
      capataces: perfiles.filter((p) => p.id_rol === 3).length,
      trabajadores: perfiles.filter((p) => p.id_rol === 4).length,
      total: perfiles.length,
    };
  },
};
