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
import RoleDistributionChart from '../charts/RoleDistributionChart';
import MensualChart from '../charts/MensualChart';

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
  const [monthlyData, setMonthlyData] = useState<{ mes: string; valor: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  /** Carga las estadísticas y registros mensuales al montar */
  useEffect(() => {
    const cargar = async () => {
      try {
        const [statsData, monthly] = await Promise.all([
          AdminRepository.getStats(),
          AdminRepository.getMonthlyRegistrations(),
        ]);
        setStats(statsData);
        setMonthlyData(monthly);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : t('admin.errorLoadStats');
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-10">
            <Card className="bg-[#E8F5E9]">
              <p className="stat-label">
                {t('admin.totalUsers')}
              </p>
              <p className="stat-value text-(--color-primary-dark)">
                {stats.total}
              </p>
            </Card>
            <Card className="bg-[#E8EAF6]">
              <p className="stat-label">
                {t('roles.admin')}
              </p>
              <p className="stat-value text-[#283593]">
                {stats.admins}
              </p>
            </Card>
            <Card className="bg-[#F1F8E9]">
              <p className="stat-label">
                {t('roles.gerente')}
              </p>
              <p className="stat-value text-(--color-primary)">
                {stats.gerentes}
              </p>
            </Card>
            <Card className="bg-[#FFF8E1]">
              <p className="stat-label">
                {t('roles.capataz')}
              </p>
              <p className="stat-value text-(--color-accent)">
                {stats.capataces}
              </p>
            </Card>
            <Card className="bg-[#EFEBE9]">
              <p className="stat-label">
                {t('roles.trabajador')}
              </p>
              <p className="stat-value text-(--color-earth)">
                {stats.trabajadores}
              </p>
            </Card>
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
            <Card title={t('admin.roleDistribution')}>
              <RoleDistributionChart
                data={[
                  { label: t('roles.admin'), value: stats.admins, color: '#283593' },
                  { label: t('roles.gerente'), value: stats.gerentes, color: 'var(--color-primary)' },
                  { label: t('roles.capataz'), value: stats.capataces, color: 'var(--color-accent)' },
                  { label: t('roles.trabajador'), value: stats.trabajadores, color: 'var(--color-earth)' },
                ]}
              />
            </Card>
            <Card title={t('admin.monthlyRegistrations')}>
              <MensualChart data={monthlyData} />
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
