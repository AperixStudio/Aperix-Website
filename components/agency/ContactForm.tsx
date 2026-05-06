"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  budgetRangeOptions,
  businessTypeOptions,
  contactSchema,
  needsOptions,
  tierInterestOptions,
  timelineOptions,
  toFieldErrors,
  type ContactFieldErrors,
  type ContactSubmission,
} from "@/lib/contactSchema";
import { useReducedMotion } from "@/lib/useReducedMotion";

type FormState = ContactSubmission;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  businessType: "",
  needs: [],
  tierInterest: "",
  budgetRange: "",
  timeline: "",
  currentWebsite: "",
  description: "",
  contactMethod: "email",
  website: "",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1.5 text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

export default function AgencyContactForm() {
  const prefersReduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("there");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const tier = new URLSearchParams(window.location.search).get("tier");
    if (!tier) {
      return;
    }

    const match = tierInterestOptions.find(
      (option) => option.toLowerCase() === tier.toLowerCase(),
    );

    if (match) {
      setForm((prev) => ({ ...prev, tierInterest: match }));
    }
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  }

  function handleNeedsChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      needs: checked
        ? [...prev.needs, value]
        : prev.needs.filter((n) => n !== value),
    }));
    setErrors((prev) => ({ ...prev, needs: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setRequestId(null);

    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; fieldErrors?: ContactFieldErrors; requestId?: string }
        | null;

      if (!response.ok) {
        if (payload?.fieldErrors) {
          setErrors(payload.fieldErrors);
        }

        setRequestId(payload?.requestId ?? null);
        setSubmitError(
          payload?.error ?? "Your enquiry could not be sent. Please try again.",
        );
        return;
      }

      setSubmittedName(parsed.data.name.split(" ")[0] || "there");
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError(
        "The connection dropped before we could send your enquiry. Please try again or email hello@aperix.com.au.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const baseInput =
    "w-full rounded-xl border border-agency-border bg-agency-surface2 px-4 py-3 text-sm text-agency-text outline-none transition-colors focus:border-agency-accent focus:ring-2 focus:ring-agency-accent/20 placeholder:text-agency-muted";

  function getFieldClass(name: keyof FormState) {
    return `${baseInput} ${errors[name] ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`;
  }

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
          Thanks, {submittedName}!
        </h3>
        <p className="mt-2 text-base text-agency-muted">
          I&apos;ll review your details and be in touch within 24 hours.
        </p>
        <p className="mt-6 text-xs text-agency-muted">Your enquiry has been delivered securely.</p>
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
      <div className="sr-only">
        <label htmlFor="ac-website">Website</label>
        <input
          id="ac-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={handleChange}
        />
      </div>

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
            className={getFieldClass("name")}
            placeholder="Your name"
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          <FieldError id="err-name" message={errors.name} />
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
            className={getFieldClass("email")}
            placeholder="you@example.com"
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          <FieldError id="err-email" message={errors.email} />
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
            className={getFieldClass("phone")}
            placeholder="0412 345 678"
            aria-describedby={errors.phone ? "err-phone" : undefined}
          />
          <FieldError id="err-phone" message={errors.phone} />
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
            className={getFieldClass("businessName")}
            placeholder="e.g. Apex Electrical"
            aria-describedby={errors.businessName ? "err-business-name" : undefined}
          />
          <FieldError id="err-business-name" message={errors.businessName} />
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
          className={getFieldClass("businessType")}
          aria-describedby={errors.businessType ? "err-business-type" : undefined}
        >
          <option value="">Select your industry…</option>
          {businessTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <FieldError id="err-business-type" message={errors.businessType} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ac-tier" className="mb-1.5 block text-sm font-medium text-agency-text">
            Package interest <span className="text-agency-muted">(optional)</span>
          </label>
          <select
            id="ac-tier"
            name="tierInterest"
            value={form.tierInterest}
            onChange={handleChange}
            className={getFieldClass("tierInterest")}
            aria-describedby={errors.tierInterest ? "err-tier-interest" : undefined}
          >
            <option value="">Select a package…</option>
            {tierInterestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="err-tier-interest" message={errors.tierInterest} />
        </div>
        <div>
          <label htmlFor="ac-budget" className="mb-1.5 block text-sm font-medium text-agency-text">
            Budget range <span className="text-agency-muted">(optional)</span>
          </label>
          <select
            id="ac-budget"
            name="budgetRange"
            value={form.budgetRange}
            onChange={handleChange}
            className={getFieldClass("budgetRange")}
            aria-describedby={errors.budgetRange ? "err-budget-range" : undefined}
          >
            <option value="">Select a range…</option>
            {budgetRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="err-budget-range" message={errors.budgetRange} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ac-timeline" className="mb-1.5 block text-sm font-medium text-agency-text">
            Timeline <span className="text-agency-muted">(optional)</span>
          </label>
          <select
            id="ac-timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className={getFieldClass("timeline")}
            aria-describedby={errors.timeline ? "err-timeline" : undefined}
          >
            <option value="">Select timing…</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="err-timeline" message={errors.timeline} />
        </div>
        <div>
          <label htmlFor="ac-current-site" className="mb-1.5 block text-sm font-medium text-agency-text">
            Current website <span className="text-agency-muted">(optional)</span>
          </label>
          <input
            id="ac-current-site"
            name="currentWebsite"
            type="url"
            value={form.currentWebsite}
            onChange={handleChange}
            className={getFieldClass("currentWebsite")}
            placeholder="https://example.com.au"
            aria-describedby={errors.currentWebsite ? "err-current-website" : undefined}
          />
          <FieldError id="err-current-website" message={errors.currentWebsite} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-agency-text">
          What do you need?
        </legend>
        <FieldError id="err-needs" message={errors.needs} />
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
                aria-describedby={errors.needs ? "err-needs" : undefined}
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
          className={`${getFieldClass("description")} resize-none`}
          placeholder="What does your business do, who are your customers, and what's your goal with a new website?"
          aria-describedby={errors.description ? "err-description" : undefined}
        />
        <FieldError id="err-description" message={errors.description} />
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

      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <p>{submitError}</p>
          {requestId ? <p className="mt-1 text-xs">Request ID: {requestId}</p> : null}
        </div>
      ) : null}

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
        No pressure — submissions go directly to Aperix and help us recommend the right next step.
      </p>
    </form>
  );
}
