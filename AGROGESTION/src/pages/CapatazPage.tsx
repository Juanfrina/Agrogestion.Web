/**
 * @file CapatazPage.tsx
 * @description Panel del Capataz — usa Layout y rutas anidadas para dashboard y tareas.
 */

import Layout from '../components/common/Layout';
import CapatazDashboard from '../components/capataz/CapatazDashboard';
import TareaCapatazList from '../components/capataz/TareaCapatazList';
import { Routes, Route } from 'react-router-dom';

/**
 * Página del capataz con rutas anidadas.
 * /capataz → Dashboard, /capataz/tareas → Lista de tareas.
 *
 * @returns El panel de capataz con Layout y enrutado interno
 */
export default function CapatazPage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<CapatazDashboard />} />
        <Route path="tareas" element={<TareaCapatazList />} />
      </Routes>
    </Layout>
  );
}
