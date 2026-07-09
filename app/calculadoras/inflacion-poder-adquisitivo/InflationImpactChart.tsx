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
import { CHART_GREEN, CHART_TERRACOTTA } from "@/lib/chartColors";

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
      <LineChart data={evolution} margin={{ top: 26, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis
          dataKey="year"
          tickFormatter={(year: number) => `Año ${year}`}
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          axisLine={{ stroke: "var(--border-subtle)" }}
          tickLine={{ stroke: "var(--border-subtle)" }}
        />
        <YAxis
          tickFormatter={formatEurosCompact}
          width={80}
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          axisLine={{ stroke: "var(--border-subtle)" }}
          tickLine={{ stroke: "var(--border-subtle)" }}
        />
        <Tooltip
          formatter={(value) => formatEurosCompact(Number(value))}
          labelFormatter={(year) => `Año ${year}`}
          contentStyle={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.75rem",
          }}
          labelStyle={{ color: "var(--muted)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--foreground)" }} />
        <ReferenceLine
          y={nominalAmount}
          stroke={CHART_GREEN}
          strokeWidth={2}
          label={{
            value: "Valor nominal (sin inflación)",
            position: "insideBottomRight",
            fill: CHART_GREEN,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="realValue"
          name="Poder adquisitivo real"
          stroke={CHART_TERRACOTTA}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
