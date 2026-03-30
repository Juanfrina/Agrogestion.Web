/**
 * @file TerrenoRepository.ts
 * @description Repositorio de terrenos — todas las operaciones CRUD sobre la tabla "terreno".
 *
 * Aquí centralizamos las consultas a Supabase para terrenos.
 * Ningún componente debería hablar directamente con la BD — siempre pasa por aquí.
 */

import { supabase } from '../supabase/Client';
import type { Terreno, TerrenoFormData } from '../../interfaces/Terreno';

export const TerrenoRepository = {
  /**
   * Trae todos los terrenos de un gestor (gerente) que no estén dados de baja.
   *
   * @param gestorId - UUID del gerente/gestor
   * @returns Lista de terrenos activos del gestor
   * @throws Error si la consulta falla
   */
  async getByGestor(gestorId: string): Promise<Terreno[]> {
    const { data, error } = await supabase
      .from('terreno')
      .select('*, gestor:perfiles!id_gestor(nombre, apellidos)')
      .eq('id_gestor', gestorId)
      .is('fecha_baja', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Trae un terreno concreto por su id.
   *
   * @param id - Id del terreno
   * @returns El terreno o null si no existe
   * @throws Error si la consulta falla (y no es un "no encontrado")
   */
  async getById(id: number): Promise<Terreno | null> {
    const { data, error } = await supabase
      .from('terreno')
      .select('*, gestor:perfiles!id_gestor(nombre, apellidos)')
      .eq('id_terreno', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Crea un nuevo terreno en la BD.
   *
   * @param gestorId - UUID del gerente que crea el terreno
   * @param data     - Datos del formulario (nombre, ubicacion, tipo_cultivo)
   * @returns El terreno recién creado
   * @throws Error si la inserción falla
   */
  async create(gestorId: string, data: TerrenoFormData): Promise<Terreno> {
    const { data: terreno, error } = await supabase
      .from('terreno')
      .insert({ ...data, id_gestor: gestorId })
      .select()
      .single();
    if (error) throw error;
    return terreno;
  },

  /**
   * Actualiza un terreno existente.
   *
   * @param id   - Id del terreno a actualizar
   * @param data - Campos a modificar (parcial)
   * @returns El terreno actualizado
   * @throws Error si la actualización falla
   */
  async update(id: number, data: Partial<TerrenoFormData>): Promise<Terreno> {
    const { data: terreno, error } = await supabase
      .from('terreno')
      .update(data)
      .eq('id_terreno', id)
      .select()
      .single();
    if (error) throw error;
    return terreno;
  },

  /**
   * Borrado lógico — pone fecha_baja a la fecha actual en vez de eliminar de verdad.
   * Así no se pierde el historial y se puede reactivar si hace falta.
   *
   * @param id - Id del terreno a dar de baja
   * @throws Error si la operación falla
   */
  async softDelete(id: number): Promise<void> {
    const { error } = await supabase
      .from('terreno')
      .update({ fecha_baja: new Date().toISOString() })
      .eq('id_terreno', id);
    if (error) throw error;
  },
};
