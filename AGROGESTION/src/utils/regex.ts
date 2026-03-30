/**
 * @file regex.ts
 * @description Expresiones regulares reutilizables.
 *
 * Aquí guardamos los patrones regex que se usan en los validadores.
 * Así si hay que cambiar alguna regla de validación, solo se toca aquí.
 */

/** DNI español: 8 dígitos seguidos de una letra (mayúscula o minúscula) */
export const DNI_REGEX = /^\d{8}[A-Za-z]$/;

/** Email básico: algo@algo.algo — no pretende cubrir el RFC entero, pero vale para el 99% */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Teléfono: al menos 9 dígitos, puede tener espacios o guiones en medio */
export const PHONE_REGEX = /^\+?\d[\d\s\-]{8,}$/;
