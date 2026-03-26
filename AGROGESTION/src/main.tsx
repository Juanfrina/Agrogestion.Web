/**
 * @file main.tsx
 * @description Punto de entrada de la app — aquí se monta React en el DOM.
 *
 * Importa los estilos globales (index.css con la paleta del logo) y monta
 * el componente <App /> dentro de StrictMode para detectar problemas en desarrollo.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

/** Monta la app React en el div #root del index.html */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
