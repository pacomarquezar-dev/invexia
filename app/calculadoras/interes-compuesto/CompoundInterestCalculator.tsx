"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import { calculateCompoundInterest } from "@/lib/compoundInterest";
import { formatEuros } from "@/lib/formatCurrency";
import { useAnnualRateSuggestion } from "@/lib/useAnnualRateSuggestion";

const YearlyCapitalChart = dynamic(() => import("@/components/YearlyCapitalChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function CompoundInterestCalculator() {
  const [initialCapital, setInitialCapital] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const { value: annualRatePercent, setValue: setAnnualRatePercent, hint: rateHint } =
    useAnnualRateSuggestion(7);
  const [years, setYears] = useState(10);

  const initialCapitalId = useId();
  const monthlyContributionId = useId();
  const annualRateId = useId();
  const yearsId = useId();

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        initialCapital,
        monthlyContribution,
        annualRatePercent,
        years,
      }),
    [initialCapital, monthlyContribution, annualRatePercent, years],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={initialCapitalId}
          name="initialCapital"
          label="Capital inicial (€)"
          step={100}
          value={initialCapital}
          onChange={(raw) => setInitialCapital(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={monthlyContributionId}
          name="monthlyContribution"
          label="Aportación mensual (€)"
          step={10}
          value={monthlyContribution}
          onChange={(raw) => setMonthlyContribution(toNonNegativeNumber(raw))}
        />

        <div className="flex flex-col gap-1.5">
          <NumberField
            id={annualRateId}
            name="annualRatePercent"
            label="Tasa de interés anual (%)"
            max={30}
            step={0.1}
            value={annualRatePercent}
            onChange={setAnnualRatePercent}
          />
          {rateHint && <p className="text-xs text-foreground/50">{rateHint}</p>}
        </div>

        <NumberField
          id={yearsId}
          name="years"
          label="Años"
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
      </form>

      <div className="flex flex-col gap-6">
        <div aria-live="polite" className="rounded-lg border border-foreground/10 p-5">
          <p className="text-sm text-foreground/70">Capital final estimado</p>
          <p className="text-3xl font-semibold tracking-tight">
            {formatEuros(result.finalCapital)}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-foreground/70">
            <dt>Total aportado</dt>
            <dd className="text-right">{formatEuros(result.totalContributed)}</dd>
            <dt>Intereses generados</dt>
            <dd className="text-right">{formatEuros(result.totalInterest)}</dd>
          </dl>
        </div>

        <YearlyCapitalChart evolution={result.evolution} />
      </div>
    </div>
  );
}
