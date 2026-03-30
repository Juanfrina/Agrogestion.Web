/**
 * @file TareaForm.tsx
 * @description Formulario para crear o editar una tarea.
 *
 * Recibe listas de terrenos y capataces por props para los selects.
 * Si le pasas una tarea existente, entra en modo edición.
 */

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import type { Tarea } from '../../interfaces/Tarea';
import type { Terreno } from '../../interfaces/Terreno';
import type { Perfil } from '../../interfaces/Perfil';
import InputField from '../forms/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../common/Alert';

/** Props del formulario de tarea */
interface TareaFormProps {
  tarea?: Tarea;
  terrenos: Terreno[];
  capataces: Perfil[];
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Formulario de tarea (crear/editar).
 * Usa InputField y Select para los campos, llama al repo para guardar.
 *
 * @param props - tarea opcional, listas de terrenos y capataces, callbacks
 * @returns El formulario con todos los campos de la tarea
 */
export default function TareaForm({ tarea, terrenos, capataces, onSave, onCancel }: TareaFormProps) {
  const { perfil } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: tarea?.nombre ?? '',
    descripcion: tarea?.descripcion ?? '',
    fecha_inicio: tarea?.fecha_inicio ?? '',
    fecha_fin: tarea?.fecha_fin ?? '',
    id_terreno: tarea?.id_terreno ? String(tarea.id_terreno) : '',
    id_capataz: tarea?.id_capataz ?? '',
  });

  /** Handler para inputs de texto y fecha */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Guarda la tarea (crea o actualiza) */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;

    setError('');
    setLoading(true);
    try {
      const datos = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        id_terreno: Number(form.id_terreno),
        id_capataz: form.id_capataz || undefined,
      };

      if (tarea) {
        await TareaRepository.update(tarea.id_tarea, datos);
      } else {
        await TareaRepository.create({ ...datos, id_gerente: perfil.id });
      }
      onSave();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar tarea';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /** Opciones de terrenos para el select */
  const opcionesTerreno = terrenos.map((t) => ({
    value: String(t.id_terreno),
    label: t.nombre,
  }));

  /** Opciones de capataces para el select */
  const opcionesCapataz = [
    { value: '', label: 'Sin asignar' },
    ...capataces.map((c) => ({
      value: c.id,
      label: `${c.nombre} ${c.apellidos}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <InputField
        label="Nombre de la tarea"
        name="nombre"
        type="text"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Poda de olivos zona norte"
        required
      />

      {/* Descripción como textarea */}
      <div>
        <label className="mb-1 block text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Describe qué hay que hacer..."
          rows={3}
          className="w-full rounded border p-2"
        />
      </div>

      <InputField
        label="Fecha de inicio"
        name="fecha_inicio"
        type="date"
        value={form.fecha_inicio}
        onChange={handleChange}
        required
      />
      <InputField
        label="Fecha de fin"
        name="fecha_fin"
        type="date"
        value={form.fecha_fin}
        onChange={handleChange}
        required
      />

      <Select
        options={opcionesTerreno}
        value={form.id_terreno}
        onChange={handleChange}
        name="id_terreno"
        placeholder="Selecciona un terreno"
      />

      <Select
        options={opcionesCapataz}
        value={form.id_capataz}
        onChange={handleChange}
        name="id_capataz"
        placeholder="Asignar capataz (opcional)"
      />

      <div className="flex gap-3">
        <Button variant="primary" loading={loading} type="submit">
          {tarea ? 'Guardar Cambios' : 'Crear Tarea'}
        </Button>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
