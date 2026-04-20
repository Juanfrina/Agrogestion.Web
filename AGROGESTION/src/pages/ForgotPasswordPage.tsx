/**
 * @file ForgotPasswordPage.tsx
 * @description Página pública donde el usuario solicita un enlace de recuperación.
 *
 * Centra el ForgotPasswordForm en pantalla, igual que la página de Login.
 */

import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

/**
 * Página wrapper del formulario de "¿Olvidaste tu contraseña?".
 */
export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}
