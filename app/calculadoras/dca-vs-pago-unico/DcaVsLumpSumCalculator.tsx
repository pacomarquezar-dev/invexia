"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import LazyOnVisible from "@/components/LazyOnVisible";
import Card from "@/components/Card";
import ResultHighlight from "@/components/ResultHighlight";
import { calculateDcaVsLumpSum } from "@/lib/dcaVsLumpSum";
import { formatEuros } from "@/lib/formatCurrency";
import { useAnnualRateSuggestion } from "@/lib/useAnnualRateSuggestion";

const DcaVsLumpSumChart = dynamic(() => import("./DcaVsLumpSumChart"), {
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

export default function DcaVsLumpSumCalculator() {
  const [totalCapital, setTotalCapital] = useState(12000);
  const [years, setYears] = useState(10);
  const { value: annualRatePercent, setValue: setAnnualRatePercent, hint: rateHint } =
    useAnnualRateSuggestion(7);

  const totalCapitalId = useId();
  const yearsId = useId();
  const annualRateId = useId();

  const result = useMemo(
    () => calculateDcaVsLumpSum({ totalCapital, years, annualRatePercent }),
    [totalCapital, years, annualRatePercent],
  );

  const lumpSumWins = result.differenceAbsolute >= 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card as="form" className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={totalCapitalId}
          name="totalCapital"
          label="Capital total a invertir (€)"
          step={100}
          value={totalCapital}
          onChange={(raw) => setTotalCapital(toNonNegativeNumber(raw))}
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

        <div className="flex flex-col gap-1.5">
          <NumberField
            id={annualRateId}
            name="annualRatePercent"
            label="Rentabilidad anual esperada (%)"
            max={30}
            step={0.1}
            value={annualRatePercent}
            onChange={setAnnualRatePercent}
          />
          {rateHint && <p className="text-xs text-foreground/50">{rateHint}</p>}
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <ResultHighlight
          label={lumpSumWins ? "El pago único gana por" : "El DCA gana por"}
          value={`${formatEuros(Math.abs(result.differenceAbsolute))} (${percentFormatter.format(Math.abs(result.differencePercent))}%)`}
        >
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted">Pago único</p>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {formatEuros(result.lumpSumFinalCapital)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">DCA (aportaciones periódicas)</p>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {formatEuros(result.dcaFinalCapital)}
              </p>
            </div>
          </div>
        </ResultHighlight>

        <LazyOnVisible
          placeholder={
            <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
              Cargando gráfico…
            </div>
          }
        >
          <DcaVsLumpSumChart evolution={result.evolution} />
        </LazyOnVisible>
      </div>
    </div>
  );
}
