import { describe, expect, it } from "vitest";
import { calculateInflationImpact } from "./inflationImpact";

describe("calculateInflationImpact", () => {
  it("calcula el valor ajustado para 1000€ con 5% de inflación durante 1 año", () => {
    // 1000 / 1.05 = 952.380952380952...
    // Pérdida: 47.619047619... € (4.7619047619...%)
    const result = calculateInflationImpact({
      currentAmount: 1000,
      annualInflationRatePercent: 5,
      years: 1,
    });

    expect(result.adjustedValue).toBeCloseTo(952.380952, 4);
    expect(result.purchasingPowerLossAbsolute).toBeCloseTo(47.619048, 4);
    expect(result.purchasingPowerLossPercent).toBeCloseTo(4.761905, 4);
  });

  it("calcula el valor ajustado para 1000€ con 2,5% de inflación durante 10 años", () => {
    // 1.025^10 = 1.280084544 (valor actuarial estándar)
    // 1000 / 1.280084544 = 781.198401...
    const result = calculateInflationImpact({
      currentAmount: 1000,
      annualInflationRatePercent: 2.5,
      years: 10,
    });

    expect(result.adjustedValue).toBeCloseTo(781.1984, 1);
    expect(result.purchasingPowerLossAbsolute).toBeCloseTo(218.8016, 1);
    expect(result.purchasingPowerLossPercent).toBeCloseTo(21.88016, 1);
  });

  it("sin inflación, el valor ajustado es exactamente el actual", () => {
    const result = calculateInflationImpact({
      currentAmount: 500,
      annualInflationRatePercent: 0,
      years: 5,
    });

    expect(result.adjustedValue).toBe(500);
    expect(result.purchasingPowerLossAbsolute).toBe(0);
    expect(result.purchasingPowerLossPercent).toBe(0);
  });

  it("con 0 años, el valor ajustado es el actual sin erosión, sea cual sea la tasa", () => {
    const result = calculateInflationImpact({
      currentAmount: 2000,
      annualInflationRatePercent: 3.5,
      years: 0,
    });

    expect(result.adjustedValue).toBe(2000);
    expect(result.purchasingPowerLossAbsolute).toBe(0);
  });

  it("una inflación más alta erosiona más el poder adquisitivo", () => {
    const base = { currentAmount: 10000, years: 20 };
    const low = calculateInflationImpact({ ...base, annualInflationRatePercent: 2 });
    const high = calculateInflationImpact({ ...base, annualInflationRatePercent: 6 });

    expect(high.adjustedValue).toBeLessThan(low.adjustedValue);
    expect(high.purchasingPowerLossPercent).toBeGreaterThan(low.purchasingPowerLossPercent);
  });

  it("genera un punto de evolución por año, arrancando en la cantidad actual sin erosionar", () => {
    const result = calculateInflationImpact({
      currentAmount: 3000,
      annualInflationRatePercent: 2.5,
      years: 6,
    });

    expect(result.evolution).toHaveLength(7);
    expect(result.evolution[0]).toEqual({ year: 0, realValue: 3000 });
    expect(result.evolution[6].realValue).toBeCloseTo(result.adjustedValue, 6);
  });
});
