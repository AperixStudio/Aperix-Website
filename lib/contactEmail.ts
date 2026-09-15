import { Resend } from "resend";
import {
  ContactDeliveryError,
  isPlaceholderResendKey,
  isResendAuthError,
  sanitizeEnvValue,
} from "@/lib/contactEnv";
import type { ContactSubmission } from "@/lib/contactSchema";

interface ContactEmailConfig {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
}

function getContactEmailConfig(): ContactEmailConfig {
  const apiKey = sanitizeEnvValue(process.env.RESEND_API_KEY);
  const toEmail = sanitizeEnvValue(process.env.CONTACT_TO_EMAIL);
  const fromEmail = sanitizeEnvValue(process.env.CONTACT_FROM_EMAIL);

  if (!apiKey || !toEmail || !fromEmail) {
    throw new ContactDeliveryError(
      "Missing contact email configuration. Set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.",
      "config",
    );
  }

  if (isPlaceholderResendKey(apiKey)) {
    throw new ContactDeliveryError(
      "RESEND_API_KEY is still the example placeholder. Add a real key from resend.com/api-keys to .env.local and restart the dev server.",
      "auth",
    );
  }

  return { apiKey, toEmail, fromEmail };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toPlainText(submission: ContactSubmission) {
  return [
    "New Aperix enquiry",
    "",
    `Need: ${submission.need}`,
    `Timing: ${submission.timing}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || "Not provided"}`,
  ].join("\n");
}

function toHtml(submission: ContactSubmission) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#14202d">
      <h2 style="margin:0 0 16px">New Aperix enquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        <tbody>
          <tr><td style="padding:8px 0;font-weight:600">Need</td><td style="padding:8px 0">${escapeHtml(submission.need)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Timing</td><td style="padding:8px 0">${escapeHtml(submission.timing)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Name</td><td style="padding:8px 0">${escapeHtml(submission.name)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0">${escapeHtml(submission.email)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Phone</td><td style="padding:8px 0">${escapeHtml(submission.phone || "Not provided")}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

export async function sendContactEmail(submission: ContactSubmission) {
  const { apiKey, fromEmail, toEmail } = getContactEmailConfig();
  const resend = new Resend(apiKey);
  const recipients = toEmail.split(",").map((e) => e.trim()).filter(Boolean);

  let response: Awaited<ReturnType<Resend["emails"]["send"]>>;

  try {
    response = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      replyTo: submission.email,
      subject: `New Aperix enquiry: ${submission.need} (${submission.name})`,
      text: toPlainText(submission),
      html: toHtml(submission),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Resend error";
    if (isResendAuthError(message)) {
      throw new ContactDeliveryError(
        "Resend rejected RESEND_API_KEY. Replace it in .env.local with a current key from resend.com/api-keys, then restart npm run dev.",
        "auth",
      );
    }
    throw new ContactDeliveryError(message, "delivery");
  }

  if (response.error) {
    const message = response.error.message;
    if (isResendAuthError(message)) {
      throw new ContactDeliveryError(
        "Resend rejected RESEND_API_KEY. Replace it in .env.local with a current key from resend.com/api-keys, then restart npm run dev.",
        "auth",
      );
    }
    throw new ContactDeliveryError(message, "delivery");
  }

  return response.data;
}
