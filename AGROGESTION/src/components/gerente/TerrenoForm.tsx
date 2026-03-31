/**
 * @file TerrenoForm.tsx
 * @description Formulario para crear o editar un terreno.
 *
 * Si le pasas un terreno por props, entra en modo edición.
 * Si no le pasas nada, es creación. Usa InputField para los campos.
 */

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TerrenoRepository } from '../../database/repositories/TerrenoRepository';
import type { Terreno } from '../../interfaces/Terreno';
import InputField from '../forms/InputField';
import Button from '../ui/Button';
import Alert from '../common/Alert';

/** Props del formulario */
interface TerrenoFormProps {
  terreno?: Terreno;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Formulario de terreno (crear/editar).
 * Usa InputField para los campos y llama al repo para guardar.
 *
 * @param props - terreno opcional (si editas), callbacks onSave y onCancel
 * @returns El formulario con inputs y botones
 */
export default function TerrenoForm({ terreno, onSave, onCancel }: TerrenoFormProps) {
  const { perfil } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: terreno?.nombre ?? '',
    ubicacion: terreno?.ubicacion ?? '',
    tipo_cultivo: terreno?.tipo_cultivo ?? '',
  });

  /** Handler genérico para los inputs */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Guarda el terreno (crea o actualiza según si hay terreno en props) */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;

    setError('');
    setLoading(true);
    try {
      if (terreno) {
        await TerrenoRepository.update(terreno.id_terreno, form);
      } else {
        await TerrenoRepository.create(perfil.id, form);
      }
      onSave();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message)
        : 'Error al guardar terreno';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <InputField
        label="Nombre"
        name="nombre"
        type="text"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Finca El Olivar"
        required
      />
      <InputField
        label="Ubicación"
        name="ubicacion"
        type="text"
        value={form.ubicacion}
        onChange={handleChange}
        placeholder="Ej: Camino de la Viña, km 3"
        required
      />
      <InputField
        label="Tipo de Cultivo"
        name="tipo_cultivo"
        type="text"
        value={form.tipo_cultivo}
        onChange={handleChange}
        placeholder="Ej: Olivo, Viña, Cereal..."
        required
      />

      <div className="flex gap-3">
        <Button variant="primary" loading={loading} type="submit">
          {terreno ? 'Guardar Cambios' : 'Crear Terreno'}
        </Button>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
