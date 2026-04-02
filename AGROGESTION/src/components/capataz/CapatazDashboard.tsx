/**
 * @file CapatazDashboard.tsx
 * @description Dashboard del capataz — resumen de tareas asignadas, pendientes y progreso.
 *
 * Muestra estadísticas rápidas de las tareas que tiene el capataz
 * y las tareas pendientes de aceptar/rechazar.
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
 * Dashboard principal del capataz.
 * Muestra estadísticas y tareas pendientes de acción.
 *
 * @returns El panel de resumen del capataz
 */
export default function CapatazDashboard() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** Carga las tareas del capataz al montar */
  useEffect(() => {
    if (!perfil) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await TareaRepository.getByCapataz(perfil.id);
        if (!cancelled) setTareas(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Error al cargar tareas';
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

  if (loading) return <Spinner size="lg" text="Cargando dashboard..." />;
  if (error) return <Alert type="error" message={error} />;

  /** Cuenta tareas por estado */
  const contar = (estado: string) => tareas.filter((t) => t.estado?.nombre === estado).length;

  /** Tareas pendientes de aceptar (estado "ASIGNADA") */
  const tareasPendientes = tareas.filter((t) => t.estado?.nombre === 'ASIGNADA');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Capataz</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Asignadas">
          <p className="text-3xl font-bold">{tareas.length}</p>
        </Card>
        <Card title="Pendientes">
          <p className="text-3xl font-bold">{contar('ASIGNADA')}</p>
        </Card>
        <Card title="En Progreso">
          <p className="text-3xl font-bold">{contar('EN_PROGRESO')}</p>
        </Card>
        <Card title="Completadas">
          <p className="text-3xl font-bold">{contar('COMPLETADA')}</p>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Button variant="primary" onClick={() => navigate('/capataz/tareas')}>
        Ver Mis Tareas
      </Button>

      {/* Tareas pendientes de aceptar */}
      {tareasPendientes.length > 0 && (
        <div>
          <h3 className="mb-3 text-xl font-semibold">Tareas por Aceptar</h3>
          <div className="space-y-2">
            {tareasPendientes.map((t) => (
              <Card key={t.id_tarea}>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <strong>{t.nombre}</strong>
                    <span className="text-sm text-gray-500">{t.terreno?.nombre}</span>
                  </div>
                  <Badge variant="warning">Pendiente de aceptar</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
