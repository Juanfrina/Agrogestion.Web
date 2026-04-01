/**
 * @file TareaComentarios.tsx
 * @description Panel de comentarios de una tarea — ver historial y añadir nuevos.
 *
 * Componente reutilizable por capataces y trabajadores.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TareaRepository } from '../../database/repositories/TareaRepository';
import Alert from './Alert';
import Spinner from './Spinner';

interface Comentario {
  id_comentario: number;
  contenido: string;
  created_at: string;
  autor: { nombre: string; apellidos: string };
}

interface TareaComentariosProps {
  tareaId: number;
  autorId: string;
}

export default function TareaComentarios({ tareaId, autorId }: TareaComentariosProps) {
  const { t } = useTranslation();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await TareaRepository.getComments(tareaId);
      setComentarios(data as Comentario[]);
    } catch {
      setMensaje({ tipo: 'error', texto: t('tarea.errorComment') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tareaId]);

  const enviar = async () => {
    if (!texto.trim()) return;
    try {
      setEnviando(true);
      await TareaRepository.addComment(tareaId, autorId, texto.trim());
      setTexto('');
      setMensaje({ tipo: 'success', texto: t('tarea.commentAdded') });
      await cargar();
    } catch {
      setMensaje({ tipo: 'error', texto: t('tarea.errorComment') });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {mensaje && (
        <Alert type={mensaje.tipo} message={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Historial de comentarios */}
      <div className="space-y-3 max-h-75 overflow-y-auto">
        {comentarios.length === 0 ? (
          <p className="text-(--color-text-secondary)">{t('tarea.noComments')}</p>
        ) : (
          comentarios.map((c) => (
            <div
              key={c.id_comentario}
              className="p-3 rounded-md bg-(--color-bg-main) border border-(--color-border)"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">
                  {c.autor.nombre} {c.autor.apellidos}
                </span>
                <span className="text-xs text-(--color-text-secondary)">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
              <p className="m-0 text-sm">{c.contenido}</p>
            </div>
          ))
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      <div className="flex gap-2">
        <textarea
          className="input flex-1"
          rows={2}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={t('tarea.commentPlaceholder')}
        />
        <button
          className="btn btn-primary self-end"
          disabled={!texto.trim() || enviando}
          onClick={enviar}
        >
          {enviando ? t('common.loading') : t('tarea.send')}
        </button>
      </div>
    </div>
  );
}
