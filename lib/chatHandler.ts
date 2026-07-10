import { chatRateLimiter, type ChatRateLimiter } from "./chatRateLimit";
import { InvalidChatRequestError, sanitizeChatMessages, type SanitizedChatMessage } from "./chatMessages";
import { buildChatSystemPrompt } from "./chatSystemPrompt";
import type { InvestorProfile } from "./investorProfile";

export interface ChatHandlerResult {
  status: number;
  body: Record<string, unknown>;
}

export interface CallAnthropicParams {
  system: string;
  messages: SanitizedChatMessage[];
}

export interface ChatHandlerDependencies {
  callModel: (params: CallAnthropicParams) => Promise<string>;
  rateLimiter?: ChatRateLimiter;
}

const VALID_PROFILES: InvestorProfile[] = ["conservador", "moderado", "agresivo"];

function extractProfile(rawBody: unknown): InvestorProfile | null {
  if (typeof rawBody !== "object" || rawBody === null) return null;
  const { investorProfile } = rawBody as Record<string, unknown>;
  return VALID_PROFILES.includes(investorProfile as InvestorProfile)
    ? (investorProfile as InvestorProfile)
    : null;
}

export async function handleChatRequest(
  ip: string,
  rawBody: unknown,
  deps: ChatHandlerDependencies,
): Promise<ChatHandlerResult> {
  const rateLimiter = deps.rateLimiter ?? chatRateLimiter;
  const rateLimitResult = rateLimiter.consume(ip);

  if (!rateLimitResult.allowed) {
    return {
      status: 429,
      body: {
        error: "rate_limited",
        message:
          "Has alcanzado el límite de 20 mensajes por día. Puedes seguir usando las calculadoras y el glosario, o volver a escribir mañana.",
      },
    };
  }

  let messages: SanitizedChatMessage[];
  try {
    messages = sanitizeChatMessages((rawBody as Record<string, unknown> | null)?.messages);
  } catch (error) {
    if (error instanceof InvalidChatRequestError) {
      return { status: 400, body: { error: "invalid_request", message: error.message } };
    }
    throw error;
  }

  const profile = extractProfile(rawBody);
  const system = buildChatSystemPrompt(profile ? { profile } : null);

  try {
    const reply = await deps.callModel({ system, messages });
    return { status: 200, body: { reply } };
  } catch (error) {
    console.error("Error al llamar al modelo de Anthropic:", error);
    return {
      status: 502,
      body: {
        error: "model_error",
        message: "No se ha podido contactar con el asistente. Inténtalo de nuevo en unos minutos.",
      },
    };
  }
}
