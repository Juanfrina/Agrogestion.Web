/**
 * @file ForgotPasswordForm.tsx
 * @description Formulario para solicitar un enlace de recuperación de contraseña.
 *
 * El usuario introduce su email y Supabase le envía un correo con un link mágico.
 * Al pulsar ese link, la app detecta el evento PASSWORD_RECOVERY y le lleva
 * al formulario de nueva contraseña.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import InputField from './InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';
import { isValidEmail } from '../../utils/validators';

/**
 * Formulario de recuperación de contraseña.
 * Pide el email, llama a resetPasswordForEmail y muestra confirmación.
 */
export default function ForgotPasswordForm() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Errores y estado "tocado" para validación en tiempo real */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /** Valida el campo email al perder foco */
  const validateField = () => {
    setTouched((p) => ({ ...p, email: true }));
    const errs = { ...fieldErrors };

    if (!email.trim()) errs.email = t('auth.errorEmailRequired');
    else if (!isValidEmail(email)) errs.email = t('auth.errorEmailInvalid');
    else delete errs.email;

    setFieldErrors(errs);
  };

  /** Envía la solicitud de recuperación */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    /* Forzamos validación */
    setTouched({ email: true });
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = t('auth.errorEmailRequired');
    else if (!isValidEmail(email)) errs.email = t('auth.errorEmailInvalid');

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      await AuthRepository.resetPasswordForEmail(email, redirectTo);
      setSuccess(true);
    } catch {
      setError(t('auth.errorResetPassword'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">{t('auth.forgotPasswordTitle')}</h2>

      <p className="text-center text-sm opacity-70">
        {t('auth.forgotPasswordDesc')}
      </p>

      {success && (
        <Alert
          type="success"
          message={t('auth.resetLinkSent')}
          onClose={() => setSuccess(false)}
        />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {!success && (
        <>
          <InputField
            label={t('auth.email')}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField()}
            error={touched.email ? fieldErrors.email : undefined}
            valid={touched.email && !fieldErrors.email && email.length > 0}
            placeholder={t('auth.placeholderEmail')}
            required
          />

          <Button type="submit" variant="primary" loading={loading}>
            {t('auth.sendResetLink')}
          </Button>
        </>
      )}

      <div className="flex items-center justify-center text-[0.88rem]">
        <Link to="/login" className="text-(--color-primary)">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </form>
  );
}
