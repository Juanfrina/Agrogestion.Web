import Layout from '../components/common/Layout';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';

/** Página de reseteo de contraseña, envuelve el formulario en el layout general */
export default function ResetPasswordPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6">Cambiar Contraseña</h1>
        <ResetPasswordForm />
      </div>
    </Layout>
  );
}
