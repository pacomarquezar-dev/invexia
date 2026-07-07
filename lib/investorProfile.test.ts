import { describe, expect, it } from "vitest";
import {
  calculateInvestorProfile,
  investorProfileQuestions,
  maxInvestorProfileScore,
  minInvestorProfileScore,
  resolveAnnualRateSuggestion,
  suggestedAnnualRateRangeByProfile,
} from "./investorProfile";

describe("calculateInvestorProfile", () => {
  it("tiene 7 preguntas con 4 opciones cada una, puntuando de 1 a 4", () => {
    expect(investorProfileQuestions).toHaveLength(7);
    for (const question of investorProfileQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.map((option) => option.points)).toEqual([1, 2, 3, 4]);
    }
    expect(minInvestorProfileScore).toBe(7); // 7 preguntas x 1 punto
    expect(maxInvestorProfileScore).toBe(28); // 7 preguntas x 4 puntos
  });

  it("clasifica como Conservador con la puntuación mínima (todo respuestas de 1 punto)", () => {
    const answers = investorProfileQuestions.map(() => 0);
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(7);
    expect(result.profile).toBe("conservador");
  });

  it("sigue siendo Conservador en el límite superior del rango (14 puntos)", () => {
    const answers = investorProfileQuestions.map(() => 1); // 7 x 2 puntos = 14
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(14);
    expect(result.profile).toBe("conservador");
  });

  it("pasa a Moderado justo en el límite inferior del rango (15 puntos)", () => {
    const answers = investorProfileQuestions.map((_, index) => (index === 0 ? 2 : 1)); // 3 + 2*6 = 15
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(15);
    expect(result.profile).toBe("moderado");
  });

  it("sigue siendo Moderado en el límite superior del rango (21 puntos)", () => {
    const answers = investorProfileQuestions.map(() => 2); // 7 x 3 puntos = 21
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(21);
    expect(result.profile).toBe("moderado");
  });

  it("pasa a Agresivo justo en el límite inferior del rango (22 puntos)", () => {
    const answers = investorProfileQuestions.map((_, index) => (index === 0 ? 3 : 2)); // 4 + 3*6 = 22
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(22);
    expect(result.profile).toBe("agresivo");
  });

  it("clasifica como Agresivo con la puntuación máxima (todo respuestas de 4 puntos)", () => {
    const answers = investorProfileQuestions.map(() => 3);
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(28);
    expect(result.profile).toBe("agresivo");
  });

  it("las respuestas que faltan puntúan 0 en vez de fallar", () => {
    const answers: number[] = [];
    const result = calculateInvestorProfile(answers);

    expect(result.totalScore).toBe(0);
    expect(result.profile).toBe("conservador");
  });
});

describe("resolveAnnualRateSuggestion", () => {
  it("usa el valor por defecto cuando no hay perfil guardado, aunque el usuario no haya editado nada", () => {
    const result = resolveAnnualRateSuggestion(null, null, 7);

    expect(result.value).toBe(7);
    expect(result.hint).toBeNull();
  });

  it("usa el valor por defecto sin perfil, incluso si por algún motivo hay un override", () => {
    const result = resolveAnnualRateSuggestion(null, 12, 7);

    expect(result.value).toBe(12);
    expect(result.hint).toBeNull();
  });

  it("sugiere el punto medio del rango de cada perfil cuando hay perfil guardado y el usuario no ha editado el campo", () => {
    expect(resolveAnnualRateSuggestion("conservador", null, 7).value).toBe(
      suggestedAnnualRateRangeByProfile.conservador.suggested,
    );
    expect(resolveAnnualRateSuggestion("moderado", null, 7).value).toBe(
      suggestedAnnualRateRangeByProfile.moderado.suggested,
    );
    expect(resolveAnnualRateSuggestion("agresivo", null, 7).value).toBe(
      suggestedAnnualRateRangeByProfile.agresivo.suggested,
    );
  });

  it("las sugerencias caen dentro de los rangos pedidos (conservador 3-4%, moderado 5-6%, agresivo 7-8%)", () => {
    expect(suggestedAnnualRateRangeByProfile.conservador).toEqual({ min: 3, max: 4, suggested: 3.5 });
    expect(suggestedAnnualRateRangeByProfile.moderado).toEqual({ min: 5, max: 6, suggested: 5.5 });
    expect(suggestedAnnualRateRangeByProfile.agresivo).toEqual({ min: 7, max: 8, suggested: 7.5 });
  });

  it("muestra un texto de sugerencia (editable) cuando hay perfil y no hay override", () => {
    const result = resolveAnnualRateSuggestion("moderado", null, 7);

    expect(result.hint).not.toBeNull();
    expect(result.hint).toContain("moderado");
    expect(result.hint).toContain("5-6%");
  });

  it("el valor tecleado por el usuario tiene prioridad sobre la sugerencia del perfil", () => {
    const result = resolveAnnualRateSuggestion("agresivo", 4.2, 7);

    expect(result.value).toBe(4.2);
  });

  it("no muestra el texto de sugerencia en cuanto el usuario ha editado el campo", () => {
    const result = resolveAnnualRateSuggestion("agresivo", 4.2, 7);

    expect(result.hint).toBeNull();
  });
});
