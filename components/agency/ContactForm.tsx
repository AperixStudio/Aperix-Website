"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   AgencyContactForm — right panel for /contact
   Fields: name, email, phone, businessName, businessType,
           needs (checkboxes), description, contactMethod (radio)
   1.5s fake submit → success state
   ──────────────────────────────────────────────────────────── */

const businessTypes = [
  "",
  "Café / Restaurant",
  "Trades / Contractor",
  "Health & Beauty",
  "Professional Services",
  "Retail",
  "Other",
];

const needsOptions = [
  "New Website",
  "Website Redesign",
  "Social Media Management",
  "SEO",
  "Not Sure Yet",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  needs: string[];
  description: string;
  contactMethod: "phone" | "email";
}

export default function AgencyContactForm() {
  const prefersReduced = useReducedMotion();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    needs: [],
    description: "",
    contactMethod: "email",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleNeedsChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      needs: checked
        ? [...prev.needs, value]
        : prev.needs.filter((n) => n !== value),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  const firstName = form.name.split(" ")[0] || "there";

  const baseInput =
    "w-full rounded-xl border border-agency-border bg-agency-surface2 px-4 py-3 text-sm text-agency-text outline-none transition-colors focus:border-agency-accent focus:ring-2 focus:ring-agency-accent/20 placeholder:text-agency-muted";

  if (submitted) {
    return (
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center px-8 py-24 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-agency-accent/10">
          <svg
            className="h-7 w-7 text-agency-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-agency-text">
          Thanks, {firstName}!
        </h3>
        <p className="mt-2 text-base text-agency-muted">
          I&apos;ll review your details and be in touch within 24 hours.
        </p>
        <p className="mt-6 text-xs text-agency-muted">
          In the real build, this submits to hello@aperix.com.au via Resend.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 px-8 py-10"
      aria-label="Contact enquiry form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ac-name" className="mb-1.5 block text-sm font-medium text-agency-text">
            Full Name *
          </label>
          <input
            id="ac-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={baseInput}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="ac-email" className="mb-1.5 block text-sm font-medium text-agency-text">
            Email *
          </label>
          <input
            id="ac-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={baseInput}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ac-phone" className="mb-1.5 block text-sm font-medium text-agency-text">
            Phone{" "}
            <span className="text-agency-muted">(optional)</span>
          </label>
          <input
            id="ac-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={baseInput}
            placeholder="0412 345 678"
          />
        </div>
        <div>
          <label htmlFor="ac-biz" className="mb-1.5 block text-sm font-medium text-agency-text">
            Business Name *
          </label>
          <input
            id="ac-biz"
            name="businessName"
            type="text"
            required
            value={form.businessName}
            onChange={handleChange}
            className={baseInput}
            placeholder="e.g. Apex Electrical"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ac-type" className="mb-1.5 block text-sm font-medium text-agency-text">
          Business Type *
        </label>
        <select
          id="ac-type"
          name="businessType"
          required
          value={form.businessType}
          onChange={handleChange}
          className={baseInput}
        >
          {businessTypes.map((t) => (
            <option key={t} value={t}>
              {t || "Select your industry…"}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-agency-text">
          What do you need?
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {needsOptions.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-agency-border px-3 py-2.5 text-sm text-agency-muted transition-colors hover:border-agency-accent/40 has-checked:border-agency-accent has-checked:text-agency-text"
            >
              <input
                type="checkbox"
                name="needs"
                value={opt}
                checked={form.needs.includes(opt)}
                onChange={handleNeedsChange}
                className="h-3.5 w-3.5 accent-[#22d3ee]"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="ac-desc" className="mb-1.5 block text-sm font-medium text-agency-text">
          Tell me about your business *
        </label>
        <textarea
          id="ac-desc"
          name="description"
          rows={4}
          required
          value={form.description}
          onChange={handleChange}
          className={`${baseInput} resize-none`}
          placeholder="What does your business do, who are your customers, and what's your goal with a new website?"
        />
      </div>

      {/* Contact method */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-agency-text">
          Preferred contact
        </legend>
        <div className="flex gap-3">
          {(["phone", "email"] as const).map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm transition-colors ${
                form.contactMethod === opt
                  ? "border-agency-accent bg-agency-accent/10 text-agency-text"
                  : "border-agency-border text-agency-muted hover:border-agency-accent/40"
              }`}
            >
              <input
                type="radio"
                name="contactMethod"
                value={opt}
                checked={form.contactMethod === opt}
                onChange={handleChange}
                className="sr-only"
              />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-agency-accent px-6 py-4 text-sm font-semibold text-agency-bg transition-colors hover:bg-agency-accent/85 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sending…
          </>
        ) : (
          "Send Enquiry"
        )}
      </button>

      <p className="text-center text-xs text-agency-muted">
        In the real build, this submits to hello@aperix.com.au via Resend.
      </p>
    </form>
  );
}
