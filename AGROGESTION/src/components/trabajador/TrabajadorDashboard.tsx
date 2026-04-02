/**
 * @file TrabajadorDashboard.tsx
 * @description Dashboard del trabajador — resumen de sus tareas y asignaciones recientes.
 *
 * Muestra estadísticas rápidas de las tareas del trabajador
 * y las últimas asignaciones que ha recibido.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Tarea } from '../../interfaces/Tarea';
import Card from '../cards/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/** Tarea aplanada con estado de asignación del trabajador */
interface TareaConAsignacion extends Tarea {
  estadoAsignacion: string;
}

export default function TrabajadorDashboard() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tareas, setTareas] = useState<TareaConAsignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!perfil) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await TareaRepository.getTareasByTrabajador(perfil.id);
        if (!cancelled) {
          const aplanadas: TareaConAsignacion[] = data.map((row: Record<string, unknown>) => ({
            ...(row.tarea as Tarea),
            estadoAsignacion: row.estado as string,
          }));
          setTareas(aplanadas);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message
            : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
            : t('tarea.errorLoad');
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    cargar();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil?.id]);

  if (loading) return <Spinner size="lg" text={t('tarea.loadingTasks')} />;
  if (error) return <Alert type="error" message={error} />;

  /** Cuenta tareas por estado de la tarea */
  const contar = (estado: string) => tareas.filter((t) => t.estado?.nombre === estado).length;

  /** Últimas asignaciones recientes */
  const recientes = [...tareas]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('nav.dashboard')} — {t('nav.misTareas')}</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title={t('tarea.statusPendiente')}>
          <p className="text-3xl font-bold">{contar('PENDIENTE') + contar('ASIGNADA')}</p>
        </Card>
        <Card title={t('tarea.statusEnProgreso')}>
          <p className="text-3xl font-bold">{contar('EN_PROGRESO')}</p>
        </Card>
        <Card title={t('tarea.statusCompletada')}>
          <p className="text-3xl font-bold">{contar('COMPLETADA')}</p>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Button variant="primary" onClick={() => navigate('/trabajador/mis-tareas')}>
        {t('nav.misTareas')}
      </Button>

      {/* Asignaciones recientes */}
      {recientes.length > 0 && (
        <div>
          <h3 className="mb-3 text-xl font-semibold">{t('tarea.myTasks')}</h3>
          <div className="space-y-2">
            {recientes.map((tarea) => (
              <Card key={tarea.id_tarea}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong>{tarea.nombre}</strong>
                    <span className="text-sm text-(--color-text-muted)">
                      {tarea.terreno?.nombre}
                    </span>
                  </div>
                  <Badge variant={tarea.estado?.nombre === 'COMPLETADA' ? 'success' : 'warning'}>
                    {tarea.estado?.nombre ?? 'PENDIENTE'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
