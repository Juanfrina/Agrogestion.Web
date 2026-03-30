/**
 * @file TrabajadorDashboard.tsx
 * @description Dashboard del trabajador — resumen de sus tareas y asignaciones recientes.
 *
 * Muestra estadísticas rápidas de las tareas del trabajador
 * y las últimas asignaciones que ha recibido.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Tarea } from '../../interfaces/Tarea';
import Card from '../cards/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/**
 * Dashboard principal del trabajador.
 * Muestra estadísticas de tareas y asignaciones recientes.
 *
 * @returns El panel de resumen del trabajador
 */
export default function TrabajadorDashboard() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** Carga las tareas del trabajador al montar */
  useEffect(() => {
    if (!perfil) return;
    const cargar = async () => {
      try {
        const data = await TareaRepository.getTareasByTrabajador(perfil.id);
        setTareas(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar tareas';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [perfil]);

  if (loading) return <Spinner size="lg" text="Cargando dashboard..." />;
  if (error) return <Alert type="error" message={error} />;

  /** Cuenta tareas por estado */
  const contar = (estado: string) => tareas.filter((t) => t.estado?.nombre === estado).length;

  /** Últimas asignaciones recientes */
  const recientes = [...tareas]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Dashboard Trabajador</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Pendientes">
          <p className="text-3xl font-bold">{contar('Pendiente') + contar('Asignada')}</p>
        </Card>
        <Card title="En Progreso">
          <p className="text-3xl font-bold">{contar('En progreso')}</p>
        </Card>
        <Card title="Completadas">
          <p className="text-3xl font-bold">{contar('Completada')}</p>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Button variant="primary" onClick={() => navigate('/trabajador/tareas')}>
        Ver Mis Tareas
      </Button>

      {/* Asignaciones recientes */}
      {recientes.length > 0 && (
        <div>
          <h3 className="mb-3 text-xl font-semibold">Asignaciones Recientes</h3>
          <div className="space-y-2">
            {recientes.map((t) => (
              <Card key={t.id_tarea}>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{t.nombre}</strong>
                    <span className="ml-2 text-sm text-gray-500">{t.terreno?.nombre}</span>
                  </div>
                  <Badge variant={t.estado?.nombre === 'Completada' ? 'success' : 'warning'}>
                    {t.estado?.nombre ?? 'Pendiente'}
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
