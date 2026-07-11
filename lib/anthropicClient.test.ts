import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateCompoundInterest } from "./compoundInterest";
import { COMPOUND_INTEREST_TOOL_NAME } from "./chatTools";

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate };
  },
}));

describe("callAnthropicChatModel", () => {
  const ORIGINAL_ENV = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    mockCreate.mockReset();
  });

  afterEach(() => {
    process.env.ANTHROPIC_API_KEY = ORIGINAL_ENV;
  });

  it("lanza un error si no hay ANTHROPIC_API_KEY configurada", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const { callAnthropicChatModel } = await import("./anthropicClient");

    await expect(
      callAnthropicChatModel({ system: "system", messages: [{ role: "user", content: "hola" }] }),
    ).rejects.toThrow("ANTHROPIC_API_KEY no está configurada.");
  });

  it("devuelve el texto directamente cuando el modelo no invoca ninguna herramienta", async () => {
    mockCreate.mockResolvedValueOnce({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "El interés compuesto es..." }],
    });

    const { callAnthropicChatModel } = await import("./anthropicClient");

    const reply = await callAnthropicChatModel({
      system: "system",
      messages: [{ role: "user", content: "¿Qué es el interés compuesto?" }],
    });

    expect(reply).toBe("El interés compuesto es...");
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("invoca la herramienta, la ejecuta con calculateCompoundInterest y devuelve la respuesta final del modelo", async () => {
    const toolInput = {
      initialCapital: 1000,
      monthlyContribution: 200,
      annualRatePercent: 7,
      years: 10,
    };
    const expectedResult = calculateCompoundInterest(toolInput);

    mockCreate
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [
          {
            type: "tool_use",
            id: "toolu_123",
            name: COMPOUND_INTEREST_TOOL_NAME,
            input: toolInput,
          },
        ],
      })
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [
          { type: "text", text: "Con esos datos, tu capital final sería de unos 37.000€." },
        ],
      });

    const { callAnthropicChatModel } = await import("./anthropicClient");

    const reply = await callAnthropicChatModel({
      system: "system",
      messages: [
        { role: "user", content: "Si invierto 200€ al mes durante 10 años al 7%, ¿cuánto tendría?" },
      ],
    });

    expect(reply).toBe("Con esos datos, tu capital final sería de unos 37.000€.");
    expect(mockCreate).toHaveBeenCalledTimes(2);

    const secondCallArgs = mockCreate.mock.calls[1][0];
    const toolResultMessage = secondCallArgs.messages.at(-1);
    expect(toolResultMessage.role).toBe("user");

    const toolResultBlock = toolResultMessage.content[0];
    expect(toolResultBlock.type).toBe("tool_result");
    expect(toolResultBlock.tool_use_id).toBe("toolu_123");
    expect(toolResultBlock.is_error).toBe(false);

    const parsedToolResult = JSON.parse(toolResultBlock.content);
    expect(parsedToolResult.result).toEqual(expectedResult);
    expect(parsedToolResult.calculatorUrl).toBe(
      "/calculadoras/interes-compuesto?capital=1000&aportacion=200&tasa=7&anios=10",
    );
  });

  it("devuelve un tool_result de error cuando la herramienta recibe parámetros fuera de rango, sin romper la conversación", async () => {
    mockCreate
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [
          {
            type: "tool_use",
            id: "toolu_456",
            name: COMPOUND_INTEREST_TOOL_NAME,
            input: {
              initialCapital: 100,
              monthlyContribution: 10,
              annualRatePercent: 7,
              years: 999,
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: "Ese número de años no es válido, ¿puedes darme otro?" }],
      });

    const { callAnthropicChatModel } = await import("./anthropicClient");

    const reply = await callAnthropicChatModel({
      system: "system",
      messages: [{ role: "user", content: "Simula 999 años de inversión" }],
    });

    expect(reply).toBe("Ese número de años no es válido, ¿puedes darme otro?");

    const secondCallArgs = mockCreate.mock.calls[1][0];
    const toolResultBlock = secondCallArgs.messages.at(-1).content[0];
    expect(toolResultBlock.is_error).toBe(true);
  });
});
