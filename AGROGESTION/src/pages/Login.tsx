/**
 * @file Login.tsx
 * @description Página de login — renderiza el formulario centrado en pantalla.
 */

import LoginForm from '../components/forms/LoginForm';

/**
 * Página wrapper del login.
 * Centra el LoginForm en la pantalla.
 *
 * @returns El formulario de login centrado
 */
export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
