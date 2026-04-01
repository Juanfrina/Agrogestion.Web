/**
 * @file TrabajadorAsignacion.tsx
 * @description Componente para asignar trabajadores a una tarea.
 *
 * Muestra los trabajadores asignados con su estado real (PENDIENTE/ACEPTADA/RECHAZADA/COMPLETADA)
 * y permite asignar nuevos o reasignar los que rechazaron.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Perfil } from '../../lib/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/** Fila de tarea_trabajador con join de perfil */
interface AsignacionRow {
  id_tarea: number;
  id_trabajador: string;
  estado: string;
  trabajador: { id: string; nombre: string; apellidos: string; email: string };
}

interface TrabajadorAsignacionProps {
  tareaId: number;
  onClose: () => void;
}

/** Badge según estado de asignación */
const getBadge = (estado: string): 'success' | 'warning' | 'error' => {
  if (estado === 'ACEPTADA' || estado === 'COMPLETADA') return 'success';
  if (estado === 'RECHAZADA') return 'error';
  return 'warning';
};

export default function TrabajadorAsignacion({ tareaId, onClose }: TrabajadorAsignacionProps) {
  const { perfil } = useAuth();
  const { t } = useTranslation();
  const [disponibles, setDisponibles] = useState<Perfil[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const cargarDatos = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const [disponiblesData, asignadosData] = await Promise.all([
        UsuarioRepository.getTrabajadoresByCapataz(perfil.id),
        TareaRepository.getTrabajadoresByTarea(tareaId),
      ]);
      setDisponibles(disponiblesData);
      setAsignaciones(asignadosData as AsignacionRow[]);
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
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil, tareaId]);

  /** Asigna un trabajador nuevo a la tarea */
  const asignar = async (trabajadorId: string) => {
    if (!perfil) return;
    try {
      await TareaRepository.assignTrabajador(tareaId, trabajadorId, perfil.id);
      setMensaje({ tipo: 'success', texto: t('tarea.assignmentAccepted') });
      cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorAccept');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Reasigna un trabajador que había rechazado */
  const reasignar = async (trabajadorId: string) => {
    try {
      await TareaRepository.reassignTrabajador(tareaId, trabajadorId);
      setMensaje({ tipo: 'success', texto: t('tarea.assignmentAccepted') });
      cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : t('tarea.errorAccept');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Traduce el estado de asignación */
  const getLabel = (estado: string): string => {
    const map: Record<string, string> = {
      PENDIENTE: t('tarea.assignPending'),
      ACEPTADA: t('tarea.assignAccepted'),
      RECHAZADA: t('tarea.assignRejected'),
      COMPLETADA: t('tarea.assignCompleted'),
    };
    return map[estado] ?? estado;
  };

  /** IDs de trabajadores con asignación activa (no rechazados) */
  const idsOcupados = new Set(
    asignaciones.filter((a) => a.estado !== 'RECHAZADA').map((a) => a.id_trabajador),
  );

  /** Trabajadores del equipo del capataz que no tienen asignación activa en esta tarea */
  const noAsignados = disponibles.filter((d) => !idsOcupados.has(d.id));

  if (loading) return <Spinner size="md" text={t('tarea.loadingTasks')} />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      {/* Trabajadores asignados con estado */}
      <div>
        <h4 className="mb-2 font-semibold">{t('tarea.assignWorkers')}</h4>
        {asignaciones.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">{t('tarea.noTasks')}</p>
        ) : (
          <ul className="space-y-1">
            {asignaciones.map((a) => (
              <li
                key={a.id_trabajador}
                className="flex items-center justify-between rounded p-2 border border-(--color-border)"
              >
                <div className="flex items-center gap-2">
                  <span>{a.trabajador.nombre} {a.trabajador.apellidos}</span>
                  <Badge variant={getBadge(a.estado)}>{getLabel(a.estado)}</Badge>
                </div>
                {/* Si rechazó, el capataz puede reasignar */}
                {a.estado === 'RECHAZADA' && (
                  <Button variant="primary" onClick={() => reasignar(a.id_trabajador)}>
                    {t('tarea.accept')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trabajadores disponibles para asignar */}
      <div>
        <h4 className="mb-2 font-semibold">{t('team.myTrabajadores')}</h4>
        {noAsignados.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">{t('team.noAvailableTrabajadores')}</p>
        ) : (
          <ul className="space-y-1">
            {noAsignados.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between rounded p-2 border border-(--color-border)"
              >
                <span>{w.nombre} {w.apellidos}</span>
                <Button variant="primary" onClick={() => asignar(w.id)}>{t('tarea.accept')}</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
    </div>
  );
}
