/**
 * @file GerenteDashboard.tsx
 * @description Dashboard del gerente — resumen rápido de terrenos, tareas y accesos directos.
 *
 * Muestra estadísticas generales (cuántos terrenos, tareas y su estado)
 * y las últimas 5 tareas creadas. También tiene botones rápidos para crear cosas.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { TerrenoRepository } from '../../database/repositories/TerrenoRepository';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Terreno } from '../../interfaces/Terreno';
import type { Tarea } from '../../interfaces/Tarea';
import Card from '../cards/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/**
 * Dashboard principal del gerente.
 * Muestra estadísticas, tareas recientes y acciones rápidas.
 *
 * @returns El panel de resumen del gerente
 */
export default function GerenteDashboard() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** Carga terrenos y tareas del gerente al montar */
  useEffect(() => {
    if (!perfil) return;
    const cargar = async () => {
      try {
        const [terrenosData, tareasData] = await Promise.all([
          TerrenoRepository.getByGestor(perfil.id),
          TareaRepository.getByGerente(perfil.id),
        ]);
        setTerrenos(terrenosData);
        setTareas(tareasData);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message
          : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
          : 'Error al cargar datos';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [perfil]);

  if (loading) return <Spinner size="lg" text={t('dashboard.loadingDashboard')} />;
  if (error) return <Alert type="error" message={error} />;

  /** Cuenta tareas por estado */
  const tareasEstado = (nombreEstado: string) =>
    tareas.filter((t) => t.estado?.nombre === nombreEstado).length;

  /** Últimas 5 tareas ordenadas por fecha de creación */
  const tareasRecientes = [...tareas]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">{t('dashboard.title')}</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title={t('dashboard.terrenos')}>
          <p className="text-3xl font-bold">{terrenos.length}</p>
        </Card>
        <Card title={t('dashboard.totalTareas')}>
          <p className="text-3xl font-bold">{tareas.length}</p>
        </Card>
        <Card title={t('dashboard.inProgress')}>
          <p className="text-3xl font-bold">{tareasEstado('EN_PROGRESO')}</p>
        </Card>
        <Card title={t('dashboard.completed')}>
          <p className="text-3xl font-bold">{tareasEstado('COMPLETADA')}</p>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => navigate('/gerente/terrenos')}>
          {t('terreno.newTerreno')}
        </Button>
        <Button variant="accent" onClick={() => navigate('/gerente/tareas')}>
          {t('tarea.newTask')}
        </Button>
      </div>

      {/* Tareas recientes */}
      <div>
        <h3 className="mb-3 text-xl font-semibold">{t('dashboard.recentTasks')}</h3>
        {tareasRecientes.length === 0 ? (
          <p className="text-(--color-text-muted)">{t('dashboard.noTasks')}</p>
        ) : (
          <div className="space-y-2">
            {tareasRecientes.map((tarea) => (
              <Card key={tarea.id_tarea}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong>{tarea.nombre}</strong>
                    <span className="text-sm text-(--color-text-muted)">
                      {tarea.terreno?.nombre ?? t('dashboard.noTerreno')}
                    </span>
                  </div>
                  <Badge variant={tarea.estado?.nombre === 'COMPLETADA' ? 'success' : 'warning'}>
                    {tarea.estado?.nombre ?? t('tarea.statusPendiente')}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
