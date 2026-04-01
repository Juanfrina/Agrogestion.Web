/**
 * @file TerrenoList.tsx
 * @description Lista de terrenos del gerente — ver, buscar, crear, editar y eliminar terrenos.
 *
 * Usa la tabla genérica y un buscador. El botón "Nuevo Terreno" abre un modal con el formulario.
 * Editar y eliminar también pasan por modales de confirmación.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        : t('terreno.errorLoad');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTerrenos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setMensaje({ tipo: 'success', texto: t('terreno.savedOk') });
    cargarTerrenos();
  };

  /** Confirma la eliminación lógica */
  const confirmarEliminar = async () => {
    if (!terrenoEliminar) return;
    try {
      await TerrenoRepository.softDelete(terrenoEliminar.id_terreno);
      setMensaje({ tipo: 'success', texto: t('terreno.deleted') });
      setModalEliminar(false);
      cargarTerrenos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('terreno.errorDelete');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: t('terreno.nombre') },
    { key: 'ubicacion', header: t('terreno.ubicacion') },
    { key: 'tipo_cultivo', header: t('terreno.tipoCultivo') },
    { key: 'estado', header: t('terreno.estado') },
    {
      key: 'acciones',
      header: t('terreno.acciones'),
      render: (row: Terreno) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => abrirEditar(row)}>{t('terreno.edit')}</Button>
          <Button variant="danger" onClick={() => { setTerrenoEliminar(row); setModalEliminar(true); }}>
            {t('terreno.delete')}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text={t('terreno.loadingTerrenos')} />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">{t('terreno.myTerrenos')}</h2>
        <Button variant="accent" onClick={abrirCrear}>{t('terreno.newTerreno')}</Button>
      </div>

      {mensaje && <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />}

      <SearchBar value={busqueda} onChange={setBusqueda} placeholder={t('terreno.searchPlaceholder')} />

      <Table<Terreno> columns={columnas} data={terrenosFiltrados} emptyMessage={t('terreno.noTerrenos')} />

      {/* Modal de formulario (crear/editar) */}
      <Modal isOpen={modalForm} onClose={() => setModalForm(false)} title={terrenoEditar ? t('terreno.editTerreno') : t('terreno.newTerreno')}>
        <TerrenoForm terreno={terrenoEditar} onSave={handleSave} onCancel={() => setModalForm(false)} />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={modalEliminar} onClose={() => setModalEliminar(false)} title={t('terreno.deleteTerreno')}>
        <div className="space-y-4">
          <p>{t('terreno.confirmDelete')} <strong>{terrenoEliminar?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={confirmarEliminar}>{t('terreno.delete')}</Button>
            <Button variant="secondary" onClick={() => setModalEliminar(false)}>{t('terreno.cancel')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
