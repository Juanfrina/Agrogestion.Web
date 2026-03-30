/**
 * @file AdminPage.tsx
 * @description Panel del Administrador — usa Layout y rutas anidadas para dashboard y usuarios.
 */

import Layout from '../components/common/Layout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserTable from '../components/admin/UserTable';
import { Routes, Route } from 'react-router-dom';

/**
 * Página del admin con rutas anidadas.
 * /admin → Dashboard, /admin/usuarios → Tabla de usuarios.
 *
 * @returns El panel de admin con Layout y enrutado interno
 */
export default function AdminPage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<UserTable />} />
      </Routes>
    </Layout>
  );
}
