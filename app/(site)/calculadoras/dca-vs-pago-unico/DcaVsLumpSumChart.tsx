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
import type { DcaVsLumpSumYearPoint } from "@/lib/dcaVsLumpSum";
import { formatEurosCompact } from "@/lib/formatCurrency";
import { CHART_GREEN, CHART_GREEN_MUTED } from "@/lib/chartColors";

export default function DcaVsLumpSumChart({
  evolution,
}: {
  evolution: DcaVsLumpSumYearPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={evolution} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
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
        <Line
          type="monotone"
          dataKey="lumpSum"
          name="Pago único"
          stroke={CHART_GREEN}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="dca"
          name="DCA (aportaciones periódicas)"
          stroke={CHART_GREEN_MUTED}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
