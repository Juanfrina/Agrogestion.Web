/**
 * @file Sidebar.tsx
 * @description Barra lateral de navegación según el rol del usuario.
 *
 * Aquí mostramos los enlaces de navegación que corresponden a cada rol.
 * Un admin ve "Dashboard" y "Usuarios", un gerente ve "Terrenos" y "Tareas", etc.
 * Usa NavLink de react-router-dom para resaltar la ruta activa.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../lib/types';

/** Definición de un enlace del sidebar */
interface SidebarLink {
  to: string;
  label: string;
}

/** Enlaces según el rol — cada rol ve menús diferentes */
const linksByRole: Record<number, SidebarLink[]> = {
  [Rol.ADMIN]: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/usuarios', label: 'Usuarios' },
  ],
  [Rol.GERENTE]: [
    { to: '/gerente', label: 'Dashboard' },
    { to: '/gerente/terrenos', label: 'Terrenos' },
    { to: '/gerente/tareas', label: 'Tareas' },
  ],
  [Rol.CAPATAZ]: [
    { to: '/capataz', label: 'Dashboard' },
    { to: '/capataz/tareas', label: 'Tareas' },
    { to: '/capataz/trabajadores', label: 'Trabajadores' },
  ],
  [Rol.TRABAJADOR]: [
    { to: '/trabajador', label: 'Dashboard' },
    { to: '/trabajador/mis-tareas', label: 'Mis Tareas' },
  ],
};

/**
 * Sidebar de navegación — muestra enlaces según el rol del usuario.
 * Cada enlace resalta cuando está activo (fondo primary-light).
 */
export default function Sidebar() {
  const { perfil } = useAuth();

  /** Si no hay perfil, no mostramos nada */
  if (!perfil) return null;

  /** Sacamos los enlaces que corresponden al rol */
  const links = linksByRole[perfil.id_rol] || [];

  return (
    <aside
      className="flex flex-col gap-1 p-4"
      style={{
        width: '16rem',
        minHeight: '100%',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className="block px-4 py-2 rounded-[var(--radius-md)] no-underline"
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
            color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
            fontWeight: isActive ? 600 : 400,
            transition: 'var(--transition-fast)',
          })}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
