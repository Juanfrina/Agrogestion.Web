/**
 * @file index.ts
 * @description Barrel export de todos los repositorios.
 *
 * Importa todos los repositorios desde aquí para no tener que
 * recordar la ruta exacta de cada uno.
 *
 * @example
 * import { AuthRepository, TareaRepository } from '../database/repositories';
 */

export { AuthRepository } from './AuthRepository';
export { AdminRepository } from './AdminRepository';
export { TareaRepository } from './TareaRepository';
export { TerrenoRepository } from './TerrenoRepository';
export { UsuarioRepository } from './UsuarioRepository';
