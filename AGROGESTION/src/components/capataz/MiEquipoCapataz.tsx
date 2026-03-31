/**
 * @file MiEquipoCapataz.tsx
 * @description Gestión del equipo del capataz — asignar y desvincular trabajadores.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import type { Perfil } from '../../lib/types';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Modal from '../common/Modal';

export default function MiEquipoCapataz() {
  const { perfil } = useAuth();
  const { t } = useTranslation();

  const [trabajadores, setTrabajadores] = useState<Perfil[]>([]);
  const [disponibles, setDisponibles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [seleccionado, setSeleccionado] = useState('');
  const [adding, setAdding] = useState(false);

  // Modal de confirmación para desvincular
  const [modalConfirm, setModalConfirm] = useState(false);
  const [trabajadorEliminar, setTrabajadorEliminar] = useState<Perfil | null>(null);

  const cargarEquipo = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const [mis, todos] = await Promise.all([
        UsuarioRepository.getTrabajadoresByCapataz(perfil.id),
        UsuarioRepository.getAvailableTrabajadores(),
      ]);
      setTrabajadores(mis);
      // Filtrar los que ya están asignados
      const idsAsignados = new Set(mis.map((w) => w.id));
      setDisponibles(todos.filter((w) => !idsAsignados.has(w.id)));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : t('team.errorLoading');
      setMensaje({ tipo: 'error', texto: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEquipo();
  }, [perfil]);

  const handleAñadir = async () => {
    if (!perfil || !seleccionado) return;
    try {
      setAdding(true);
      await UsuarioRepository.assignTrabajadorToCapataz(perfil.id, seleccionado);
      setMensaje({ tipo: 'success', texto: t('team.trabajadorAdded') });
      setSeleccionado('');
      await cargarEquipo();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : t('team.errorAdding');
      setMensaje({ tipo: 'error', texto: msg });
    } finally {
      setAdding(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!perfil || !trabajadorEliminar) return;
    try {
      await UsuarioRepository.removeTrabajadorFromCapataz(perfil.id, trabajadorEliminar.id);
      setMensaje({ tipo: 'success', texto: t('team.trabajadorRemoved') });
      setModalConfirm(false);
      setTrabajadorEliminar(null);
      await cargarEquipo();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : t('team.errorRemoving');
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>{t('team.title')}</h1>

      {mensaje && (
        <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Sección para añadir trabajador */}
      <div className="card mb-6">
        <h2 className="mb-4">{t('team.addTrabajador')}</h2>
        {disponibles.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('team.noAvailableTrabajadores')}</p>
        ) : (
          <div className="flex gap-3 items-end flex-wrap">
            <select
              className="input flex-1"
              value={seleccionado}
              onChange={(e) => setSeleccionado(e.target.value)}
            >
              <option value="">{t('team.selectTrabajador')}</option>
              {disponibles.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nombre} {w.apellidos} — {w.email}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              disabled={!seleccionado || adding}
              onClick={handleAñadir}
            >
              {adding ? t('common.loading') : t('team.addTrabajador')}
            </button>
          </div>
        )}
      </div>

      {/* Lista de trabajadores asignados */}
      <div className="card">
        <h2 className="mb-4">{t('team.myTrabajadores')}</h2>
        {trabajadores.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('team.noTrabajadores')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {trabajadores.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-4 rounded-[var(--radius-md)]"
                style={{
                  backgroundColor: 'var(--color-bg-main)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <p className="font-semibold m-0">
                    {w.nombre} {w.apellidos}
                  </p>
                  <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>
                    {w.email} · {w.tlf}
                  </p>
                </div>
                <button
                  className="btn"
                  style={{
                    backgroundColor: 'var(--color-error)',
                    color: '#fff',
                    border: 'none',
                  }}
                  onClick={() => {
                    setTrabajadorEliminar(w);
                    setModalConfirm(true);
                  }}
                >
                  {t('team.removeTrabajador')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={modalConfirm}
        onClose={() => setModalConfirm(false)}
        title={t('team.removeTrabajador')}
      >
        <p>{t('team.confirmRemoveTrabajador')}</p>
        {trabajadorEliminar && (
          <p className="font-semibold">
            {trabajadorEliminar.nombre} {trabajadorEliminar.apellidos}
          </p>
        )}
        <div className="flex gap-3 justify-end mt-4">
          <button className="btn" onClick={() => setModalConfirm(false)}>
            {t('common.cancel')}
          </button>
          <button
            className="btn"
            style={{ backgroundColor: 'var(--color-error)', color: '#fff', border: 'none' }}
            onClick={confirmarEliminar}
          >
            {t('common.confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
