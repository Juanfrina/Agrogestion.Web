/**
 * @file ProtectedRoute.tsx
 * @description Componente guardián de rutas — controla quién puede acceder a cada página.
 *
 * Funciona como un "portero": si no tienes sesión, te manda al login.
 * Si tienes sesión pero tu rol no es el adecuado, te redirige a la landing.
 *
 * Se usa en App.tsx para proteger las rutas de cada rol:
 *   <ProtectedRoute allowedRoles={[Rol.GERENTE]}>
 *     <GerentePage />
 *   </ProtectedRoute>
 *
 * @example
 * // Solo admins pueden entrar aquí:
 * <ProtectedRoute allowedRoles={[1]}><AdminPage /></ProtectedRoute>
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { ReactNode } from 'react';

/**
 * Props del componente ProtectedRoute.
 *
 * @property children     - El componente hijo que se renderiza si pasa las comprobaciones
 * @property allowedRoles - Array opcional de id_rol permitidos (si no se pasa, cualquier usuario logueado puede entrar)
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: number[];
}

/**
 * Componente que protege rutas según autenticación y rol.
 *
 * @param props - children (lo que se renderiza) y allowedRoles (roles permitidos)
 * @returns El children si todo OK, o un Navigate si no tiene acceso
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, perfil, loading } = useAuthStore();

  // Mientras se comprueba la sesión, mostramos un spinner
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando...</span>
      </div>
    );
  }

  // Si no hay sesión → al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión pero el rol no está en la lista de permitidos → a la landing
  if (allowedRoles && perfil && !allowedRoles.includes(perfil.id_rol)) {
    return <Navigate to="/" replace />;
  }

  // Todo correcto — renderizamos el componente hijo
  return <>{children}</>;
}
