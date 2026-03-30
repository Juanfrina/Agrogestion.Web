/**
 * @file ResetPasswordForm.tsx
 * @description Formulario para cambiar la contraseña.
 *
 * Esto le pide al usuario la nueva contraseña dos veces (para confirmar),
 * valida que coincidan y que tengan al menos 6 caracteres,
 * y luego llama a AuthRepository.updatePassword() para guardar el cambio.
 */

import { useState } from 'react';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import InputField from './InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';
import { isValidPassword } from '../../utils/validators';

/**
 * Formulario de cambio de contraseña.
 * Muestra una alerta de éxito cuando la contraseña se cambia correctamente.
 */
export default function ResetPasswordForm() {
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
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await AuthRepository.updatePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">Cambiar contraseña</h2>

      {success && (
        <Alert
          type="success"
          message="Contraseña actualizada correctamente"
          onClose={() => setSuccess(false)}
        />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <InputField
        label="Nueva contraseña"
        name="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Mínimo 6 caracteres"
        required
      />

      <InputField
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repite la contraseña"
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        Cambiar contraseña
      </Button>
    </form>
  );
}
