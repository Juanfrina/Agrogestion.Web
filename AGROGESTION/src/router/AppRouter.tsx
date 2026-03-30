/**
 * @file AppRouter.tsx
 * @description Router principal de Agrogestión — aquí se definen todas las rutas de la app.
 *
 * Usa BrowserRouter, envuelve todo con AuthProvider y define:
 *   - Rutas públicas (landing, login, registro)
 *   - Ruta /dashboard que redirige según el rol del usuario
 *   - Rutas protegidas por rol (admin, gerente, capataz, trabajador)
 *   - Ruta de perfil (cualquier usuario autenticado)
 *   - Ruta 404 → vuelve a la landing
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { useAuthStore } from '../store/authStore';
import { Rol } from '../lib/types';

// Páginas
import LandingPage from '../pages/LandigPage';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import AdminPage from '../pages/AdminPage';
import GerentePage from '../pages/GerentePage';
import CapatazPage from '../pages/CapatazPage';
import TrabajadorPage from '../pages/TrabajadorPage';

// Componentes que no son páginas pero se usan en rutas
import Profile from '../components/profile/Profile';
import Layout from '../components/common/Layout';

/**
 * Componente interno que redirige al usuario a la página de su rol.
 * Se usa en /dashboard — al hacer login, llegas aquí y te manda a tu panel.
 *
 * @returns Un Navigate a la ruta que corresponde al rol del usuario
 */
function RedirectByRole() {
  const { perfil, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Cargando...</span>
      </div>
    );
  }

  if (!perfil) return <Navigate to="/login" replace />;

  switch (perfil.id_rol) {
    case Rol.ADMIN:      return <Navigate to="/admin" replace />;
    case Rol.GERENTE:    return <Navigate to="/gerente" replace />;
    case Rol.CAPATAZ:    return <Navigate to="/capataz" replace />;
    case Rol.TRABAJADOR: return <Navigate to="/trabajador" replace />;
    default:             return <Navigate to="/login" replace />;
  }
}

/**
 * Router principal de la aplicación.
 * Monta BrowserRouter, AuthProvider y define todas las rutas.
 *
 * @returns La app completa con enrutado y autenticación
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Rutas públicas ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />

          {/* ── Redirección por rol ── */}
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

          {/* ── Perfil (cualquier usuario autenticado) ── */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />

          {/* ── 404 → Landing ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
