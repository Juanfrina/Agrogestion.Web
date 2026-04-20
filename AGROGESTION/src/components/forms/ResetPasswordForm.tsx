/**
 * @file ResetPasswordForm.tsx
 * @description Formulario para cambiar la contraseña.
 *
 * Esto le pide al usuario la nueva contraseña dos veces (para confirmar),
 * valida que coincidan y que tengan al menos 6 caracteres,
 * y luego llama a AuthRepository.updatePassword() para guardar el cambio.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import InputField from './InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';
import { isValidPassword } from '../../utils/validators';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

/**
 * Formulario de cambio de contraseña.
 * Muestra una alerta de éxito cuando la contraseña se cambia correctamente.
 * Si se pasa onSuccess, se llama tras cambiar la contraseña (ej: redirigir al login).
 */
export default function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  /** Estado de los campos */
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Envía la nueva contraseña */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    /* Validaciones */
    if (!isValidPassword(newPassword)) {
      setError(t('auth.errorPasswordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth.errorPasswordMatch'));
      return;
    }

    setLoading(true);
    try {
      await AuthRepository.updatePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('profile.errorChangePassword');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">{t('profile.changePassword')}</h2>

      {success && (
        <Alert
          type="success"
          message={t('profile.passwordUpdated')}
          onClose={() => setSuccess(false)}
        />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <InputField
        label={t('profile.newPassword')}
        name="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={t('auth.placeholderPassword')}
        required
      />

      <InputField
        label={t('profile.confirmNewPassword')}
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t('auth.placeholderConfirmPassword')}
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        {t('profile.changePassword')}
      </Button>
    </form>
  );
}
