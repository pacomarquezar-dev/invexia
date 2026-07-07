import { describe, expect, it } from "vitest";
import { ChatRateLimiter } from "./chatRateLimit";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("ChatRateLimiter", () => {
  it("permite hasta el máximo de mensajes configurado dentro de la ventana", () => {
    const limiter = new ChatRateLimiter(20, DAY_MS);
    const now = Date.now();

    for (let i = 0; i < 20; i++) {
      const result = limiter.consume("1.2.3.4", now);
      expect(result.allowed).toBe(true);
    }
  });

  it("bloquea el mensaje 21 dentro de la misma ventana de 24h", () => {
    const limiter = new ChatRateLimiter(20, DAY_MS);
    const now = Date.now();

    for (let i = 0; i < 20; i++) {
      limiter.consume("1.2.3.4", now);
    }

    const blocked = limiter.consume("1.2.3.4", now + 1000);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("reporta el remaining correctamente conforme se consumen mensajes", () => {
    const limiter = new ChatRateLimiter(20, DAY_MS);
    const now = Date.now();

    const first = limiter.consume("1.2.3.4", now);
    const second = limiter.consume("1.2.3.4", now);

    expect(first.remaining).toBe(19);
    expect(second.remaining).toBe(18);
  });

  it("resetea el contador una vez pasada la ventana de 24h", () => {
    const limiter = new ChatRateLimiter(20, DAY_MS);
    const now = Date.now();

    for (let i = 0; i < 20; i++) {
      limiter.consume("1.2.3.4", now);
    }

    const afterWindow = limiter.consume("1.2.3.4", now + DAY_MS + 1);

    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(19);
  });

  it("trata cada identificador (IP) de forma independiente", () => {
    const limiter = new ChatRateLimiter(20, DAY_MS);
    const now = Date.now();

    for (let i = 0; i < 20; i++) {
      limiter.consume("1.2.3.4", now);
    }

    const otherIp = limiter.consume("5.6.7.8", now);

    expect(otherIp.allowed).toBe(true);
    expect(otherIp.remaining).toBe(19);
  });
});
