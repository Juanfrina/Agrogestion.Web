/**
 * @file MiEquipoGerente.tsx
 * @description Gestión del equipo del gerente — asignar y desvincular capataces.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import type { Perfil } from '../../lib/types';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Modal from '../common/Modal';

export default function MiEquipoGerente() {
  const { perfil } = useAuth();
  const { t } = useTranslation();

  const [capataces, setCapataces] = useState<Perfil[]>([]);
  const [disponibles, setDisponibles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [seleccionado, setSeleccionado] = useState('');
  const [adding, setAdding] = useState(false);

  // Modal de confirmación para desvincular
  const [modalConfirm, setModalConfirm] = useState(false);
  const [capatazEliminar, setCapatazEliminar] = useState<Perfil | null>(null);

  const cargarEquipo = async () => {
    if (!perfil) return;
    try {
      setLoading(true);
      const [mis, todos] = await Promise.all([
        UsuarioRepository.getCapatacesByGerente(perfil.id),
        UsuarioRepository.getAvailableCapataces(),
      ]);
      setCapataces(mis);
      // Filtrar los que ya están asignados
      const idsAsignados = new Set(mis.map((c) => c.id));
      setDisponibles(todos.filter((c) => !idsAsignados.has(c.id)));
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
      await UsuarioRepository.assignCapatazToGerente(perfil.id, seleccionado);
      setMensaje({ tipo: 'success', texto: t('team.capatazAdded') });
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
    if (!perfil || !capatazEliminar) return;
    try {
      await UsuarioRepository.removeCapatazFromGerente(perfil.id, capatazEliminar.id);
      setMensaje({ tipo: 'success', texto: t('team.capatazRemoved') });
      setModalConfirm(false);
      setCapatazEliminar(null);
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

      {/* Sección para añadir capataz */}
      <div className="card mb-6">
        <h2 className="mb-4">{t('team.addCapataz')}</h2>
        {disponibles.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('team.noAvailableCapataces')}</p>
        ) : (
          <div className="flex gap-3 items-end flex-wrap">
            <select
              className="input flex-1"
              value={seleccionado}
              onChange={(e) => setSeleccionado(e.target.value)}
            >
              <option value="">{t('team.selectCapataz')}</option>
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellidos} — {c.email}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              disabled={!seleccionado || adding}
              onClick={handleAñadir}
            >
              {adding ? t('common.loading') : t('team.addCapataz')}
            </button>
          </div>
        )}
      </div>

      {/* Lista de capataces asignados */}
      <div className="card">
        <h2 className="mb-4">{t('team.myCapataces')}</h2>
        {capataces.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('team.noCapataces')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {capataces.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-[var(--radius-md)]"
                style={{
                  backgroundColor: 'var(--color-bg-main)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <p className="font-semibold m-0">
                    {c.nombre} {c.apellidos}
                  </p>
                  <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>
                    {c.email} · {c.tlf}
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
                    setCapatazEliminar(c);
                    setModalConfirm(true);
                  }}
                >
                  {t('team.removeCapataz')}
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
        title={t('team.removeCapataz')}
      >
        <p>{t('team.confirmRemoveCapataz')}</p>
        {capatazEliminar && (
          <p className="font-semibold">
            {capatazEliminar.nombre} {capatazEliminar.apellidos}
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
