/**
 * @file ResetPasswordPage.tsx
 * @description Página donde el usuario establece su nueva contraseña
 * tras pulsar el enlace de recuperación del email.
 *
 * Supabase inyecta tokens en la URL y detectSessionInUrl los procesa.
 * El AuthContext detecta el evento PASSWORD_RECOVERY y redirige aquí.
 */

import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';

/** Página de reseteo de contraseña, centra el formulario como Login */
export default function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <ResetPasswordForm onSuccess={() => navigate('/login')} />
      </div>
    </div>
  );
}
