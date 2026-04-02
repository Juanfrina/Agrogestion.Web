/**
 * @file AuthContext.tsx
 * @description Proveedor de autenticación — el "guardián" de la sesión.
 *
 * Este componente envuelve toda la app y se encarga de:
 *   1. Comprobar si ya hay sesión al cargar la página (getSession explícito)
 *   2. Escuchar cambios de auth (login, logout, refresh de token)
 *   3. Sincronizar todo con el store de Zustand para que la app entera se entere
 *
 * Estrategia:
 *   - Usamos getSession() para la carga inicial (fiable con StrictMode y HMR)
 *   - onAuthStateChange solo escucha SIGNED_IN, SIGNED_OUT y TOKEN_REFRESHED
 *   - TOKEN_REFRESHED solo actualiza la sesión JWT (sin trabajo asíncrono)
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

    // ── 1. Carga inicial: leemos sesión desde sessionStorage ──
    // Usamos getSession() directamente en vez de depender de INITIAL_SESSION.
    // Esto es más fiable con StrictMode (doble mount) y con HMR de Vite.
    const initAuth = async () => {
      try {
        const session = await AuthRepository.getSession();
        if (!mounted) return;

        if (session?.user) {
          setSession(session);
          try {
            const perfil = await AuthRepository.getPerfil(session.user.id);
            if (mounted && perfil) setPerfil(perfil);
          } catch {
            // Si falla la consulta del perfil pero hay sesión, no rompemos nada
          }
        }
      } catch {
        // Sin sesión válida
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // ── 2. Escuchar cambios de auth en tiempo real ──
    // Solo eventos de runtime (login, logout, refresh). NO usamos INITIAL_SESSION.
    const { data: { subscription } } = AuthRepository.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        const typedSession = session as import('@supabase/supabase-js').Session | null;

        switch (event) {
          // Logout: limpiamos todo
          case 'SIGNED_OUT':
            reset();
            break;

          // Refresh de token (al volver de otra pestaña): solo actualizamos el JWT.
          // El perfil NO cambia cuando se renueva el token —
          // NO hacemos trabajo asíncrono aquí para evitar race conditions.
          case 'TOKEN_REFRESHED':
            if (typedSession) setSession(typedSession);
            break;

          // Login: el usuario acaba de iniciar sesión
          case 'SIGNED_IN':
            if (typedSession?.user) {
              setSession(typedSession);
              // Buscamos el perfil en segundo plano (no bloqueante)
              AuthRepository.getPerfil(typedSession.user.id)
                .then((perfil) => { if (mounted && perfil) setPerfil(perfil); })
                .catch(() => { /* mantener estado existente */ });
              setLoading(false);
            }
            break;

          // INITIAL_SESSION y otros: ignorados (ya los manejamos con initAuth)
          default:
            break;
        }
      }
    );

    return () => {
      mounted = false;
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
