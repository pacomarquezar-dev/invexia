import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "./compoundInterest";
import { calculateDcaVsLumpSum } from "./dcaVsLumpSum";
import { calculateFeeImpact } from "./feeImpact";
import { calculateSavingsGoal } from "./savingsGoal";
import { calculateFireNumber } from "./fireNumber";
import { calculateInflationImpact } from "./inflationImpact";
import {
  chatTools,
  COMPOUND_INTEREST_TOOL_NAME,
  DCA_VS_LUMP_SUM_TOOL_NAME,
  FEE_IMPACT_TOOL_NAME,
  SAVINGS_GOAL_TOOL_NAME,
  FIRE_NUMBER_TOOL_NAME,
  INFLATION_IMPACT_TOOL_NAME,
  InvalidToolInputError,
  runChatTool,
  runCompoundInterestTool,
  runDcaVsLumpSumTool,
  runFeeImpactTool,
  runSavingsGoalTool,
  runFireNumberTool,
  runInflationImpactTool,
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

  it("define una herramienta por cada una de las 6 calculadoras, con nombre único", () => {
    const names = chatTools.map((tool) => tool.name);

    expect(names).toEqual([
      COMPOUND_INTEREST_TOOL_NAME,
      DCA_VS_LUMP_SUM_TOOL_NAME,
      FEE_IMPACT_TOOL_NAME,
      SAVINGS_GOAL_TOOL_NAME,
      FIRE_NUMBER_TOOL_NAME,
      INFLATION_IMPACT_TOOL_NAME,
    ]);
    expect(new Set(names).size).toBe(names.length);
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

describe("runDcaVsLumpSumTool", () => {
  const input = { totalCapital: 12000, years: 10, annualRatePercent: 7 };

  it("da exactamente el mismo resultado que calculateDcaVsLumpSum", () => {
    expect(runDcaVsLumpSumTool(input).result).toEqual(calculateDcaVsLumpSum(input));
  });

  it("rechaza años y tasa fuera de rango", () => {
    expect(() => runDcaVsLumpSumTool({ ...input, years: 0 })).toThrow(InvalidToolInputError);
    expect(() => runDcaVsLumpSumTool({ ...input, annualRatePercent: 31 })).toThrow(
      InvalidToolInputError,
    );
  });
});

describe("runFeeImpactTool", () => {
  const input = {
    initialCapital: 10000,
    grossAnnualRatePercent: 7,
    years: 20,
    lowFeePercent: 0.2,
    mediumFeePercent: 1,
    highFeePercent: 2,
  };

  it("da exactamente el mismo resultado que calculateFeeImpact con los 3 escenarios de comisión", () => {
    expect(runFeeImpactTool(input).result).toEqual(calculateFeeImpact(input));
  });

  it("usa comisiones por defecto (0.2/1/2%) cuando no se dan", () => {
    const { initialCapital, grossAnnualRatePercent, years } = input;
    const output = runFeeImpactTool({ initialCapital, grossAnnualRatePercent, years });

    expect(output.input.lowFeePercent).toBe(0.2);
    expect(output.input.mediumFeePercent).toBe(1);
    expect(output.input.highFeePercent).toBe(2);
    expect(output.result).toEqual(calculateFeeImpact(input));
  });

  it("rechaza una comisión fuera de rango (mayor de 10%)", () => {
    expect(() => runFeeImpactTool({ ...input, highFeePercent: 11 })).toThrow(InvalidToolInputError);
  });
});

describe("runSavingsGoalTool", () => {
  const input = { targetAmount: 30000, years: 10, annualRatePercent: 7, initialCapital: 0 };

  it("da exactamente el mismo resultado que calculateSavingsGoal", () => {
    expect(runSavingsGoalTool(input).result).toEqual(calculateSavingsGoal(input));
  });

  it("usa initialCapital=0 por defecto cuando no se da", () => {
    const output = runSavingsGoalTool({
      targetAmount: input.targetAmount,
      years: input.years,
      annualRatePercent: input.annualRatePercent,
    });

    expect(output.input.initialCapital).toBe(0);
    expect(output.result).toEqual(calculateSavingsGoal(input));
  });

  it("rechaza un targetAmount negativo", () => {
    expect(() => runSavingsGoalTool({ ...input, targetAmount: -1 })).toThrow(InvalidToolInputError);
  });
});

describe("runFireNumberTool", () => {
  const input = {
    annualExpenses: 24000,
    safeWithdrawalRatePercent: 4,
    currentSavings: 10000,
    monthlyContribution: 500,
    annualRatePercent: 7,
  };

  it("da exactamente el mismo resultado que calculateFireNumber", () => {
    expect(runFireNumberTool(input).result).toEqual(calculateFireNumber(input));
  });

  it("usa la regla del 4% por defecto cuando no se da safeWithdrawalRatePercent", () => {
    const { annualExpenses, currentSavings, monthlyContribution, annualRatePercent } = input;
    const output = runFireNumberTool({
      annualExpenses,
      currentSavings,
      monthlyContribution,
      annualRatePercent,
    });

    expect(output.input.safeWithdrawalRatePercent).toBe(4);
    expect(output.result).toEqual(calculateFireNumber(input));
  });

  it("rechaza una tasa de retirada fuera de rango (0 o mayor de 10)", () => {
    expect(() => runFireNumberTool({ ...input, safeWithdrawalRatePercent: 0 })).toThrow(
      InvalidToolInputError,
    );
    expect(() => runFireNumberTool({ ...input, safeWithdrawalRatePercent: 11 })).toThrow(
      InvalidToolInputError,
    );
  });
});

describe("runInflationImpactTool", () => {
  const input = { currentAmount: 10000, annualInflationRatePercent: 2.5, years: 10 };

  it("da exactamente el mismo resultado que calculateInflationImpact", () => {
    expect(runInflationImpactTool(input).result).toEqual(calculateInflationImpact(input));
  });

  it("rechaza una tasa de inflación fuera de rango (negativa o mayor de 20)", () => {
    expect(() => runInflationImpactTool({ ...input, annualInflationRatePercent: -1 })).toThrow(
      InvalidToolInputError,
    );
    expect(() => runInflationImpactTool({ ...input, annualInflationRatePercent: 21 })).toThrow(
      InvalidToolInputError,
    );
  });
});

describe("runChatTool", () => {
  it("despacha cada nombre de herramienta a su implementación y serializa el resultado como JSON", () => {
    const compoundInput = {
      initialCapital: 1000,
      monthlyContribution: 100,
      annualRatePercent: 7,
      years: 10,
    };

    const output = runChatTool(COMPOUND_INTEREST_TOOL_NAME, compoundInput);

    expect(output.isError).toBe(false);
    expect(JSON.parse(output.content).result).toEqual(calculateCompoundInterest(compoundInput));
  });

  it("devuelve un resultado de error (is_error) para un nombre de herramienta desconocido", () => {
    const output = runChatTool("herramienta_inventada", {});

    expect(output.isError).toBe(true);
    expect(output.content).toMatch(/desconocida/i);
  });

  it("devuelve un resultado de error (is_error), sin lanzar, cuando el input no es válido", () => {
    const output = runChatTool(INFLATION_IMPACT_TOOL_NAME, { currentAmount: -1 });

    expect(output.isError).toBe(true);
  });
});
