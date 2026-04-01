/**
 * @file Table.tsx
 * @description Componente de tabla genérica reutilizable.
 *
 * Esto renderiza una tabla HTML con columnas configurables.
 * Soporta un render custom por columna, estado de carga (spinner)
 * y un mensaje cuando no hay datos. El wrapper usa la clase "card".
 */

import type { ReactNode } from 'react';
import Spinner from '../common/Spinner';

/** Definición de una columna de la tabla */
interface Column<T> {
  /** Clave del objeto para sacar el valor (o identificador para el render custom) */
  key: string;
  /** Texto que se muestra en la cabecera */
  header: string;
  /** Función de renderizado custom — si no se pasa, se muestra el valor crudo */
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  /** Definición de las columnas */
  columns: Column<T>[];
  /** Datos a mostrar en las filas */
  data: T[];
  /** Si es true, muestra el spinner en vez de la tabla */
  loading?: boolean;
  /** Mensaje que se muestra cuando data está vacío */
  emptyMessage?: string;
}

/**
 * Tabla genérica — recibe columnas y datos tipados.
 * Muestra spinner si está cargando y un mensaje si no hay datos.
 */
export default function Table<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="card flex justify-center p-8">
        <Spinner text="Cargando datos..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-(--color-text-muted)">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className="border-b-2 border-(--color-border)"
          >
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left p-3 font-semibold text-(--color-text-secondary)"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-(--color-border)"
            >
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {col.render
                    ? col.render(row)
                    : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
