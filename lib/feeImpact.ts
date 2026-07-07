import { calculateCompoundInterest, type YearlyCapital } from "./compoundInterest";

export interface FeeImpactInput {
  /** Capital inicial invertido, en euros. */
  initialCapital: number;
  /** Rentabilidad anual esperada antes de comisiones, en porcentaje. */
  grossAnnualRatePercent: number;
  /** Horizonte temporal de la simulación, en años. */
  years: number;
  /** Comisión anual del escenario bajo, en porcentaje (ej. 0.2 para 0,2%). */
  lowFeePercent: number;
  /** Comisión anual del escenario medio, en porcentaje. */
  mediumFeePercent: number;
  /** Comisión anual del escenario alto, en porcentaje. */
  highFeePercent: number;
}

export interface FeeScenarioResult {
  feePercent: number;
  /** Rentabilidad neta anual tras restar la comisión (rentabilidad bruta - comisión). */
  netAnnualRatePercent: number;
  finalCapital: number;
}

export interface FeeImpactYearPoint {
  year: number;
  low: number;
  medium: number;
  high: number;
}

export interface FeeImpactResult {
  low: FeeScenarioResult;
  medium: FeeScenarioResult;
  high: FeeScenarioResult;
  /** Capital final del escenario bajo menos el del alto, en euros. */
  lowVsHighDifference: number;
  evolution: FeeImpactYearPoint[];
}

function calculateScenario(
  initialCapital: number,
  grossAnnualRatePercent: number,
  feePercent: number,
  years: number,
): { scenario: FeeScenarioResult; evolution: YearlyCapital[] } {
  const netAnnualRatePercent = grossAnnualRatePercent - feePercent;

  const result = calculateCompoundInterest({
    initialCapital,
    monthlyContribution: 0,
    annualRatePercent: netAnnualRatePercent,
    years,
  });

  return {
    scenario: {
      feePercent,
      netAnnualRatePercent,
      finalCapital: result.finalCapital,
    },
    evolution: result.evolution,
  };
}

export function calculateFeeImpact({
  initialCapital,
  grossAnnualRatePercent,
  years,
  lowFeePercent,
  mediumFeePercent,
  highFeePercent,
}: FeeImpactInput): FeeImpactResult {
  const low = calculateScenario(initialCapital, grossAnnualRatePercent, lowFeePercent, years);
  const medium = calculateScenario(
    initialCapital,
    grossAnnualRatePercent,
    mediumFeePercent,
    years,
  );
  const high = calculateScenario(initialCapital, grossAnnualRatePercent, highFeePercent, years);

  const evolution: FeeImpactYearPoint[] = low.evolution.map((point, index) => ({
    year: point.year,
    low: point.capital,
    medium: medium.evolution[index].capital,
    high: high.evolution[index].capital,
  }));

  return {
    low: low.scenario,
    medium: medium.scenario,
    high: high.scenario,
    lowVsHighDifference: low.scenario.finalCapital - high.scenario.finalCapital,
    evolution,
  };
}
