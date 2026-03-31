/**
 * @file TrabajadorPage.tsx
 * @description Panel del Trabajador — usa Layout y rutas anidadas para dashboard y tareas.
 */

import Layout from '../components/common/Layout';
import TrabajadorDashboard from '../components/trabajador/TrabajadorDashboard';
import MisTareasList from '../components/trabajador/MisTareasList';
import { Routes, Route } from 'react-router-dom';

/**
 * Página del trabajador con rutas anidadas.
 * /trabajador → Dashboard, /trabajador/tareas → Mis tareas.
 *
 * @returns El panel de trabajador con Layout y enrutado interno
 */
export default function TrabajadorPage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<TrabajadorDashboard />} />
        <Route path="mis-tareas" element={<MisTareasList />} />
      </Routes>
    </Layout>
  );
}
