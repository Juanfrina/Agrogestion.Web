/**
 * @file UserTable.tsx
 * @description Tabla de gestión de usuarios — el admin puede ver, buscar, cambiar roles y dar de baja.
 *
 * Carga todos los usuarios del sistema y los muestra en una tabla con acciones.
 * Tiene buscador para filtrar por nombre o email y modales de confirmación.
 */

import { useState, useEffect } from 'react';
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
  }, []);

  /** Trae todos los usuarios del repo */
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await AdminRepository.getAllUsers();
      setUsuarios(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar usuarios';
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
      case Rol.ADMIN: return 'Admin';
      case Rol.GERENTE: return 'Gerente';
      case Rol.CAPATAZ: return 'Capataz';
      default: return 'Trabajador';
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
      setMensaje({ tipo: 'success', texto: 'Rol actualizado correctamente' });
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
        setMensaje({ tipo: 'success', texto: 'Usuario dado de baja' });
      } else {
        await AdminRepository.reactivateUser(usuarioSeleccionado.id);
        setMensaje({ tipo: 'success', texto: 'Usuario reactivado' });
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
    { value: String(Rol.ADMIN), label: 'Administrador' },
    { value: String(Rol.GERENTE), label: 'Gerente' },
    { value: String(Rol.CAPATAZ), label: 'Capataz' },
    { value: String(Rol.TRABAJADOR), label: 'Trabajador' },
  ];

  /** Columnas de la tabla */
  const columnas = [
    { key: 'nombre', header: 'Nombre', render: (u: Perfil) => `${u.nombre} ${u.apellidos}` },
    { key: 'email', header: 'Email' },
    { key: 'dni', header: 'DNI' },
    {
      key: 'id_rol',
      header: 'Rol',
      render: (u: Perfil) => (
        <Badge variant={getBadgeVariant(u.id_rol)}>{getRolNombre(u.id_rol)}</Badge>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (u: Perfil) => (
        <Badge variant={u.fecha_baja ? 'error' : 'success'}>
          {u.fecha_baja ? 'Baja' : 'Activo'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (u: Perfil) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => abrirModalRol(u)}>
            Cambiar Rol
          </Button>
          {u.fecha_baja ? (
            <Button variant="accent" onClick={() => abrirModalConfirm(u, 'alta')}>
              Reactivar
            </Button>
          ) : (
            <Button variant="danger" onClick={() => abrirModalConfirm(u, 'baja')}>
              Dar de Baja
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Spinner size="lg" text="Cargando usuarios..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>

      {/* Alerta de feedback */}
      {mensaje && (
        <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Buscador */}
      <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o email..." />

      {/* Tabla de usuarios */}
      <Table columns={columnas} data={usuariosFiltrados} emptyMessage="No se encontraron usuarios" />

      {/* Modal de cambio de rol */}
      <Modal isOpen={modalRol} onClose={() => setModalRol(false)} title="Cambiar Rol">
        <div className="space-y-4">
          <p>
            Cambiando rol de <strong>{usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellidos}</strong>
          </p>
          <Select
            options={opcionesRol}
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            name="nuevoRol"
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={confirmarCambioRol}>Confirmar</Button>
            <Button variant="secondary" onClick={() => setModalRol(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación baja/alta */}
      <Modal isOpen={modalConfirm} onClose={() => setModalConfirm(false)} title="Confirmar Acción">
        <div className="space-y-4">
          <p>
            ¿Seguro que quieres {accionConfirm === 'baja' ? 'dar de baja' : 'reactivar'} a{' '}
            <strong>{usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellidos}</strong>?
          </p>
          <div className="flex gap-3">
            <Button variant={accionConfirm === 'baja' ? 'danger' : 'accent'} onClick={confirmarAccion}>
              {accionConfirm === 'baja' ? 'Dar de Baja' : 'Reactivar'}
            </Button>
            <Button variant="secondary" onClick={() => setModalConfirm(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
