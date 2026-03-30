/**
 * @file EstadoTarea.ts
 * @description Interfaz para los estados de tarea.
 *
 * Esto mapea la tabla "estados_tarea" de la BD.
 * Cada tarea tiene un estado (Pendiente, En progreso, Completada, etc.)
 * y aquí definimos cómo es ese objeto.
 */

/**
 * Estado de una tarea tal cual viene de la tabla "estados_tarea".
 *
 * @property id_estado   - Clave primaria (autoincremental)
 * @property nombre      - Nombre del estado (ej: "Pendiente", "En progreso")
 * @property descripcion - Explicación del estado (puede ser null)
 */
export interface EstadoTarea {
  id_estado: number;
  nombre: string;
  descripcion: string | null;
}
