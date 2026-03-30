/**
 * @file Registro.tsx
 * @description Página de registro — renderiza el formulario de registro centrado.
 */

import RegistroForm from '../components/forms/RegistroForm';

/**
 * Página wrapper del registro.
 * Centra el RegistroForm en la pantalla.
 *
 * @returns El formulario de registro centrado
 */
export default function Registro() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegistroForm />
    </div>
  );
}
