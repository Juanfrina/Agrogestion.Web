/**
 * @file types.ts
 * @description Tipos e interfaces centrales de Agrogestión.
 *
 * Aquí definimos la forma de los datos que maneja la app:
 * cómo es un perfil de usuario, qué datos se necesitan para registrarse,
 * y cuáles son los roles disponibles.
 *
 * Si mañana cambiamos la BD, solo hay que tocar este archivo
 * y TypeScript nos avisará de todo lo que se rompa.
 */

/**
 * Perfil de usuario tal cual viene de la tabla "perfiles" en Supabase.
 * Es la representación completa de un usuario registrado.
 *
 * @property id         - UUID del usuario (viene de auth.users)
 * @property nombre     - Nombre del usuario
 * @property apellidos  - Apellidos del usuario
 * @property dni        - Documento nacional de identidad (9 chars)
 * @property email      - Correo electrónico (único en la BD)
 * @property tlf        - Teléfono de contacto
 * @property direccion  - Dirección postal
 * @property id_rol     - Rol del usuario (1=Admin, 2=Gerente, 3=Capataz, 4=Trabajador)
 * @property fecha_baja - Si no es null, el usuario está dado de baja
 * @property created_at - Fecha de creación del perfil
 */
export interface Perfil {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  tlf: string;
  direccion: string;
  id_rol: number;
  fecha_baja: string | null;
  created_at: string;
}

/**
 * Datos necesarios para registrar un nuevo usuario.
 * Son los mismos campos del perfil + la contraseña.
 * La contraseña NO se guarda en nuestra tabla — Supabase Auth la encripta internamente.
 *
 * @property password - Contraseña en texto plano (Supabase la encripta con bcrypt)
 */
export interface RegistroData {
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  tlf: string;
  direccion: string;
  password: string;
  id_rol: number;
}

/**
 * Enum con los roles de la aplicación.
 * Coinciden exactamente con los id_rol de la tabla "rol" en la BD.
 *
 * - ADMIN (1):      Control total del sistema
 * - GERENTE (2):    Crea terrenos, tareas y asigna capataces
 * - CAPATAZ (3):    Acepta/rechaza tareas, asigna trabajadores
 * - TRABAJADOR (4): Ejecuta las tareas asignadas
 */
export enum Rol {
  ADMIN = 1,
  GERENTE = 2,
  CAPATAZ = 3,
  TRABAJADOR = 4,
}
