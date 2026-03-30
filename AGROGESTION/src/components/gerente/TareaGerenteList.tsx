/**
 * @file TareaGerenteList.tsx
 * @description Lista de tareas del gerente — puede crear, editar y ver el estado de cada tarea.
 *
 * Carga las tareas del gerente logueado, las muestra en tabla con filtro por estado
 * y permite abrir el formulario de nueva tarea en un modal.
 */

import { useState, useEffect } from 'react';
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

/**
 * Lista de tareas creadas por el gerente.
 * Permite filtrar, crear nuevas y ver detalles.
 *
 * @returns La vista de gestión de tareas del gerente
 */
export default function TareaGerenteList() {
  const { perfil } = useAuth();
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

  /** Carga todo lo necesario al montar */
  useEffect(() => {
    if (!perfil) return;
    const cargar = async () => {
      try {
        const [tareasData, terrenosData, capatacesData] = await Promise.all([
          TareaRepository.getByGerente(perfil.id),
          TerrenoRepository.getByGestor(perfil.id),
          UsuarioRepository.getCapatacesByGerente(perfil.id),
        ]);
        setTareas(tareasData);
        setTerrenos(terrenosData);
        setCapataces(capatacesData);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar datos';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [perfil]);

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
    { value: '', label: 'Todos los estados' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Asignada', label: 'Asignada' },
    { value: 'En progreso', label: 'En progreso' },
    { value: 'Completada', label: 'Completada' },
  ];

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'terreno', header: 'Terreno', render: (t: Tarea) => t.terreno?.nombre ?? '—' },
    { key: 'capataz', header: 'Capataz', render: (t: Tarea) => t.capataz ? `${t.capataz.nombre} ${t.capataz.apellidos}` : 'Sin asignar' },
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
        <Button variant="secondary" onClick={() => { setTareaEditar(t); setModalForm(true); }}>
          Editar
        </Button>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text="Cargando tareas..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Tareas</h2>
        <Button variant="primary" onClick={() => { setTareaEditar(undefined); setModalForm(true); }}>
          Nueva Tarea
        </Button>
      </div>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      {/* Filtro por estado */}
      <Select
        options={opcionesEstado}
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        name="filtroEstado"
        placeholder="Filtrar por estado"
      />

      <Table columns={columnas} data={tareasFiltradas} emptyMessage="No hay tareas" />

      {/* Modal de formulario */}
      <Modal isOpen={modalForm} onClose={() => setModalForm(false)} title={tareaEditar ? 'Editar Tarea' : 'Nueva Tarea'}>
        <TareaForm
          tarea={tareaEditar}
          terrenos={terrenos}
          capataces={capataces}
          onSave={() => {
            setModalForm(false);
            setMensaje({ tipo: 'success', texto: 'Tarea guardada correctamente' });
            recargarTareas();
          }}
          onCancel={() => setModalForm(false)}
        />
      </Modal>
    </div>
  );
}
