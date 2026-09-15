export function sanitizeEnvValue(value: string | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }

  let next = value.replace(/^\uFEFF/, "").trim();

  if (
    (next.startsWith('"') && next.endsWith('"')) ||
    (next.startsWith("'") && next.endsWith("'"))
  ) {
    next = next.slice(1, -1).trim();
  }

  if (next.toLowerCase().startsWith("bearer ")) {
    next = next.slice(7).trim();
  }

  return next || undefined;
}

export function isPlaceholderResendKey(apiKey: string) {
  return /xxxx/i.test(apiKey) || /^re_x+$/i.test(apiKey);
}

export function isResendAuthError(message: string) {
  return /api key is invalid|invalid api key|unauthorized|forbidden|rejected RESEND_API_KEY/i.test(
    message,
  );
}

export class ContactDeliveryError extends Error {
  readonly kind: "auth" | "config" | "delivery";

  constructor(message: string, kind: "auth" | "config" | "delivery") {
    super(message);
    this.name = "ContactDeliveryError";
    this.kind = kind;
  }
}
