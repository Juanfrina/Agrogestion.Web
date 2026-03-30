/**
 * @file Landing.tsx
 * @description Componente de la landing page — lo primero que ve el visitante al entrar.
 *
 * Muestra el nombre de la app, el eslogan y dos botones para entrar o registrarse.
 * También enseña tres tarjetas con las funcionalidades principales.
 * Es público, no hace falta estar logueado para verlo.
 */

import { Link } from 'react-router-dom';
import Card from '../cards/Card';

/**
 * Landing page principal de Agrogestión.
 * Renderiza la portada con título, eslogan, CTAs y tarjetas de features.
 *
 * @returns La página de bienvenida completa
 */
export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
      {/* Título principal */}
      <h1 className="text-5xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
        Agrogestión
      </h1>

      {/* Eslogan */}
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

      {/* Tarjetas de funcionalidades */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card title="Gestión de Terrenos">
          <p>Controla tus fincas, parcelas y cultivos desde un solo lugar.</p>
        </Card>
        <Card title="Control de Tareas">
          <p>Crea, asigna y supervisa tareas agrícolas con seguimiento en tiempo real.</p>
        </Card>
        <Card title="Equipo Conectado">
          <p>Gerentes, capataces y trabajadores coordinados y siempre al día.</p>
        </Card>
      </div>
    </div>
  );
}
