/**
 * @file MisTareasList.tsx
 * @description Lista de tareas del trabajador — aceptar/rechazar asignaciones, marcar completas y comentar.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import { ESTADOS_TAREA } from '../../lib/constants';
import type { Tarea } from '../../interfaces/Tarea';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import TareaComentarios from '../common/TareaComentarios';

/** Tarea con el estado de asignación del trabajador */
interface TareaConAsignacion extends Tarea {
  estadoAsignacion: string;
}

/** Badge según el estado de asignación del trabajador */
const getAsignBadge = (estado: string): 'success' | 'warning' | 'error' => {
  if (estado === 'COMPLETADA' || estado === 'ACEPTADA') return 'success';
  if (estado === 'RECHAZADA') return 'error';
  return 'warning';
};

export default function MisTareasList() {
  const { perfil } = useAuth();
  const { t } = useTranslation();
  const [tareas, setTareas] = useState<TareaConAsignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modal de comentarios
  const [modalComentarios, setModalComentarios] = useState(false);
  const [tareaComentarios, setTareaComentarios] = useState<number | null>(null);

  const cargarTareas = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const data = await TareaRepository.getTareasByTrabajador(perfil.id);
      // Aplanar: cada fila es tarea_trabajador con tarea embebida
      const transformada = (data ?? []).map((row: Record<string, unknown>) => ({
        ...(row.tarea as Tarea),
        estadoAsignacion: row.estado as string,
      }));
      setTareas(transformada);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorLoad');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil]);

  /** Traduce el estado de asignación */
  const getAsignLabel = (estado: string): string => {
    const map: Record<string, string> = {
      PENDIENTE: t('tarea.assignPending'),
      ACEPTADA: t('tarea.assignAccepted'),
      RECHAZADA: t('tarea.assignRejected'),
      COMPLETADA: t('tarea.assignCompleted'),
    };
    return map[estado] ?? estado;
  };

  /** Traduce el estado de la tarea */
  const getEstadoLabel = (id: number): string => {
    const map: Record<number, string> = {
      [ESTADOS_TAREA.PENDIENTE]: t('tarea.statusPendiente'),
      [ESTADOS_TAREA.ASIGNADA]: t('tarea.statusAsignada'),
      [ESTADOS_TAREA.ACEPTADA]: t('tarea.statusAceptada'),
      [ESTADOS_TAREA.RECHAZADA]: t('tarea.statusRechazada'),
      [ESTADOS_TAREA.EN_PROGRESO]: t('tarea.statusEnProgreso'),
      [ESTADOS_TAREA.COMPLETADA]: t('tarea.statusCompletada'),
    };
    return map[id] ?? '—';
  };

  /** Acepta la asignación */
  const aceptar = async (tareaId: number) => {
    if (!perfil) return;
    try {
      await TareaRepository.respondTrabajadorAssignment(tareaId, perfil.id, true);
      setMensaje({ tipo: 'success', texto: t('tarea.assignmentAccepted') });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorAccept');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Rechaza la asignación */
  const rechazar = async (tareaId: number) => {
    if (!perfil) return;
    try {
      await TareaRepository.respondTrabajadorAssignment(tareaId, perfil.id, false);
      setMensaje({ tipo: 'success', texto: t('tarea.assignmentRejected') });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorReject');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Marca la asignación como completada */
  const completar = async (tareaId: number) => {
    if (!perfil) return;
    try {
      await TareaRepository.completeTrabajadorAssignment(tareaId, perfil.id);
      setMensaje({ tipo: 'success', texto: t('tarea.assignmentCompleted') });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorComplete');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  const columnas = [
    { key: 'nombre', header: t('tarea.name') },
    { key: 'descripcion', header: t('tarea.description'), render: (row: TareaConAsignacion) => row.descripcion ?? '—' },
    { key: 'terreno', header: t('tarea.terrain'), render: (row: TareaConAsignacion) => row.terreno?.nombre ?? '—' },
    { key: 'fechas', header: t('tarea.dates'), render: (row: TareaConAsignacion) => `${row.fecha_inicio} — ${row.fecha_fin}` },
    {
      key: 'estadoTarea',
      header: t('tarea.status'),
      render: (row: TareaConAsignacion) => {
        const variante = row.id_estado === ESTADOS_TAREA.COMPLETADA ? 'success'
          : row.id_estado === ESTADOS_TAREA.RECHAZADA ? 'error' : 'warning';
        return <Badge variant={variante}>{getEstadoLabel(row.id_estado)}</Badge>;
      },
    },
    {
      key: 'miEstado',
      header: t('tarea.status') + ' ✋',
      render: (row: TareaConAsignacion) => (
        <Badge variant={getAsignBadge(row.estadoAsignacion)}>
          {getAsignLabel(row.estadoAsignacion)}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: t('tarea.actions'),
      render: (row: TareaConAsignacion) => (
        <div className="flex gap-2 flex-wrap">
          {/* Asignación pendiente: Aceptar / Rechazar */}
          {row.estadoAsignacion === 'PENDIENTE' && (
            <>
              <Button variant="primary" onClick={() => aceptar(row.id_tarea)}>{t('tarea.accept')}</Button>
              <Button variant="danger" onClick={() => rechazar(row.id_tarea)}>{t('tarea.reject')}</Button>
            </>
          )}
          {/* Asignación aceptada: Completar */}
          {row.estadoAsignacion === 'ACEPTADA' && (
            <Button variant="accent" onClick={() => completar(row.id_tarea)}>{t('tarea.complete')}</Button>
          )}
          {/* Comentarios: siempre si no es pendiente */}
          {row.estadoAsignacion !== 'PENDIENTE' && (
            <Button variant="secondary" onClick={() => { setTareaComentarios(row.id_tarea); setModalComentarios(true); }}>
              {t('tarea.comments')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text={t('tarea.loadingTasks')} />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('tarea.myTasks')}</h2>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      <Table<TareaConAsignacion> columns={columnas} data={tareas} emptyMessage={t('tarea.noTasks')} />

      {/* Modal de comentarios */}
      <Modal isOpen={modalComentarios} onClose={() => setModalComentarios(false)} title={t('tarea.comments')}>
        {tareaComentarios && perfil && (
          <TareaComentarios tareaId={tareaComentarios} autorId={perfil.id} />
        )}
      </Modal>
    </div>
  );
}
