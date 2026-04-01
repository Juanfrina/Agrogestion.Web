/**
 * @file UserTable.tsx
 * @description Tabla de gestión de usuarios — el admin puede ver, buscar, cambiar roles y dar de baja.
 *
 * Carga todos los usuarios del sistema y los muestra en una tabla con acciones.
 * Tiene buscador para filtrar por nombre o email y modales de confirmación.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminRepository } from '../../database/repositories/AdminRepository';
import type { Perfil } from '../../interfaces/Perfil';
import { Rol } from '../../interfaces/Rol';
import Table from '../ui/Table';
import SearchBar from '../ui/SearchBar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

/**
 * Componente de gestión de usuarios.
 * Muestra la tabla con todos los usuarios, buscador y acciones de admin.
 *
 * @returns La tabla de usuarios con todas las acciones disponibles
 */
export default function UserTable() {
  const { t } = useTranslation();
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Modal de cambio de rol
  const [modalRol, setModalRol] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Perfil | null>(null);
  const [nuevoRol, setNuevoRol] = useState('');

  // Modal de confirmación de baja/alta
  const [modalConfirm, setModalConfirm] = useState(false);
  const [accionConfirm, setAccionConfirm] = useState<'baja' | 'alta'>('baja');

  /** Carga los usuarios al montar */
  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Trae todos los usuarios del repo */
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getAllUsers();
      setUsuarios(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('admin.errorLoadUsers');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /** Filtra usuarios por nombre o email */
  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(texto) ||
      u.apellidos.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto)
    );
  });

  /** Devuelve la variante del badge según el rol */
  const getBadgeVariant = (id_rol: number): 'admin' | 'gerente' | 'capataz' | 'trabajador' => {
    switch (id_rol) {
      case Rol.ADMIN: return 'admin';
      case Rol.GERENTE: return 'gerente';
      case Rol.CAPATAZ: return 'capataz';
      default: return 'trabajador';
    }
  };

  /** Devuelve el nombre legible del rol */
  const getRolNombre = (id_rol: number): string => {
    switch (id_rol) {
      case Rol.ADMIN: return t('roles.admin');
      case Rol.GERENTE: return t('roles.gerente');
      case Rol.CAPATAZ: return t('roles.capataz');
      default: return t('roles.trabajador');
    }
  };

  /** Abre el modal de cambio de rol */
  const abrirModalRol = (usuario: Perfil) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(String(usuario.id_rol));
    setModalRol(true);
  };

  /** Confirma el cambio de rol */
  const confirmarCambioRol = async () => {
    if (!usuarioSeleccionado) return;
    try {
      await AdminRepository.updateUserRole(usuarioSeleccionado.id, Number(nuevoRol));
      setMensaje({ tipo: 'success', texto: t('admin.roleUpdated') });
      setModalRol(false);
      cargarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar rol';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Abre el modal de confirmación de baja o alta */
  const abrirModalConfirm = (usuario: Perfil, accion: 'baja' | 'alta') => {
    setUsuarioSeleccionado(usuario);
    setAccionConfirm(accion);
    setModalConfirm(true);
  };

  /** Ejecuta la baja o reactivación del usuario */
  const confirmarAccion = async () => {
    if (!usuarioSeleccionado) return;
    try {
      if (accionConfirm === 'baja') {
        await AdminRepository.softDeleteUser(usuarioSeleccionado.id);
        setMensaje({ tipo: 'success', texto: t('admin.userDeactivated') });
      } else {
        await AdminRepository.reactivateUser(usuarioSeleccionado.id);
        setMensaje({ tipo: 'success', texto: t('admin.userReactivated') });
      }
      setModalConfirm(false);
      cargarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la operación';
      setMensaje({ tipo: 'error', texto: msg });
    }
  };

  /** Opciones para el select de roles */
  const opcionesRol = [
    { value: String(Rol.ADMIN), label: t('roles.admin') },
    { value: String(Rol.GERENTE), label: t('roles.gerente') },
    { value: String(Rol.CAPATAZ), label: t('roles.capataz') },
    { value: String(Rol.TRABAJADOR), label: t('roles.trabajador') },
  ];

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: t('common.name'), render: (u: Perfil) => `${u.nombre} ${u.apellidos}` },
    { key: 'email', header: t('common.email') },
    { key: 'dni', header: t('auth.dni') },
    {
      key: 'id_rol',
      header: t('common.role'),
      render: (u: Perfil) => (
        <Badge variant={getBadgeVariant(u.id_rol)}>{getRolNombre(u.id_rol)}</Badge>
      ),
    },
    {
      key: 'estado',
      header: t('common.status'),
      render: (u: Perfil) => (
        <Badge variant={u.fecha_baja ? 'error' : 'success'}>
          {u.fecha_baja ? t('admin.inactive') : t('admin.active')}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: t('common.actions'),
      render: (u: Perfil) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => abrirModalRol(u)}>
            {t('admin.changeRole')}
          </Button>
          {u.fecha_baja ? (
            <Button variant="accent" onClick={() => abrirModalConfirm(u, 'alta')}>
              {t('admin.reactivate')}
            </Button>
          ) : (
            <Button variant="danger" onClick={() => abrirModalConfirm(u, 'baja')}>
              {t('admin.deactivate')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text={t('admin.loadingUsers')} />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">{t('admin.userManagement')}</h2>

      {/* Alerta de feedback */}
      {mensaje && (
        <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Buscador */}
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder={t('admin.searchUsers')} />

      {/* Tabla de usuarios */}
      <Table<Perfil> columns={columnas} data={usuariosFiltrados} emptyMessage={t('admin.noUsersFound')} />

      {/* Modal de cambio de rol */}
      <Modal isOpen={modalRol} onClose={() => setModalRol(false)} title={t('admin.changeRole')}>
        <div className="space-y-4">
          <p>
            {t('admin.changingRoleOf')} <strong>{usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellidos}</strong>
          </p>
          <Select
            options={opcionesRol}
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            name="nuevoRol"
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={confirmarCambioRol}>{t('common.confirm')}</Button>
            <Button variant="secondary" onClick={() => setModalRol(false)}>{t('common.cancel')}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación baja/alta */}
      <Modal isOpen={modalConfirm} onClose={() => setModalConfirm(false)} title={t('admin.confirmAction')}>
        <div className="space-y-4">
          <p>
            {accionConfirm === 'baja' ? t('admin.confirmDeactivate') : t('admin.confirmReactivate')}{' '}
            <strong>{usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellidos}</strong>?
          </p>
          <div className="flex gap-3">
            <Button variant={accionConfirm === 'baja' ? 'danger' : 'accent'} onClick={confirmarAccion}>
              {accionConfirm === 'baja' ? t('admin.deactivate') : t('admin.reactivate')}
            </Button>
            <Button variant="secondary" onClick={() => setModalConfirm(false)}>{t('common.cancel')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
