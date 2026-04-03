/**
 * @file UsuarioRepository.ts
 * @description Repositorio de usuarios — relaciones entre gerentes, capataces y trabajadores.
 *
 * Aquí gestionamos las tablas puente: gerente_capataz, capataz_trabajador,
 * y también las notificaciones. Básicamente todo lo que tiene que ver con
 * "quién trabaja para quién" y los avisos del sistema.
 */

import { supabase } from '../supabase/Client';
import type { Perfil } from '../../lib/types';

export const UsuarioRepository = {
  /**
   * Trae los capataces asignados a un gerente.
   * Consulta la tabla puente gerente_capataz y hace join con perfiles.
   *
   * @param gerenteId - UUID del gerente
   * @returns Lista de perfiles de los capataces del gerente
   */
  async getCapatacesByGerente(gerenteId: string): Promise<Perfil[]> {
    const { data, error } = await supabase
      .from('gerente_capataz')
      .select('capataz:perfiles!id_capataz(*)')
      .eq('id_gerente', gerenteId)
      .is('fecha_baja', null);
    if (error) throw error;
    // El join devuelve { capataz: Perfil }, así que extraemos solo el perfil
    return (data ?? []).map((row) => (row as unknown as { capataz: Perfil }).capataz);
  },

  /**
   * Trae los trabajadores asignados a un capataz.
   * Consulta la tabla puente capataz_trabajador y hace join con perfiles.
   *
   * @param capatazId - UUID del capataz
   * @returns Lista de perfiles de los trabajadores del capataz
   */
  async getTrabajadoresByCapataz(capatazId: string): Promise<Perfil[]> {
    const { data, error } = await supabase
      .from('capataz_trabajador')
      .select('trabajador:perfiles!id_trabajador(*)')
      .eq('id_capataz', capatazId)
      .is('fecha_baja', null);
    if (error) throw error;
    return (data ?? []).map((row) => (row as unknown as { trabajador: Perfil }).trabajador);
  },

  /**
   * Asigna un capataz a un gerente (crea la relación en gerente_capataz).
   *
   * @param gerenteId - UUID del gerente
   * @param capatazId - UUID del capataz a asignar
   */
  async assignCapatazToGerente(gerenteId: string, capatazId: string): Promise<void> {
    const { error } = await supabase
      .from('gerente_capataz')
      .insert({ id_gerente: gerenteId, id_capataz: capatazId });
    if (error) throw error;
  },

  /**
   * Asigna un trabajador a un capataz (crea la relación en capataz_trabajador).
   *
   * @param capatazId    - UUID del capataz
   * @param trabajadorId - UUID del trabajador a asignar
   */
  async assignTrabajadorToCapataz(capatazId: string, trabajadorId: string): Promise<void> {
    const { error } = await supabase
      .from('capataz_trabajador')
      .insert({ id_capataz: capatazId, id_trabajador: trabajadorId });
    if (error) throw error;
  },

  /**
   * Desasocia un capataz de un gerente (borrado lógico).
   */
  async removeCapatazFromGerente(gerenteId: string, capatazId: string): Promise<void> {
    const { error } = await supabase
      .from('gerente_capataz')
      .update({ fecha_baja: new Date().toISOString().split('T')[0] })
      .eq('id_gerente', gerenteId)
      .eq('id_capataz', capatazId);
    if (error) throw error;
  },

  /**
   * Desasocia un trabajador de un capataz (borrado lógico).
   */
  async removeTrabajadorFromCapataz(capatazId: string, trabajadorId: string): Promise<void> {
    const { error } = await supabase
      .from('capataz_trabajador')
      .update({ fecha_baja: new Date().toISOString().split('T')[0] })
      .eq('id_capataz', capatazId)
      .eq('id_trabajador', trabajadorId);
    if (error) throw error;
  },

  /**
   * Trae todos los capataces disponibles (activos, sin fecha de baja).
   * Útil para los selects de asignación.
   *
   * @returns Lista de perfiles con rol capataz
   */
  async getAvailableCapataces(): Promise<Perfil[]> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id_rol', 3)
      .is('fecha_baja', null)
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Trae todos los trabajadores disponibles (activos, sin fecha de baja).
   * Útil para los selects de asignación.
   *
   * @returns Lista de perfiles con rol trabajador
   */
  async getAvailableTrabajadores(): Promise<Perfil[]> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id_rol', 4)
      .is('fecha_baja', null)
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Trae las notificaciones de un usuario, ordenadas de más nueva a más antigua.
   *
   * @param userId - UUID del destinatario
   * @returns Lista de notificaciones
   */
  async getNotificaciones(userId: string) {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('id_destinatario', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Marca una notificación como leída.
   *
   * @param notifId - Id de la notificación
   */
  async markNotificacionLeida(notifId: number): Promise<void> {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id_notificacion', notifId);
    if (error) throw error;
  },

  /**
   * Marca todas las notificaciones no leídas de un usuario como leídas.
   */
  async markAllNotificacionesLeidas(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id_destinatario', userId)
      .eq('leida', false);
    if (error) throw error;
  },
};
