/**
 * @file AdminDashboard.tsx
 * @description Dashboard del administrador — muestra las estadísticas generales del sistema.
 *
 * Aquí se ven los totales de usuarios, cuántos hay por rol, etc.
 * Todo se carga al montar el componente con useEffect.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminRepository } from '../../database/repositories/AdminRepository';
import Card from '../cards/Card';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Button from '../ui/Button';

/** Tipo para las estadísticas que devuelve el repo */
interface Stats {
  total: number;
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
  const navigate = useNavigate();
  const { t } = useTranslation();

  /** Carga las estadísticas al montar el componente */
  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await AdminRepository.getStats();
        setStats(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : t('admin.errorLoadStats');
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-(--color-primary-dark) mb-6">
        {t('admin.panelTitle')}
      </h2>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" text={t('admin.loadingStats')} />
        </div>
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {!loading && !error && stats && (
        <>
          {/* Tarjetas con las estadísticas */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-8">
            <Card>
              <p className="stat-label">
                {t('admin.totalUsers')}
              </p>
              <p className="stat-value text-(--color-primary-dark)">
                {stats.total}
              </p>
            </Card>
            <Card>
              <p className="stat-label">
                {t('roles.admin')}
              </p>
              <p className="stat-value text-[#283593]">
                {stats.admins}
              </p>
            </Card>
            <Card>
              <p className="stat-label">
                {t('roles.gerente')}
              </p>
              <p className="stat-value text-(--color-primary)">
                {stats.gerentes}
              </p>
            </Card>
            <Card>
              <p className="stat-label">
                {t('roles.capataz')}
              </p>
              <p className="stat-value text-(--color-accent)">
                {stats.capataces}
              </p>
            </Card>
            <Card>
              <p className="stat-label">
                {t('roles.trabajador')}
              </p>
              <p className="stat-value text-(--color-earth)">
                {stats.trabajadores}
              </p>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4">
            {t('admin.quickActions')}
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" onClick={() => navigate('/admin/usuarios')}>
              {t('admin.manageUsers')}
            </Button>
          </div>
        </>
      )}

      {!loading && !error && !stats && (
        <Alert type="warning" message={t('common.noData')} />
      )}
    </div>
  );
}
