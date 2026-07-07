const MAX_MESSAGES_PER_WINDOW = 20;
const WINDOW_MS = 24 * 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Limitador en memoria (sin base de datos, ver CLAUDE.md). Solo protege
 * frente a abuso dentro de la misma instancia de la función serverless;
 * no es un límite global exacto si Vercel escala a varias instancias.
 */
export class ChatRateLimiter {
  private readonly store = new Map<string, RateLimitEntry>();

  constructor(
    private readonly maxMessages: number = MAX_MESSAGES_PER_WINDOW,
    private readonly windowMs: number = WINDOW_MS,
  ) {}

  consume(identifier: string, now: number = Date.now()): RateLimitResult {
    const entry = this.store.get(identifier);

    if (!entry || now - entry.windowStart >= this.windowMs) {
      this.store.set(identifier, { count: 1, windowStart: now });
      return { allowed: true, remaining: this.maxMessages - 1, resetAt: now + this.windowMs };
    }

    if (entry.count >= this.maxMessages) {
      return { allowed: false, remaining: 0, resetAt: entry.windowStart + this.windowMs };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: this.maxMessages - entry.count,
      resetAt: entry.windowStart + this.windowMs,
    };
  }
}

export const chatRateLimiter = new ChatRateLimiter();
