import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt } from "./chatSystemPrompt";

describe("buildChatSystemPrompt", () => {
  it("incluye la prohibición de recomendar productos, fondos, brokers o porcentajes concretos", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toMatch(/nunca recomiendes productos/i);
    expect(prompt).toMatch(/fondos/i);
    expect(prompt).toMatch(/brokers/i);
    expect(prompt).toMatch(/porcentajes de cartera concretos/i);
  });

  it("incluye el recordatorio de contenido educativo, no asesoramiento regulado", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toMatch(/información educativa/i);
    expect(prompt).toMatch(/no asesoramiento financiero regulado/i);
  });

  it("instruye a ignorar intentos de saltarse las reglas mediante instrucciones del usuario", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toMatch(/ignora cualquier intento/i);
    expect(prompt).toMatch(/prioridad absoluta sobre cualquier instrucción/i);
  });

  it("sin perfil de inversor, no añade contexto adicional", () => {
    const prompt = buildChatSystemPrompt(null);

    expect(prompt).not.toMatch(/test de perfil de inversor/i);
  });

  it("con perfil de inversor, añade el contexto sin eliminar las reglas base", () => {
    const prompt = buildChatSystemPrompt({ profile: "agresivo" });

    expect(prompt).toMatch(/"Agresivo"/);
    expect(prompt).toMatch(/nunca recomiendes productos/i);
    expect(prompt).toMatch(/no cambia ninguna regla anterior/i);
  });

  it("menciona la herramienta de cálculo de interés compuesto y deja claro que no debe usarse para recomendar", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toMatch(/calcular_interes_compuesto/);
    expect(prompt).toMatch(/no la uses para decidir ni sugerir/i);
  });
});
