/**
 * @file authStore.ts
 * @description Store global de autenticación usando Zustand.
 *
 * Este store es como una "caja" donde guardamos el estado de auth de toda la app:
 * la sesión de Supabase, el perfil del usuario y si estamos cargando o no.
 *
 * Cualquier componente puede leer o cambiar estos valores con el hook useAuthStore().
 * Zustand se encarga de que todos los componentes se actualicen automáticamente
 * cuando algo cambia — sin necesidad de pasar props de padre a hijo.
 *
 * @example
 * // Leer el perfil del usuario actual en cualquier componente:
 * const { perfil } = useAuthStore();
 * console.log(perfil?.nombre); // "Juan"
 */

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { Perfil } from '../lib/types';

/**
 * Interfaz que define la forma del store de autenticación.
 *
 * @property session    - La sesión activa de Supabase (null si no hay login)
 * @property perfil     - Datos del perfil del usuario desde la tabla "perfiles"
 * @property loading    - true mientras se comprueba si hay sesión al cargar la app
 * @property setSession - Actualiza la sesión
 * @property setPerfil  - Actualiza el perfil
 * @property setLoading - Cambia el estado de carga
 * @property reset      - Limpia todo (se usa al hacer logout)
 */
interface AuthState {
  session: Session | null;
  perfil: Perfil | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setPerfil: (perfil: Perfil | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

/** Store de autenticación — accesible desde cualquier componente */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial: sin sesión, sin perfil, cargando
  session: null,
  perfil: null,
  loading: true,

  // Setters que actualizan el estado (evitan re-renders si el valor no cambió)
  setSession: (session) => {
    // Solo actualizar si realmente cambió el access_token
    const current = get().session;
    if (current?.access_token !== session?.access_token) {
      set({ session });
    }
  },
  setPerfil: (perfil) => {
    // Solo actualizar si cambió el id del perfil
    const current = get().perfil;
    if (current?.id !== perfil?.id) {
      set({ perfil });
    }
  },
  setLoading: (loading) => {
    if (get().loading !== loading) set({ loading });
  },

  // Limpia todo el estado de auth (para cuando el usuario cierra sesión)
  reset: () => set({ session: null, perfil: null, loading: false }),
}));
