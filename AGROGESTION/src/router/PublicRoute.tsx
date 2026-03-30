/**
 * @file PublicRoute.tsx
 * @description Ruta pública — si ya estás logueado, te manda al dashboard directamente.
 *
 * Envuelve las rutas de login y registro para que un usuario
 * con sesión activa no vea esos formularios otra vez.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/** Props del componente */
interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper para rutas públicas.
 * Si el usuario ya tiene sesión, lo redirige a /dashboard.
 *
 * @param children - El componente público a renderizar
 * @returns El children si no hay sesión, o Navigate si ya está logueado
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { session, perfil, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando...</span>
      </div>
    );
  }

  // Solo redirigimos si tiene sesión Y perfil cargado (evita loop si perfil aún no llegó)
  if (session && perfil) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
