/**
 * @file MisTareasList.tsx
 * @description Lista de tareas del trabajador — ver tareas, aceptar/rechazar asignaciones.
 *
 * Muestra las tareas del trabajador en una tabla.
 * Las asignaciones pendientes tienen botones de aceptar/rechazar.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Tarea } from '../../interfaces/Tarea';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/**
 * Lista de tareas asignadas al trabajador.
 * Muestra detalles y permite aceptar/rechazar asignaciones pendientes.
 *
 * @returns La vista de tareas del trabajador con acciones
 */
export default function MisTareasList() {
  const { perfil } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  /** Carga las tareas del trabajador */
  const cargarTareas = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const data = await TareaRepository.getTareasByTrabajador(perfil.id);
      setTareas(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar tareas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, [perfil]);

  /** Acepta una asignación pendiente */
  const aceptar = async (tareaId: number) => {
    if (!perfil) return;
    try {
      await TareaRepository.respondTrabajadorAssignment(tareaId, perfil.id, true);
      setMensaje({ tipo: 'success', texto: 'Asignación aceptada' });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aceptar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Rechaza una asignación pendiente */
  const rechazar = async (tareaId: number) => {
    if (!perfil) return;
    try {
      await TareaRepository.respondTrabajadorAssignment(tareaId, perfil.id, false);
      setMensaje({ tipo: 'success', texto: 'Asignación rechazada' });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al rechazar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: 'Nombre' },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (t: Tarea) => t.descripcion ?? '—',
    },
    { key: 'terreno', header: 'Terreno', render: (t: Tarea) => t.terreno?.nombre ?? '—' },
    { key: 'fechas', header: 'Fechas', render: (t: Tarea) => `${t.fecha_inicio} — ${t.fecha_fin}` },
    {
      key: 'estado',
      header: 'Estado',
      render: (t: Tarea) => {
        const variante = t.estado?.nombre === 'Completada' ? 'success' : t.estado?.nombre === 'En progreso' ? 'warning' : 'error';
        return <Badge variant={variante}>{t.estado?.nombre ?? 'Pendiente'}</Badge>;
      },
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (t: Tarea) => (
        <div className="flex gap-2">
          {/* Solo mostramos botones si la asignación está pendiente */}
          {t.estado?.nombre === 'Asignada' && (
            <>
              <Button variant="primary" onClick={() => aceptar(t.id_tarea)}>Aceptar</Button>
              <Button variant="danger" onClick={() => rechazar(t.id_tarea)}>Rechazar</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text="Cargando tareas..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Mis Tareas</h2>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      <Table columns={columnas} data={tareas} emptyMessage="No tienes tareas asignadas" />
    </div>
  );
}
