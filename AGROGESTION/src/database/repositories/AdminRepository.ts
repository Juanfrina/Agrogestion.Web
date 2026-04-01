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

  /**
   * Obtiene el número de registros de usuarios por mes (últimos 6 meses).
   *
   * @returns Array de objetos { mes, valor } con el conteo mensual
   */
  async getMonthlyRegistrations(): Promise<{ mes: string; valor: number }[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('perfiles')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());
    if (error) throw error;

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const counts: Record<string, number> = {};

    // Inicializar los últimos 6 meses con 0
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      counts[key] = 0;
    }

    // Contar registros por mes
    for (const row of data ?? []) {
      const d = new Date(row.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in counts) counts[key]++;
    }

    return Object.entries(counts).map(([key, valor]) => {
      const [, month] = key.split('-');
      return { mes: monthNames[Number(month) - 1], valor };
    });
  },

  /**
   * Actualiza los datos de un usuario (nombre, apellidos, email, tlf, direccion, dni).
   *
   * @param userId  - UUID del usuario a editar
   * @param updates - Campos a actualizar
   */
  async updateUser(
    userId: string,
    updates: Partial<Pick<Perfil, 'nombre' | 'apellidos' | 'email' | 'tlf' | 'direccion' | 'dni'>>,
  ): Promise<void> {
    const { error } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  },
};
