/**
 * @file MensualChart.tsx
 * @description Gráfico de barras simple hecho con divs — sin librerías externas.
 *
 * Recibe un array de datos con mes y valor, y pinta barras de colores proporcionadas.
 * Si no hay datos, muestra un mensaje amigable.
 */

/** Props del gráfico */
interface MensualChartProps {
  data?: { mes: string; valor: number }[];
}

/**
 * Gráfico de barras mensual sencillo.
 * Renderiza barras horizontales usando divs y CSS.
 *
 * @param props - array de datos opcionales con mes y valor
 * @returns El gráfico de barras o mensaje de "sin datos"
 */
export default function MensualChart({ data }: MensualChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        Sin datos disponibles
      </div>
    );
  }

  /** Calculamos el valor máximo para escalar las barras */
  const maxValor = Math.max(...data.map((d) => d.valor), 1);

  return (
    <div className="space-y-2 p-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          {/* Etiqueta del mes */}
          <span className="w-16 text-right text-sm font-medium">{item.mes}</span>

          {/* Barra */}
          <div className="flex-1">
            <div
              className="rounded"
              style={{
                width: `${(item.valor / maxValor) * 100}%`,
                height: '24px',
                backgroundColor: 'var(--color-primary, #4a7c59)',
                minWidth: item.valor > 0 ? '4px' : '0',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Valor numérico */}
          <span className="w-10 text-sm text-gray-600">{item.valor}</span>
        </div>
      ))}
    </div>
  );
}
