import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "./compoundInterest";

describe("calculateCompoundInterest", () => {
  it("compone solo el capital inicial cuando no hay aportaciones", () => {
    // 1000€ al 12% anual (1% mensual) durante 1 año, sin aportaciones:
    // FV = 1000 * 1.01^12 = 1126.825030...
    const result = calculateCompoundInterest({
      initialCapital: 1000,
      monthlyContribution: 0,
      annualRatePercent: 12,
      years: 1,
    });

    expect(result.finalCapital).toBeCloseTo(1126.825, 2);
    expect(result.totalContributed).toBe(1000);
    expect(result.totalInterest).toBeCloseTo(126.825, 2);
  });

  it("compone las aportaciones periódicas cuando no hay capital inicial", () => {
    // 100€/mes al 12% anual (1% mensual) durante 1 año, sin capital inicial:
    // FV = 100 * ((1.01^12 - 1) / 0.01) = 1268.250301...
    const result = calculateCompoundInterest({
      initialCapital: 0,
      monthlyContribution: 100,
      annualRatePercent: 12,
      years: 1,
    });

    expect(result.finalCapital).toBeCloseTo(1268.25, 2);
    expect(result.totalContributed).toBe(1200);
    expect(result.totalInterest).toBeCloseTo(68.25, 2);
  });

  it("combina capital inicial y aportaciones periódicas", () => {
    // Suma de los dos casos anteriores: 1126.825030 + 1268.250301 = 2395.075331
    const result = calculateCompoundInterest({
      initialCapital: 1000,
      monthlyContribution: 100,
      annualRatePercent: 12,
      years: 1,
    });

    expect(result.finalCapital).toBeCloseTo(2395.075, 2);
  });

  it("sin interés, el capital final es la simple suma de las aportaciones", () => {
    const result = calculateCompoundInterest({
      initialCapital: 500,
      monthlyContribution: 100,
      annualRatePercent: 0,
      years: 2,
    });

    expect(result.finalCapital).toBe(2900);
    expect(result.totalContributed).toBe(2900);
    expect(result.totalInterest).toBe(0);
  });

  it("genera un punto de evolución por cada año, incluido el año 0", () => {
    const result = calculateCompoundInterest({
      initialCapital: 1000,
      monthlyContribution: 50,
      annualRatePercent: 5,
      years: 3,
    });

    expect(result.evolution).toHaveLength(4);
    expect(result.evolution[0]).toEqual({ year: 0, capital: 1000, contributed: 1000 });
    expect(result.evolution[3].capital).toBeCloseTo(result.finalCapital, 6);
  });
});
