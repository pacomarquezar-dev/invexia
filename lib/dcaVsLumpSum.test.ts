import { describe, expect, it } from "vitest";
import { calculateDcaVsLumpSum } from "./dcaVsLumpSum";

describe("calculateDcaVsLumpSum", () => {
  it("calcula el pago único y el DCA para 12000€ al 12% anual durante 1 año", () => {
    // i = 1% mensual exacto (12%/12), 1.01^12 = 1.126825030131969 (verificado en compoundInterest.test.ts)
    //
    // Pago único: 12000 * 1.01^12 = 13521.900361...
    // DCA: aportación mensual = 12000/12 = 1000€
    //      1000 * ((1.01^12 - 1) / 0.01) = 1000 * 12.6825030131969 = 12682.503013...
    // Diferencia: 13521.900362 - 12682.503013 = 839.397349€ (~6.6185% sobre el DCA)
    const result = calculateDcaVsLumpSum({
      totalCapital: 12000,
      years: 1,
      annualRatePercent: 12,
    });

    expect(result.lumpSumFinalCapital).toBeCloseTo(13521.9, 1);
    expect(result.dcaFinalCapital).toBeCloseTo(12682.503, 2);
    expect(result.differenceAbsolute).toBeCloseTo(839.397, 2);
    expect(result.differencePercent).toBeCloseTo(6.62, 1);
  });

  it("con rentabilidad 0%, ambos escenarios terminan igual (el momento de invertir no importa)", () => {
    const result = calculateDcaVsLumpSum({
      totalCapital: 1200,
      years: 1,
      annualRatePercent: 0,
    });

    expect(result.lumpSumFinalCapital).toBe(1200);
    expect(result.dcaFinalCapital).toBe(1200);
    expect(result.differenceAbsolute).toBe(0);
    expect(result.differencePercent).toBe(0);
  });

  it("el pago único siempre gana o iguala al DCA cuando hay rentabilidad positiva", () => {
    const result = calculateDcaVsLumpSum({
      totalCapital: 6000,
      years: 5,
      annualRatePercent: 5,
    });

    expect(result.lumpSumFinalCapital).toBeGreaterThan(result.dcaFinalCapital);
    expect(result.differenceAbsolute).toBeGreaterThan(0);
    expect(result.differencePercent).toBeGreaterThan(0);
  });

  it("genera un punto de evolución por año, con el DCA arrancando en 0 y el pago único en el capital total", () => {
    const result = calculateDcaVsLumpSum({
      totalCapital: 3000,
      years: 3,
      annualRatePercent: 6,
    });

    expect(result.evolution).toHaveLength(4);
    expect(result.evolution[0]).toEqual({ year: 0, lumpSum: 3000, dca: 0 });
    expect(result.evolution[3].lumpSum).toBeCloseTo(result.lumpSumFinalCapital, 6);
    expect(result.evolution[3].dca).toBeCloseTo(result.dcaFinalCapital, 6);
  });
});
