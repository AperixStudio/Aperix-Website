import { Resend } from "resend";
import type { ContactSubmission } from "@/lib/contactSchema";

interface ContactEmailConfig {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
}

function getContactEmailConfig(): ContactEmailConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !toEmail || !fromEmail) {
    throw new Error(
      "Missing contact email configuration. Set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.",
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

function toHtmlList(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function toPlainText(submission: ContactSubmission) {
  return [
    "New Aperix enquiry",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || "Not provided"}`,
    `Business: ${submission.businessName}`,
    `Business type: ${submission.businessType}`,
    `Preferred contact: ${submission.contactMethod}`,
    `Services: ${submission.needs.join(", ")}`,
    "",
    "Project details:",
    submission.description,
  ].join("\n");
}

function toHtml(submission: ContactSubmission) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#14202d">
      <h2 style="margin:0 0 16px">New Aperix enquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        <tbody>
          <tr><td style="padding:8px 0;font-weight:600">Name</td><td style="padding:8px 0">${escapeHtml(submission.name)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0">${escapeHtml(submission.email)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Phone</td><td style="padding:8px 0">${escapeHtml(submission.phone || "Not provided")}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Business</td><td style="padding:8px 0">${escapeHtml(submission.businessName)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Business type</td><td style="padding:8px 0">${escapeHtml(submission.businessType)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Preferred contact</td><td style="padding:8px 0">${escapeHtml(submission.contactMethod)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;vertical-align:top">Services</td><td style="padding:8px 0"><ul style="margin:0;padding-left:18px">${toHtmlList(submission.needs)}</ul></td></tr>
        </tbody>
      </table>
      <div style="margin-top:20px;padding:16px;border:1px solid #c1cedb;border-radius:12px;background:#f2f5f9">
        <p style="margin:0 0 8px;font-weight:600">Project details</p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(submission.description)}</p>
      </div>
    </div>
  `;
}

export async function sendContactEmail(submission: ContactSubmission) {
  const { apiKey, fromEmail, toEmail } = getContactEmailConfig();
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: submission.email,
    subject: `New Aperix enquiry — ${submission.businessName}`,
    text: toPlainText(submission),
    html: toHtml(submission),
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
