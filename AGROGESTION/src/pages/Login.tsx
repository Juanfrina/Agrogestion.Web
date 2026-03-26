/**
 * @file Login.tsx
 * @description Página de inicio de sesión — donde el usuario mete su email y contraseña.
 *
 * El formulario valida los campos, llama a AuthRepository.signIn() y si todo va bien
 * redirige al dashboard (que a su vez te manda a la página de tu rol).
 *
 * Supabase se encarga de verificar la contraseña contra el hash bcrypt.
 * Nosotros solo mandamos email + password y esperamos la respuesta.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthRepository } from '../database/repositories/AuthRepository';

/**
 * Componente de Login.
 * Renderiza el formulario de inicio de sesión con validación y manejo de errores.
 *
 * @returns Formulario de login con email, contraseña y enlace a registro
 */
export default function Login() {
  const navigate = useNavigate();

  // Estado local del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Maneja el envío del formulario.
   * Llama a Supabase Auth para verificar las credenciales.
   * Si todo OK → /dashboard. Si falla → muestra el error.
   *
   * @param e - Evento del formulario (preventDefault para evitar recarga)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AuthRepository.signIn(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="form-card space-y-4">
        {/* Título del formulario */}
        <h1 className="text-center">Iniciar Sesión</h1>

        {/* Mensaje de error (solo visible si hay error) */}
        {error && <p className="form-error">{error}</p>}

        {/* Campo de email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Botón de envío */}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Enlace al registro */}
        <p className="text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
