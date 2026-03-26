/**
 * @file Registro.tsx
 * @description Página de registro — aquí el usuario crea su cuenta nueva.
 *
 * El formulario recoge todos los datos personales + contraseña + rol.
 * Antes de crear la cuenta comprobamos:
 *   1. Que las contraseñas coincidan (validación local)
 *   2. Que el email no esté ya pillado (llamando a la función RPC de la BD)
 *   3. Que la contraseña tenga al menos 6 caracteres
 *
 * Si todo OK, llamamos a signUp() que crea el usuario en Supabase Auth
 * y el trigger de la BD crea automáticamente el perfil en la tabla "perfiles".
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthRepository } from '../database/repositories/AuthRepository';
import { Rol } from '../lib/types';

/**
 * Componente de Registro.
 * Formulario completo con todos los campos necesarios para darse de alta.
 *
 * @returns Formulario de registro con validaciones y selector de rol
 */
export default function Registro() {
  const navigate = useNavigate();

  // Estado del formulario — todos los campos que necesita la BD + confirmPassword
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    tlf: '',
    direccion: '',
    password: '',
    confirmPassword: '',
    id_rol: Rol.TRABAJADOR as number, // Por defecto, trabajador
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handler genérico para actualizar cualquier campo del formulario.
   * Usa el atributo "name" del input para saber qué campo actualizar.
   *
   * @param e - Evento de cambio del input o select
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Maneja el envío del formulario de registro.
   * Valida contraseñas → comprueba email → crea cuenta → redirige.
   *
   * @param e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación 1: las contraseñas tienen que ser iguales
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación 2: mínimo 6 caracteres (requisito de Supabase)
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Validación 3: comprobamos que el email esté libre
      const emailTaken = await AuthRepository.isEmailTaken(form.email);
      if (emailTaken) {
        setError('Este email ya está registrado');
        return;
      }

      // Quitamos confirmPassword que no va a la BD y registramos
      const { confirmPassword: _, ...registroData } = form;
      await AuthRepository.signUp({ ...registroData, id_rol: Number(registroData.id_rol) });

      // Si todo fue bien, al dashboard (que redirige según rol)
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="form-card space-y-4">
        {/* Título */}
        <h1 className="text-center">Registro</h1>

        {/* Mensaje de error */}
        {error && <p className="form-error">{error}</p>}

        {/* Datos personales */}
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required />
        <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required maxLength={9} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="tlf" placeholder="Teléfono" value={form.tlf} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />

        {/* Selector de rol (no incluye ADMIN — eso solo se pone a mano) */}
        <select name="id_rol" value={form.id_rol} onChange={handleChange}>
          <option value={Rol.GERENTE}>Gerente</option>
          <option value={Rol.CAPATAZ}>Capataz</option>
          <option value={Rol.TRABAJADOR}>Trabajador</option>
        </select>

        {/* Contraseña y confirmación */}
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Repite la contraseña" value={form.confirmPassword} onChange={handleChange} required />

        {/* Botón de registro */}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        {/* Enlace al login */}
        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
