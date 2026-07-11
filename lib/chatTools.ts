import type Anthropic from "@anthropic-ai/sdk";
import { calculateCompoundInterest, type CompoundInterestResult } from "./compoundInterest";
import { buildCompoundInterestCalculatorUrl } from "./compoundInterestUrl";
import { calculateDcaVsLumpSum, type DcaVsLumpSumResult } from "./dcaVsLumpSum";
import { calculateFeeImpact, type FeeImpactResult } from "./feeImpact";
import { calculateSavingsGoal, type SavingsGoalResult } from "./savingsGoal";
import { calculateFireNumber, type FireNumberResult } from "./fireNumber";
import { calculateInflationImpact, type InflationImpactResult } from "./inflationImpact";

const MIN_YEARS = 1;
const MAX_YEARS = 60;
const MIN_RATE_PERCENT = 0;
const MAX_RATE_PERCENT = 30;
const MAX_FEE_PERCENT = 10;
const MIN_WITHDRAWAL_RATE_PERCENT = 0.1;
const MAX_WITHDRAWAL_RATE_PERCENT = 10;
const MAX_INFLATION_RATE_PERCENT = 20;
const MAX_MONETARY_AMOUNT = 100_000_000;

export class InvalidToolInputError extends Error {}

function asRecord(rawInput: unknown): Record<string, unknown> {
  if (typeof rawInput !== "object" || rawInput === null) {
    throw new InvalidToolInputError("Los parámetros de la herramienta no son válidos.");
  }
  return rawInput as Record<string, unknown>;
}

function requireNumberInRange(value: unknown, field: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new InvalidToolInputError(`El parámetro "${field}" debe ser un número entre ${min} y ${max}.`);
  }
  return value;
}

function requireIntegerInRange(value: unknown, field: string, min: number, max: number): number {
  const parsed = requireNumberInRange(value, field, min, max);
  if (!Number.isInteger(parsed)) {
    throw new InvalidToolInputError(`El parámetro "${field}" debe ser un número entero entre ${min} y ${max}.`);
  }
  return parsed;
}

function requireAmount(value: unknown, field: string): number {
  return requireNumberInRange(value, field, 0, MAX_MONETARY_AMOUNT);
}

function requireYears(value: unknown): number {
  return requireIntegerInRange(value, "years", MIN_YEARS, MAX_YEARS);
}

function requireAnnualRatePercent(value: unknown): number {
  return requireNumberInRange(value, "annualRatePercent", MIN_RATE_PERCENT, MAX_RATE_PERCENT);
}

function optionalAmount(value: unknown, field: string, defaultValue: number): number {
  return value === undefined ? defaultValue : requireAmount(value, field);
}

function optionalNumberInRange(
  value: unknown,
  field: string,
  min: number,
  max: number,
  defaultValue: number,
): number {
  return value === undefined ? defaultValue : requireNumberInRange(value, field, min, max);
}

// ---------------------------------------------------------------------------
// Interés compuesto
// ---------------------------------------------------------------------------

export const COMPOUND_INTEREST_TOOL_NAME = "calcular_interes_compuesto";

interface CompoundInterestToolInput {
  initialCapital: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}

function parseCompoundInterestToolInput(rawInput: unknown): CompoundInterestToolInput {
  const record = asRecord(rawInput);
  return {
    initialCapital: requireAmount(record.initialCapital, "initialCapital"),
    monthlyContribution: requireAmount(record.monthlyContribution, "monthlyContribution"),
    annualRatePercent: requireAnnualRatePercent(record.annualRatePercent),
    years: requireYears(record.years),
  };
}

