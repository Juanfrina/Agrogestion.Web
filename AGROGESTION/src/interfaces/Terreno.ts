/**
 * @file Terreno.ts
 * @description Interfaz de Terreno y su formulario.
 *
 * Aquí definimos cómo es un terreno en la BD y qué datos
 * se necesitan para crear o editar uno desde el formulario.
 */

/**
 * Terreno completo tal cual viene de la tabla "terreno" en Supabase.
 *
 * @property id_terreno   - Clave primaria (autoincremental)
 * @property nombre       - Nombre del terreno (ej: "Finca El Olivar")
 * @property ubicacion    - Dónde está (dirección o coordenadas)
 * @property tipo_cultivo - Qué se cultiva ahí (olivo, viña, cereal…)
 * @property estado       - Estado actual del terreno (por defecto "activo")
 * @property id_gestor    - UUID del gerente propietario/gestor
 * @property fecha_baja   - Si no es null, el terreno está dado de baja
 * @property created_at   - Fecha de creación
 * @property gestor       - Join opcional con el perfil del gestor
 */
export interface Terreno {
  id_terreno: number;
  nombre: string;
  ubicacion: string;
  tipo_cultivo: string;
  estado: string;
  id_gestor: string;
  fecha_baja: string | null;
  created_at: string;
  gestor?: { nombre: string; apellidos: string };
}

/**
 * Datos del formulario para crear o editar un terreno.
 * Solo los campos que rellena el usuario — el id_gestor se pone automáticamente.
 *
 * @property nombre       - Nombre del terreno
 * @property ubicacion    - Ubicación del terreno
 * @property tipo_cultivo - Tipo de cultivo
 */
export interface TerrenoFormData {
  nombre: string;
  ubicacion: string;
  tipo_cultivo: string;
}
