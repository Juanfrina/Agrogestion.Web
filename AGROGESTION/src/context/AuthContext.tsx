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
    // Al montar: miramos si hay sesión guardada en sessionStorage
    AuthRepository.getSession()
      .then(async (session) => {
        if (session?.user) {
          setSession(session);
          try {
            const perfil = await AuthRepository.getPerfil(session.user.id);
            setPerfil(perfil);
          } catch {
            // Si falla traer el perfil, limpiamos todo
            reset();
          }
        }
      })
      .catch(() => {
        // Si falla la sesión, dejamos todo limpio
        reset();
      })
      .finally(() => {
        setLoading(false);
      });

    // Nos suscribimos a los cambios de auth de Supabase
    // Esto se dispara cuando el usuario hace login, logout o se refresca el token
    const { data: { subscription } } = AuthRepository.onAuthStateChange(
      async (event, session) => {
        const typedSession = session as import('@supabase/supabase-js').Session | null;
        setSession(typedSession);

        // Si acaba de hacer login, cargamos su perfil
        if (event === 'SIGNED_IN' && typedSession?.user) {
          try {
            const perfil = await AuthRepository.getPerfil(typedSession.user.id);
            setPerfil(perfil);
          } catch {
            // Si falla cargar el perfil en el listener, limpiamos todo
            reset();
          }
        }

        // Si cierra sesión, limpiamos todo el store
        if (event === 'SIGNED_OUT') {
          reset();
        }
      }
    );

    // Al desmontar el componente, nos desuscribimos para evitar memory leaks
    return () => subscription.unsubscribe();
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
