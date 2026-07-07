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
import type { YearlyCapital } from "@/lib/compoundInterest";
import { formatEurosCompact } from "@/lib/formatCurrency";

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
          dataKey="capital"
          name="Capital total"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="contributed"
          name="Aportado (sin intereses)"
          stroke="#71717a"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
