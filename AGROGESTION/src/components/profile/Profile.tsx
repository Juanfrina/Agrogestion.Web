/**
 * @file Profile.tsx
 * @description Perfil de usuario — aquí puedes ver y editar tus datos personales.
 *
 * Muestra la info del usuario logueado en una tarjeta bonita.
 * Si le das a "Editar Perfil", los campos se vuelven editables.
 * El DNI, email y rol no se pueden cambiar (eso lo gestiona el admin).
 * También tiene una sección para cambiar la contraseña.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import Card from '../cards/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import InputField from '../forms/InputField';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import ResetPasswordForm from '../forms/ResetPasswordForm';

/**
 * Componente de perfil de usuario.
 * Muestra los datos del usuario y permite editarlos (los que se pueden).
 *
 * @returns La vista de perfil con modo lectura y modo edición
 */
export default function Profile() {
  const { perfil, loading, roleName } = useAuth();
  const { t } = useTranslation();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Campos editables del formulario
  const [form, setForm] = useState({
    nombre: perfil?.nombre ?? '',
    apellidos: perfil?.apellidos ?? '',
    email: perfil?.email ?? '',
    tlf: perfil?.tlf ?? '',
    direccion: perfil?.direccion ?? '',
  });

  if (loading) return <Spinner size="lg" text={t('common.loading')} />;
  if (!perfil) return <Alert type="error" message={t('profile.errorLoading')} />;

  /** Handler genérico para los inputs */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Activa el modo edición y sincroniza los datos actuales */
  const activarEdicion = () => {
    setForm({
      nombre: perfil.nombre,
      apellidos: perfil.apellidos,
      email: perfil.email,
      tlf: perfil.tlf,
      direccion: perfil.direccion,
    });
    setEditando(true);
    setMensaje(null);
  };

  /** Guarda los cambios del perfil */
  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      // Si el email cambió, actualizamos en Auth + perfiles
      if (form.email !== perfil.email) {
        await AuthRepository.updateEmail(perfil.id, form.email);
      }
      await AuthRepository.updatePerfil(perfil.id, {
        nombre: form.nombre,
        apellidos: form.apellidos,
        tlf: form.tlf,
        direccion: form.direccion,
      });
      setMensaje({ tipo: 'success', texto: t('profile.profileUpdated') });
      setEditando(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('profile.errorSaving');
      setMensaje({ tipo: 'error', texto: msg });
    } finally {
      setGuardando(false);
    }
  };

  /** Mapea el nombre del rol a la variante del Badge */
  const badgeVariant = (): 'admin' | 'gerente' | 'capataz' | 'trabajador' => {
    const mapa: Record<string, 'admin' | 'gerente' | 'capataz' | 'trabajador'> = {
      Administrador: 'admin',
      Gerente: 'gerente',
      Capataz: 'capataz',
      Trabajador: 'trabajador',
    };
    return mapa[roleName ?? ''] ?? 'trabajador';
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Alerta de feedback */}
      {mensaje && (
        <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Tarjeta con los datos del usuario */}
      <Card title={t('profile.title')}>
        <div className="space-y-4">
          {/* Datos que NO se pueden editar */}
          <div className="flex items-center gap-3">
            <Badge variant={badgeVariant()}>{roleName}</Badge>
          </div>
          <p><strong>{t('auth.dni')}:</strong> {perfil.dni}</p>

          {/* Datos editables */}
          {editando ? (
            <div className="space-y-3">
              <InputField label={t('auth.email')} name="email" type="email" value={form.email} onChange={handleChange} required />
              <InputField label={t('auth.name')} name="nombre" type="text" value={form.nombre} onChange={handleChange} required />
              <InputField label={t('auth.surname')} name="apellidos" type="text" value={form.apellidos} onChange={handleChange} required />
              <InputField label={t('auth.phone')} name="tlf" type="text" value={form.tlf} onChange={handleChange} />
              <InputField label={t('auth.address')} name="direccion" type="text" value={form.direccion} onChange={handleChange} />
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleGuardar} loading={guardando}>
                  {t('common.save')}
                </Button>
                <Button variant="secondary" onClick={() => setEditando(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>{t('auth.email')}:</strong> {perfil.email}</p>
              <p><strong>{t('auth.name')}:</strong> {perfil.nombre} {perfil.apellidos}</p>
              <p><strong>{t('auth.phone')}:</strong> {perfil.tlf}</p>
              <p><strong>{t('auth.address')}:</strong> {perfil.direccion}</p>
              <Button variant="primary" onClick={activarEdicion}>
                {t('profile.editProfile')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Sección para cambiar la contraseña */}
      <Card title={t('profile.changePassword')}>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
