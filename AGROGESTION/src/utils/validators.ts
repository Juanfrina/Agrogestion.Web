/**
 * @file validators.ts
 * @description Funciones de validación para formularios.
 *
 * Aquí centralizamos todas las validaciones típicas: DNI, email, teléfono, etc.
 * Los componentes de formulario llaman a estas funciones antes de enviar datos
 * para mostrar errores al usuario si algo no cuadra.
 */

import { DNI_REGEX, EMAIL_REGEX, PHONE_REGEX } from './regex';

/**
 * Comprueba si un DNI tiene formato válido (8 dígitos + 1 letra).
 * No valida la letra en sí — solo el formato.
 *
 * @param dni - El DNI a validar
 * @returns true si el formato es correcto
 */
export function isValidDNI(dni: string): boolean {
  return DNI_REGEX.test(dni.trim());
}

/**
 * Comprueba si un email tiene pinta de ser válido.
 * No es una validación exhaustiva del RFC 5322, pero pilla el 99% de los casos.
 *
 * @param email - El email a validar
 * @returns true si parece un email correcto
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Comprueba si un teléfono tiene al menos 9 dígitos.
 * Acepta espacios, guiones y prefijo internacional (+34, etc.).
 *
 * @param phone - El teléfono a validar
 * @returns true si el formato parece correcto
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

/**
 * Comprueba si una contraseña tiene al menos 6 caracteres.
 * Es el mínimo que pide Supabase Auth por defecto.
 *
 * @param password - La contraseña a validar
 * @returns true si tiene 6+ caracteres
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Comprueba que un campo no esté vacío (ni sea solo espacios en blanco).
 * Útil para validar campos obligatorios de formularios.
 *
 * @param value - El valor del campo
 * @returns true si tiene contenido de verdad
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
