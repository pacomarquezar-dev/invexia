import { describe, expect, it } from "vitest";
import { calculateFeeImpact } from "./feeImpact";

describe("calculateFeeImpact", () => {
  it("calcula los 3 escenarios para 10000€ al 13% bruto durante 1 año", () => {
    // Rentabilidad neta = bruta - comisión:
    //   baja:  13% - 1%  = 12% -> 1% mensual  -> 10000 * 1.01^12  = 11268.250301...
    //   media: 13% - 7%  = 6%  -> 0.5% mensual -> 10000 * 1.005^12 = 10616.778...
    //   alta:  13% - 13% = 0%  -> sin crecimiento -> 10000 (exacto)
    const result = calculateFeeImpact({
      initialCapital: 10000,
      grossAnnualRatePercent: 13,
      years: 1,
      lowFeePercent: 1,
      mediumFeePercent: 7,
      highFeePercent: 13,
    });

    expect(result.low.netAnnualRatePercent).toBe(12);
    expect(result.low.finalCapital).toBeCloseTo(11268.25, 1);

    expect(result.medium.netAnnualRatePercent).toBe(6);
    expect(result.medium.finalCapital).toBeCloseTo(10616.78, 1);

    expect(result.high.netAnnualRatePercent).toBe(0);
    expect(result.high.finalCapital).toBe(10000);

    expect(result.lowVsHighDifference).toBeCloseTo(1268.25, 1);
  });

  it("calcula los 3 escenarios para 5000€ al 12% bruto durante 2 años", () => {
    // baja:  12% - 0%  = 12% -> 5000 * 1.01^24  = 6348.673...
    // media: 12% - 6%  = 6%  -> 5000 * 1.005^24 = 5635.799...
    // alta:  12% - 12% = 0%  -> 5000 (exacto)
    const result = calculateFeeImpact({
      initialCapital: 5000,
      grossAnnualRatePercent: 12,
      years: 2,
      lowFeePercent: 0,
      mediumFeePercent: 6,
      highFeePercent: 12,
    });

    expect(result.low.finalCapital).toBeCloseTo(6348.67, 1);
    expect(result.medium.finalCapital).toBeCloseTo(5635.8, 1);
    expect(result.high.finalCapital).toBe(5000);
    expect(result.lowVsHighDifference).toBeCloseTo(1348.67, 1);
  });

  it("una comisión más alta nunca produce un capital final mayor", () => {
    const result = calculateFeeImpact({
      initialCapital: 20000,
      grossAnnualRatePercent: 8,
      years: 30,
      lowFeePercent: 0.2,
      mediumFeePercent: 1,
      highFeePercent: 2,
    });

    expect(result.low.finalCapital).toBeGreaterThan(result.medium.finalCapital);
    expect(result.medium.finalCapital).toBeGreaterThan(result.high.finalCapital);
    expect(result.lowVsHighDifference).toBeGreaterThan(0);
  });

  it("genera un punto de evolución por año, con los 3 escenarios arrancando en el capital inicial", () => {
    const result = calculateFeeImpact({
      initialCapital: 3000,
      grossAnnualRatePercent: 7,
      years: 5,
      lowFeePercent: 0.2,
      mediumFeePercent: 1,
      highFeePercent: 2,
    });

    expect(result.evolution).toHaveLength(6);
    expect(result.evolution[0]).toEqual({ year: 0, low: 3000, medium: 3000, high: 3000 });
    expect(result.evolution[5].low).toBeCloseTo(result.low.finalCapital, 6);
    expect(result.evolution[5].medium).toBeCloseTo(result.medium.finalCapital, 6);
    expect(result.evolution[5].high).toBeCloseTo(result.high.finalCapital, 6);
  });
});
