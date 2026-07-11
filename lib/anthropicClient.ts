import Anthropic from "@anthropic-ai/sdk";
import type { CallAnthropicParams } from "./chatHandler";
import {
  chatTools,
  COMPOUND_INTEREST_TOOL_NAME,
  runCompoundInterestTool,
  InvalidToolInputError,
} from "./chatTools";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 700;
const MAX_TOOL_ITERATIONS = 3;

interface ToolExecutionResult {
  content: string;
  isError: boolean;
}

function executeTool(name: string, input: unknown): ToolExecutionResult {
  if (name !== COMPOUND_INTEREST_TOOL_NAME) {
    return { content: `Herramienta desconocida: ${name}`, isError: true };
  }

  try {
    return { content: JSON.stringify(runCompoundInterestTool(input)), isError: false };
  } catch (error) {
    if (error instanceof InvalidToolInputError) {
      return { content: error.message, isError: true };
    }
    throw error;
  }
}

export async function callAnthropicChatModel({ system, messages }: CallAnthropicParams): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está configurada.");
  }

  const client = new Anthropic({ apiKey });

  const conversation: Anthropic.MessageParam[] = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: conversation,
      tools: chatTools,
    });

    if (response.stop_reason !== "tool_use") {
      const text = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === "text",
      )?.text;

      if (!text) {
        throw new Error("La respuesta del modelo no contiene texto.");
      }

      return text;
    }

    conversation.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = response.content
      .filter((block): block is Anthropic.ToolUseBlock => block.type === "tool_use")
      .map((block) => {
        const { content, isError } = executeTool(block.name, block.input);
        return {
          type: "tool_result",
          tool_use_id: block.id,
          content,
          is_error: isError,
        };
      });

    conversation.push({ role: "user", content: toolResults });
  }

  throw new Error("Se alcanzó el límite de iteraciones de herramientas sin obtener una respuesta final.");
}
