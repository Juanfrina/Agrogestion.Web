/**
 * @file Tarea.ts
 * @description Interfaz de Tarea y su formulario.
 *
 * Aquí definimos cómo es una tarea tal cual viene de la BD,
 * incluyendo las relaciones opcionales que traen los joins
 * (terreno, gerente, capataz, estado).
 *
 * TareaFormData es la versión "light" que se usa en los formularios
 * — solo los campos que el usuario rellena, sin ids generados ni fechas automáticas.
 */

/**
 * Tarea completa tal cual viene de la tabla "tarea" en Supabase.
 *
 * @property id_tarea    - Clave primaria (autoincremental)
 * @property nombre      - Nombre descriptivo de la tarea
 * @property descripcion - Explicación detallada (puede ser null)
 * @property fecha_inicio - Cuándo empieza la tarea (formato DATE)
 * @property fecha_fin    - Cuándo debería terminar
 * @property id_terreno   - FK al terreno donde se realiza
 * @property id_gerente   - UUID del gerente que la creó
 * @property id_capataz   - UUID del capataz asignado (null si aún no tiene)
 * @property id_estado    - FK al estado actual (1=Pendiente, 2=En progreso, etc.)
 * @property fecha_baja   - Si no es null, la tarea está eliminada lógicamente
 * @property created_at   - Fecha de creación
 * @property updated_at   - Última modificación
 * @property terreno      - Join opcional con la tabla terreno
 * @property gerente      - Join opcional con el perfil del gerente
 * @property capataz      - Join opcional con el perfil del capataz
 * @property estado       - Join opcional con la tabla estados_tarea
 */
export interface Tarea {
  id_tarea: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  id_terreno: number;
  id_gerente: string;
  id_capataz: string | null;
  id_estado: number;
  fecha_baja: string | null;
  created_at: string;
  updated_at: string;
  /** Relaciones opcionales que vienen en joins */
  terreno?: { nombre: string };
  gerente?: { nombre: string; apellidos: string };
  capataz?: { nombre: string; apellidos: string };
  estado?: { nombre: string };
}

/**
 * Datos del formulario para crear o editar una tarea.
 * Solo lo que rellena el usuario — el id_gerente y el estado se asignan automáticamente.
 *
 * @property nombre       - Nombre de la tarea
 * @property descripcion  - Explicación de qué hay que hacer
 * @property fecha_inicio - Fecha de inicio (string ISO)
 * @property fecha_fin    - Fecha límite
 * @property id_terreno   - Terreno donde se hará la tarea
 * @property id_capataz   - Capataz asignado (opcional, se puede asignar después)
 */
export interface TareaFormData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_terreno: number;
  id_capataz?: string;
}
