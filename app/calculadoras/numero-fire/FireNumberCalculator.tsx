"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import NumberField from "@/components/NumberField";
import { calculateFireNumber } from "@/lib/fireNumber";
import { formatEuros } from "@/lib/formatCurrency";

const YearlyCapitalChart = dynamic(() => import("@/components/YearlyCapitalChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center text-sm text-foreground/50">
      Cargando gráfico…
    </div>
  ),
});

const yearsFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function FireNumberCalculator() {
  const [annualExpenses, setAnnualExpenses] = useState(24000);
  const [safeWithdrawalRatePercent, setSafeWithdrawalRatePercent] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRatePercent, setAnnualRatePercent] = useState(7);

  const annualExpensesId = useId();
  const withdrawalRateId = useId();
  const currentSavingsId = useId();
  const monthlyContributionId = useId();
  const annualRateId = useId();

  const result = useMemo(
    () =>
      calculateFireNumber({
        annualExpenses,
        safeWithdrawalRatePercent,
        currentSavings,
        monthlyContribution,
        annualRatePercent,
      }),
    [annualExpenses, safeWithdrawalRatePercent, currentSavings, monthlyContribution, annualRatePercent],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="flex flex-col gap-5" aria-label="Datos de la simulación">
        <NumberField
          id={annualExpensesId}
          name="annualExpenses"
          label="Gasto anual estimado a cubrir (€)"
          step={500}
          value={annualExpenses}
          onChange={(raw) => setAnnualExpenses(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={withdrawalRateId}
          name="safeWithdrawalRatePercent"
          label="Tasa de retirada segura (%)"
          min={0.1}
          max={10}
          step={0.1}
          value={safeWithdrawalRatePercent}
          onChange={(raw) => setSafeWithdrawalRatePercent(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={currentSavingsId}
          name="currentSavings"
          label="Ahorro actual (€)"
          step={500}
          value={currentSavings}
          onChange={(raw) => setCurrentSavings(toNonNegativeNumber(raw))}
        />

        <NumberField
          id={monthlyContributionId}
          name="monthlyContribution"
          label="Aportación mensual actual (€)"
          step={50}
          value={monthlyContribution}
          onChange={(raw) => setMonthlyContribution(toNonNegativeNumber(raw))}
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
      </form>

      <div className="flex flex-col gap-6">
        <div aria-live="polite" className="rounded-lg border border-foreground/10 p-5">
          <p className="text-sm text-foreground/70">Tu número FIRE</p>
          <p className="text-3xl font-semibold tracking-tight">{formatEuros(result.fireNumber)}</p>

          <p className="mt-4 text-sm text-foreground/70">
            {result.achievable ? (
              <>
                Años estimados para alcanzarlo:{" "}
                <span className="font-medium text-foreground">
                  {yearsFormatter.format(result.yearsToTarget ?? 0)}
                </span>
              </>
            ) : (
              "Con estos datos no llegarías a alcanzar tu número FIRE: necesitas ahorro inicial o aportación mensual (y que crezcan con el tiempo)."
            )}
          </p>
        </div>

        {result.achievable ? (
          <YearlyCapitalChart
            evolution={result.evolution}
            referenceLine={{ value: result.fireNumber, label: "Número FIRE" }}
          />
        ) : (
          <div className="flex h-[320px] items-center justify-center rounded-lg border border-foreground/10 text-sm text-foreground/50">
            No hay evolución que mostrar sin ahorro ni aportación que crezcan.
          </div>
        )}
      </div>
    </div>
  );
}
