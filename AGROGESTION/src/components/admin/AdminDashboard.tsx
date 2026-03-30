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
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--color-primary-dark)',
        marginBottom: '1.5rem',
      }}>
        {t('admin.panelTitle')}
      </h2>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <Spinner size="lg" text={t('admin.loadingStats')} />
        </div>
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {!loading && !error && stats && (
        <>
          {/* Tarjetas con las estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <Card>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {t('admin.totalUsers')}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                {stats.total}
              </p>
            </Card>
            <Card>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {t('roles.admin')}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#283593' }}>
                {stats.admins}
              </p>
            </Card>
            <Card>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {t('roles.gerente')}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {stats.gerentes}
              </p>
            </Card>
            <Card>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {t('roles.capataz')}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                {stats.capataces}
              </p>
            </Card>
            <Card>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {t('roles.trabajador')}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-earth)' }}>
                {stats.trabajadores}
              </p>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            {t('admin.quickActions')}
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
