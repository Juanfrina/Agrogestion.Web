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

/** Nombre / Apellidos: solo letras (incluye acentos), espacios y guiones, mínimo 3 caracteres */
export const NAME_REGEX = /^[A-Za-zÀ-ÿñÑ\s-]{3,}$/;

/** Teléfono español: empieza por 6, 7, 8 o 9 y exactamente 9 dígitos */
export const PHONE_REGEX = /^[6-9]\d{8}$/;
