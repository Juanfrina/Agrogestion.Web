/**
 * @file TerrenoList.tsx
 * @description Lista de terrenos del gerente — ver, buscar, crear, editar y eliminar terrenos.
 *
 * Usa la tabla genérica y un buscador. El botón "Nuevo Terreno" abre un modal con el formulario.
 * Editar y eliminar también pasan por modales de confirmación.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TerrenoRepository } from '../../database/repositories/TerrenoRepository';
import type { Terreno } from '../../interfaces/Terreno';
import Table from '../ui/Table';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import TerrenoForm from './TerrenoForm';

/**
 * Lista de terrenos del gerente actual.
 * Incluye buscador, tabla y modales para CRUD.
 *
 * @returns La vista de gestión de terrenos
 */
export default function TerrenoList() {
  const { perfil } = useAuth();
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modales
  const [modalForm, setModalForm] = useState(false);
  const [terrenoEditar, setTerrenoEditar] = useState<Terreno | undefined>(undefined);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [terrenoEliminar, setTerrenoEliminar] = useState<Terreno | null>(null);

  /** Carga los terrenos del gerente */
  const cargarTerrenos = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const data = await TerrenoRepository.getByGestor(perfil.id);
      setTerrenos(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : 'Error al cargar terrenos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTerrenos();
  }, [perfil]);

  /** Filtra terrenos por nombre o ubicación */
  const terrenosFiltrados = terrenos.filter((t) => {
    const texto = busqueda.toLowerCase();
    return (
      t.nombre.toLowerCase().includes(texto) ||
      t.ubicacion.toLowerCase().includes(texto)
    );
  });

  /** Abre el modal para crear un terreno nuevo */
  const abrirCrear = () => {
    setTerrenoEditar(undefined);
    setModalForm(true);
  };

  /** Abre el modal para editar un terreno */
  const abrirEditar = (terreno: Terreno) => {
    setTerrenoEditar(terreno);
    setModalForm(true);
  };

  /** Callback cuando se guarda (crear o editar) */
  const handleSave = () => {
    setModalForm(false);
    setMensaje({ tipo: 'success', texto: 'Terreno guardado correctamente' });
    cargarTerrenos();
  };

  /** Confirma la eliminación lógica */
  const confirmarEliminar = async () => {
    if (!terrenoEliminar) return;
    try {
      await TerrenoRepository.softDelete(terrenoEliminar.id_terreno);
      setMensaje({ tipo: 'success', texto: 'Terreno eliminado' });
      setModalEliminar(false);
      cargarTerrenos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'ubicacion', header: 'Ubicación' },
    { key: 'tipo_cultivo', header: 'Tipo Cultivo' },
    { key: 'estado', header: 'Estado' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (t: Terreno) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => abrirEditar(t)}>Editar</Button>
          <Button variant="danger" onClick={() => { setTerrenoEliminar(t); setModalEliminar(true); }}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text="Cargando terrenos..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Terrenos</h2>
        <Button variant="primary" onClick={abrirCrear}>Nuevo Terreno</Button>
      </div>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="🔍Buscar terrenos..." />

      <Table columns={columnas} data={terrenosFiltrados} emptyMessage="No tienes terrenos todavía" />

      {/* Modal de formulario (crear/editar) */}
      <Modal isOpen={modalForm} onClose={() => setModalForm(false)} title={terrenoEditar ? 'Editar Terreno' : 'Nuevo Terreno'}>
        <TerrenoForm terreno={terrenoEditar} onSave={handleSave} onCancel={() => setModalForm(false)} />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={modalEliminar} onClose={() => setModalEliminar(false)} title="Eliminar Terreno">
        <div className="space-y-4">
          <p>¿Seguro que quieres eliminar <strong>{terrenoEliminar?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={confirmarEliminar}>Eliminar</Button>
            <Button variant="secondary" onClick={() => setModalEliminar(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
