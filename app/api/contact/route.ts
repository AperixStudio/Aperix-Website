import { NextResponse, type NextRequest } from "next/server";
import { sendContactEmail } from "@/lib/contactEmail";
import { ContactDeliveryError } from "@/lib/contactEnv";
import { checkRateLimit } from "@/lib/contactRateLimit";
import { contactSchema, toFieldErrors } from "@/lib/contactSchema";

export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`contact:${clientIp}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many enquiries from this connection. Please try again shortly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-Request-Id": requestId,
        },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that request. Please try again.", requestId },
      { status: 400, headers: { "X-Request-Id": requestId } },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please review the highlighted fields and try again.",
        fieldErrors: toFieldErrors(parsed.error),
        requestId,
      },
      { status: 400, headers: { "X-Request-Id": requestId } },
    );
  }

  if (parsed.data.website) {
    console.warn("[contact] honeypot triggered", { requestId, clientIp });
    return NextResponse.json({ ok: true, requestId }, { headers: { "X-Request-Id": requestId } });
  }

  try {
    await sendContactEmail(parsed.data);

    console.info("[contact] enquiry delivered", {
      requestId,
      clientIp,
      need: parsed.data.need,
      name: parsed.data.name,
      email: parsed.data.email,
    });

    return NextResponse.json({ ok: true, requestId }, { headers: { "X-Request-Id": requestId } });
  } catch (error) {
    console.error("[contact] delivery failed", {
      requestId,
      clientIp,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    const isDev = process.env.NODE_ENV !== "production";
    const isAuthFailure = error instanceof ContactDeliveryError && error.kind === "auth";
    const clientError =
      isDev && isAuthFailure
        ? "Resend rejected the API key. Update RESEND_API_KEY in .env.local and restart npm run dev."
        : "Your message couldn't be sent right now. Please email hello@aperix.com.au and mention request ID " +
          requestId +
          ".";

    return NextResponse.json(
      {
        error: clientError,
        requestId,
      },
      { status: 500, headers: { "X-Request-Id": requestId } },
    );
  }
}
