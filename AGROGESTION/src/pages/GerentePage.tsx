/**
 * @file GerentePage.tsx
 * @description Panel del Gerente — usa Layout y rutas anidadas para dashboard, terrenos y tareas.
 */

import Layout from '../components/common/Layout';
import GerenteDashboard from '../components/gerente/GerenteDashboard';
import TerrenoList from '../components/gerente/TerrenoList';
import TareaGerenteList from '../components/gerente/TareaGerenteList';
import { Routes, Route } from 'react-router-dom';

/**
 * Página del gerente con rutas anidadas.
 * /gerente → Dashboard, /gerente/terrenos → Terrenos, /gerente/tareas → Tareas.
 *
 * @returns El panel de gerente con Layout y enrutado interno
 */
export default function GerentePage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<GerenteDashboard />} />
        <Route path="terrenos" element={<TerrenoList />} />
        <Route path="tareas" element={<TareaGerenteList />} />
      </Routes>
    </Layout>
  );
}
