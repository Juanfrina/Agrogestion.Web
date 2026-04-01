/**
 * @file RoleDistributionChart.tsx
 * @description Gráfico de barras horizontales para la distribución de usuarios por rol.
 *
 * Cada barra tiene el color asociado al rol y muestra el porcentaje.
 */

interface RoleData {
  label: string;
  value: number;
  color: string;
}

interface RoleDistributionChartProps {
  data: RoleData[];
}

export default function RoleDistributionChart({ data }: RoleDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-(--color-text-muted)">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {data.map((item) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>{item.label}</span>
              <span className="text-(--color-text-muted)">{item.value} ({pct}%)</span>
            </div>
            <div className="h-5 w-full overflow-hidden rounded-full bg-(--color-bg-main)">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  minWidth: item.value > 0 ? '8px' : '0',
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
