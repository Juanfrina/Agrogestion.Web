/**
 * @file CapatazPage.tsx
 * @description Panel del Capataz — acepta tareas, asigna trabajadores y supervisa.
 *
 * De momento es un placeholder. Aquí irán:
 *   - Tareas asignadas (aceptar/rechazar)
 *   - Asignación de trabajadores a tareas
 *   - Comentarios y seguimiento
 *   - Notificaciones
 */

import { AuthRepository } from '../database/repositories/AuthRepository';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Componente del panel de capataz.
 * Solo accesible por usuarios con rol CAPATAZ (id_rol = 3).
 *
 * @returns El panel de capataz con header y mensaje de bienvenida
 */
export default function CapatazPage() {
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
        <h1>Panel Capataz</h1>
        <button onClick={handleLogout} className="btn-danger">Cerrar Sesión</button>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="badge badge-capataz">Capataz</span>
        <p>Bienvenido, {perfil?.nombre} {perfil?.apellidos}</p>
      </div>
    </div>
  );
}
