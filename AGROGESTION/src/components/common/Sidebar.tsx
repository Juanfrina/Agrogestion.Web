/**
 * @file Sidebar.tsx
 * @description Barra lateral de navegación según el rol del usuario.
 *
 * Aquí mostramos los enlaces de navegación que corresponden a cada rol.
 * Un admin ve "Dashboard" y "Usuarios", un gerente ve "Terrenos" y "Tareas", etc.
 * Usa NavLink de react-router-dom para resaltar la ruta activa.
 */

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../lib/types';

/** Enlaces según el rol — cada rol ve menús diferentes */
const linksByRole: Record<number, { to: string; labelKey: string }[]> = {
  [Rol.ADMIN]: [
    { to: '/admin', labelKey: 'nav.dashboard' },
    { to: '/admin/usuarios', labelKey: 'nav.usuarios' },
    { to: '/perfil', labelKey: 'nav.perfil' },
  ],
  [Rol.GERENTE]: [
    { to: '/gerente', labelKey: 'nav.dashboard' },
    { to: '/gerente/terrenos', labelKey: 'nav.terrenos' },
    { to: '/gerente/tareas', labelKey: 'nav.tareas' },
    { to: '/gerente/equipo', labelKey: 'nav.equipo' },
    { to: '/perfil', labelKey: 'nav.perfil' },
  ],
  [Rol.CAPATAZ]: [
    { to: '/capataz', labelKey: 'nav.dashboard' },
    { to: '/capataz/tareas', labelKey: 'nav.tareas' },
    { to: '/capataz/trabajadores', labelKey: 'nav.trabajadores' },
    { to: '/perfil', labelKey: 'nav.perfil' },
  ],
  [Rol.TRABAJADOR]: [
    { to: '/trabajador', labelKey: 'nav.dashboard' },
    { to: '/trabajador/mis-tareas', labelKey: 'nav.misTareas' },
    { to: '/perfil', labelKey: 'nav.perfil' },
  ],
};

/**
 * Sidebar de navegación — muestra enlaces según el rol del usuario.
 * Cada enlace resalta cuando está activo (fondo primary-light).
 */
export default function Sidebar() {
  const { perfil } = useAuth();
  const { t } = useTranslation();

  /** Si no hay perfil, no mostramos nada */
  if (!perfil) return null;

  /** Sacamos los enlaces que corresponden al rol */
  const links = linksByRole[perfil.id_rol] || [];

  return (
    <aside
      className="sidebar flex flex-col gap-1 p-4"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
          }
        >
          {t(link.labelKey as never)}
        </NavLink>
      ))}
    </aside>
  );
}
