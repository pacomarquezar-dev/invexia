import { describe, expect, it } from "vitest";
import { calculateSavingsGoal } from "./savingsGoal";

describe("calculateSavingsGoal", () => {
  it("despeja la aportación mensual correctamente sin capital inicial", () => {
    // 12% anual (1% mensual): 1.01^12 = 1.126825030131969
    // Con aportación de 1000€/mes durante 1 año: FV = 1000 * ((1.01^12 - 1) / 0.01) = 12682.503013...
    // Por tanto, para alcanzar exactamente ese objetivo, la aportación necesaria es 1000€/mes.
    const result = calculateSavingsGoal({
      targetAmount: 12682.503013,
      years: 1,
      annualRatePercent: 12,
      initialCapital: 0,
    });

    expect(result.requiredMonthlyContribution).toBeCloseTo(1000, 1);
    expect(result.totalContributed).toBeCloseTo(12000, 1);
    expect(result.finalCapital).toBeCloseTo(12682.503013, 1);
  });

  it("descuenta el crecimiento del capital inicial antes de calcular la aportación", () => {
    // Mismo 12% anual / 1 año. Capital inicial de 5000€ crece a 5000*1.126825030131969 = 5634.125151
    // Aportación de 500€/mes crecería a 500*12.6825030131969 = 6341.251507
    // Objetivo = 5634.125151 + 6341.251507 = 11975.376657 -> aportación esperada: 500€/mes
    const result = calculateSavingsGoal({
      targetAmount: 11975.376657,
      years: 1,
      annualRatePercent: 12,
      initialCapital: 5000,
    });

    expect(result.requiredMonthlyContribution).toBeCloseTo(500, 1);
    expect(result.finalCapital).toBeCloseTo(11975.376657, 1);
  });

  it("con rentabilidad 0%, la aportación es la simple diferencia dividida entre los meses", () => {
    // (2000 - 200) / 12 = 150€/mes exactos
    const result = calculateSavingsGoal({
      targetAmount: 2000,
      years: 1,
      annualRatePercent: 0,
      initialCapital: 200,
    });

    expect(result.requiredMonthlyContribution).toBe(150);
    expect(result.finalCapital).toBe(2000);
  });

  it("si el capital inicial ya supera el objetivo por su cuenta, no exige aportación", () => {
    const result = calculateSavingsGoal({
      targetAmount: 50000,
      years: 10,
      annualRatePercent: 5,
      initialCapital: 100000,
    });

    expect(result.requiredMonthlyContribution).toBe(0);
    expect(result.finalCapital).toBeGreaterThan(50000);
  });

  it("genera un punto de evolución por año, arrancando en el capital inicial", () => {
    const result = calculateSavingsGoal({
      targetAmount: 20000,
      years: 5,
      annualRatePercent: 6,
      initialCapital: 1000,
    });

    expect(result.evolution).toHaveLength(6);
    expect(result.evolution[0]).toEqual({ year: 0, capital: 1000, contributed: 1000 });
    expect(result.evolution[5].capital).toBeCloseTo(result.finalCapital, 6);
    expect(result.finalCapital).toBeCloseTo(20000, 1);
  });
});
