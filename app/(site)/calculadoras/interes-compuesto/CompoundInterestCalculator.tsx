"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NumberField from "@/components/NumberField";
import LazyOnVisible from "@/components/LazyOnVisible";
import Card from "@/components/Card";
import ResultHighlight from "@/components/ResultHighlight";
import type { DonutChartSlice } from "@/components/DonutChart";
import { DONUT_HERO_COLOR, DONUT_MUTED_COLOR } from "@/lib/donutColors";
import { calculateCompoundInterest } from "@/lib/compoundInterest";
import { formatEuros } from "@/lib/formatCurrency";
import { useAnnualRateSuggestion } from "@/lib/useAnnualRateSuggestion";
import { COMPOUND_INTEREST_QUERY_PARAMS, parseNonNegativeUrlNumber } from "@/lib/compoundInterestUrl";

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

export default function CompoundInterestCalculator() {
  const searchParams = useSearchParams();
  const urlCapital = parseNonNegativeUrlNumber(
    searchParams.get(COMPOUND_INTEREST_QUERY_PARAMS.initialCapital),
  );
  const urlContribution = parseNonNegativeUrlNumber(
    searchParams.get(COMPOUND_INTEREST_QUERY_PARAMS.monthlyContribution),
  );
  const urlRate = parseNonNegativeUrlNumber(
    searchParams.get(COMPOUND_INTEREST_QUERY_PARAMS.annualRatePercent),
  );
  const urlYears = parseNonNegativeUrlNumber(
    searchParams.get(COMPOUND_INTEREST_QUERY_PARAMS.years),
  );

  const [initialCapital, setInitialCapital] = useState(urlCapital ?? 1000);
  const [monthlyContribution, setMonthlyContribution] = useState(urlContribution ?? 100);
  const { value: annualRatePercent, setValue: setAnnualRatePercent, hint: rateHint } =
    useAnnualRateSuggestion(7, urlRate);
  const [years, setYears] = useState(() =>
    urlYears ? Math.min(60, Math.max(1, Math.round(urlYears))) : 10,
  );

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

  const donutData: DonutChartSlice[] = [
    { name: "Capital inicial", value: initialCapital, color: DONUT_MUTED_COLOR },
    {
      name: "Aportaciones acumuladas",
      value: result.totalContributed - initialCapital,
      color: DONUT_MUTED_COLOR,
    },
    { name: "Intereses generados", value: result.totalInterest, color: DONUT_HERO_COLOR },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card as="form" className="flex flex-col gap-5" aria-label="Datos de la simulación">
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
          {rateHint && <p className="text-xs text-muted">{rateHint}</p>}
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
      </Card>

      <div className="flex flex-col gap-6">
        <ResultHighlight
          label="Capital final estimado"
          value={formatEuros(result.finalCapital)}
          stats={[
            { label: "Total aportado", value: formatEuros(result.totalContributed) },
            { label: "Intereses generados", value: formatEuros(result.totalInterest) },
          ]}
          shareText={`Con interés compuesto, mi capital final estimado es ${formatEuros(result.finalCapital)} en ${years} años, según Invexia.`}
        />

        <LazyOnVisible
          placeholder={
            <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
              Cargando gráfico…
            </div>
          }
        >
          <YearlyCapitalChart evolution={result.evolution} />
        </LazyOnVisible>

        <LazyOnVisible
          placeholder={
            <div className="flex h-[280px] items-center justify-center text-sm text-foreground/50">
              Cargando gráfico…
            </div>
          }
        >
          <DonutChart
            data={donutData}
            total={result.finalCapital}
            totalLabel="Capital final estimado"
          />
        </LazyOnVisible>
      </div>
    </div>
  );
}
