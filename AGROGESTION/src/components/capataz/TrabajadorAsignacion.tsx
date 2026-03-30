/**
 * @file TrabajadorAsignacion.tsx
 * @description Componente para asignar trabajadores a una tarea.
 *
 * Muestra los trabajadores disponibles y los que ya están asignados.
 * El capataz puede añadir nuevos trabajadores a la tarea.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Perfil } from '../../interfaces/Perfil';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/** Props del componente */
interface TrabajadorAsignacionProps {
  tareaId: number;
  onClose: () => void;
}

/**
 * Panel de asignación de trabajadores a una tarea.
 * Muestra trabajadores disponibles y asignados con su estado.
 *
 * @param props - tareaId de la tarea y callback onClose
 * @returns La vista de asignación con listas y botones
 */
export default function TrabajadorAsignacion({ tareaId, onClose }: TrabajadorAsignacionProps) {
  const { perfil } = useAuth();
  const [disponibles, setDisponibles] = useState<Perfil[]>([]);
  const [asignados, setAsignados] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  /** Carga trabajadores disponibles y los ya asignados */
  const cargarDatos = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const [disponiblesData, asignadosData] = await Promise.all([
        UsuarioRepository.getTrabajadoresByCapataz(perfil.id),
        TareaRepository.getTrabajadoresByTarea(tareaId),
      ]);
      setDisponibles(disponiblesData);
      setAsignados(asignadosData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar trabajadores';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [perfil, tareaId]);

  /** Asigna un trabajador a la tarea */
  const asignar = async (trabajadorId: string) => {
    try {
      await TareaRepository.assignTrabajador(tareaId, trabajadorId);
      setMensaje({ tipo: 'success', texto: 'Trabajador asignado' });
      cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al asignar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** IDs de trabajadores ya asignados (para filtrar los disponibles) */
  const idsAsignados = new Set(asignados.map((a) => a.id));

  /** Trabajadores disponibles que aún no están asignados */
  const noAsignados = disponibles.filter((d) => !idsAsignados.has(d.id));

  if (loading) return <Spinner size="md" text="Cargando trabajadores..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      {/* Trabajadores ya asignados */}
      <div>
        <h4 className="mb-2 font-semibold">Asignados</h4>
        {asignados.length === 0 ? (
          <p className="text-sm text-gray-500">Ningún trabajador asignado todavía</p>
        ) : (
          <ul className="space-y-1">
            {asignados.map((t) => (
              <li key={t.id} className="flex items-center gap-2 rounded border p-2">
                <span>{t.nombre} {t.apellidos}</span>
                <Badge variant="success">Asignado</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trabajadores disponibles */}
      <div>
        <h4 className="mb-2 font-semibold">Disponibles</h4>
        {noAsignados.length === 0 ? (
          <p className="text-sm text-gray-500">No hay más trabajadores disponibles</p>
        ) : (
          <ul className="space-y-1">
            {noAsignados.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded border p-2">
                <span>{t.nombre} {t.apellidos}</span>
                <Button variant="primary" onClick={() => asignar(t.id)}>Asignar</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="secondary" onClick={onClose}>Cerrar</Button>
    </div>
  );
}
