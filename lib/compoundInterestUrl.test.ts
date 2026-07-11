import { describe, expect, it } from "vitest";
import { buildCompoundInterestCalculatorUrl, parseNonNegativeUrlNumber } from "./compoundInterestUrl";

describe("buildCompoundInterestCalculatorUrl", () => {
  it("genera la URL de la calculadora con los 4 valores como query params", () => {
    const url = buildCompoundInterestCalculatorUrl({
      initialCapital: 1000,
      monthlyContribution: 200,
      annualRatePercent: 7,
      years: 10,
    });

    expect(url).toBe("/calculadoras/interes-compuesto?capital=1000&aportacion=200&tasa=7&anios=10");
  });
});

describe("parseNonNegativeUrlNumber", () => {
  it("devuelve el número cuando es válido y no negativo", () => {
    expect(parseNonNegativeUrlNumber("200")).toBe(200);
    expect(parseNonNegativeUrlNumber("0")).toBe(0);
    expect(parseNonNegativeUrlNumber("7.5")).toBe(7.5);
  });

  it("devuelve null para valores ausentes, negativos o no numéricos", () => {
    expect(parseNonNegativeUrlNumber(null)).toBeNull();
    expect(parseNonNegativeUrlNumber("-5")).toBeNull();
    expect(parseNonNegativeUrlNumber("abc")).toBeNull();
    expect(parseNonNegativeUrlNumber("")).toBeNull();
  });
});
