import { calculateCompoundInterest, type YearlyCapital } from "./compoundInterest";

export interface FireNumberInput {
  /** Gasto anual estimado a cubrir con las inversiones, en euros. */
  annualExpenses: number;
  /** Tasa de retirada segura, en porcentaje (ej. 4 para 4%). */
  safeWithdrawalRatePercent: number;
  /** Ahorro/inversión actual, en euros. */
  currentSavings: number;
  /** Aportación mensual actual, en euros. */
  monthlyContribution: number;
  /** Rentabilidad anual esperada (nominal, antes de inflación), en porcentaje. */
  annualRatePercent: number;
  /** Inflación anual esperada, en porcentaje (ej. 2.5 para 2,5%). */
  annualInflationRatePercent: number;
}

export interface FireNumberResult {
  /** Capital objetivo: gasto anual / tasa de retirada. */
  fireNumber: number;
  /** false si, con los datos dados, nunca se alcanzaría el número FIRE. */
  achievable: boolean;
  /** Años estimados hasta alcanzarlo (null si no es alcanzable). */
  yearsToTarget: number | null;
  /** Rentabilidad real (ecuación de Fisher) usada para proyectar el crecimiento. */
  realAnnualRatePercent: number;
  evolution: YearlyCapital[];
}

/**
 * Ecuación de Fisher: convierte una rentabilidad nominal en rentabilidad real
 * descontando la inflación esperada, para que el resultado quede expresado en
 * poder adquisitivo de hoy (y así no haga falta inflactar también el gasto
 * anual objetivo).
 */
export function calculateRealRatePercent(
  nominalRatePercent: number,
  inflationRatePercent: number,
): number {
  const nominalRate = nominalRatePercent / 100;
  const inflationRate = inflationRatePercent / 100;
  return ((1 + nominalRate) / (1 + inflationRate) - 1) * 100;
}

/**
 * Despeja el número de meses (no la aportación) necesarios para que
 * initialCapital + monthlyContribution, componiendo a monthlyRate, alcance target.
 *
 * FV(m) = initialCapital*(1+i)^m + monthlyContribution*((1+i)^m - 1)/i
 * Reordenando: (1+i)^m = (target + k) / (initialCapital + k), con k = monthlyContribution/i
 * m = ln((target+k)/(initialCapital+k)) / ln(1+i)
 */
function monthsToReachTarget(
  initialCapital: number,
  monthlyContribution: number,
  monthlyRate: number,
  target: number,
): number | null {
  if (target <= initialCapital) return 0;

  // Sin aportación y sin capital, el capital se queda en 0 para siempre.
  if (monthlyContribution <= 0 && initialCapital <= 0) return null;

  if (monthlyRate === 0) {
    // Capital plano: sin aportación nunca crece.
    if (monthlyContribution <= 0) return null;
    return (target - initialCapital) / monthlyContribution;
  }

  const k = monthlyContribution / monthlyRate;
  const numerator = target + k;
  const denominator = initialCapital + k;
  if (denominator <= 0 || numerator <= 0) return null;

  return Math.log(numerator / denominator) / Math.log(1 + monthlyRate);
}

export function calculateFireNumber({
  annualExpenses,
  safeWithdrawalRatePercent,
  currentSavings,
  monthlyContribution,
  annualRatePercent,
  annualInflationRatePercent,
}: FireNumberInput): FireNumberResult {
  const fireNumber =
    safeWithdrawalRatePercent > 0
      ? annualExpenses / (safeWithdrawalRatePercent / 100)
      : Infinity;

  const realAnnualRatePercent = calculateRealRatePercent(
    annualRatePercent,
    annualInflationRatePercent,
  );

  const monthlyRate = realAnnualRatePercent / 100 / 12;
  const months = Number.isFinite(fireNumber)
    ? monthsToReachTarget(currentSavings, monthlyContribution, monthlyRate, fireNumber)
    : null;

  if (months === null) {
    return {
      fireNumber,
      achievable: false,
      yearsToTarget: null,
      realAnnualRatePercent,
      evolution: [],
    };
  }

  const years = months / 12;
  const horizonYears = Math.max(1, Math.ceil(years));

  const { evolution } = calculateCompoundInterest({
    initialCapital: currentSavings,
    monthlyContribution,
    annualRatePercent: realAnnualRatePercent,
    years: horizonYears,
  });

  return {
    fireNumber,
    achievable: true,
    yearsToTarget: years,
    realAnnualRatePercent,
    evolution,
  };
}
