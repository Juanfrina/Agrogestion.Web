/**
 * @file TrabajadorPage.tsx
 * @description Panel del Trabajador — ve sus tareas, las acepta y deja comentarios.
 *
 * De momento es un placeholder. Aquí irán:
 *   - Tareas asignadas (aceptar/rechazar)
 *   - Estado de las tareas en las que participa
 *   - Comentarios en tareas
 *   - Notificaciones
 */

import { AuthRepository } from '../database/repositories/AuthRepository';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Componente del panel de trabajador.
 * Solo accesible por usuarios con rol TRABAJADOR (id_rol = 4).
 *
 * @returns El panel de trabajador con header y mensaje de bienvenida
 */
export default function TrabajadorPage() {
  const { perfil } = useAuthStore();
  const navigate = useNavigate();

  /** Cierra la sesión y redirige al login */
  const handleLogout = async () => {
    await AuthRepository.signOut();
    navigate('/login');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1>Panel Trabajador</h1>
        <button onClick={handleLogout} className="btn-danger">Cerrar Sesión</button>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="badge badge-trabajador">Trabajador</span>
        <p>Bienvenido, {perfil?.nombre} {perfil?.apellidos}</p>
      </div>
    </div>
  );
}
