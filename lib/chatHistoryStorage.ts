const STORAGE_KEY = "invexia:chat-historial";
const MAX_STORED_MESSAGES = 40;

export interface StoredChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function saveChatHistory(messages: StoredChatMessage[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
}

export function loadChatHistory(): StoredChatMessage[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
