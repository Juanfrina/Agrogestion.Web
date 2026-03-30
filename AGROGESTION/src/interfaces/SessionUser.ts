/**
 * @file SessionUser.ts
 * @description Re-exportación del tipo Session de Supabase y del Perfil.
 *
 * Esto es por comodidad — si algún componente necesita tipar la sesión
 * y el perfil a la vez, puede importar todo desde aquí sin buscar en dos sitios.
 */

export type { Session } from '@supabase/supabase-js';
export type { Perfil } from '../lib/types';
