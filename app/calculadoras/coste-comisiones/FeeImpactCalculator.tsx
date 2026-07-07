"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import { calculateFeeImpact } from "@/lib/feeImpact";
import { formatEuros } from "@/lib/formatCurrency";

const FeeImpactChart = dynamic(() => import("./FeeImpactChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

const percentFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function FeeImpactCalculator() {
  const [initialCapital, setInitialCapital] = useState(10000);
  const [grossAnnualRatePercent, setGrossAnnualRatePercent] = useState(7);
  const [years, setYears] = useState(20);
  const [lowFeePercent, setLowFeePercent] = useState(0.2);
  const [mediumFeePercent, setMediumFeePercent] = useState(1);
  const [highFeePercent, setHighFeePercent] = useState(2);

  const initialCapitalId = useId();
  const grossRateId = useId();
  const yearsId = useId();
  const lowFeeId = useId();
  const mediumFeeId = useId();
  const highFeeId = useId();

  const result = useMemo(
    () =>
      calculateFeeImpact({
        initialCapital,
        grossAnnualRatePercent,
        years,
        lowFeePercent,
        mediumFeePercent,
        highFeePercent,
      }),
    [initialCapital, grossAnnualRatePercent, years, lowFeePercent, mediumFeePercent, highFeePercent],
  );

  const lowLabel = `Comisión baja (${formatPercent(lowFeePercent)})`;
  const mediumLabel = `Comisión media (${formatPercent(mediumFeePercent)})`;
  const highLabel = `Comisión alta (${formatPercent(highFeePercent)})`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={initialCapitalId}
          name="initialCapital"
          label="Capital inicial invertido (€)"
          step={100}
          value={initialCapital}
          onChange={(raw) => setInitialCapital(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={grossRateId}
          name="grossAnnualRatePercent"
          label="Rentabilidad anual esperada antes de comisiones (%)"
          max={30}
          step={0.1}
          value={grossAnnualRatePercent}
          onChange={(raw) => setGrossAnnualRatePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={yearsId}
          name="years"
          label="Horizonte temporal (años)"
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
          id={lowFeeId}
          name="lowFeePercent"
          label="Comisión anual — escenario bajo (%)"
          max={10}
          step={0.1}
          value={lowFeePercent}
          onChange={(raw) => setLowFeePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={mediumFeeId}
          name="mediumFeePercent"
          label="Comisión anual — escenario medio (%)"
          max={10}
          step={0.1}
          value={mediumFeePercent}
          onChange={(raw) => setMediumFeePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={highFeeId}
          name="highFeePercent"
          label="Comisión anual — escenario alto (%)"
          max={10}
          step={0.1}
          value={highFeePercent}
          onChange={(raw) => setHighFeePercent(toNonNegativeNumber(raw))}
        />
      </form>

      <div className="flex flex-col gap-6">
        <div aria-live="polite" className="rounded-lg border border-foreground/10 p-5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-foreground/70">{lowLabel}</p>
              <p className="text-xl font-semibold tracking-tight">
                {formatEuros(result.low.finalCapital)}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground/70">{mediumLabel}</p>
              <p className="text-xl font-semibold tracking-tight">
                {formatEuros(result.medium.finalCapital)}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground/70">{highLabel}</p>
              <p className="text-xl font-semibold tracking-tight">
                {formatEuros(result.high.finalCapital)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-foreground/70">
            Diferencia entre comisión baja y alta:{" "}
            <span className="font-medium text-foreground">
              {formatEuros(result.lowVsHighDifference)}
            </span>
          </p>
        </div>

        <FeeImpactChart
          evolution={result.evolution}
          lowLabel={lowLabel}
          mediumLabel={mediumLabel}
          highLabel={highLabel}
        />
      </div>
    </div>
  );
}
