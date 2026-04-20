/**
 * @file AuthRepository.ts
 * @description Repositorio de autenticación — todas las operaciones de auth en un solo sitio.
 *
 * Este archivo es el "puente" entre la app y Supabase Auth + tabla perfiles.
 * Centraliza login, registro, logout, consulta de perfil, etc.
 *
 * La idea es que los componentes NUNCA hablen directamente con Supabase.
 * Siempre pasan por aquí — así si mañana cambiamos el backend, solo tocamos esto.
 */

import { supabase } from '../supabase/Client';
import type { Perfil, RegistroData } from '../../lib/types';

export const AuthRepository = {
  /**
   * Registra un nuevo usuario en la app.
   * Supabase Auth crea la cuenta y encripta la contraseña.
   * El trigger on_auth_user_created se encarga de crear el perfil en la tabla "perfiles".
   *
   * @param data - Datos del formulario de registro (nombre, email, password, rol, etc.)
   * @returns Los datos de autenticación (user, session)
   * @throws Error si el email ya existe o hay problemas con Supabase
   */
  async signUp(data: RegistroData) {
    const { password, ...metadata } = data;
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password,
      options: {
        // Estos metadatos los recoge el trigger para crear el perfil automáticamente
        data: metadata,
      },
    });
    if (error) throw error;
    return authData;
  },

  /**
   * Inicia sesión con email y contraseña.
   * Supabase compara el hash bcrypt internamente y devuelve una sesión JWT.
   *
   * @param email    - Email del usuario
   * @param password - Contraseña en texto plano (Supabase la verifica contra el hash)
   * @returns Sesión activa con tokens de acceso
   * @throws Error si las credenciales son incorrectas
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Cierra la sesión actual. Invalida los tokens JWT del usuario.
   * Después de esto, cualquier petición a Supabase será rechazada.
   *
   * @throws Error si no se puede cerrar sesión
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Obtiene la sesión actual (si existe).
   * Útil para saber si el usuario ya tiene login al cargar la app.
   *
   * @returns La sesión activa o null si no hay login
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Trae el perfil completo de un usuario desde la tabla "perfiles".
   * Solo devuelve usuarios activos (fecha_baja IS NULL).
   *
   * @param userId - UUID del usuario (viene de auth.users)
   * @returns El perfil del usuario, o null si no existe / está dado de baja
   * @throws Error si hay problemas con la consulta (que no sea "no encontrado")
   */
  async getPerfil(userId: string): Promise<Perfil | null> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .is('fecha_baja', null)
      .single();
    if (error) {
      // PGRST116 = "no se encontró ninguna fila" — es normal si el perfil aún no existe
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Actualiza los datos del perfil de un usuario.
   * La política RLS "perfiles_update_self" asegura que solo puedas editar el tuyo.
   *
   * @param userId  - UUID del usuario a actualizar
   * @param updates - Campos a modificar (solo los que cambien)
   * @returns El perfil actualizado
   * @throws Error si no tienes permisos o hay error en la BD
   */
  async updatePerfil(userId: string, updates: Partial<Perfil>) {
    const { data, error } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Perfil;
  },

  /**
   * Cambia la contraseña del usuario autenticado.
   * Supabase se encarga de re-encriptarla con bcrypt.
   *
   * @param newPassword - La nueva contraseña en texto plano
   * @throws Error si la contraseña no cumple los requisitos
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  /**
   * Cambia el email del usuario autenticado.
   * Actualiza tanto en auth.users (Supabase Auth) como en la tabla perfiles.
   *
   * @param userId   - UUID del usuario
   * @param newEmail - Nuevo email
   * @throws Error si el email ya está en uso o hay error
   */
  async updateEmail(userId: string, newEmail: string) {
    // 1. Actualizar en Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (authError) throw authError;

    // 2. Actualizar en la tabla perfiles
    const { error: dbError } = await supabase
      .from('perfiles')
      .update({ email: newEmail })
      .eq('id', userId);
    if (dbError) throw dbError;
  },

  /**
   * Comprueba si un email ya está registrado en la app.
   * Llama a la función RPC "is_email_taken" que definimos en la BD.
   * Es SECURITY DEFINER, así que funciona sin importar el rol del que pregunta.
   *
   * @param email - Email a comprobar
   * @returns true si el email ya está pillado, false si está libre
   */
  async isEmailTaken(email: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('is_email_taken', {
      email_to_check: email,
    });
    if (error) throw error;
    return data as boolean;
  },

  /**
   * Envía un email de recuperación de contraseña al correo indicado.
   * Supabase genera un enlace mágico que, al pulsarlo, crea una sesión
   * temporal con evento PASSWORD_RECOVERY.
   *
   * @param email      - Email del usuario que quiere recuperar su contraseña
   * @param redirectTo - URL a la que redirigir tras pulsar el enlace del email
   * @throws Error si no se puede enviar el email
   */
  async resetPasswordForEmail(email: string, redirectTo: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  },

  /**
   * Escucha cambios en el estado de autenticación (login, logout, refresh token...).
   * Supabase lanza eventos cuando algo cambia y nosotros reaccionamos actualizando el store.
   *
   * @param callback - Función que se ejecuta cada vez que cambia el estado de auth
   * @returns Suscripción — hay que llamar a .unsubscribe() al desmontar el componente
   */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
