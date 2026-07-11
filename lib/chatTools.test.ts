import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "./compoundInterest";
import {
  chatTools,
  COMPOUND_INTEREST_TOOL_NAME,
  InvalidToolInputError,
  runCompoundInterestTool,
} from "./chatTools";

describe("chatTools", () => {
  it("define la herramienta calcular_interes_compuesto con los 4 parámetros requeridos", () => {
    const tool = chatTools.find((t) => t.name === COMPOUND_INTEREST_TOOL_NAME);

    expect(tool).toBeDefined();
    expect(tool?.input_schema.required).toEqual([
      "initialCapital",
      "monthlyContribution",
      "annualRatePercent",
      "years",
    ]);
  });
});

describe("runCompoundInterestTool", () => {
  it("da exactamente el mismo resultado que calculateCompoundInterest (misma fuente de verdad que la calculadora real)", () => {
    const input = {
      initialCapital: 1000,
      monthlyContribution: 200,
      annualRatePercent: 7,
      years: 10,
    };

    const expected = calculateCompoundInterest(input);
    const output = runCompoundInterestTool(input);

    expect(output.result).toEqual(expected);
    expect(output.input).toEqual(input);
  });

  it("incluye un enlace a la calculadora real con los mismos valores como query params", () => {
    const output = runCompoundInterestTool({
      initialCapital: 500,
      monthlyContribution: 50,
      annualRatePercent: 5,
      years: 20,
    });

    expect(output.calculatorUrl).toBe(
      "/calculadoras/interes-compuesto?capital=500&aportacion=50&tasa=5&anios=20",
    );
  });

  it("rechaza años fuera de rango (0 y 61) sin llamar al cálculo", () => {
    expect(() =>
      runCompoundInterestTool({
        initialCapital: 100,
        monthlyContribution: 10,
        annualRatePercent: 5,
        years: 0,
      }),
    ).toThrow(InvalidToolInputError);

    expect(() =>
      runCompoundInterestTool({
        initialCapital: 100,
        monthlyContribution: 10,
        annualRatePercent: 5,
        years: 61,
      }),
    ).toThrow(InvalidToolInputError);
  });

  it("rechaza una tasa anual fuera de rango (negativa o mayor de 30)", () => {
    expect(() =>
      runCompoundInterestTool({
        initialCapital: 100,
        monthlyContribution: 10,
        annualRatePercent: -1,
        years: 5,
      }),
    ).toThrow(InvalidToolInputError);

    expect(() =>
      runCompoundInterestTool({
        initialCapital: 100,
        monthlyContribution: 10,
        annualRatePercent: 31,
        years: 5,
      }),
    ).toThrow(InvalidToolInputError);
  });

  it("rechaza un capital o aportación negativos, no finitos, o con formato inválido", () => {
    expect(() =>
      runCompoundInterestTool({
        initialCapital: -100,
        monthlyContribution: 10,
        annualRatePercent: 5,
        years: 5,
      }),
    ).toThrow(InvalidToolInputError);

    expect(() =>
      runCompoundInterestTool({
        initialCapital: 100,
        monthlyContribution: "diez",
        annualRatePercent: 5,
        years: 5,
      }),
    ).toThrow(InvalidToolInputError);

    expect(() => runCompoundInterestTool(null)).toThrow(InvalidToolInputError);
  });
});
