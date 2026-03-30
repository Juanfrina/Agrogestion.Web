/**
 * @file index.ts
 * @description Barrel export de todas las interfaces.
 *
 * Desde aquí se re-exporta todo lo que hay en interfaces/
 * para que otros archivos puedan hacer:
 *   import { Tarea, Terreno, Perfil } from '../interfaces';
 * sin tener que buscar en qué archivo está cada cosa.
 */

export type { Perfil } from './Perfil';
export { Rol } from './Rol';
export type { Tarea, TareaFormData } from './Tarea';
export type { Terreno, TerrenoFormData } from './Terreno';
export type { EstadoTarea } from './EstadoTarea';
export type { Session } from './SessionUser';
export type { Usuario } from './Usuario';
