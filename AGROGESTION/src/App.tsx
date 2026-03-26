/**
 * @file App.tsx
 * @description Componente raíz de Agrogestión — aquí se define todo el enrutado.
 *
 * La app funciona así:
 *   - Rutas públicas: Landing (/), Login (/login), Registro (/registro)
 *   - Ruta comodín:  /dashboard → te redirige a la página de tu rol
 *   - Rutas protegidas: /admin, /gerente, /capataz, /trabajador
 *
 * El AuthProvider envuelve todo para mantener la sesión sincronizada.
 * ProtectedRoute se encarga de que nadie entre donde no debe.
 * PublicRoute evita que un usuario logueado vea el login otra vez.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { Rol } from './lib/types';
import Login from './pages/Login';
import Registro from './pages/Registro';
import LandingPage from './pages/LandigPage';
import AdminPage from './pages/AdminPage';
import GerentePage from './pages/GerentePage';
import CapatazPage from './pages/CapatazPage';
import TrabajadorPage from './pages/TrabajadorPage';

/**
 * Componente interno que redirige al usuario a la página de su rol.
 * Se usa en la ruta /dashboard — cuando alguien hace login, llega aquí
 * y automáticamente lo mandamos a /admin, /gerente, /capataz o /trabajador.
 *
 * @returns Un Navigate hacia la ruta que le corresponde al usuario
 */
function RedirectByRole() {
  const { perfil, loading } = useAuthStore();

  // Mientras cargamos, mostramos el spinner bonito
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando...</span>
      </div>
    );
  }

  // Sin perfil = algo raro pasó, al login
  if (!perfil) return <Navigate to="/login" replace />;

  // Redirigimos según el rol del usuario
  switch (perfil.id_rol) {
    case Rol.ADMIN:      return <Navigate to="/admin" replace />;
    case Rol.GERENTE:    return <Navigate to="/gerente" replace />;
    case Rol.CAPATAZ:    return <Navigate to="/capataz" replace />;
    case Rol.TRABAJADOR: return <Navigate to="/trabajador" replace />;
    default:             return <Navigate to="/login" replace />;
  }
}

/**
 * Componente que envuelve las rutas públicas (login, registro).
 * Si el usuario ya tiene sesión activa, lo redirigimos al dashboard
 * en lugar de mostrarle el formulario de login otra vez.
 *
 * @param children - El componente público a renderizar
 * @returns El children si no hay sesión, o un Navigate al dashboard si ya está logueado
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando...</span>
      </div>
    );
  }

  // Si ya tiene sesión, no le dejamos ver el login — al dashboard directamente
  if (session) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

/**
 * Componente principal de la aplicación.
 * Monta el Router, el AuthProvider y define todas las rutas.
 *
 * @returns La app completa con enrutado y autenticación
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Rutas públicas (accesibles sin login) ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />

          {/* ── Ruta comodín: te lleva a la página de tu rol ── */}
          <Route path="/dashboard" element={<ProtectedRoute><RedirectByRole /></ProtectedRoute>} />

          {/* ── Rutas protegidas por rol ── */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={[Rol.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/gerente/*" element={
            <ProtectedRoute allowedRoles={[Rol.GERENTE]}>
              <GerentePage />
            </ProtectedRoute>
          } />
          <Route path="/capataz/*" element={
            <ProtectedRoute allowedRoles={[Rol.CAPATAZ]}>
              <CapatazPage />
            </ProtectedRoute>
          } />
          <Route path="/trabajador/*" element={
            <ProtectedRoute allowedRoles={[Rol.TRABAJADOR]}>
              <TrabajadorPage />
            </ProtectedRoute>
          } />

          {/* ── Ruta 404: cualquier URL que no exista → a la landing ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
