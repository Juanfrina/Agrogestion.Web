/**
 * @file TareaRepository.ts
 * @description Repositorio de tareas — todo lo que toca la tabla "tarea" y sus relaciones.
 *
 * Este es el repositorio más gordo porque las tareas tienen muchas operaciones:
 * CRUD básico, asignar capataz/trabajador, comentarios, cambiar estado, etc.
 *
 * Como siempre, los componentes nunca hablan directo con Supabase — pasan por aquí.
 */

import { supabase } from '../supabase/Client';
import type { Tarea, TareaFormData } from '../../interfaces/Tarea';
import { ESTADOS_TAREA } from '../../lib/constants';

/** Query de selección con todos los joins típicos de una tarea */
const TAREA_SELECT = `
  *,
  terreno:terreno!id_terreno(nombre),
  gerente:perfiles!id_gerente(nombre, apellidos),
  capataz:perfiles!id_capataz(nombre, apellidos),
  estado:estados_tarea!id_estado(nombre)
`;

export const TareaRepository = {
  /**
   * Trae todas las tareas de un gerente (las que él ha creado) con joins.
   *
   * @param gerenteId - UUID del gerente
   * @returns Lista de tareas activas del gerente
   */
  async getByGerente(gerenteId: string): Promise<Tarea[]> {
    const { data, error } = await supabase
      .from('tarea')
      .select(TAREA_SELECT)
      .eq('id_gerente', gerenteId)
      .is('fecha_baja', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Trae todas las tareas asignadas a un capataz con joins.
   *
   * @param capatazId - UUID del capataz
   * @returns Lista de tareas asignadas al capataz
   */
  async getByCapataz(capatazId: string): Promise<Tarea[]> {
    const { data, error } = await supabase
      .from('tarea')
      .select(TAREA_SELECT)
      .eq('id_capataz', capatazId)
      .is('fecha_baja', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Trae una tarea concreta por su id con todos los joins.
   *
   * @param id - Id de la tarea
   * @returns La tarea completa o null si no existe
   */
  async getById(id: number): Promise<Tarea | null> {
    const { data, error } = await supabase
      .from('tarea')
      .select(TAREA_SELECT)
      .eq('id_tarea', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Crea una nueva tarea. El estado inicial es 1 (Pendiente).
   *
   * @param gerenteId - UUID del gerente que crea la tarea
   * @param data      - Datos del formulario
   * @returns La tarea recién creada
   */
  async create(gerenteId: string, data: TareaFormData): Promise<Tarea> {
    const { data: tarea, error } = await supabase
      .from('tarea')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        id_terreno: data.id_terreno,
        id_gerente: gerenteId,
        id_capataz: data.id_capataz ?? null,
        id_estado: data.id_capataz ? ESTADOS_TAREA.ASIGNADA : ESTADOS_TAREA.PENDIENTE,
      })
      .select()
      .single();
    if (error) throw error;
    return tarea;
  },

  /**
   * Actualiza campos de una tarea existente.
   *
   * @param id      - Id de la tarea
   * @param updates - Campos a modificar
   * @returns La tarea actualizada
   */
  async update(id: number, updates: Partial<Tarea>): Promise<Tarea> {
    const { data, error } = await supabase
      .from('tarea')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id_tarea', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Asigna un capataz a una tarea y cambia su estado a 2 (En progreso).
   *
   * @param tareaId   - Id de la tarea
   * @param capatazId - UUID del capataz a asignar
   */
  async assignCapataz(tareaId: number, capatazId: string): Promise<void> {
    const { error } = await supabase
      .from('tarea')
      .update({
        id_capataz: capatazId,
        id_estado: 2,
        updated_at: new Date().toISOString(),
      })
      .eq('id_tarea', tareaId);
    if (error) throw error;
  },

  /**
   * Cambia el estado de una tarea (Pendiente, En progreso, Completada, etc.).
   *
   * @param tareaId  - Id de la tarea
   * @param estadoId - Nuevo id de estado
   */
  async updateEstado(tareaId: number, estadoId: number): Promise<void> {
    const { error } = await supabase
      .from('tarea')
      .update({
        id_estado: estadoId,
        updated_at: new Date().toISOString(),
      })
      .eq('id_tarea', tareaId);
    if (error) throw error;
  },

  /**
   * Añade un comentario a una tarea.
   *
   * @param tareaId   - Id de la tarea
   * @param autorId   - UUID del autor del comentario
   * @param contenido - Texto del comentario
   */
  async addComment(tareaId: number, autorId: string, contenido: string): Promise<void> {
    const { error } = await supabase
      .from('comentarios_tarea')
      .insert({ id_tarea: tareaId, id_autor: autorId, contenido });
    if (error) throw error;
  },

  /**
   * Trae todos los comentarios de una tarea, ordenados del más antiguo al más reciente.
   * Incluye el nombre y apellidos del autor de cada comentario.
   *
   * @param tareaId - Id de la tarea
   * @returns Lista de comentarios con info del autor
   */
  async getComments(tareaId: number) {
    const { data, error } = await supabase
      .from('comentarios_tarea')
      .select('*, autor:perfiles!id_autor(nombre, apellidos)')
      .eq('id_tarea', tareaId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Asigna un trabajador a una tarea. El capataz es quien hace la asignación.
   * El estado inicial de la asignación es "PENDIENTE" (el trabajador aún no ha respondido).
   *
   * @param tareaId       - Id de la tarea
   * @param trabajadorId  - UUID del trabajador
   * @param capatazId     - UUID del capataz que asigna
   */
  async assignTrabajador(tareaId: number, trabajadorId: string, capatazId: string): Promise<void> {
    const { error } = await supabase
      .from('tarea_trabajador')
      .insert({
        id_tarea: tareaId,
        id_trabajador: trabajadorId,
        id_capataz_asigna: capatazId,
        estado: 'PENDIENTE',
      });
    if (error) throw error;
  },

  /**
   * Reasigna un trabajador que había rechazado (actualiza RECHAZADA → PENDIENTE).
   */
  async reassignTrabajador(tareaId: number, trabajadorId: string): Promise<void> {
    const { error } = await supabase
      .from('tarea_trabajador')
      .update({
        estado: 'PENDIENTE',
        fecha_respuesta: null,
      })
      .eq('id_tarea', tareaId)
      .eq('id_trabajador', trabajadorId);
    if (error) throw error;
  },

  /**
   * Trae los trabajadores asignados a una tarea con sus datos de perfil.
   *
   * @param tareaId - Id de la tarea
   * @returns Lista de asignaciones con info del trabajador
   */
  async getTrabajadoresByTarea(tareaId: number) {
    const { data, error } = await supabase
      .from('tarea_trabajador')
      .select('*, trabajador:perfiles!id_trabajador(id, nombre, apellidos, email)')
      .eq('id_tarea', tareaId)
      .is('fecha_baja', null);
    if (error) throw error;
    return data ?? [];
  },

  /**
   * El trabajador acepta o rechaza una asignación de tarea.
   *
   * @param tareaId      - Id de la tarea
   * @param trabajadorId - UUID del trabajador
   * @param aceptar      - true si acepta, false si rechaza
   */
  async respondTrabajadorAssignment(
    tareaId: number,
    trabajadorId: string,
    aceptar: boolean,
  ): Promise<void> {
    const { error } = await supabase
      .from('tarea_trabajador')
      .update({
        estado: aceptar ? 'ACEPTADA' : 'RECHAZADA',
        fecha_respuesta: new Date().toISOString(),
      })
      .eq('id_tarea', tareaId)
      .eq('id_trabajador', trabajadorId);
    if (error) throw error;
  },

  /**
   * El trabajador marca su asignación como completada.
   *
   * @param tareaId      - Id de la tarea
   * @param trabajadorId - UUID del trabajador
   */
  async completeTrabajadorAssignment(
    tareaId: number,
    trabajadorId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('tarea_trabajador')
      .update({
        estado: 'COMPLETADA',
        fecha_respuesta: new Date().toISOString(),
      })
      .eq('id_tarea', tareaId)
      .eq('id_trabajador', trabajadorId);
    if (error) throw error;
  },

  /**
   * Trae todas las tareas asignadas a un trabajador con los datos completos de cada tarea.
   *
   * @param trabajadorId - UUID del trabajador
   * @returns Lista de asignaciones con la tarea completa embebida
   */
  async getTareasByTrabajador(trabajadorId: string) {
    const { data, error } = await supabase
      .from('tarea_trabajador')
      .select(`
        *,
        tarea:tarea!id_tarea(
          ${TAREA_SELECT}
        )
      `)
      .eq('id_trabajador', trabajadorId)
      .is('fecha_baja', null);
    if (error) throw error;
    return data ?? [];
  },
};
