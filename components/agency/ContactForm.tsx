"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  businessTypeOptions,
  contactSchema,
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

    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      // Honeypot check
      if (parsed.data.website) {
        setSubmittedName(parsed.data.name.split(" ")[0] || "there");
        setSubmitted(true);
        setForm(initialForm);
        return;
      }

      const formData = new URLSearchParams();
      formData.append("form-name", "contact");
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, String(value ?? ""));
        }
      });

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        setSubmitError("Your enquiry could not be sent. Please try again.");
        return;
      }

      setSubmittedName(parsed.data.name.split(" ")[0] || "there");
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError(
        "The connection dropped before we could send your enquiry. Please try again or email hello@aperixstudio.com.",
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
          We will review your details and be in touch within 24 hours.
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



      <div>
        <label htmlFor="ac-desc" className="mb-1.5 block text-sm font-medium text-agency-text">
          Tell us about your business *
        </label>
        <textarea
          id="ac-desc"
          name="description"
          rows={4}
          required
          value={form.description}
          onChange={handleChange}
          className={`${getFieldClass("description")} resize-none`}
          placeholder="Things like what does your business do, who are your customers, what's your goal with a new website?"
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


    </form>
  );
}
