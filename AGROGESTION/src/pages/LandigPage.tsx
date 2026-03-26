/**
 * @file LandigPage.tsx
 * @description Página de bienvenida (landing) — lo primero que ve el visitante.
 *
 * Muestra el logo, el nombre de la app y dos botones para entrar o registrarse.
 * Es una página pública, cualquier persona puede verla sin estar logueado.
 */

import { Link } from 'react-router-dom';

/**
 * Componente Landing Page.
 * Renderiza la portada de la app con los enlaces a login y registro.
 *
 * @returns La página de bienvenida con los CTAs principales
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      {/* Título principal con los colores del logo */}
      <h1 className="text-5xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
        Agrogestión
      </h1>

      {/* Subtítulo con el lema del logo */}
      <p className="text-lg" style={{ color: 'var(--color-earth)' }}>
        Innovación · Sostenibilidad · Productividad
      </p>

      {/* Botones de acceso */}
      <div className="flex gap-4">
        <Link to="/login" className="btn-primary">
          Iniciar Sesión
        </Link>
        <Link to="/registro" className="btn-secondary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
