/**
 * @file TareaGerenteList.tsx
 * @description Lista de tareas del gerente — puede crear, editar y ver el estado de cada tarea.
 *
 * Carga las tareas del gerente logueado, las muestra en tabla con filtro por estado
 * y permite abrir el formulario de nueva tarea en un modal.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import { TerrenoRepository } from '../../database/repositories/TerrenoRepository';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import type { Tarea } from '../../interfaces/Tarea';
import type { Terreno } from '../../interfaces/Terreno';
import type { Perfil } from '../../interfaces/Perfil';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import TareaForm from './TareaForm';
import TareaComentarios from '../common/TareaComentarios';

/**
 * Lista de tareas creadas por el gerente.
 * Permite filtrar, crear nuevas y ver detalles.
 *
 * @returns La vista de gestión de tareas del gerente
 */
export default function TareaGerenteList() {
  const { perfil } = useAuth();
  const { t } = useTranslation();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [capataces, setCapataces] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modal de formulario
  const [modalForm, setModalForm] = useState(false);
  const [tareaEditar, setTareaEditar] = useState<Tarea | undefined>(undefined);

  // Modal de comentarios
  const [modalComentarios, setModalComentarios] = useState(false);
  const [tareaComentarios, setTareaComentarios] = useState<number | null>(null);

  /** Carga todo lo necesario al montar */
  useEffect(() => {
    if (!perfil) { setLoading(false); return; }
    let cancelled = false;
    const cargar = async () => {
      setLoading(true);
      try {
        const [tareasData, terrenosData, capatacesData] = await Promise.all([
          TareaRepository.getByGerente(perfil.id),
          TerrenoRepository.getByGestor(perfil.id),
          UsuarioRepository.getCapatacesByGerente(perfil.id),
        ]);
        if (!cancelled) {
          setTareas(tareasData);
          setTerrenos(terrenosData);
          setCapataces(capatacesData);
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

  /** Recarga solo las tareas */
  const recargarTareas = async () => {
    if (!perfil) return;
    const data = await TareaRepository.getByGerente(perfil.id);
    setTareas(data);
  };

  /** Filtra las tareas según el estado seleccionado */
  const tareasFiltradas = filtroEstado
    ? tareas.filter((t) => t.estado?.nombre === filtroEstado)
    : tareas;

  /** Opciones del filtro de estado */
  const opcionesEstado = [
    { value: '', label: t('tarea.allStatuses') },
    { value: 'PENDIENTE', label: t('tarea.statusPendiente') },
    { value: 'ASIGNADA', label: t('tarea.statusAsignada') },
    { value: 'EN_PROGRESO', label: t('tarea.statusEnProgreso') },
    { value: 'COMPLETADA', label: t('tarea.statusCompletada') },
    { value: 'RECHAZADA', label: t('tarea.statusRechazada') },
  ];

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: t('tarea.name'), render: (row: Tarea) => {
      const numComentarios = row.comentarios_tarea?.[0]?.count ?? 0;
      return (
        <div className="flex items-center gap-2">
          <span>{row.nombre}</span>
          {numComentarios > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800" title={`${numComentarios} ${t('tarea.comments').toLowerCase()}`}>
              💬 {numComentarios}
            </span>
          )}
        </div>
      );
    }},
    { key: 'terreno', header: t('tarea.terrain'), render: (row: Tarea) => row.terreno?.nombre ?? '—' },
    { key: 'capataz', header: t('tarea.capataz'), render: (row: Tarea) => row.capataz ? `${row.capataz.nombre} ${row.capataz.apellidos}` : t('tarea.noAssigned') },
    {
      key: 'estado',
      header: t('tarea.status'),
      render: (row: Tarea) => {
        const variante = row.estado?.nombre === 'COMPLETADA' ? 'success' : row.estado?.nombre === 'EN_PROGRESO' ? 'warning' : 'error';
        return <Badge variant={variante}>{row.estado?.nombre ?? t('tarea.statusPendiente')}</Badge>;
      },
    },
    { key: 'fechas', header: t('tarea.dates'), render: (row: Tarea) => `${row.fecha_inicio} — ${row.fecha_fin}` },
    {
      key: 'acciones',
      header: t('tarea.actions'),
      render: (row: Tarea) => (
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => { setTareaEditar(row); setModalForm(true); }}>
            {t('tarea.edit')}
          </Button>
          {row.estado?.nombre !== 'PENDIENTE' && (
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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">{t('tarea.myTasks')}</h2>
        <Button variant="accent" onClick={() => { setTareaEditar(undefined); setModalForm(true); }}>
          {t('tarea.newTask')}
        </Button>
      </div>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      {/* Filtro por estado */}
      <Select
        options={opcionesEstado}
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        name="filtroEstado"
        placeholder={t('tarea.filterByStatus')}
      />

      <Table<Tarea> columns={columnas} data={tareasFiltradas} emptyMessage={t('tarea.noTasks')} />

      {/* Modal de formulario */}
      <Modal isOpen={modalForm} onClose={() => setModalForm(false)} title={tareaEditar ? t('tarea.editTask') : t('tarea.newTask')}>
        <TareaForm
          tarea={tareaEditar}
          terrenos={terrenos}
          capataces={capataces}
          onSave={() => {
            setModalForm(false);
            setMensaje({ tipo: 'success', texto: t('tarea.savedOk') });
            recargarTareas();
          }}
          onCancel={() => setModalForm(false)}
        />
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
