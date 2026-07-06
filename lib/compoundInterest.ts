export interface CompoundInterestInput {
  /** Capital inicial, en euros. */
  initialCapital: number;
  /** Aportación al final de cada mes, en euros. */
  monthlyContribution: number;
  /** Tasa de interés nominal anual, en porcentaje (ej. 7 para 7%). */
  annualRatePercent: number;
  /** Número de años de la simulación. */
  years: number;
}

export interface YearlyCapital {
  year: number;
  capital: number;
  contributed: number;
}

export interface CompoundInterestResult {
  finalCapital: number;
  totalContributed: number;
  totalInterest: number;
  evolution: YearlyCapital[];
}

function futureValueAtMonth(
  initialCapital: number,
  monthlyContribution: number,
  monthlyRate: number,
  months: number,
): number {
  const compoundedInitial = initialCapital * (1 + monthlyRate) ** months;

  const compoundedContributions =
    monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);

  return compoundedInitial + compoundedContributions;
}

export function calculateCompoundInterest({
  initialCapital,
  monthlyContribution,
  annualRatePercent,
  years,
}: CompoundInterestInput): CompoundInterestResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = Math.round(years * 12);

  const evolution: YearlyCapital[] = [];
  for (let year = 0; year <= years; year += 1) {
    const months = year * 12;
    evolution.push({
      year,
      capital: futureValueAtMonth(initialCapital, monthlyContribution, monthlyRate, months),
      contributed: initialCapital + monthlyContribution * months,
    });
  }

  const finalCapital = futureValueAtMonth(
    initialCapital,
    monthlyContribution,
    monthlyRate,
    totalMonths,
  );
  const totalContributed = initialCapital + monthlyContribution * totalMonths;

  return {
    finalCapital,
    totalContributed,
    totalInterest: finalCapital - totalContributed,
    evolution,
  };
}
