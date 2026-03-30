import { supabase } from '../Client';

/**
 * Comprueba si un email ya está registrado usando la RPC de Supabase.
 * Devuelve true si el correo ya existe en la base de datos.
 */
export async function isEmailTaken(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_email_taken', { email_to_check: email });
  if (error) throw error;
  return data as boolean;
}
