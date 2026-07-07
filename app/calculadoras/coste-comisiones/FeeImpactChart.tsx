"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeeImpactYearPoint } from "@/lib/feeImpact";
import { formatEurosCompact } from "@/lib/formatCurrency";

interface FeeImpactChartProps {
  evolution: FeeImpactYearPoint[];
  lowLabel: string;
  mediumLabel: string;
  highLabel: string;
}

export default function FeeImpactChart({
  evolution,
  lowLabel,
  mediumLabel,
  highLabel,
}: FeeImpactChartProps) {
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
        <Line
          type="monotone"
          dataKey="low"
          name={lowLabel}
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="medium"
          name={mediumLabel}
          stroke="#d97706"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="high"
          name={highLabel}
          stroke="#71717a"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