export interface CompoundInterestToolOutput {
  result: CompoundInterestResult;
  input: CompoundInterestToolInput;
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

// ---------------------------------------------------------------------------
// DCA vs pago único
// ---------------------------------------------------------------------------

export const DCA_VS_LUMP_SUM_TOOL_NAME = "comparar_dca_vs_pago_unico";

interface DcaVsLumpSumToolInput {
  totalCapital: number;
  years: number;
  annualRatePercent: number;
}

function parseDcaVsLumpSumToolInput(rawInput: unknown): DcaVsLumpSumToolInput {
  const record = asRecord(rawInput);
  return {
    totalCapital: requireAmount(record.totalCapital, "totalCapital"),
    years: requireYears(record.years),
    annualRatePercent: requireAnnualRatePercent(record.annualRatePercent),
  };
}

export interface DcaVsLumpSumToolOutput {
  result: DcaVsLumpSumResult;
  input: DcaVsLumpSumToolInput;
}

/** Reutiliza calculateDcaVsLumpSum de /lib — misma fuente de verdad que la calculadora real. */
export function runDcaVsLumpSumTool(rawInput: unknown): DcaVsLumpSumToolOutput {
  const input = parseDcaVsLumpSumToolInput(rawInput);
  return { result: calculateDcaVsLumpSum(input), input };
}

// ---------------------------------------------------------------------------
// Coste de comisiones
// ---------------------------------------------------------------------------

export const FEE_IMPACT_TOOL_NAME = "calcular_impacto_comisiones";

const DEFAULT_LOW_FEE_PERCENT = 0.2;
const DEFAULT_MEDIUM_FEE_PERCENT = 1;
const DEFAULT_HIGH_FEE_PERCENT = 2;

interface FeeImpactToolInput {
  initialCapital: number;
  grossAnnualRatePercent: number;
  years: number;
  lowFeePercent: number;
  mediumFeePercent: number;
  highFeePercent: number;
}

function parseFeeImpactToolInput(rawInput: unknown): FeeImpactToolInput {
  const record = asRecord(rawInput);
  return {
    initialCapital: requireAmount(record.initialCapital, "initialCapital"),
    grossAnnualRatePercent: requireAnnualRatePercent(record.grossAnnualRatePercent),
    years: requireYears(record.years),
    lowFeePercent: optionalNumberInRange(
      record.lowFeePercent,
      "lowFeePercent",
      0,
      MAX_FEE_PERCENT,
      DEFAULT_LOW_FEE_PERCENT,
    ),
    mediumFeePercent: optionalNumberInRange(
      record.mediumFeePercent,
      "mediumFeePercent",
      0,
      MAX_FEE_PERCENT,
      DEFAULT_MEDIUM_FEE_PERCENT,
    ),
    highFeePercent: optionalNumberInRange(
      record.highFeePercent,
      "highFeePercent",
      0,
      MAX_FEE_PERCENT,
      DEFAULT_HIGH_FEE_PERCENT,
    ),
  };
}

export interface FeeImpactToolOutput {
  result: FeeImpactResult;
  input: FeeImpactToolInput;
}

/** Reutiliza calculateFeeImpact de /lib — misma fuente de verdad que la calculadora real. */
export function runFeeImpactTool(rawInput: unknown): FeeImpactToolOutput {
  const input = parseFeeImpactToolInput(rawInput);
  return { result: calculateFeeImpact(input), input };
}

// ---------------------------------------------------------------------------
// Objetivo de ahorro
// ---------------------------------------------------------------------------

export const SAVINGS_GOAL_TOOL_NAME = "calcular_objetivo_ahorro";

interface SavingsGoalToolInput {
  targetAmount: number;
  years: number;
  annualRatePercent: number;
  initialCapital: number;
}

function parseSavingsGoalToolInput(rawInput: unknown): SavingsGoalToolInput {
  const record = asRecord(rawInput);
  return {
    targetAmount: requireAmount(record.targetAmount, "targetAmount"),
    years: requireYears(record.years),
    annualRatePercent: requireAnnualRatePercent(record.annualRatePercent),
    initialCapital: optionalAmount(record.initialCapital, "initialCapital", 0),
  };
}

export interface SavingsGoalToolOutput {
  result: SavingsGoalResult;
  input: SavingsGoalToolInput;
}

/** Reutiliza calculateSavingsGoal de /lib — misma fuente de verdad que la calculadora real. */
export function runSavingsGoalTool(rawInput: unknown): SavingsGoalToolOutput {
  const input = parseSavingsGoalToolInput(rawInput);
  return { result: calculateSavingsGoal(input), input };
}

// ---------------------------------------------------------------------------
// Número FIRE / jubilación
// ---------------------------------------------------------------------------

export const FIRE_NUMBER_TOOL_NAME = "calcular_numero_fire";

const DEFAULT_SAFE_WITHDRAWAL_RATE_PERCENT = 4;

interface FireNumberToolInput {
  annualExpenses: number;
  safeWithdrawalRatePercent: number;
  currentSavings: number;
  monthlyContribution: number;
  annualRatePercent: number;
}

function parseFireNumberToolInput(rawInput: unknown): FireNumberToolInput {
  const record = asRecord(rawInput);
  return {
    annualExpenses: requireAmount(record.annualExpenses, "annualExpenses"),
    safeWithdrawalRatePercent: optionalNumberInRange(
      record.safeWithdrawalRatePercent,
      "safeWithdrawalRatePercent",
      MIN_WITHDRAWAL_RATE_PERCENT,
      MAX_WITHDRAWAL_RATE_PERCENT,
      DEFAULT_SAFE_WITHDRAWAL_RATE_PERCENT,
    ),
    currentSavings: requireAmount(record.currentSavings, "currentSavings"),
    monthlyContribution: requireAmount(record.monthlyContribution, "monthlyContribution"),
    annualRatePercent: requireAnnualRatePercent(record.annualRatePercent),
  };
}

export interface FireNumberToolOutput {
  result: FireNumberResult;
  input: FireNumberToolInput;
}

/** Reutiliza calculateFireNumber de /lib — misma fuente de verdad que la calculadora real. */
export function runFireNumberTool(rawInput: unknown): FireNumberToolOutput {
  const input = parseFireNumberToolInput(rawInput);
  return { result: calculateFireNumber(input), input };
}

// ---------------------------------------------------------------------------
// Inflación / poder adquisitivo
// ---------------------------------------------------------------------------

export const INFLATION_IMPACT_TOOL_NAME = "calcular_impacto_inflacion";

interface InflationImpactToolInput {
  currentAmount: number;
  annualInflationRatePercent: number;
  years: number;
}

function parseInflationImpactToolInput(rawInput: unknown): InflationImpactToolInput {
  const record = asRecord(rawInput);
  return {
    currentAmount: requireAmount(record.currentAmount, "currentAmount"),
    annualInflationRatePercent: requireNumberInRange(
      record.annualInflationRatePercent,
      "annualInflationRatePercent",
      0,
      MAX_INFLATION_RATE_PERCENT,
    ),
    years: requireYears(record.years),
  };
}

export interface InflationImpactToolOutput {
  result: InflationImpactResult;
  input: InflationImpactToolInput;
}

/** Reutiliza calculateInflationImpact de /lib — misma fuente de verdad que la calculadora real. */
export function runInflationImpactTool(rawInput: unknown): InflationImpactToolOutput {
  const input = parseInflationImpactToolInput(rawInput);
  return { result: calculateInflationImpact(input), input };
}

// ---------------------------------------------------------------------------
// Definiciones de herramientas (schema Anthropic) y despacho
// ---------------------------------------------------------------------------

/**
 * Rangos alineados con los límites de los formularios reales de cada
 * calculadora (años 1-60, tasas 0-30%, etc.) para que ninguna herramienta
 * calcule un escenario que la calculadora correspondiente no podría mostrar.
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
        initialCapital: { type: "number", description: "Capital inicial en euros (0 o más)." },
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
  {
    name: DCA_VS_LUMP_SUM_TOOL_NAME,
    description:
      "Compara invertir un capital total de golpe (pago único) frente a repartirlo en aportaciones mensuales " +
      "iguales durante el mismo periodo (DCA, dollar-cost averaging), con la misma rentabilidad anual esperada " +
      "para ambos. Úsala cuando la persona usuaria pregunte algo como \"¿es mejor invertir todo de golpe o poco " +
      "a poco?\" dando una cantidad y un plazo concretos. Esta herramienta solo calcula el resultado matemático " +
      "de los datos dados: no la uses para decidir por la persona usuaria qué opción elegir.",
    input_schema: {
      type: "object",
      properties: {
        totalCapital: { type: "number", description: "Capital total a invertir, en euros (0 o más)." },
        years: {
          type: "number",
          description: `Horizonte temporal de la simulación, en años (entre ${MIN_YEARS} y ${MAX_YEARS}).`,
        },
        annualRatePercent: {
          type: "number",
          description: `Rentabilidad anual esperada en porcentaje (entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}).`,
        },
      },
      required: ["totalCapital", "years", "annualRatePercent"],
    },
  },
  {
    name: FEE_IMPACT_TOOL_NAME,
    description:
      "Calcula cómo las comisiones anuales afectan al capital final a largo plazo, comparando tres escenarios de " +
      "comisión (baja, media, alta) sobre la misma rentabilidad bruta esperada. Úsala cuando la persona usuaria " +
      "pregunte cuánto le cuestan las comisiones de un fondo o producto a largo plazo. Los tres porcentajes de " +
      `comisión son opcionales: si no los da, usa por defecto ${DEFAULT_LOW_FEE_PERCENT}% (baja), ` +
      `${DEFAULT_MEDIUM_FEE_PERCENT}% (media) y ${DEFAULT_HIGH_FEE_PERCENT}% (alta), típicos de fondo indexado, ` +
      "fondo gestionado activamente y producto caro respectivamente. Esta herramienta solo calcula el resultado " +
      "matemático: no la uses para recomendar un producto o entidad concreta.",
    input_schema: {
      type: "object",
      properties: {
        initialCapital: { type: "number", description: "Capital inicial invertido, en euros (0 o más)." },
        grossAnnualRatePercent: {
          type: "number",
          description: `Rentabilidad anual esperada antes de comisiones, en porcentaje (entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}).`,
        },
        years: {
          type: "number",
          description: `Horizonte temporal de la simulación, en años (entre ${MIN_YEARS} y ${MAX_YEARS}).`,
        },
        lowFeePercent: {
          type: "number",
          description: `Comisión anual del escenario bajo, en porcentaje (entre 0 y ${MAX_FEE_PERCENT}). Opcional, por defecto ${DEFAULT_LOW_FEE_PERCENT}.`,
        },
        mediumFeePercent: {
          type: "number",
          description: `Comisión anual del escenario medio, en porcentaje (entre 0 y ${MAX_FEE_PERCENT}). Opcional, por defecto ${DEFAULT_MEDIUM_FEE_PERCENT}.`,
        },
        highFeePercent: {
          type: "number",
          description: `Comisión anual del escenario alto, en porcentaje (entre 0 y ${MAX_FEE_PERCENT}). Opcional, por defecto ${DEFAULT_HIGH_FEE_PERCENT}.`,
        },
      },
      required: ["initialCapital", "grossAnnualRatePercent", "years"],
    },
  },
  {
    name: SAVINGS_GOAL_TOOL_NAME,
    description:
      "Calcula la aportación mensual necesaria para alcanzar una cantidad objetivo de ahorro en un plazo dado, " +
      "con una rentabilidad anual esperada. Úsala cuando la persona usuaria pregunte algo como \"¿cuánto tengo " +
      "que ahorrar al mes para tener 30.000€ en 10 años?\". \"initialCapital\" es opcional (por defecto 0, si " +
      "aún no tiene nada ahorrado). Esta herramienta solo calcula el resultado matemático: no la uses para " +
      "sugerir si ese objetivo o esa rentabilidad son adecuados para la persona usuaria.",
    input_schema: {
      type: "object",
      properties: {
        targetAmount: { type: "number", description: "Cantidad objetivo a alcanzar, en euros (0 o más)." },
        years: {
          type: "number",
          description: `Años disponibles para conseguirlo (entre ${MIN_YEARS} y ${MAX_YEARS}).`,
        },
        annualRatePercent: {
          type: "number",
          description: `Rentabilidad anual esperada en porcentaje (entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}).`,
        },
        initialCapital: {
          type: "number",
          description: "Capital inicial ya ahorrado, en euros (0 o más). Opcional, por defecto 0.",
        },
      },
      required: ["targetAmount", "years", "annualRatePercent"],
    },
  },
  {
    name: FIRE_NUMBER_TOOL_NAME,
    description:
      "Calcula el \"número FIRE\" (capital objetivo para vivir de las rentas / jubilación anticipada) a partir " +
      "del gasto anual y una tasa de retirada segura, y estima en cuántos años se alcanzaría con el ahorro " +
      "actual y la aportación mensual dadas. Úsala cuando la persona usuaria pregunte algo como \"¿cuánto " +
      "necesito para poder dejar de trabajar?\" o mencione FIRE/jubilación anticipada con cifras concretas. " +
      `\"safeWithdrawalRatePercent\" es opcional (por defecto ${DEFAULT_SAFE_WITHDRAWAL_RATE_PERCENT}, la regla ` +
      "clásica del 4%). Esta herramienta solo calcula el resultado matemático: no la uses para decidir si esa " +
      "meta o ese estilo de vida son adecuados para la persona usuaria.",
    input_schema: {
      type: "object",
      properties: {
        annualExpenses: {
          type: "number",
          description: "Gasto anual estimado a cubrir con las inversiones, en euros (0 o más).",
        },
        safeWithdrawalRatePercent: {
          type: "number",
          description: `Tasa de retirada segura, en porcentaje (entre ${MIN_WITHDRAWAL_RATE_PERCENT} y ${MAX_WITHDRAWAL_RATE_PERCENT}). Opcional, por defecto ${DEFAULT_SAFE_WITHDRAWAL_RATE_PERCENT}.`,
        },
        currentSavings: { type: "number", description: "Ahorro/inversión actual, en euros (0 o más)." },
        monthlyContribution: { type: "number", description: "Aportación mensual actual, en euros (0 o más)." },
        annualRatePercent: {
          type: "number",
          description: `Rentabilidad anual esperada en porcentaje (entre ${MIN_RATE_PERCENT} y ${MAX_RATE_PERCENT}).`,
        },
      },
      required: ["annualExpenses", "currentSavings", "monthlyContribution", "annualRatePercent"],
    },
  },
  {
    name: INFLATION_IMPACT_TOOL_NAME,
    description:
      "Calcula cuánto poder adquisitivo pierde una cantidad de dinero a lo largo de los años debido a la " +
      "inflación. Úsala cuando la persona usuaria pregunte algo como \"¿cuánto valdrán realmente mis 10.000€ " +
      "dentro de 10 años?\" o sobre el efecto de la inflación en sus ahorros. Esta herramienta solo calcula el " +
      "resultado matemático de los datos dados: no la uses para recomendar cómo protegerse de la inflación.",
    input_schema: {
      type: "object",
      properties: {
        currentAmount: { type: "number", description: "Cantidad de dinero actual, en euros (0 o más)." },
        annualInflationRatePercent: {
          type: "number",
          description: `Tasa de inflación anual esperada, en porcentaje (entre 0 y ${MAX_INFLATION_RATE_PERCENT}).`,
        },
        years: {
          type: "number",
          description: `Años a futuro (entre ${MIN_YEARS} y ${MAX_YEARS}).`,
        },
      },
      required: ["currentAmount", "annualInflationRatePercent", "years"],
    },
  },
];

export interface ChatToolExecutionResult {
  content: string;
  isError: boolean;
}

/**
 * Punto único de despacho: dado el nombre de una herramienta y su input crudo,
 * la ejecuta y devuelve el contenido a enviar de vuelta al modelo como
 * tool_result. Nunca lanza para un input inválido: lo convierte en un
 * tool_result de error para que el modelo pueda recuperarse.
 */
export function runChatTool(name: string, rawInput: unknown): ChatToolExecutionResult {
  try {
    switch (name) {
      case COMPOUND_INTEREST_TOOL_NAME:
        return { content: JSON.stringify(runCompoundInterestTool(rawInput)), isError: false };
      case DCA_VS_LUMP_SUM_TOOL_NAME:
        return { content: JSON.stringify(runDcaVsLumpSumTool(rawInput)), isError: false };
      case FEE_IMPACT_TOOL_NAME:
        return { content: JSON.stringify(runFeeImpactTool(rawInput)), isError: false };
      case SAVINGS_GOAL_TOOL_NAME:
        return { content: JSON.stringify(runSavingsGoalTool(rawInput)), isError: false };
      case FIRE_NUMBER_TOOL_NAME:
        return { content: JSON.stringify(runFireNumberTool(rawInput)), isError: false };
      case INFLATION_IMPACT_TOOL_NAME:
        return { content: JSON.stringify(runInflationImpactTool(rawInput)), isError: false };
      default:
        return { content: `Herramienta desconocida: ${name}`, isError: true };
    }
  } catch (error) {
    if (error instanceof InvalidToolInputError) {
      return { content: error.message, isError: true };
    }
    throw error;
  }
}
