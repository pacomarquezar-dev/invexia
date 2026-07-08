"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatEurosCompact } from "@/lib/formatCurrency";

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
            <Tooltip formatter={(value) => formatEurosCompact(Number(value))} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-semibold tracking-tight">{formatEurosCompact(total)}</p>
          <p className="text-xs text-foreground/60">{totalLabel}</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {data.map((slice) => (
          <li key={slice.name} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-foreground/70">{slice.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
