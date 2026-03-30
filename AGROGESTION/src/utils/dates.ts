/**
 * @file dates.ts
 * @description Utilidades para manejar fechas.
 *
 * Aquí guardamos funciones de formato y comparación de fechas.
 * Toda la app usa estas funciones para no repetir lógica de fechas
 * en cada componente — y para que los formatos sean consistentes.
 */

/**
 * Formatea una fecha a "dd/mm/yyyy" (formato español).
 * Acepta un Date, un string ISO o cualquier cosa que el constructor Date entienda.
 *
 * @param date - La fecha a formatear (Date o string)
 * @returns La fecha en formato "dd/mm/yyyy"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha con hora a "dd/mm/yyyy HH:mm".
 * Útil para mostrar timestamps de comentarios, notificaciones, etc.
 *
 * @param date - La fecha a formatear (Date o string)
 * @returns La fecha con hora en formato "dd/mm/yyyy HH:mm"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Comprueba si una fecha ya pasó (es anterior a hoy).
 * Compara solo las fechas, sin tener en cuenta la hora.
 *
 * @param date - La fecha a comprobar (Date o string)
 * @returns true si la fecha es anterior a hoy
 */
export function isDateInPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Comprueba si un rango de fechas es válido (inicio <= fin).
 * Útil para formularios de tareas donde se pide fecha inicio y fecha fin.
 *
 * @param start - Fecha de inicio
 * @param end   - Fecha de fin
 * @returns true si la fecha de inicio es anterior o igual a la de fin
 */
export function isDateRangeValid(start: Date | string, end: Date | string): boolean {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return s <= e;
}

/**
 * Convierte una fecha a formato ISO "yyyy-mm-dd" (lo que espera Supabase para campos DATE).
 * Si ya es un string ISO, devuelve solo la parte de la fecha (sin hora).
 *
 * @param date - La fecha a convertir
 * @returns String en formato "yyyy-mm-dd"
 */
export function toISODate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}
