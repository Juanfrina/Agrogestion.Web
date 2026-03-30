/**
 * @file Header.tsx
 * @description Cabecera principal de la app (navbar).
 *
 * Esto muestra la barra de navegación superior con el nombre de la app,
 * el nombre del usuario, su rol en un badge y un botón para cerrar sesión.
 * Si no hay sesión, no muestra nada (o podrías poner un link a login).
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { AuthRepository } from '../../database/repositories/AuthRepository';
import { useAuthStore } from '../../store/authStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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

/**
 * Cabecera de la app — usa la clase "navbar" del CSS global.
 * Lee el estado del usuario con useAuth() y maneja el logout.
 */
export default function Header() {
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
      {/* Lado izquierdo: nombre de la app */}
      <h1 className="text-xl font-bold m-0" style={{ color: 'var(--color-text-on-primary)' }}>
        {t('app.name')}
      </h1>

      {/* Lado derecho: info del usuario + logout */}
      {isAuthenticated && perfil && (
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--color-text-on-primary)' }}>
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
