/**
 * @file Header.tsx
 * @description Cabecera principal de la app (navbar).
 *
 * Esto muestra la barra de navegación superior con el nombre de la app,
 * el nombre del usuario, su rol en un badge y un botón para cerrar sesión.
 * En móvil incluye botón hamburguesa para abrir/cerrar el sidebar.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import { useAuthStore } from '../../store/authStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import NotificationBell from './NotificationBell';

/** Mapeamos el nombre del rol a la variante del badge */
function rolToBadgeVariant(roleName: string | null) {
  switch (roleName) {
    case 'Administrador': return 'admin' as const;
    case 'Gerente': return 'gerente' as const;
    case 'Capataz': return 'capataz' as const;
    case 'Trabajador': return 'trabajador' as const;
    default: return 'trabajador' as const;
  }
}

interface HeaderProps {
  onToggleSidebar?: () => void;
}

/**
 * Cabecera de la app — usa la clase "navbar" del CSS global.
 * Lee el estado del usuario con useAuth() y maneja el logout.
 */
export default function Header({ onToggleSidebar }: HeaderProps) {
  const { perfil, isAuthenticated, roleName } = useAuth();
  const reset = useAuthStore((s) => s.reset);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /** Cierra sesión, limpia el store y redirige al login */
  const handleLogout = async () => {
    try {
      await AuthRepository.signOut();
      reset();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <header className="navbar">
      <div className="flex items-center gap-2">
        {/* Botón hamburguesa — solo en móvil */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-(--color-text-on-primary) text-2xl leading-none p-1"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        )}
        {/* Nombre de la app */}
        <h1 className="text-xl font-bold m-0 text-(--color-text-on-primary)">
          {t('app.name')}
        </h1>
      </div>

      {/* Lado derecho: info del usuario + logout */}
      {isAuthenticated && perfil && (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Campanita de notificaciones para capataz y trabajador */}
          {(perfil.id_rol === 3 || perfil.id_rol === 4) && (
            <NotificationBell userId={perfil.id} />
          )}
          <span className="hidden sm:inline text-(--color-text-on-primary)">
            {perfil.nombre} {perfil.apellidos}
          </span>
          <Badge variant={rolToBadgeVariant(roleName)}>
            {roleName}
          </Badge>
          <Button variant="danger" onClick={handleLogout}>
            {t('nav.logout')}
          </Button>
        </div>
      )}
    </header>
  );
}
