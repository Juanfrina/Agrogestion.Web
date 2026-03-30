/**
 * @file AdminDashboard.tsx
 * @description Dashboard del administrador — muestra las estadísticas generales del sistema.
 *
 * Aquí se ven los totales de usuarios, cuántos hay por rol, etc.
 * Todo se carga al montar el componente con useEffect.
 */

import { useState, useEffect } from 'react';
import { AdminRepository } from '../../database/repositories/AdminRepository';
import Card from '../cards/Card';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/** Tipo para las estadísticas que devuelve el repo */
interface Stats {
  totalUsuarios: number;
  admins: number;
  gerentes: number;
  capataces: number;
  trabajadores: number;
}

/**
 * Dashboard principal del admin.
 * Muestra tarjetas con las estadísticas de usuarios del sistema.
 *
 * @returns El panel de estadísticas del administrador
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** Carga las estadísticas al montar el componente */
  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await AdminRepository.getStats();
        setStats(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar estadísticas';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, []);

  if (loading) return <Spinner size="lg" text="Cargando estadísticas..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!stats) return <Alert type="warning" message="No hay datos disponibles" />;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Panel de Administración</h2>

      {/* Tarjetas con las estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Total Usuarios">
          <p className="text-3xl font-bold">{stats.totalUsuarios}</p>
        </Card>
        <Card title="Administradores">
          <p className="text-3xl font-bold">{stats.admins}</p>
        </Card>
        <Card title="Gerentes">
          <p className="text-3xl font-bold">{stats.gerentes}</p>
        </Card>
        <Card title="Capataces">
          <p className="text-3xl font-bold">{stats.capataces}</p>
        </Card>
        <Card title="Trabajadores">
          <p className="text-3xl font-bold">{stats.trabajadores}</p>
        </Card>
      </div>
    </div>
  );
}
