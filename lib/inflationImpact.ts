export interface InflationImpactInput {
  /** Cantidad de dinero actual, en euros. */
  currentAmount: number;
  /** Tasa de inflación anual esperada, en porcentaje (ej. 2.5 para 2,5%). */
  annualInflationRatePercent: number;
  /** Años a futuro. */
  years: number;
}

export interface InflationYearPoint {
  year: number;
  realValue: number;
}

export interface InflationImpactResult {
  /** Valor ajustado por inflación: lo que esa cantidad podría comprar dentro de `years` años, en euros de hoy. */
  adjustedValue: number;
  /** currentAmount - adjustedValue. */
  purchasingPowerLossAbsolute: number;
  /** La misma pérdida, en porcentaje sobre la cantidad actual. */
  purchasingPowerLossPercent: number;
  evolution: InflationYearPoint[];
}

export function calculateInflationImpact({
  currentAmount,
  annualInflationRatePercent,
  years,
}: InflationImpactInput): InflationImpactResult {
  const rate = annualInflationRatePercent / 100;

  const evolution: InflationYearPoint[] = [];
  for (let year = 0; year <= years; year += 1) {
    evolution.push({
      year,
      realValue: currentAmount / (1 + rate) ** year,
    });
  }

  const adjustedValue = currentAmount / (1 + rate) ** years;
  const purchasingPowerLossAbsolute = currentAmount - adjustedValue;
  const purchasingPowerLossPercent =
    currentAmount !== 0 ? (purchasingPowerLossAbsolute / currentAmount) * 100 : 0;

  return {
    adjustedValue,
    purchasingPowerLossAbsolute,
    purchasingPowerLossPercent,
    evolution,
  };
}
