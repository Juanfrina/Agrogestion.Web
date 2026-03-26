/**
 * @file AdminPage.tsx
 * @description Panel del Administrador — control total del sistema.
 *
 * De momento es un placeholder con el nombre del usuario y un botón de logout.
 * Aquí irán las funciones de gestión de usuarios, ver estadísticas, etc.
 */

import { AuthRepository } from '../database/repositories/AuthRepository';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Componente del panel de administración.
 * Solo accesible por usuarios con rol ADMIN (id_rol = 1).
 *
 * @returns El panel de admin con header y mensaje de bienvenida
 */
export default function AdminPage() {
  const { perfil } = useAuthStore();
  const navigate = useNavigate();

  /** Cierra la sesión y redirige al login */
  const handleLogout = async () => {
    await AuthRepository.signOut();
    navigate('/login');
  };

  return (
    <div className="p-8">
      {/* Header con título y botón de logout */}
      <div className="flex items-center justify-between">
        <h1>Panel Admin</h1>
        <button onClick={handleLogout} className="btn-danger">Cerrar Sesión</button>
      </div>

      {/* Badge de rol y bienvenida */}
      <div className="mt-4 flex items-center gap-3">
        <span className="badge badge-admin">Admin</span>
        <p>Bienvenido, {perfil?.nombre} {perfil?.apellidos}</p>
      </div>
    </div>
  );
}
