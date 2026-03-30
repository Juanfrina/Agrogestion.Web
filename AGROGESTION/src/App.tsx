/**
 * @file App.tsx
 * @description Componente raíz de Agrogestión — simplemente monta el AppRouter.
 *
 * Toda la lógica de enrutado y autenticación está ahora en router/AppRouter.tsx.
 */

import { AppRouter } from './router/AppRouter';

/**
 * Componente principal de la app.
 * Delega todo el enrutado y auth al AppRouter.
 *
 * @returns La app completa
 */
function App() {
  return <AppRouter />;
}

export default App;
