import { calculateCompoundInterest } from "./compoundInterest";

export interface DcaVsLumpSumInput {
  /** Capital total a invertir, en euros. */
  totalCapital: number;
  /** Horizonte temporal de la simulación, en años. */
  years: number;
  /** Rentabilidad anual esperada, en porcentaje (ej. 7 para 7%). */
  annualRatePercent: number;
}

export interface DcaVsLumpSumYearPoint {
  year: number;
  lumpSum: number;
  dca: number;
}

export interface DcaVsLumpSumResult {
  lumpSumFinalCapital: number;
  dcaFinalCapital: number;
  /** Pago único menos DCA, en euros. Positivo si el pago único gana. */
  differenceAbsolute: number;
  /** La misma diferencia, en porcentaje sobre el capital final del DCA. */
  differencePercent: number;
  evolution: DcaVsLumpSumYearPoint[];
}

export function calculateDcaVsLumpSum({
  totalCapital,
  years,
  annualRatePercent,
}: DcaVsLumpSumInput): DcaVsLumpSumResult {
  const totalMonths = Math.round(years * 12);
  const monthlyContribution = totalMonths > 0 ? totalCapital / totalMonths : 0;

  // Pago único: todo el capital invertido desde el día 1.
  const lumpSum = calculateCompoundInterest({
    initialCapital: totalCapital,
    monthlyContribution: 0,
    annualRatePercent,
    years,
  });

  // DCA: el mismo capital repartido en partes iguales, cada una invertida
  // (y componiendo interés) al final de su mes correspondiente.
  const dca = calculateCompoundInterest({
    initialCapital: 0,
    monthlyContribution,
    annualRatePercent,
    years,
  });

  const differenceAbsolute = lumpSum.finalCapital - dca.finalCapital;
  const differencePercent =
    dca.finalCapital !== 0 ? (differenceAbsolute / dca.finalCapital) * 100 : 0;

  const evolution: DcaVsLumpSumYearPoint[] = lumpSum.evolution.map((point, index) => ({
    year: point.year,
    lumpSum: point.capital,
    dca: dca.evolution[index].capital,
  }));

  return {
    lumpSumFinalCapital: lumpSum.finalCapital,
    dcaFinalCapital: dca.finalCapital,
    differenceAbsolute,
    differencePercent,
    evolution,
  };
}
