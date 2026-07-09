"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatEurosCompact } from "@/lib/formatCurrency";
import { DONUT_HERO_COLOR } from "@/lib/donutColors";

export interface DonutChartSlice {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartSlice[];
  /** Suma de todos los valores, mostrada en grande en el centro del donut. */
  total: number;
  /** Etiqueta bajo el valor total (ej. "Capital final estimado"). */
  totalLabel: string;
}

export default function DonutChart({ data, total, totalLabel }: DonutChartProps) {
  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Tooltip
              formatter={(value) => formatEurosCompact(Number(value))}
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.75rem",
              }}
              labelStyle={{ color: "var(--muted)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={84}
              outerRadius={104}
              paddingAngle={4}
              cornerRadius={8}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.name}
                  fill={slice.color}
                  style={
                    slice.color.toUpperCase() === DONUT_HERO_COLOR
                      ? { filter: "drop-shadow(0 0 6px rgba(61, 220, 132, 0.65))" }
                      : undefined
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-semibold tracking-tight text-foreground">{formatEurosCompact(total)}</p>
          <p className="text-xs text-muted">{totalLabel}</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {data.map((slice) => (
          <li
            key={slice.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              {slice.name}
            </span>
            <span className="font-medium text-foreground">{formatEurosCompact(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
