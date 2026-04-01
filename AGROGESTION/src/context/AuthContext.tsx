/**
 * @file AuthContext.tsx
 * @description Proveedor de autenticación — el "guardián" de la sesión.
 *
 * Este componente envuelve toda la app y se encarga de:
 *   1. Comprobar si ya hay sesión al cargar la página (por si el usuario ya tenía login)
 *   2. Escuchar cambios de auth (login, logout, refresh de token)
 *   3. Sincronizar todo con el store de Zustand para que la app entera se entere
 *
 * Se coloca en App.tsx envolviendo a las rutas:
 *   <AuthProvider><Routes>...</Routes></AuthProvider>
 *
 * Los componentes hijos no necesitan importar esto directamente,
 * simplemente usan useAuthStore() para leer sesión/perfil.
 */

import { useEffect, createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthRepository } from '../database/repositories/AuthRepository';

/** El contexto en sí — de momento solo lo usamos como "wrapper" */
const AuthContext = createContext<null>(null);

/**
 * Componente Provider que gestiona el ciclo de vida de la autenticación.
 * Se monta una vez al arrancar la app y se mantiene vivo todo el rato.
 *
 * @param children - Los componentes hijos que tendrán acceso al contexto de auth
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { setSession, setPerfil, setLoading, reset } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // Usamos SOLO onAuthStateChange — Supabase v2 lanza INITIAL_SESSION
    // como primer evento, así que no necesitamos getSession() por separado.
    // Esto elimina la condición de carrera que causaba el loading infinito.
    const { data: { subscription } } = AuthRepository.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        const typedSession = session as import('@supabase/supabase-js').Session | null;

        // Si cierra sesión, limpiamos todo el store
        if (event === 'SIGNED_OUT') {
          reset();
          return;
        }

        // Para cualquier evento con sesión válida, sincronizamos sesión + perfil
        if (typedSession?.user) {
          setSession(typedSession);
          try {
            const perfil = await AuthRepository.getPerfil(typedSession.user.id);
            if (mounted) setPerfil(perfil);
          } catch {
            if (mounted) reset();
          }
        }

        if (mounted) setLoading(false);
      }
    );

    // Safety net: si onAuthStateChange nunca dispara (p.ej. error de red),
    // aseguramos que loading se ponga a false tras 5 segundos para no bloquear la UI
    const timeout = setTimeout(() => {
      if (mounted && useAuthStore.getState().loading) {
        setLoading(false);
      }
    }, 5000);

    // Al desmontar el componente, nos desuscribimos para evitar memory leaks
    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [setSession, setPerfil, setLoading, reset]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook para acceder al contexto de auth (por si lo necesitamos en el futuro) */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
