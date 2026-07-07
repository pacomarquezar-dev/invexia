import type { CallAnthropicParams } from "./chatHandler";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 700;

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicMessagesResponse {
  content?: AnthropicContentBlock[];
}

export async function callAnthropicChatModel({ system, messages }: CallAnthropicParams): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está configurada.");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API respondió con estado ${response.status}`);
  }

  const data = (await response.json()) as AnthropicMessagesResponse;
  const text = data.content?.find((block) => block.type === "text")?.text;

  if (!text) {
    throw new Error("La respuesta del modelo no contiene texto.");
  }

  return text;
}
