"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { z } from "zod";

/* ────────────────────────────────────────────────────────────
   ApexContactPage — PRD §8.3.5
   Zod validation  ·  Loading spinner  ·  Success message
   Fields: name, phone, email, suburb, service, description,
           contact preference (radio), referral source (select)
   ──────────────────────────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s+()-]{8,15}$/,
      "Enter a valid phone number (8–15 digits)"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  suburb: z.string().min(1, "Suburb is required"),
  service: z.string().min(1, "Please select a service"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing the job"),
  contactPreference: z.enum(["phone", "email", "either"], {
    error: "Please select a contact preference",
  }),
  referralSource: z.string().min(1, "Let us know how you found us"),
});

type ContactForm = z.infer<typeof contactSchema>;

const services = [
  "Residential Electrical",
  "Commercial Electrical",
  "Emergency Call-out",
  "Switchboard Upgrades",
  "LED & Lighting",
  "Data & Networking",
];

const referralOptions = [
  "",
  "Google Search",
  "Referral from a Friend",
  "Facebook",
  "Flyer / Letterbox Drop",
  "Returning Customer",
  "Other",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ApexContactPage() {
  const prefersReduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    service: "",
    description: "",
    contactPreference: "either",
    referralSource: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear error on change
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactForm];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // scroll to first error
      const firstKey = result.error.issues[0]?.path[0] as string;
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      if (el) (el as HTMLElement).focus();
      return;
    }

    setErrors({});
    setSubmitting(true);

    // simulate API call
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  const firstName = form.name.split(" ")[0] || "there";

  /* ── shared field styles ── */
  const baseInput =
    "w-full rounded-lg border bg-white px-4 py-3 font-(family-name:--font-apex-body) text-sm text-[#1e293b] outline-none transition-colors focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20";
  const errorBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  const normalBorder = "border-[#e2e8f0]";

  function inputClass(field: keyof ContactForm) {
    return `${baseInput} ${errors[field] ? errorBorder : normalBorder}`;
  }

  return (
    <>
      {/* hero */}
      <section className="bg-[#0f172a] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Contact Us
          </p>
          <h1 className="font-(family-name:--font-apex-display) text-3xl font-bold text-white md:text-4xl">
            Request a free quote
          </h1>
          <p className="mx-auto mt-4 max-w-md font-(family-name:--font-apex-body) text-base text-white/70">
            Tell us about your job and we&apos;ll get back to you within 24
            hours with an honest, upfront quote.
          </p>
        </div>
      </section>

      {/* form + sidebar */}
      <section className="bg-[#f8f9fa] py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_340px]">
          {/* form */}
          <motion.div variants={fadeUp} {...motionProps}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-[#16a34a]/30 bg-[#f0fdf4] p-10 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a]">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="font-(family-name:--font-apex-display) text-2xl font-bold text-[#0f172a]">
                    Thanks {firstName}!
                  </h2>
                  <p className="mt-2 font-(family-name:--font-apex-body) text-base text-[#64748b]">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6 rounded-xl border border-[#e2e8f0] bg-white p-8"
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                >
                  {/* name & phone */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass("name")}
                        placeholder="James Kowalski"
                        aria-describedby={errors.name ? "err-name" : undefined}
                      />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass("phone")}
                        placeholder="0412 345 678"
                        aria-describedby={
                          errors.phone ? "err-phone" : undefined
                        }
                      />
                    </Field>
                  </div>

                  {/* email & suburb */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" error={errors.email}>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass("email")}
                        placeholder="james@email.com"
                        aria-describedby={
                          errors.email ? "err-email" : undefined
                        }
                      />
                    </Field>
                    <Field label="Suburb" error={errors.suburb}>
                      <input
                        name="suburb"
                        type="text"
                        value={form.suburb}
                        onChange={handleChange}
                        className={inputClass("suburb")}
                        placeholder="Richmond"
                        aria-describedby={
                          errors.suburb ? "err-suburb" : undefined
                        }
                      />
                    </Field>
                  </div>

                  {/* service select */}
                  <Field label="Service required" error={errors.service}>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={inputClass("service")}
                      aria-describedby={
                        errors.service ? "err-service" : undefined
                      }
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* description */}
                  <Field
                    label="Describe the job"
                    error={errors.description}
                  >
                    <textarea
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                      className={`${inputClass("description")} resize-none`}
                      placeholder="E.g. Need all downlights replaced in a 3-bedroom house, plus a safety check on the switchboard…"
                      aria-describedby={
                        errors.description ? "err-description" : undefined
                      }
                    />
                  </Field>

                  {/* contact preference — radio */}
                  <fieldset>
                    <legend className="mb-2 font-(family-name:--font-apex-body) text-sm font-medium text-[#0f172a]">
                      Preferred contact method
                    </legend>
                    <div className="flex flex-wrap gap-5">
                      {(["phone", "email", "either"] as const).map(
                        (option) => (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 font-(family-name:--font-apex-body) text-sm text-[#1e293b]"
                          >
                            <input
                              type="radio"
                              name="contactPreference"
                              value={option}
                              checked={form.contactPreference === option}
                              onChange={handleChange}
                              className="h-4 w-4 accent-[#1d4ed8]"
                            />
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </label>
                        )
                      )}
                    </div>
                    {errors.contactPreference && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.contactPreference}
                      </p>
                    )}
                  </fieldset>

                  {/* referral source */}
                  <Field
                    label="How did you hear about us?"
                    error={errors.referralSource}
                  >
                    <select
                      name="referralSource"
                      value={form.referralSource}
                      onChange={handleChange}
                      className={inputClass("referralSource")}
                      aria-describedby={
                        errors.referralSource
                          ? "err-referralSource"
                          : undefined
                      }
                    >
                      {referralOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt || "Select…"}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-6 py-3.5 font-(family-name:--font-apex-body) text-sm font-bold text-[#0f172a] transition-colors hover:bg-[#d97706] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      "Request a Free Quote"
                    )}
                  </button>

                  {/* disclaimer */}
                  <p className="text-center font-(family-name:--font-apex-body) text-xs text-[#64748b]">
                    In the real build, this submits via a Next.js API route to
                    Resend.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* sidebar */}
          <motion.aside
            variants={fadeUp}
            {...motionProps}
            className="flex flex-col gap-6"
          >
            {/* direct contact */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-7">
              <h3 className="font-(family-name:--font-apex-display) text-lg font-bold text-[#0f172a]">
                Get in touch directly
              </h3>
              <ul className="mt-4 space-y-4 font-(family-name:--font-apex-body) text-sm text-[#64748b]">
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1d4ed8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[#0f172a]">Phone</p>
                    <p>0412 345 678</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1d4ed8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[#0f172a]">Email</p>
                    <p>info@apexelectrical.com.au</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1d4ed8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[#0f172a]">Service area</p>
                    <p>Melbourne inner suburbs (10 km radius from Richmond)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* hours */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-7">
              <h3 className="font-(family-name:--font-apex-display) text-lg font-bold text-[#0f172a]">
                Hours
              </h3>
              <ul className="mt-4 space-y-2 font-(family-name:--font-apex-body) text-sm text-[#64748b]">
                <li className="flex justify-between">
                  <span>Mon – Fri</span>
                  <span className="font-medium text-[#1e293b]">
                    7 am – 5 pm
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-[#1e293b]">
                    8 am – 1 pm
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-[#1e293b]">Closed</span>
                </li>
                <li className="mt-3 flex items-center gap-2 rounded-lg bg-[#fef3c7] px-4 py-2.5 font-medium text-[#0f172a]">
                  <svg
                    className="h-4 w-4 text-[#f59e0b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  24/7 Emergency available
                </li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </section>
    </>
  );
}

/* ── tiny sub-component for consistent field layout ── */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = `err-${label.toLowerCase().replace(/\s/g, "")}`;
  return (
    <div>
      <label className="mb-1.5 block font-(family-name:--font-apex-body) text-sm font-medium text-[#0f172a]">
        {label}
      </label>
      {children}
      {error && (
        <p id={id} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
