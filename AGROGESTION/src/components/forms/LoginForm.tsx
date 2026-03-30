/**
 * @file LoginForm.tsx
 * @description Formulario de inicio de sesión.
 *
 * Esto maneja el login completo: campos de email y contraseña,
 * validación, llamada al AuthRepository y gestión de errores.
 * Si el login va bien, llama a onSuccess o navega a /dashboard.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import { useAuthStore } from '../../store/authStore';
import InputField from './InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';
import { isValidEmail } from '../../utils/validators';

interface LoginFormProps {
  /** Callback opcional tras login exitoso — si no se pasa, navega a / */
  onSuccess?: () => void;
}

/**
 * Formulario de login — gestiona estado, validación y envío.
 * Usa InputField y Button para mantener consistencia visual.
 */
export default function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { setPerfil, setSession } = useAuthStore();

  /** Estado del formulario */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Envía las credenciales al servidor */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* Validación básica */
    if (!isValidEmail(email)) {
      setError('Introduce un email válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const data = await AuthRepository.signIn(email, password);
      setSession(data.session);

      /* Traemos el perfil del usuario */
      const perfil = await AuthRepository.getPerfil(data.user.id);
      setPerfil(perfil);

      /* Éxito: callback custom o navegación por defecto */
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">Iniciar sesión</h2>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <InputField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
      />

      <InputField
        label="Contraseña"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••"
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        Entrar
      </Button>
    </form>
  );
}
