/**
 * @file Usuario.ts
 * @description Alias de Perfil como "Usuario".
 *
 * En algunos sitios se usa "Usuario" en vez de "Perfil" para referirse
 * al mismo objeto. Esto es un alias para que no haya confusión
 * y puedas importar con el nombre que te resulte más natural.
 */

import type { Perfil } from '../lib/types';

/** Alias de Perfil — es exactamente lo mismo, solo cambia el nombre */
export type Usuario = Perfil;
