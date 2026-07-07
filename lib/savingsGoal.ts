import { calculateCompoundInterest, type YearlyCapital } from "./compoundInterest";

export interface SavingsGoalInput {
  /** Cantidad objetivo a alcanzar, en euros. */
  targetAmount: number;
  /** Años disponibles para conseguirlo. */
  years: number;
  /** Rentabilidad anual esperada, en porcentaje. */
  annualRatePercent: number;
  /** Capital inicial ya ahorrado, en euros (puede ser 0). */
  initialCapital: number;
}

export interface SavingsGoalResult {
  /** Aportación mensual necesaria para alcanzar el objetivo (nunca negativa). */
  requiredMonthlyContribution: number;
  totalContributed: number;
  finalCapital: number;
  evolution: YearlyCapital[];
}

export function calculateSavingsGoal({
  targetAmount,
  years,
  annualRatePercent,
  initialCapital,
}: SavingsGoalInput): SavingsGoalResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = Math.round(years * 12);
  const growthFactor = (1 + monthlyRate) ** totalMonths;
  const futureValueOfInitialCapital = initialCapital * growthFactor;

  let requiredMonthlyContribution: number;
  if (totalMonths === 0) {
    requiredMonthlyContribution = 0;
  } else if (monthlyRate === 0) {
    requiredMonthlyContribution = (targetAmount - initialCapital) / totalMonths;
  } else {
    const annuityFactor = (growthFactor - 1) / monthlyRate;
    requiredMonthlyContribution = (targetAmount - futureValueOfInitialCapital) / annuityFactor;
  }

  // Si el capital inicial ya alcanza (o supera) el objetivo por sí solo, no hace
  // falta aportar nada más.
  requiredMonthlyContribution = Math.max(0, requiredMonthlyContribution);

  const result = calculateCompoundInterest({
    initialCapital,
    monthlyContribution: requiredMonthlyContribution,
    annualRatePercent,
    years,
  });

  return {
    requiredMonthlyContribution,
    totalContributed: result.totalContributed,
    finalCapital: result.finalCapital,
    evolution: result.evolution,
  };
}
