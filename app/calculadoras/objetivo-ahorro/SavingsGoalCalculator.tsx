"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import type { DonutChartSlice } from "@/components/DonutChart";
import { calculateSavingsGoal } from "@/lib/savingsGoal";
import { formatEuros } from "@/lib/formatCurrency";

const YearlyCapitalChart = dynamic(() => import("@/components/YearlyCapitalChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

const DonutChart = dynamic(() => import("@/components/DonutChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function SavingsGoalCalculator() {
  const [targetAmount, setTargetAmount] = useState(30000);
  const [years, setYears] = useState(10);
  const [annualRatePercent, setAnnualRatePercent] = useState(7);
  const [initialCapital, setInitialCapital] = useState(0);

  const targetAmountId = useId();
  const yearsId = useId();
  const annualRateId = useId();
  const initialCapitalId = useId();

  const result = useMemo(
    () => calculateSavingsGoal({ targetAmount, years, annualRatePercent, initialCapital }),
    [targetAmount, years, annualRatePercent, initialCapital],
  );

  const donutData: DonutChartSlice[] = [
    { name: "Total aportado", value: result.totalContributed, color: "#2563eb" },
    {
      name: "Intereses generados",
      value: result.finalCapital - result.totalContributed,
      color: "#16a34a",
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={targetAmountId}
          name="targetAmount"
          label="Cantidad objetivo a alcanzar (€)"
          step={500}
          value={targetAmount}
          onChange={(raw) => setTargetAmount(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={yearsId}
          name="years"
          label="Años disponibles"
          min={1}
          max={60}
          step={1}
          inputMode="numeric"
          value={years}
          onChange={(raw) => {
            const parsed = Math.round(toNonNegativeNumber(raw));
            setYears(Math.min(60, Math.max(1, parsed || 1)));
          }}
        />

        <NumberField
          id={annualRateId}
          name="annualRatePercent"
          label="Rentabilidad anual esperada (%)"
          max={30}
          step={0.1}
          value={annualRatePercent}
          onChange={(raw) => setAnnualRatePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={initialCapitalId}
          name="initialCapital"
          label="Capital inicial ya ahorrado (€)"
          step={100}
          value={initialCapital}
          onChange={(raw) => setInitialCapital(toNonNegativeNumber(raw))}
        />
      </form>

      <div className="flex flex-col gap-6">
        <div aria-live="polite" className="rounded-lg border border-foreground/10 p-5">
          <p className="text-sm text-foreground/70">Aportación mensual necesaria</p>
          <p className="text-3xl font-semibold tracking-tight">
            {formatEuros(result.requiredMonthlyContribution)}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-foreground/70">
            <dt>Total aportado</dt>
            <dd className="text-right">{formatEuros(result.totalContributed)}</dd>
            <dt>Capital final estimado</dt>
            <dd className="text-right">{formatEuros(result.finalCapital)}</dd>
          </dl>
        </div>

        <YearlyCapitalChart
          evolution={result.evolution}
          referenceLine={{ value: targetAmount, label: "Objetivo" }}
        />

        <DonutChart data={donutData} total={result.finalCapital} totalLabel="Capital final estimado" />
      </div>
    </div>
  );
}
