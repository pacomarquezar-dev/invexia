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

export default function DcaVsLumpSumChart({
  evolution,
}: {
  evolution: DcaVsLumpSumYearPoint[];
}) {
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
          dataKey="lumpSum"
          name="Pago único"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="dca"
          name="DCA (aportaciones periódicas)"
          stroke="#71717a"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
