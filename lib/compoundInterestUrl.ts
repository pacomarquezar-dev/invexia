export const COMPOUND_INTEREST_QUERY_PARAMS = {
  initialCapital: "capital",
  monthlyContribution: "aportacion",
  annualRatePercent: "tasa",
  years: "anios",
} as const;

export interface CompoundInterestUrlParams {
  initialCapital: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}

/**
 * Genera la URL de la calculadora real con los valores de un escenario como
 * query params, para que un enlace compartido (p. ej. desde el chatbot)
 * abra la calculadora ya rellena con ese mismo escenario.
 */
export function buildCompoundInterestCalculatorUrl(params: CompoundInterestUrlParams): string {
  const search = new URLSearchParams({
    [COMPOUND_INTEREST_QUERY_PARAMS.initialCapital]: String(params.initialCapital),
    [COMPOUND_INTEREST_QUERY_PARAMS.monthlyContribution]: String(params.monthlyContribution),
    [COMPOUND_INTEREST_QUERY_PARAMS.annualRatePercent]: String(params.annualRatePercent),
    [COMPOUND_INTEREST_QUERY_PARAMS.years]: String(params.years),
  });
  return `/calculadoras/interes-compuesto?${search.toString()}`;
}

/** Parsea un valor de query param a número no negativo, o null si no es válido. */
export function parseNonNegativeUrlNumber(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
