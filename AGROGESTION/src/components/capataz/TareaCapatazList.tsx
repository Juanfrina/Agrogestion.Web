/**
 * @file TareaCapatazList.tsx
 * @description Lista de tareas del capataz — aceptar, rechazar, cambiar estado y asignar trabajadores.
 *
 * Muestra las tareas asignadas al capataz en una tabla.
 * Las que están en estado "Asignada" tienen botones de aceptar/rechazar.
 * Las aceptadas pueden cambiar de estado y asignar trabajadores.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Tarea } from '../../interfaces/Tarea';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import TrabajadorAsignacion from './TrabajadorAsignacion';

/**
 * Lista de tareas asignadas al capataz.
 * Permite aceptar/rechazar, cambiar estado y asignar trabajadores.
 *
 * @returns La vista de tareas del capataz con acciones
 */
export default function TareaCapatazList() {
  const { perfil } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modal de asignación de trabajadores
  const [modalAsignar, setModalAsignar] = useState(false);
  const [tareaAsignar, setTareaAsignar] = useState<number | null>(null);

  /** Carga las tareas del capataz */
  const cargarTareas = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const data = await TareaRepository.getByCapataz(perfil.id);
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

  /** Acepta una tarea asignada */
  const aceptarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, 3); // 3 = En progreso
      setMensaje({ tipo: 'success', texto: 'Tarea aceptada' });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aceptar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Rechaza una tarea asignada */
  const rechazarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, 1); // 1 = Pendiente (vuelve al gerente)
      setMensaje({ tipo: 'success', texto: 'Tarea rechazada' });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al rechazar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Marca una tarea como completada */
  const completarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, 4); // 4 = Completada
      setMensaje({ tipo: 'success', texto: 'Tarea completada' });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al completar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'terreno', header: 'Terreno', render: (t: Tarea) => t.terreno?.nombre ?? '—' },
    {
      key: 'estado',
      header: 'Estado',
      render: (t: Tarea) => {
        const variante = t.estado?.nombre === 'Completada' ? 'success' : t.estado?.nombre === 'En progreso' ? 'warning' : 'error';
        return <Badge variant={variante}>{t.estado?.nombre ?? 'Pendiente'}</Badge>;
      },
    },
    { key: 'fechas', header: 'Fechas', render: (t: Tarea) => `${t.fecha_inicio} — ${t.fecha_fin}` },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (t: Tarea) => (
        <div className="flex gap-2">
          {/* Botones para tareas en estado "Asignada" */}
          {t.estado?.nombre === 'Asignada' && (
            <>
              <Button variant="primary" onClick={() => aceptarTarea(t)}>Aceptar</Button>
              <Button variant="danger" onClick={() => rechazarTarea(t)}>Rechazar</Button>
            </>
          )}
          {/* Botones para tareas aceptadas (en progreso) */}
          {t.estado?.nombre === 'En progreso' && (
            <>
              <Button variant="accent" onClick={() => completarTarea(t)}>Completar</Button>
              <Button variant="secondary" onClick={() => { setTareaAsignar(t.id_tarea); setModalAsignar(true); }}>
                Asignar Trabajadores
              </Button>
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

      {/* Modal de asignación de trabajadores */}
      <Modal isOpen={modalAsignar} onClose={() => setModalAsignar(false)} title="Asignar Trabajadores">
        {tareaAsignar && (
          <TrabajadorAsignacion
            tareaId={tareaAsignar}
            onClose={() => { setModalAsignar(false); cargarTareas(); }}
          />
        )}
      </Modal>
    </div>
  );
}
