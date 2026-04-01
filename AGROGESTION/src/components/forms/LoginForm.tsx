/**
 * @file LoginForm.tsx
 * @description Formulario de inicio de sesión con validación en tiempo real.
 *
 * Valida email y contraseña al perder el foco (onBlur). Muestra bordes
 * verdes/rojos según el estado. Incluye botón "Volver" para cancelar.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import { useAuthStore } from '../../store/authStore';
import InputField from './InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';
import { isValidEmail } from '../../utils/validators';

interface LoginFormProps {
  onSuccess?: () => void;
}

/**
 * Formulario de login con validación en tiempo real y botón de volver.
 */
export default function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setPerfil, setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Errores por campo (validación en tiempo real) */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  /** Campos que el usuario ya ha tocado */
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /** Valida un campo individual al perder foco */
  const validateField = (name: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = { ...fieldErrors };

    if (name === 'email') {
      if (!email.trim()) errs.email = t('auth.errorEmailRequired');
      else if (!isValidEmail(email)) errs.email = t('auth.errorEmailInvalid');
      else delete errs.email;
    }
    if (name === 'password') {
      if (!password) errs.password = t('auth.errorPasswordRequired');
      else if (password.length < 6) errs.password = t('auth.errorPasswordMin');
      else delete errs.password;
    }

    setFieldErrors(errs);
  };

  /** Envía credenciales */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* Forzamos validación de ambos campos */
    setTouched({ email: true, password: true });
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = t('auth.errorEmailRequired');
    else if (!isValidEmail(email)) errs.email = t('auth.errorEmailInvalid');
    if (!password) errs.password = t('auth.errorPasswordRequired');
    else if (password.length < 6) errs.password = t('auth.errorPasswordMin');

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const data = await AuthRepository.signIn(email, password);
      setSession(data.session);
      const perfil = await AuthRepository.getPerfil(data.user.id);
      setPerfil(perfil);
      if (onSuccess) { onSuccess(); } else { navigate('/dashboard'); }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.errorLogin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">{t('auth.login')}</h2>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <InputField
        label={t('auth.email')}
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateField('email')}
        error={touched.email ? fieldErrors.email : undefined}
        valid={touched.email && !fieldErrors.email && email.length > 0}
        placeholder={t('auth.placeholderEmail')}
        required
      />

      <InputField
        label={t('auth.password')}
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => validateField('password')}
        error={touched.password ? fieldErrors.password : undefined}
        valid={touched.password && !fieldErrors.password && password.length > 0}
        placeholder={t('auth.placeholderPassword')}
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        {t('auth.enter')}
      </Button>

      <div className="flex items-center justify-between text-[0.88rem]">
        <Link to="/registro" className="text-(--color-primary)">
          {t('auth.noAccount')}
        </Link>
        <Link to="/" className="btn-cancel">
          {t('common.back')}
        </Link>
      </div>
    </form>
  );
}
