import { describe, expect, it } from "vitest";
import { calculateFireNumber } from "./fireNumber";

describe("calculateFireNumber", () => {
  it("calcula el número FIRE como gasto anual / tasa de retirada (25x con el 4% por defecto)", () => {
    const result = calculateFireNumber({
      annualExpenses: 40000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 0,
      monthlyContribution: 1000,
      annualRatePercent: 7,
    });

    expect(result.fireNumber).toBe(1000000);
  });

  it("con rentabilidad 0%, los años se calculan por división simple (caso suficiente)", () => {
    // fireNumber = 8000 (tasa de retirada 100% para que sea igual al gasto anual)
    // (8000 - 2000) / 500 = 12 meses = 1 año exacto
    const result = calculateFireNumber({
      annualExpenses: 8000,
      safeWithdrawalRatePercent: 100,
      currentSavings: 2000,
      monthlyContribution: 500,
      annualRatePercent: 0,
    });

    expect(result.fireNumber).toBe(8000);
    expect(result.achievable).toBe(true);
    expect(result.yearsToTarget).toBeCloseTo(1, 6);
  });

  it("despeja correctamente los años con rentabilidad positiva (caso suficiente)", () => {
    // Reutiliza un resultado ya verificado en compoundInterest.test.ts:
    // 1000€ inicial + 100€/mes al 12% anual (1% mensual) durante 1 año -> 2395.075331€
    // Si el número FIRE es exactamente ese valor, debe tardar ~1 año en alcanzarlo.
    const result = calculateFireNumber({
      annualExpenses: 2395.075331,
      safeWithdrawalRatePercent: 100,
      currentSavings: 1000,
      monthlyContribution: 100,
      annualRatePercent: 12,
    });

    expect(result.fireNumber).toBeCloseTo(2395.075331, 4);
    expect(result.achievable).toBe(true);
    expect(result.yearsToTarget).toBeCloseTo(1, 2);
  });

  it("si el ahorro actual ya alcanza el número FIRE, los años necesarios son 0", () => {
    const result = calculateFireNumber({
      annualExpenses: 10000,
      safeWithdrawalRatePercent: 4, // fireNumber = 250000
      currentSavings: 300000,
      monthlyContribution: 500,
      annualRatePercent: 5,
    });

    expect(result.fireNumber).toBe(250000);
    expect(result.achievable).toBe(true);
    expect(result.yearsToTarget).toBe(0);
  });

  it("marca como no alcanzable cuando no hay ahorro ni aportación (caso insuficiente)", () => {
    const result = calculateFireNumber({
      annualExpenses: 40000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 0,
      monthlyContribution: 0,
      annualRatePercent: 7,
    });

    expect(result.fireNumber).toBe(1000000);
    expect(result.achievable).toBe(false);
    expect(result.yearsToTarget).toBeNull();
    expect(result.evolution).toEqual([]);
  });

  it("marca como no alcanzable con rentabilidad 0% y aportación 0 aunque haya algo de ahorro (caso insuficiente)", () => {
    const result = calculateFireNumber({
      annualExpenses: 8000,
      safeWithdrawalRatePercent: 100, // fireNumber = 8000
      currentSavings: 2000,
      monthlyContribution: 0,
      annualRatePercent: 0,
    });

    expect(result.achievable).toBe(false);
    expect(result.yearsToTarget).toBeNull();
  });

  it("una aportación mensual mayor reduce los años necesarios", () => {
    const base = {
      annualExpenses: 30000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 5000,
      annualRatePercent: 6,
    };

    const slow = calculateFireNumber({ ...base, monthlyContribution: 200 });
    const fast = calculateFireNumber({ ...base, monthlyContribution: 800 });

    expect(slow.achievable).toBe(true);
    expect(fast.achievable).toBe(true);
    expect(fast.yearsToTarget).toBeLessThan(slow.yearsToTarget as number);
  });

  it("genera una evolución que arranca en el ahorro actual cuando es alcanzable", () => {
    const result = calculateFireNumber({
      annualExpenses: 20000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 10000,
      monthlyContribution: 1000,
      annualRatePercent: 7,
    });

    expect(result.achievable).toBe(true);
    expect(result.evolution.length).toBeGreaterThan(0);
    expect(result.evolution[0]).toEqual({ year: 0, capital: 10000, contributed: 10000 });
  });
});
