import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "./contactRateLimit";

afterEach(() => {
  resetRateLimitStore();
});

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const first = checkRateLimit("contact:test", { limit: 2, windowMs: 1000, now: 0 });
    const second = checkRateLimit("contact:test", { limit: 2, windowMs: 1000, now: 10 });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it("blocks requests once the limit is reached", () => {
    checkRateLimit("contact:test", { limit: 1, windowMs: 1000, now: 0 });
    const blocked = checkRateLimit("contact:test", { limit: 1, windowMs: 1000, now: 10 });

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the time window expires", () => {
    checkRateLimit("contact:test", { limit: 1, windowMs: 1000, now: 0 });
    const reset = checkRateLimit("contact:test", { limit: 1, windowMs: 1000, now: 1200 });

    expect(reset.allowed).toBe(true);
    expect(reset.remaining).toBe(0);
  });
});
