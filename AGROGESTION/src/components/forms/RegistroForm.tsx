/**
 * @file RegistroForm.tsx
 * @description Formulario de registro de nuevos usuarios.
 *
 * Esto tiene todos los campos necesarios para crear una cuenta:
 * nombre, apellidos, DNI, email, teléfono, dirección, rol y contraseña.
 * Valida todo antes de enviarlo al AuthRepository.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import InputField from './InputField';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Alert from '../common/Alert';
import {
  isValidDNI,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isNotEmpty,
} from '../../utils/validators';
import { Rol } from '../../lib/types';

interface RegistroFormProps {
  /** Callback opcional tras registro exitoso */
  onSuccess?: () => void;
}

/** Opciones del select de rol */
const rolOptions = [
  { value: Rol.GERENTE, label: 'Gerente' },
  { value: Rol.CAPATAZ, label: 'Capataz' },
  { value: Rol.TRABAJADOR, label: 'Trabajador' },
];

/**
 * Formulario de registro completo con validación.
 * Usa InputField, Select y Button para la UI.
 */
export default function RegistroForm({ onSuccess }: RegistroFormProps) {
  const navigate = useNavigate();

  /** Estado de todos los campos del formulario */
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    tlf: '',
    direccion: '',
    password: '',
    confirmPassword: '',
    id_rol: '' as string | number,
  });

  /** Errores de validación por campo */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Actualiza un campo del formulario */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiamos el error de ese campo cuando el usuario escribe
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /** Valida todos los campos y devuelve true si todo está bien */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isNotEmpty(form.nombre)) newErrors.nombre = 'El nombre es obligatorio';
    if (!isNotEmpty(form.apellidos)) newErrors.apellidos = 'Los apellidos son obligatorios';
    if (!isValidDNI(form.dni)) newErrors.dni = 'DNI no válido (8 dígitos + letra)';
    if (!isValidEmail(form.email)) newErrors.email = 'Email no válido';
    if (!isValidPhone(form.tlf)) newErrors.tlf = 'Teléfono no válido';
    if (!isNotEmpty(form.direccion)) newErrors.direccion = 'La dirección es obligatoria';
    if (!isValidPassword(form.password)) newErrors.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!form.id_rol) newErrors.id_rol = 'Selecciona un rol';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Envía el registro al servidor */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setLoading(true);
    try {
      /* Comprobamos si el email ya está registrado */
      const taken = await AuthRepository.isEmailTaken(form.email);
      if (taken) {
        setErrors((prev) => ({ ...prev, email: 'Este email ya está registrado' }));
        setLoading(false);
        return;
      }

      /* Enviamos los datos de registro */
      await AuthRepository.signUp({
        nombre: form.nombre,
        apellidos: form.apellidos,
        dni: form.dni.toUpperCase(),
        email: form.email,
        tlf: form.tlf,
        direccion: form.direccion,
        password: form.password,
        id_rol: Number(form.id_rol),
      });

      /* Éxito */
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/login');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar';
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">Registro</h2>

      {globalError && (
        <Alert type="error" message={globalError} onClose={() => setGlobalError('')} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />
        <InputField
          label="Apellidos"
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          error={errors.apellidos}
          required
        />
        <InputField
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          error={errors.dni}
          placeholder="12345678A"
          maxLength={9}
          required
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <InputField
          label="Teléfono"
          name="tlf"
          value={form.tlf}
          onChange={handleChange}
          error={errors.tlf}
          placeholder="612345678"
          required
        />
        <InputField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          error={errors.direccion}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Rol <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <Select
          name="id_rol"
          options={rolOptions}
          value={form.id_rol}
          onChange={handleChange}
          placeholder="Selecciona un rol"
        />
        {errors.id_rol && <span className="form-error">{errors.id_rol}</span>}
      </div>

      <InputField
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
      />
      <InputField
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        Registrarse
      </Button>
    </form>
  );
}
