/**
 * @file Footer.tsx
 * @description Pie de página de la app.
 *
 * Esto muestra el copyright y el eslogan de Agrogestión.
 * Nada del otro mundo — un fondo oscuro con texto blanco y ya.
 */

/**
 * Footer sencillo con copyright y eslogan.
 * Usa var(--color-primary-dark) como fondo.
 */
export default function Footer() {
  return (
    <footer
      className="text-center p-4 bg-(--color-primary-dark) text-white"
    >
      <p className="m-0 text-(--color-text-on-primary)">
        © 2026 Agrogestión — Innovación · Sostenibilidad · Productividad
      </p>
    </footer>
  );
}
