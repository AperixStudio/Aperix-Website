import { describe, expect, it } from "vitest";
import {
  isPlaceholderResendKey,
  isResendAuthError,
  sanitizeEnvValue,
} from "./contactEnv";

describe("sanitizeEnvValue", () => {
  it("strips wrapping quotes and a Bearer prefix", () => {
    expect(sanitizeEnvValue('"re_testkey"')).toBe("re_testkey");
    expect(sanitizeEnvValue("Bearer re_testkey")).toBe("re_testkey");
  });

  it("returns undefined for blank values", () => {
    expect(sanitizeEnvValue("   ")).toBeUndefined();
    expect(sanitizeEnvValue(undefined)).toBeUndefined();
  });
});

describe("isPlaceholderResendKey", () => {
  it("detects the example placeholder", () => {
    expect(isPlaceholderResendKey("re_xxxxxxxxxxxxxxxxxxxx")).toBe(true);
    expect(isPlaceholderResendKey("re_live_notplaceholder")).toBe(false);
  });
});

describe("isResendAuthError", () => {
  it("matches Resend's invalid key message", () => {
    expect(isResendAuthError("API key is invalid")).toBe(true);
  });
});
