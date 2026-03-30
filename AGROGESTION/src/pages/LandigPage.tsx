/**
 * @file LandigPage.tsx
 * @description Página de bienvenida — simplemente importa y renderiza el componente Landing.
 */

import Landing from '../components/home/Landing';

/**
 * Página wrapper de la landing.
 * Toda la lógica está en el componente Landing.
 *
 * @returns El componente Landing
 */
export default function LandingPage() {
  return <Landing />;
}
