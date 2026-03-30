/**
 * @file RegistroForm.tsx
 * @description Formulario de registro con validación en tiempo real.
 *
 * Valida cada campo al perder el foco (onBlur): formato de DNI, email,
 * teléfono, contraseñas, etc. Además comprueba en Supabase si el email
 * ya existe. Incluye botón "Volver" para cancelar el registro.
 */

import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  isValidName,
} from '../../utils/validators';
import { Rol } from '../../lib/types';

interface RegistroFormProps {
  onSuccess?: () => void;
}

const rolOptions = [
  { value: Rol.GERENTE, label: 'roles.gerente' },
  { value: Rol.CAPATAZ, label: 'roles.capataz' },
  { value: Rol.TRABAJADOR, label: 'roles.trabajador' },
];

/**
 * Formulario de registro con validación en tiempo real y botón de volver.
 */
export default function RegistroForm({ onSuccess }: RegistroFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  /** Actualiza un campo */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    /* Limpiamos error al escribir */
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  /** Validación por campo individual (onBlur) */
  const validateField = useCallback(
    async (name: string) => {
      setTouched((p) => ({ ...p, [name]: true }));
      const errs = { ...errors };

      switch (name) {
        case 'nombre':
          if (!isNotEmpty(form.nombre)) errs.nombre = t('auth.errorNameRequired');
          else if (!isValidName(form.nombre)) errs.nombre = t('auth.errorNameInvalid');
          else delete errs.nombre;
          break;
        case 'apellidos':
          if (!isNotEmpty(form.apellidos)) errs.apellidos = t('auth.errorSurnameRequired');
          else if (!isValidName(form.apellidos)) errs.apellidos = t('auth.errorSurnameInvalid');
          else delete errs.apellidos;
          break;
        case 'dni':
          if (!form.dni.trim()) errs.dni = t('auth.errorDniRequired');
          else if (!isValidDNI(form.dni)) errs.dni = t('auth.errorDniInvalid');
          else delete errs.dni;
          break;
        case 'email':
          if (!form.email.trim()) {
            errs.email = t('auth.errorEmailRequired');
          } else if (!isValidEmail(form.email)) {
            errs.email = t('auth.errorEmailInvalid');
          } else {
            /* Comprobar si ya existe en la BD */
            setCheckingEmail(true);
            try {
              const taken = await AuthRepository.isEmailTaken(form.email);
              if (taken) errs.email = t('auth.errorEmailTaken');
              else delete errs.email;
            } catch {
              delete errs.email; /* Si falla la comprobación, no bloqueamos */
            } finally {
              setCheckingEmail(false);
            }
          }
          break;
        case 'tlf':
          if (!form.tlf.trim()) errs.tlf = t('auth.errorPhoneRequired');
          else if (!isValidPhone(form.tlf)) errs.tlf = t('auth.errorPhoneInvalid');
          else delete errs.tlf;
          break;
        case 'direccion':
          if (!isNotEmpty(form.direccion)) errs.direccion = t('auth.errorAddressRequired');
          else delete errs.direccion;
          break;
        case 'password':
          if (!form.password) errs.password = t('auth.errorPasswordRequired');
          else if (!isValidPassword(form.password)) errs.password = t('auth.errorPasswordMin');
          else delete errs.password;
          /* Si ya tocó confirmar, re-validamos */
          if (touched.confirmPassword) {
            if (form.confirmPassword && form.password !== form.confirmPassword)
              errs.confirmPassword = t('auth.errorPasswordMatch');
            else if (form.confirmPassword) delete errs.confirmPassword;
          }
          break;
        case 'confirmPassword':
          if (!form.confirmPassword) errs.confirmPassword = t('auth.errorConfirmRequired');
          else if (form.password !== form.confirmPassword) errs.confirmPassword = t('auth.errorPasswordMatch');
          else delete errs.confirmPassword;
          break;
        case 'id_rol':
          if (!form.id_rol) errs.id_rol = t('auth.errorRoleRequired');
          else delete errs.id_rol;
          break;
      }

      setErrors(errs);
    },
    [form, errors, touched],
  );

  /** ¿El campo ha sido tocado y no tiene error? */
  const isValid = (name: string) =>
    touched[name] && !errors[name] && isNotEmpty(String(form[name as keyof typeof form]));

  /** Envía el registro */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    /* Marcamos todos como tocados y validamos */
    const allFields = ['nombre', 'apellidos', 'dni', 'email', 'tlf', 'direccion', 'password', 'confirmPassword', 'id_rol'];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((f) => (newTouched[f] = true));
    setTouched(newTouched);

    const newErrors: Record<string, string> = {};
    if (!isNotEmpty(form.nombre)) newErrors.nombre = t('auth.errorNameRequired');
    else if (!isValidName(form.nombre)) newErrors.nombre = t('auth.errorNameInvalid');
    if (!isNotEmpty(form.apellidos)) newErrors.apellidos = t('auth.errorSurnameRequired');
    else if (!isValidName(form.apellidos)) newErrors.apellidos = t('auth.errorSurnameInvalid');
    if (!isValidDNI(form.dni)) newErrors.dni = t('auth.errorDniInvalid');
    if (!isValidEmail(form.email)) newErrors.email = t('auth.errorEmailInvalid');
    if (!isValidPhone(form.tlf)) newErrors.tlf = t('auth.errorPhoneInvalid');
    if (!isNotEmpty(form.direccion)) newErrors.direccion = t('auth.errorAddressRequired');
    if (!isValidPassword(form.password)) newErrors.password = t('auth.errorPasswordMin');
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = t('auth.errorPasswordMatch');
    if (!form.id_rol) newErrors.id_rol = t('auth.errorRoleRequired');

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const taken = await AuthRepository.isEmailTaken(form.email);
      if (taken) {
        setErrors((p) => ({ ...p, email: t('auth.errorEmailTaken') }));
        setLoading(false);
        return;
      }

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

      onSuccess ? onSuccess() : navigate('/login');
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : t('auth.errorRegister'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card flex flex-col gap-4">
      <h2 className="text-center">{t('auth.register')}</h2>

      {globalError && (
        <Alert type="error" message={globalError} onClose={() => setGlobalError('')} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t('auth.name')}
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          onBlur={() => validateField('nombre')}
          error={touched.nombre ? errors.nombre : undefined}
          valid={isValid('nombre')}
          placeholder={t('auth.placeholderName')}
          required
        />
        <InputField
          label={t('auth.surname')}
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          onBlur={() => validateField('apellidos')}
          error={touched.apellidos ? errors.apellidos : undefined}
          valid={isValid('apellidos')}
          placeholder={t('auth.placeholderSurname')}
          required
        />
        <InputField
          label={t('auth.dni')}
          name="dni"
          value={form.dni}
          onChange={handleChange}
          onBlur={() => validateField('dni')}
          error={touched.dni ? errors.dni : undefined}
          valid={isValid('dni')}
          placeholder={t('auth.placeholderDni')}
          hint={t('auth.hintDni')}
          maxLength={9}
          required
        />
        <InputField
          label={t('auth.email')}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={() => validateField('email')}
          error={touched.email ? errors.email : undefined}
          valid={isValid('email') && !checkingEmail}
          placeholder={t('auth.placeholderEmail')}
          hint={checkingEmail ? t('auth.checkingEmail') : undefined}
          required
        />
        <InputField
          label={t('auth.phone')}
          name="tlf"
          value={form.tlf}
          onChange={handleChange}
          onBlur={() => validateField('tlf')}
          error={touched.tlf ? errors.tlf : undefined}
          valid={isValid('tlf')}
          placeholder={t('auth.placeholderPhone')}
          hint={t('auth.hintPhone')}
          maxLength={9}
          required
        />
        <InputField
          label={t('auth.address')}
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          onBlur={() => validateField('direccion')}
          error={touched.direccion ? errors.direccion : undefined}
          valid={isValid('direccion')}
          placeholder={t('auth.placeholderAddress')}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {t('auth.role')} <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <Select
          name="id_rol"
          options={rolOptions.map(o => ({ ...o, label: t(o.label) }))}
          value={form.id_rol}
          onChange={(e) => { handleChange(e); setTouched((p) => ({ ...p, id_rol: true })); }}
          placeholder={t('auth.selectRole')}
        />
        {touched.id_rol && errors.id_rol && <span className="form-error">{errors.id_rol}</span>}
      </div>

      <InputField
        label={t('auth.password')}
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        onBlur={() => validateField('password')}
        error={touched.password ? errors.password : undefined}
        valid={isValid('password')}
        placeholder={t('auth.placeholderPassword')}
        required
      />
      <InputField
        label={t('auth.confirmPassword')}
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        onBlur={() => validateField('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        valid={isValid('confirmPassword')}
        placeholder={t('auth.placeholderConfirmPassword')}
        required
      />

      <Button type="submit" variant="primary" loading={loading}>
        {t('auth.register')}
      </Button>

      <div className="flex items-center justify-between" style={{ fontSize: '0.88rem' }}>
        <Link to="/login" style={{ color: 'var(--color-primary)' }}>
          {t('auth.hasAccount')}
        </Link>
        <Link to="/" className="btn-cancel">
          {t('common.back')}
        </Link>
      </div>
    </form>
  );
}
