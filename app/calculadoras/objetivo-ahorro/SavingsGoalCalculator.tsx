"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import LazyOnVisible from "@/components/LazyOnVisible";
import Card from "@/components/Card";
import ResultHighlight from "@/components/ResultHighlight";
import type { DonutChartSlice } from "@/components/DonutChart";
import { DONUT_HERO_COLOR, DONUT_MUTED_COLOR } from "@/lib/donutColors";
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
    { name: "Total aportado", value: result.totalContributed, color: DONUT_MUTED_COLOR },
    {
      name: "Intereses generados",
      value: result.finalCapital - result.totalContributed,
      color: DONUT_HERO_COLOR,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card as="form" className="flex flex-col gap-5" aria-label="Datos de la simulación">
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
      </Card>

      <div className="flex flex-col gap-6">
        <ResultHighlight
          label="Aportación mensual necesaria"
          value={formatEuros(result.requiredMonthlyContribution)}
          stats={[
            { label: "Total aportado", value: formatEuros(result.totalContributed) },
            { label: "Capital final estimado", value: formatEuros(result.finalCapital) },
          ]}
        />

        <LazyOnVisible
          placeholder={
            <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
              Cargando gráfico…
            </div>
          }
        >
          <YearlyCapitalChart
            evolution={result.evolution}
            referenceLine={{ value: targetAmount, label: "Objetivo" }}
          />
        </LazyOnVisible>

        <LazyOnVisible
          placeholder={
            <div className="flex h-[280px] items-center justify-center text-sm text-foreground/50">
              Cargando gráfico…
            </div>
          }
        >
          <DonutChart data={donutData} total={result.finalCapital} totalLabel="Capital final estimado" />
        </LazyOnVisible>
      </div>
    </div>
  );
}
