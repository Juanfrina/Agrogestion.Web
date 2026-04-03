/**
 * @file NotificationBell.tsx
 * @description Campanita de notificaciones con contador — abre un modal con el listado.
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UsuarioRepository } from '../../database/repositories/UsuarioRepository';
import Modal from './Modal';

interface Notificacion {
  id_notificacion: number;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  leida: boolean;
  created_at: string;
}

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const { t } = useTranslation();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cargar = async () => {
    try {
      const data = await UsuarioRepository.getNotificaciones(userId);
      setNotificaciones(data as Notificacion[]);
      setUnread((data as Notificacion[]).filter((n) => !n.leida).length);
    } catch {
      /* silencioso */
    }
  };

  useEffect(() => {
    cargar();
    // Polling cada 30 segundos
    intervalRef.current = setInterval(cargar, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleMarkAllRead = async () => {
    try {
      await UsuarioRepository.markAllNotificacionesLeidas(userId);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setUnread(0);
    } catch {
      /* silencioso */
    }
  };

  const handleMarkOne = async (id: number) => {
    try {
      await UsuarioRepository.markNotificacionLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id_notificacion === id ? { ...n, leida: true } : n)),
      );
      setUnread((c) => Math.max(0, c - 1));
    } catch {
      /* silencioso */
    }
  };

  const tipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'TAREA_ASIGNADA': return '📋';
      case 'TAREA_ACEPTADA': return '✅';
      case 'TAREA_RECHAZADA': return '❌';
      case 'TAREA_EN_PROGRESO': return '🔄';
      case 'TAREA_COMPLETADA': return '🏁';
      case 'TRABAJADOR_ASIGNADO': return '👤';
      case 'TRABAJADOR_ACEPTO': return '👍';
      case 'TRABAJADOR_RECHAZO': return '👎';
      case 'COMENTARIO_NUEVO': return '💬';
      case 'ASOCIACION_NUEVA': return '🤝';
      default: return '🔔';
    }
  };

  return (
    <>
      {/* Botón campanita */}
      <button
        onClick={handleOpen}
        className="relative p-1 text-(--color-text-on-primary) hover:opacity-80 transition-opacity"
        aria-label={t('notif.title')}
        title={t('notif.title')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Modal de notificaciones */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title={t('notif.title')}>
        <div className="space-y-3">
          {/* Botón marcar todas como leídas */}
          {unread > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-(--color-primary) hover:underline font-medium"
              >
                {t('notif.markAllRead')}
              </button>
            </div>
          )}

          {/* Lista */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {notificaciones.length === 0 ? (
              <p className="text-center text-(--color-text-secondary) py-4">
                {t('notif.empty')}
              </p>
            ) : (
              notificaciones.map((n) => (
                <div
                  key={n.id_notificacion}
                  className={`p-3 rounded-md border transition-colors cursor-pointer ${
                    n.leida
                      ? 'bg-(--color-bg-main) border-(--color-border) opacity-60'
                      : 'bg-(--color-bg-card) border-(--color-primary-light) shadow-sm'
                  }`}
                  onClick={() => !n.leida && handleMarkOne(n.id_notificacion)}
                  title={!n.leida ? t('notif.markRead') : undefined}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{tipoIcon(n.tipo)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${!n.leida ? 'text-(--color-text-primary)' : ''}`}>
                          {n.titulo}
                        </span>
                        <span className="text-xs text-(--color-text-secondary) flex-shrink-0">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {n.mensaje && (
                        <p className="text-sm text-(--color-text-secondary) m-0 mt-1 line-clamp-2">
                          {n.mensaje}
                        </p>
                      )}
                    </div>
                    {!n.leida && (
                      <span className="w-2.5 h-2.5 rounded-full bg-(--color-primary) flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
