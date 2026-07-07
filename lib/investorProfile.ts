export interface QuizOption {
  label: string;
  points: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const investorProfileQuestions: QuizQuestion[] = [
  {
    id: "caida-20",
    question: "Si tus inversiones cayeran un 20% en un mes, ¿qué harías?",
    options: [
      { label: "Vendería todo para evitar más pérdidas", points: 1 },
      { label: "Vendería una parte para reducir el riesgo", points: 2 },
      { label: "No haría nada y esperaría a que se recupere", points: 3 },
      { label: "Aprovecharía para invertir más", points: 4 },
    ],
  },
  {
    id: "horizonte",
    question: "¿Cuánto tiempo falta antes de que necesites este dinero?",
    options: [
      { label: "Menos de 2 años", points: 1 },
      { label: "Entre 2 y 5 años", points: 2 },
      { label: "Entre 5 y 10 años", points: 3 },
      { label: "Más de 10 años", points: 4 },
    ],
  },
  {
    id: "experiencia",
    question: "¿Cuál es tu experiencia previa invirtiendo?",
    options: [
      { label: "Ninguna, nunca he invertido", points: 1 },
      { label: "Algo: he probado depósitos o fondos garantizados", points: 2 },
      { label: "Invierto de forma regular desde hace algunos años", points: 3 },
      { label: "Bastante experiencia con distintos productos (bolsa, fondos indexados...)", points: 4 },
    ],
  },
  {
    id: "prioridad",
    question: "¿Qué prefieres?",
    options: [
      { label: "Seguridad total, aunque la rentabilidad sea baja", points: 1 },
      { label: "Un equilibrio entre seguridad y rentabilidad", points: 2 },
      { label: "Más rentabilidad, aceptando algo más de riesgo", points: 3 },
      { label: "La máxima rentabilidad posible, aunque el riesgo sea alto", points: 4 },
    ],
  },
  {
    id: "porcentaje-riesgo",
    question:
      "¿Qué porcentaje de tus ahorros totales estarías dispuesto a poner en productos con riesgo (por ejemplo, bolsa)?",
    options: [
      { label: "Ninguno, prefiero productos sin riesgo", points: 1 },
      { label: "Hasta un 25%", points: 2 },
      { label: "Entre un 25% y un 50%", points: 3 },
      { label: "Más del 50%", points: 4 },
    ],
  },
  {
    id: "resultados-flojos",
    question:
      "Si tu inversión no diera los resultados esperados durante 2-3 años seguidos, ¿qué harías?",
    options: [
      { label: "Retiraría el dinero y no volvería a invertir", points: 1 },
      { label: "Retiraría una parte y sería más prudente", points: 2 },
      { label: "Mantendría la inversión, confiando en el largo plazo", points: 3 },
      { label: "Seguiría invirtiendo e incluso aportaría más", points: 4 },
    ],
  },
  {
    id: "conocimientos",
    question: "¿Cómo describirías tus conocimientos sobre los mercados financieros?",
    options: [
      { label: "Muy básicos o nulos", points: 1 },
      { label: "Básicos: entiendo los conceptos principales", points: 2 },
      { label: "Intermedios: sigo la actualidad económica", points: 3 },
      { label: "Avanzados: entiendo bien los riesgos y los productos", points: 4 },
    ],
  },
];

export type InvestorProfile = "conservador" | "moderado" | "agresivo";

export interface InvestorProfileDefinition {
  id: InvestorProfile;
  name: string;
  description: string;
}

export const investorProfiles: Record<InvestorProfile, InvestorProfileDefinition> = {
  conservador: {
    id: "conservador",
    name: "Conservador",
    description:
      "Priorizas la seguridad de tu capital por encima de la rentabilidad. Prefieres evitar caídas bruscas y sueles tener un horizonte temporal más corto o poca tolerancia a la volatilidad. Los productos de menor riesgo suelen encajar mejor con este perfil.",
  },
  moderado: {
    id: "moderado",
    name: "Moderado",
    description:
      "Buscas un equilibrio entre seguridad y crecimiento. Puedes tolerar cierta volatilidad a cambio de una rentabilidad algo mayor, siempre que el horizonte temporal lo permita.",
  },
  agresivo: {
    id: "agresivo",
    name: "Agresivo",
    description:
      "Priorizas el crecimiento a largo plazo y toleras bien la volatilidad a corto plazo. Sueles tener un horizonte temporal largo y estás dispuesto a asumir más riesgo buscando una mayor rentabilidad potencial.",
  },
};

export interface AnnualRateSuggestion {
  min: number;
  max: number;
  /** Punto medio del rango, usado como valor sugerido único. */
  suggested: number;
}

/**
 * Rentabilidad anual esperada sugerida por perfil, para pre-rellenar (de
 * forma editable) el campo de rentabilidad de las calculadoras cuando hay
 * un perfil guardado en localStorage. No es una recomendación de inversión
 * concreta, solo una referencia orientativa por perfil de riesgo.
 */
export const suggestedAnnualRateRangeByProfile: Record<InvestorProfile, AnnualRateSuggestion> = {
  conservador: { min: 3, max: 4, suggested: 3.5 },
  moderado: { min: 5, max: 6, suggested: 5.5 },
  agresivo: { min: 7, max: 8, suggested: 7.5 },
};

export interface ResolvedAnnualRate {
  value: number;
  /** Texto para mostrar mientras se está usando la sugerencia sin editar (null si no aplica). */
  hint: string | null;
}

/**
 * Decide qué rentabilidad anual usar en un campo de calculadora: lo que
 * haya tecleado el usuario (`override`) tiene siempre prioridad; si no ha
 * tecleado nada y hay un perfil de inversor guardado, se sugiere (de forma
 * editable) la rentabilidad típica de ese perfil; si no hay perfil
 * guardado, se usa `defaultValue` (el valor por defecto actual de la
 * calculadora, sin cambios).
 */
export function resolveAnnualRateSuggestion(
  profile: InvestorProfile | null,
  override: number | null,
  defaultValue: number,
): ResolvedAnnualRate {
  if (profile === null) {
    return { value: override ?? defaultValue, hint: null };
  }

  const suggestion = suggestedAnnualRateRangeByProfile[profile];
  const profileName = investorProfiles[profile].name.toLowerCase();

  return {
    value: override ?? suggestion.suggested,
    hint:
      override === null
        ? `Sugerencia para tu perfil ${profileName}: ${suggestion.min}-${suggestion.max}% (usamos ${suggestion.suggested}%). Puedes cambiarlo.`
        : null,
  };
}

export const minInvestorProfileScore = investorProfileQuestions.reduce(
  (sum, question) => sum + Math.min(...question.options.map((option) => option.points)),
  0,
);

export const maxInvestorProfileScore = investorProfileQuestions.reduce(
  (sum, question) => sum + Math.max(...question.options.map((option) => option.points)),
  0,
);

function classifyProfile(totalScore: number): InvestorProfile {
  const range = maxInvestorProfileScore - minInvestorProfileScore;
  const conservadorThreshold = minInvestorProfileScore + range / 3;
  const moderadoThreshold = minInvestorProfileScore + (2 * range) / 3;

  if (totalScore <= conservadorThreshold) return "conservador";
  if (totalScore <= moderadoThreshold) return "moderado";
  return "agresivo";
}

export interface InvestorProfileResult {
  totalScore: number;
  profile: InvestorProfile;
}

/**
 * `answerOptionIndices[i]` es el índice de la opción elegida para
 * `investorProfileQuestions[i]`. Los índices que falten puntúan 0.
 */
export function calculateInvestorProfile(
  answerOptionIndices: number[],
): InvestorProfileResult {
  const totalScore = investorProfileQuestions.reduce((sum, question, index) => {
    const option = question.options[answerOptionIndices[index]];
    return sum + (option ? option.points : 0);
  }, 0);

  return {
    totalScore,
    profile: classifyProfile(totalScore),
  };
}
