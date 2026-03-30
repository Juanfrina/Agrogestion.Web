/**
 * @file Client.ts
 * @description Cliente de Supabase — la conexión principal con nuestra base de datos.
 *
 * Usa sessionStorage para que la sesión se borre al cerrar el navegador/pestaña.
 *
 * @requires VITE_SUPABASE_URL — La URL de tu proyecto en Supabase
 * @requires VITE_SUPABASE_ANON_KEY — La clave pública (anon) de Supabase
 */

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: sessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);