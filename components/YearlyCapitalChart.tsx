"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearlyCapital } from "@/lib/compoundInterest";
import { formatEurosCompact } from "@/lib/formatCurrency";
import { CHART_GREEN, CHART_TERRACOTTA } from "@/lib/chartColors";

interface YearlyCapitalChartProps {
  evolution: YearlyCapital[];
  /** Línea horizontal opcional (ej. para marcar un objetivo a alcanzar). */
  referenceLine?: {
    value: number;
    label: string;
  };
}

export default function YearlyCapitalChart({ evolution, referenceLine }: YearlyCapitalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={evolution} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="yearlyCapitalGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_GREEN} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_GREEN} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.value}
            stroke="#16a34a"
            strokeDasharray="6 3"
            label={{
              value: referenceLine.label,
              position: "insideTopLeft",
              fill: "#16a34a",
              fontSize: 12,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="contributed"
          name="Aportado (sin intereses)"
          stroke={CHART_TERRACOTTA}
          strokeWidth={1.5}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="capital"
          name="Capital total"
          stroke={CHART_GREEN}
          strokeWidth={2.5}
          fill="url(#yearlyCapitalGrowthFill)"
          fillOpacity={1}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
