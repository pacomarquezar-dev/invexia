import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "./compoundInterest";
import { calculateFireNumber, calculateRealRatePercent } from "./fireNumber";

describe("calculateFireNumber", () => {
  it("calcula el número FIRE como gasto anual / tasa de retirada (25x con el 4% por defecto)", () => {
    const result = calculateFireNumber({
      annualExpenses: 40000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 0,
      monthlyContribution: 1000,
      annualRatePercent: 7,
      annualInflationRatePercent: 0,
    });

    expect(result.fireNumber).toBe(1000000);
  });

  it("con rentabilidad 0% y sin inflación, los años se calculan por división simple (caso suficiente)", () => {
    // fireNumber = 8000 (tasa de retirada 100% para que sea igual al gasto anual)
    // Sin inflación, la rentabilidad real == la nominal (0%): (8000 - 2000) / 500 = 12 meses = 1 año exacto
    const result = calculateFireNumber({
      annualExpenses: 8000,
      safeWithdrawalRatePercent: 100,
      currentSavings: 2000,
      monthlyContribution: 500,
      annualRatePercent: 0,
      annualInflationRatePercent: 0,
    });

    expect(result.fireNumber).toBe(8000);
    expect(result.achievable).toBe(true);
    expect(result.yearsToTarget).toBeCloseTo(1, 6);
  });

  it("despeja correctamente los años con rentabilidad positiva y sin inflación (caso suficiente)", () => {
    // Reutiliza un resultado ya verificado en compoundInterest.test.ts:
    // 1000€ inicial + 100€/mes al 12% anual (1% mensual) durante 1 año -> 2395.075331€
    // Sin inflación, la rentabilidad real == la nominal, así que el caso es idéntico al de siempre.
    const result = calculateFireNumber({
      annualExpenses: 2395.075331,
      safeWithdrawalRatePercent: 100,
      currentSavings: 1000,
      monthlyContribution: 100,
      annualRatePercent: 12,
      annualInflationRatePercent: 0,
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
      annualInflationRatePercent: 2.5,
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
      annualInflationRatePercent: 2.5,
    });

    expect(result.fireNumber).toBe(1000000);
    expect(result.achievable).toBe(false);
    expect(result.yearsToTarget).toBeNull();
    expect(result.evolution).toEqual([]);
  });

  it("marca como no alcanzable con rentabilidad real 0% y aportación 0 aunque haya algo de ahorro (caso insuficiente)", () => {
    const result = calculateFireNumber({
      annualExpenses: 8000,
      safeWithdrawalRatePercent: 100, // fireNumber = 8000
      currentSavings: 2000,
      monthlyContribution: 0,
      annualRatePercent: 0,
      annualInflationRatePercent: 0,
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
      annualInflationRatePercent: 2.5,
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
      annualInflationRatePercent: 2.5,
    });

    expect(result.achievable).toBe(true);
    expect(result.evolution.length).toBeGreaterThan(0);
    expect(result.evolution[0]).toEqual({ year: 0, capital: 10000, contributed: 10000 });
  });

  // --- Rentabilidad real (ecuación de Fisher) ---

  it("con inflación > 0, usa la rentabilidad real (Fisher) para proyectar la evolución, no la nominal", () => {
    const input = {
      annualExpenses: 20000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 10000,
      monthlyContribution: 500,
      annualRatePercent: 7,
      annualInflationRatePercent: 2.5,
    };

    const result = calculateFireNumber(input);
    const expectedRealRate = calculateRealRatePercent(7, 2.5);

    expect(result.realAnnualRatePercent).toBeCloseTo(expectedRealRate, 10);
    expect(result.realAnnualRatePercent).toBeLessThan(input.annualRatePercent);

    // La evolución debe coincidir exactamente con llamar a calculateCompoundInterest
    // directamente con la rentabilidad real ya ajustada — misma fuente de verdad.
    const horizonYears = Math.max(1, Math.ceil(result.yearsToTarget as number));
    const expectedEvolution = calculateCompoundInterest({
      initialCapital: input.currentSavings,
      monthlyContribution: input.monthlyContribution,
      annualRatePercent: expectedRealRate,
      years: horizonYears,
    }).evolution;

    expect(result.evolution).toEqual(expectedEvolution);
  });

  it("a más inflación, más años hace falta para alcanzar el número FIRE (la rentabilidad real cae)", () => {
    const base = {
      annualExpenses: 30000,
      safeWithdrawalRatePercent: 4,
      currentSavings: 20000,
      monthlyContribution: 500,
      annualRatePercent: 7,
    };

    const lowInflation = calculateFireNumber({ ...base, annualInflationRatePercent: 1 });
    const highInflation = calculateFireNumber({ ...base, annualInflationRatePercent: 6 });

    expect(lowInflation.achievable).toBe(true);
    expect(highInflation.achievable).toBe(true);
    expect(highInflation.yearsToTarget).toBeGreaterThan(lowInflation.yearsToTarget as number);
  });
});

describe("calculateRealRatePercent", () => {
  it("aplica la ecuación de Fisher exacta: (1 + nominal) / (1 + inflación) - 1", () => {
    // (1.07 / 1.025 - 1) * 100 = 4.3902439024390...%
    expect(calculateRealRatePercent(7, 2.5)).toBeCloseTo(4.3902439024390244, 10);
  });

  it("con rentabilidad nominal 0% e inflación positiva, la rentabilidad real es negativa", () => {
    // (1 / 1.025 - 1) * 100 = -2.4390243902439...%
    expect(calculateRealRatePercent(0, 2.5)).toBeCloseTo(-2.4390243902439024, 10);
  });

  it("sin inflación, la rentabilidad real es igual a la nominal", () => {
    expect(calculateRealRatePercent(7, 0)).toBeCloseTo(7, 10);
  });

  it("si la rentabilidad nominal iguala a la inflación, la rentabilidad real es 0%", () => {
    expect(calculateRealRatePercent(3, 3)).toBeCloseTo(0, 10);
  });
});
