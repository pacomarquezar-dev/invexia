import type Anthropic from "@anthropic-ai/sdk";
import { calculateCompoundInterest, type CompoundInterestResult } from "./compoundInterest";
import { buildCompoundInterestCalculatorUrl } from "./compoundInterestUrl";

const MIN_YEARS = 1;
const MAX_YEARS = 60;
const MIN_RATE_PERCENT = 0;
const MAX_RATE_PERCENT = 30;
const MAX_MONETARY_AMOUNT = 100_000_000;

export const COMPOUND_INTEREST_TOOL_NAME = "calcular_interes_compuesto";

/**
 * Rangos alineados con los límites del formulario real de la calculadora
 * (CompoundInterestCalculator.tsx: años 1-60, tasa 0-30%) para que la
 * herramienta nunca calcule un escenario que la calculadora no podría mostrar.
 */
export const chatTools: Anthropic.Tool[] = [
  {
    name: COMPOUND_INTEREST_TOOL_NAME,
    description:
      "Calcula el capital final de un escenario de interés compuesto con aportaciones periódicas mensuales. " +
      "Úsala cuando la persona usuaria plantee un escenario numérico concreto de ahorro/inversión " +
      "(por ejemplo, \"si invierto 200€ al mes durante 10 años al 7%, ¿cuánto tendría?\"). " +
      "Esta herramienta solo calcula el resultado matemático de los datos que da la propia persona usuaria: " +
      "nunca la uses para sugerir qué capital, aportación o tasa debería elegir, ni para recomendar dónde invertir.",
    input_schema: {
      type: "object",
      properties: {
        initialCapital: {
          type: "number",
          description: "Capital inicial en euros (0 o más).",
        },
        monthlyContribution: {
          type: "number",
          description: "Aportación periódica mensual en euros (0 o más).",
        },
        annualRatePercent: {
          type: "number",
          description: `Tasa de interés nominal anual en porcentaje, ej. 7 para 7% (entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}).`,
        },
        years: {
          type: "number",
          description: `Número de años de la simulación (entre ${MIN_YEARS} y ${MAX_YEARS}).`,
        },
      },
      required: ["initialCapital", "monthlyContribution", "annualRatePercent", "years"],
    },
  },
];

export class InvalidToolInputError extends Error {}

function requireFiniteAmount(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > MAX_MONETARY_AMOUNT) {
    throw new InvalidToolInputError(
      `El parámetro "${field}" debe ser un número entre 0 y ${MAX_MONETARY_AMOUNT}.`,
    );
  }
  return value;
}

function parseCompoundInterestToolInput(rawInput: unknown): {
  initialCapital: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
} {
  if (typeof rawInput !== "object" || rawInput === null) {
    throw new InvalidToolInputError("Los parámetros de la herramienta no son válidos.");
  }

  const { initialCapital, monthlyContribution, annualRatePercent, years } =
    rawInput as Record<string, unknown>;

  const parsedRate = annualRatePercent;
  if (
    typeof parsedRate !== "number" ||
    !Number.isFinite(parsedRate) ||
    parsedRate < MIN_RATE_PERCENT ||
    parsedRate > MAX_RATE_PERCENT
  ) {
    throw new InvalidToolInputError(
      `El parámetro "annualRatePercent" debe estar entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}.`,
    );
  }

  const parsedYears = years;
  if (
    typeof parsedYears !== "number" ||
    !Number.isFinite(parsedYears) ||
    !Number.isInteger(parsedYears) ||
    parsedYears < MIN_YEARS ||
    parsedYears > MAX_YEARS
  ) {
    throw new InvalidToolInputError(
      `El parámetro "years" debe ser un número entero entre ${MIN_YEARS} y ${MAX_YEARS}.`,
    );
  }

  return {
    initialCapital: requireFiniteAmount(initialCapital, "initialCapital"),
    monthlyContribution: requireFiniteAmount(monthlyContribution, "monthlyContribution"),
    annualRatePercent: parsedRate,
    years: parsedYears,
  };
}

export interface CompoundInterestToolOutput {
  result: CompoundInterestResult;
  input: {
    initialCapital: number;
    monthlyContribution: number;
    annualRatePercent: number;
    years: number;
  };
  calculatorUrl: string;
}

/**
 * Ejecuta la herramienta reutilizando calculateCompoundInterest, la misma
 * función de /lib que usa la calculadora real — nunca reimplementa la fórmula.
 */
export function runCompoundInterestTool(rawInput: unknown): CompoundInterestToolOutput {
  const input = parseCompoundInterestToolInput(rawInput);
  return {
    result: calculateCompoundInterest(input),
    input,
    calculatorUrl: buildCompoundInterestCalculatorUrl(input),
  };
}
