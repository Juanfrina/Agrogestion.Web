/**
 * @file Client.ts
 * @description Cliente de Supabase — la conexión principal con nuestra base de datos.
 *
 * Este archivo crea una única instancia del cliente de Supabase que se usará
 * en toda la app. Las credenciales vienen de las variables de entorno (.env).
 *
 * Básicamente es como el "enchufe" que conecta el frontend con Supabase.
 *
 * @requires VITE_SUPABASE_URL — La URL de tu proyecto en Supabase
 * @requires VITE_SUPABASE_ANON_KEY — La clave pública (anon) de Supabase
 */

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);