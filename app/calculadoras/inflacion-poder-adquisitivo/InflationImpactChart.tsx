"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { InflationYearPoint } from "@/lib/inflationImpact";
import { formatEurosCompact } from "@/lib/formatCurrency";

interface InflationImpactChartProps {
  evolution: InflationYearPoint[];
  nominalAmount: number;
}

export default function InflationImpactChart({
  evolution,
  nominalAmount,
}: InflationImpactChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={evolution} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tickFormatter={(year: number) => `Año ${year}`}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatEurosCompact} width={80} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => formatEurosCompact(Number(value))}
          labelFormatter={(year) => `Año ${year}`}
        />
        <Legend />
        <ReferenceLine
          y={nominalAmount}
          stroke="#71717a"
          strokeDasharray="4 4"
          label={{
            value: "Valor nominal (sin inflación)",
            position: "insideBottomLeft",
            fill: "#71717a",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="realValue"
          name="Poder adquisitivo real"
          stroke="#dc2626"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
