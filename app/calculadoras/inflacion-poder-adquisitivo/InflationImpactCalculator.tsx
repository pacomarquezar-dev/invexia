"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import { calculateInflationImpact } from "@/lib/inflationImpact";
import { formatEuros } from "@/lib/formatCurrency";

const InflationImpactChart = dynamic(() => import("./InflationImpactChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function InflationImpactCalculator() {
  const [currentAmount, setCurrentAmount] = useState(10000);
  const [annualInflationRatePercent, setAnnualInflationRatePercent] = useState(2.5);
  const [years, setYears] = useState(10);

  const currentAmountId = useId();
  const inflationRateId = useId();
  const yearsId = useId();

  const result = useMemo(
    () => calculateInflationImpact({ currentAmount, annualInflationRatePercent, years }),
    [currentAmount, annualInflationRatePercent, years],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={currentAmountId}
          name="currentAmount"
          label="Cantidad de dinero actual (€)"
          step={100}
          value={currentAmount}
          onChange={(raw) => setCurrentAmount(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={inflationRateId}
          name="annualInflationRatePercent"
          label="Tasa de inflación anual esperada (%)"
          max={20}
          step={0.1}
          value={annualInflationRatePercent}
          onChange={(raw) => setAnnualInflationRatePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={yearsId}
          name="years"
          label="Años a futuro"
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
          <p className="text-sm text-foreground/70">Valor ajustado por inflación</p>
          <p className="text-3xl font-semibold tracking-tight">
            {formatEuros(result.adjustedValue)}
          </p>
          <p className="mt-4 text-sm text-foreground/70">
            Pérdida de poder adquisitivo:{" "}
            <span className="font-medium text-foreground">
              {formatEuros(result.purchasingPowerLossAbsolute)}
            </span>{" "}
            ({percentFormatter.format(result.purchasingPowerLossPercent)}%)
          </p>
        </div>

        <InflationImpactChart evolution={result.evolution} nominalAmount={currentAmount} />
      </div>
    </div>
  );
}
