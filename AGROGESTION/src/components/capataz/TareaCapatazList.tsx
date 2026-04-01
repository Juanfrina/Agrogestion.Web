/**
 * @file TareaCapatazList.tsx
 * @description Lista de tareas del capataz — aceptar, rechazar, cambiar estado, comentar y asignar trabajadores.
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
import TrabajadorAsignacion from './TrabajadorAsignacion';
import TareaComentarios from '../common/TareaComentarios';

/** Devuelve la variante de Badge según el estado */
const getEstadoBadge = (id: number): 'success' | 'warning' | 'error' => {
  if (id === ESTADOS_TAREA.COMPLETADA) return 'success';
  if (id === ESTADOS_TAREA.RECHAZADA) return 'error';
  return 'warning';
};

export default function TareaCapatazList() {
  const { perfil } = useAuth();
  const { t } = useTranslation();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modales
  const [modalAsignar, setModalAsignar] = useState(false);
  const [tareaAsignar, setTareaAsignar] = useState<number | null>(null);
  const [modalComentarios, setModalComentarios] = useState(false);
  const [tareaComentarios, setTareaComentarios] = useState<number | null>(null);

  const cargarTareas = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const data = await TareaRepository.getByCapataz(perfil.id);
      setTareas(data);
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

  /** Traduce el id_estado a texto */
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

  /** Acepta una tarea → EN_PROGRESO */
  const aceptarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, ESTADOS_TAREA.EN_PROGRESO);
      setMensaje({ tipo: 'success', texto: t('tarea.accepted') });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorAccept');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Rechaza una tarea → PENDIENTE (vuelve al gerente) */
  const rechazarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, ESTADOS_TAREA.PENDIENTE);
      setMensaje({ tipo: 'success', texto: t('tarea.rejected') });
      cargarTareas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorReject');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Completa una tarea → COMPLETADA */
  const completarTarea = async (tarea: Tarea) => {
    try {
      await TareaRepository.updateEstado(tarea.id_tarea, ESTADOS_TAREA.COMPLETADA);
      setMensaje({ tipo: 'success', texto: t('tarea.completed') });
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
    { key: 'terreno', header: t('tarea.terrain'), render: (tarea: Tarea) => tarea.terreno?.nombre ?? '—' },
    {
      key: 'estado',
      header: t('tarea.status'),
      render: (tarea: Tarea) => (
        <Badge variant={getEstadoBadge(tarea.id_estado)}>
          {getEstadoLabel(tarea.id_estado)}
        </Badge>
      ),
    },
    { key: 'fechas', header: t('tarea.dates'), render: (tarea: Tarea) => `${tarea.fecha_inicio} — ${tarea.fecha_fin}` },
    {
      key: 'acciones',
      header: t('tarea.actions'),
      render: (tarea: Tarea) => (
        <div className="flex gap-2 flex-wrap">
          {/* Tarea asignada: Aceptar / Rechazar */}
          {tarea.id_estado === ESTADOS_TAREA.ASIGNADA && (
            <>
              <Button variant="primary" onClick={() => aceptarTarea(tarea)}>{t('tarea.accept')}</Button>
              <Button variant="danger" onClick={() => rechazarTarea(tarea)}>{t('tarea.reject')}</Button>
            </>
          )}
          {/* Tarea en progreso: Completar / Asignar trabajadores */}
          {(tarea.id_estado === ESTADOS_TAREA.EN_PROGRESO || tarea.id_estado === ESTADOS_TAREA.ACEPTADA) && (
            <>
              <Button variant="accent" onClick={() => completarTarea(tarea)}>{t('tarea.complete')}</Button>
              <Button variant="secondary" onClick={() => { setTareaAsignar(tarea.id_tarea); setModalAsignar(true); }}>
                {t('tarea.assignWorkers')}
              </Button>
            </>
          )}
          {/* Comentarios: siempre disponible excepto pendiente */}
          {tarea.id_estado !== ESTADOS_TAREA.PENDIENTE && (
            <Button variant="secondary" onClick={() => { setTareaComentarios(tarea.id_tarea); setModalComentarios(true); }}>
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
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">{t('tarea.myTasks')}</h2>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      <Table<Tarea> columns={columnas} data={tareas} emptyMessage={t('tarea.noTasks')} />

      {/* Modal de asignación de trabajadores */}
      <Modal isOpen={modalAsignar} onClose={() => setModalAsignar(false)} title={t('tarea.assignWorkers')}>
        {tareaAsignar && (
          <TrabajadorAsignacion
            tareaId={tareaAsignar}
            onClose={() => { setModalAsignar(false); cargarTareas(); }}
          />
        )}
      </Modal>

      {/* Modal de comentarios */}
      <Modal isOpen={modalComentarios} onClose={() => setModalComentarios(false)} title={t('tarea.comments')}>
        {tareaComentarios && perfil && (
          <TareaComentarios tareaId={tareaComentarios} autorId={perfil.id} />
        )}
      </Modal>
    </div>
  );
}
