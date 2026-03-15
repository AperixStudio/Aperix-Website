"use client";

import { useState } from "react";
import { z } from "zod";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexContactForm — PRD §8.3.5
   Zod validation: Name · Phone · Email · Suburb · Service (6) ·
   Description (min 20) · Contact preference (radio) ·
   Referral source (select)
   Visual error states + aria-describedby
   1.5s loading spinner → success message
   ──────────────────────────────────────────────────────────── */

/* ── Zod schema ────────────────────────────────────────────── */
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  suburb: z.string().min(2, "Suburb is required"),
  service: z.string().min(1, "Please select a service"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing the job"),
  contactPreference: z.enum(["phone", "email", "either"], {
    errorMap: () => ({ message: "Please select a contact preference" }),
  }),
  referralSource: z.string().min(1, "Please let us know how you heard about us"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const serviceOptions = [
  "Residential Wiring",
  "Commercial Fit-outs",
  "Safety Inspections",
  "Emergency Callout",
  "Solar & Battery Storage",
  "Lighting Design",
];

const referralOptions = [
  "Google Search",
  "Word of mouth / referral",
  "Facebook",
  "Instagram",
  "Seen your van / signage",
  "Repeat customer",
  "Other",
];

/* ── Shared field styles ────────────────────────────────────── */
function inputCls(hasError: boolean) {
  return `w-full rounded-md border px-4 py-3 font-(family-name:--font-apex-body) text-sm text-white bg-white/5 outline-none transition-colors placeholder:text-white/30 focus:ring-2 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-white/20 focus:border-[#f59e0b] focus:ring-[#f59e0b]/20"
  }`;
}

function ErrorMsg({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 font-(family-name:--font-apex-body) text-xs text-red-400">
      {message}
    </p>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-(family-name:--font-apex-body) text-sm font-semibold text-white/80">
      {children}
    </label>
  );
}

/* ── Spinner ────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function ApexContactForm() {
  const prefersReduced = useReducedMotion();
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // Focus first error field
      const firstErrorKey = result.error.issues[0]?.path[0] as string;
      if (firstErrorKey) {
        const el = document.getElementById(`apex-${firstErrorKey}`);
        el?.focus();
      }
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Simulate 1.5s API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  }

  if (submitted) {
    const firstName = (formData.firstName ?? "there").trim();
    return (
      <div
        className={`rounded-xl bg-[#f59e0b]/10 p-10 text-center ring-1 ring-[#f59e0b]/30 ${
          prefersReduced ? "" : "animate-in fade-in duration-500"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f59e0b]/20 text-3xl">
          ✅
        </div>
        <h2 className="font-(family-name:--font-apex-heading) text-2xl font-extrabold text-white">
          Thanks {firstName}!
        </h2>
        <p className="mt-2 font-(family-name:--font-apex-body) text-base text-white/70">
          We&apos;ll be in touch within 24 hours.
        </p>
        <p className="mt-4 font-(family-name:--font-apex-body) text-xs text-white/40">
          Note: In the real build, this submits via a Next.js API route to Resend.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Contact form">
      {/* Name row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="apex-firstName">First name *</Label>
          <input
            id="apex-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            aria-describedby={errors.firstName ? "apex-firstName-error" : undefined}
            aria-invalid={!!errors.firstName}
            onChange={handleChange}
            className={inputCls(!!errors.firstName)}
            placeholder="James"
          />
          <ErrorMsg id="apex-firstName-error" message={errors.firstName} />
        </div>
        <div>
          <Label htmlFor="apex-lastName">Last name *</Label>
          <input
            id="apex-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            aria-describedby={errors.lastName ? "apex-lastName-error" : undefined}
            aria-invalid={!!errors.lastName}
            onChange={handleChange}
            className={inputCls(!!errors.lastName)}
            placeholder="Smith"
          />
          <ErrorMsg id="apex-lastName-error" message={errors.lastName} />
        </div>
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="apex-phone">Phone *</Label>
        <input
          id="apex-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          aria-describedby={errors.phone ? "apex-phone-error" : undefined}
          aria-invalid={!!errors.phone}
          onChange={handleChange}
          className={inputCls(!!errors.phone)}
          placeholder="04XX XXX XXX"
        />
        <ErrorMsg id="apex-phone-error" message={errors.phone} />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="apex-email">Email *</Label>
        <input
          id="apex-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-describedby={errors.email ? "apex-email-error" : undefined}
          aria-invalid={!!errors.email}
          onChange={handleChange}
          className={inputCls(!!errors.email)}
          placeholder="you@example.com"
        />
        <ErrorMsg id="apex-email-error" message={errors.email} />
      </div>

      {/* Suburb */}
      <div>
        <Label htmlFor="apex-suburb">Suburb *</Label>
        <input
          id="apex-suburb"
          name="suburb"
          type="text"
          aria-describedby={errors.suburb ? "apex-suburb-error" : undefined}
          aria-invalid={!!errors.suburb}
          onChange={handleChange}
          className={inputCls(!!errors.suburb)}
          placeholder="e.g. Richmond"
        />
        <ErrorMsg id="apex-suburb-error" message={errors.suburb} />
      </div>

      {/* Service */}
      <div>
        <Label htmlFor="apex-service">Service required *</Label>
        <select
          id="apex-service"
          name="service"
          defaultValue=""
          aria-describedby={errors.service ? "apex-service-error" : undefined}
          aria-invalid={!!errors.service}
          onChange={handleChange}
          className={`${inputCls(!!errors.service)} appearance-none`}
        >
          <option value="" disabled className="bg-[#1c1917] text-white/50">
            Select a service
          </option>
          {serviceOptions.map((s) => (
            <option key={s} value={s} className="bg-[#1c1917] text-white">
              {s}
            </option>
          ))}
        </select>
        <ErrorMsg id="apex-service-error" message={errors.service} />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="apex-description">
          Job description * <span className="font-normal text-white/40">(min 20 chars)</span>
        </Label>
        <textarea
          id="apex-description"
          name="description"
          rows={4}
          aria-describedby={errors.description ? "apex-description-error" : undefined}
          aria-invalid={!!errors.description}
          onChange={handleChange}
          className={inputCls(!!errors.description)}
          placeholder="Please describe the electrical work you need..."
        />
        <ErrorMsg id="apex-description-error" message={errors.description} />
      </div>

      {/* Contact preference */}
      <fieldset>
        <legend className="mb-2 font-(family-name:--font-apex-body) text-sm font-semibold text-white/80">
          Preferred contact method *
        </legend>
        <div
          role="radiogroup"
          aria-describedby={errors.contactPreference ? "apex-contactPreference-error" : undefined}
          aria-invalid={!!errors.contactPreference}
          className="flex flex-wrap gap-4"
        >
          {(["phone", "email", "either"] as const).map((pref) => (
            <label
              key={pref}
              className="flex cursor-pointer items-center gap-2 font-(family-name:--font-apex-body) text-sm text-white/70"
            >
              <input
                type="radio"
                name="contactPreference"
                value={pref}
                onChange={handleChange}
                className="accent-[#f59e0b]"
              />
              {pref.charAt(0).toUpperCase() + pref.slice(1)}
            </label>
          ))}
        </div>
        <ErrorMsg id="apex-contactPreference-error" message={errors.contactPreference} />
      </fieldset>

      {/* Referral source */}
      <div>
        <Label htmlFor="apex-referralSource">How did you hear about us? *</Label>
        <select
          id="apex-referralSource"
          name="referralSource"
          defaultValue=""
          aria-describedby={errors.referralSource ? "apex-referralSource-error" : undefined}
          aria-invalid={!!errors.referralSource}
          onChange={handleChange}
          className={`${inputCls(!!errors.referralSource)} appearance-none`}
        >
          <option value="" disabled className="bg-[#1c1917] text-white/50">
            Select an option
          </option>
          {referralOptions.map((r) => (
            <option key={r} value={r} className="bg-[#1c1917] text-white">
              {r}
            </option>
          ))}
        </select>
        <ErrorMsg id="apex-referralSource-error" message={errors.referralSource} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f59e0b] px-6 py-3.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0c0a09] transition-all hover:scale-[1.02] hover:bg-[#d97706] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          "Send Quote Request"
        )}
      </button>

      <p className="font-(family-name:--font-apex-body) text-center text-xs text-white/30">
        Note: In the real build, this submits via a Next.js API route to Resend.
      </p>
    </form>
  );
}
