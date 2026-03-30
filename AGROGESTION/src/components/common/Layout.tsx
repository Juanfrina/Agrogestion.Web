/**
 * @file Layout.tsx
 * @description Layout principal de la app para usuarios autenticados.
 *
 * Esto organiza la página en: Header arriba, Sidebar a la izquierda,
 * contenido principal en el centro y Footer abajo.
 * La estructura usa flex para que el sidebar y el contenido se repartan el espacio.
 */

import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  /** El contenido principal de la página */
  children: ReactNode;
}

/**
 * Layout con Header + Sidebar + Content + Footer.
 * El sidebar ocupa 16rem fijos y el contenido se expande para llenar el resto.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabecera fija arriba */}
      <Header />

      {/* Cuerpo: sidebar + contenido */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Contenido principal */}
        <main
          className="flex-1 p-6"
          style={{ backgroundColor: 'var(--color-bg-main)' }}
        >
          {children}
        </main>
      </div>

      {/* Pie de página */}
      <Footer />
    </div>
  );
}
