const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

export interface SanitizedChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class InvalidChatRequestError extends Error {}

function isValidRole(role: unknown): role is "user" | "assistant" {
  return role === "user" || role === "assistant";
}

/**
 * Filtra y normaliza los mensajes recibidos del cliente antes de usarlos:
 * descarta cualquier rol distinto de user/assistant (p. ej. un intento del
 * cliente de colar un mensaje "system"), recorta longitud y exige que la
 * conversación termine en un mensaje del usuario.
 */
export function sanitizeChatMessages(rawMessages: unknown): SanitizedChatMessage[] {
  if (!Array.isArray(rawMessages)) {
    throw new InvalidChatRequestError("El formato de la conversación no es válido.");
  }

  const sanitized: SanitizedChatMessage[] = [];

  for (const item of rawMessages) {
    if (typeof item !== "object" || item === null) continue;

    const { role, content } = item as Record<string, unknown>;
    if (!isValidRole(role) || typeof content !== "string") continue;

    const trimmed = content.trim();
    if (!trimmed) continue;

    sanitized.push({ role, content: trimmed.slice(0, MAX_MESSAGE_LENGTH) });
  }

  const history = sanitized.slice(-MAX_HISTORY_MESSAGES);
  const lastMessage = history[history.length - 1];

  if (!lastMessage || lastMessage.role !== "user") {
    throw new InvalidChatRequestError("El último mensaje de la conversación debe ser del usuario.");
  }

  return history;
}
