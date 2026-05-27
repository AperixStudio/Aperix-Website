"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  description: "",
  contactMethod: "email",
  website: "",
};

function buildNetlifyFormData(data: ContactSubmission) {
  const formData = new URLSearchParams();
  const appendIfPresent = (label: string, value?: string) => {
    const trimmed = value?.trim();
    if (trimmed) {
      formData.append(label, trimmed);
    }
  };

  formData.append("form-name", "contact");
  appendIfPresent("website", data.website);
  formData.append("Name", data.name);
  formData.append("Email", data.email);
  appendIfPresent("Phone", data.phone);
  formData.append("Business Name", data.businessName);
  formData.append("Business Type", data.businessType);
  formData.append("Preferred Contact", data.contactMethod);
  formData.append("Project Details", data.description);

  return formData;
}

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

function ContactToast({
  toast,
  onDismiss,
}: {
  toast: { type: "success" | "error"; message: string } | null;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="flex-1">{toast.message}</span>
          <button onClick={onDismiss} className="opacity-70 hover:opacity-100" aria-label="Dismiss">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setToast(null);

    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      const msg = "Please review the highlighted fields and try again.";
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 6000);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      // Honeypot check
      if (parsed.data.website) {
        const msg = "Thanks — your enquiry has been received.";
        setSubmittedName(parsed.data.name.split(" ")[0] || "there");
        setSubmitted(true);
        setForm(initialForm);
        setToast({ type: "success", message: msg });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      const formData = buildNetlifyFormData(parsed.data);

      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const msg = "Your enquiry could not be sent. Please try again.";
        setSubmitError(msg);
        setToast({ type: "error", message: msg });
        setTimeout(() => setToast(null), 6000);
        return;
      }

      setSubmittedName(parsed.data.name.split(" ")[0] || "there");
      setSubmitted(true);
      setForm(initialForm);
      setToast({ type: "success", message: "Enquiry sent. We'll be in touch within 24 hours." });
      setTimeout(() => setToast(null), 5000);
    } catch {
      const msg = "The connection dropped before we could send your enquiry. Please try again or email hello@aperixstudio.com.";
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 6000);
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
      <>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-full flex-col items-center justify-center px-7 py-12 text-center lg:px-8 lg:py-14"
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
        <ContactToast toast={toast} onDismiss={() => setToast(null)} />
      </>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      action="/__forms.html"
      onSubmit={handleSubmit}
      noValidate
      className="flex h-full flex-col justify-center space-y-3 px-7 py-5 lg:px-8 lg:py-6"
      aria-label="Contact enquiry form"
    >
      <input type="hidden" name="form-name" value="contact" />
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

      <div className="grid gap-3 sm:grid-cols-2">
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

      <div className="grid gap-3 sm:grid-cols-2">
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
          rows={2}
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
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          <p>{submitError}</p>
        </div>
      ) : null}

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={prefersReduced ? undefined : { scale: 0.97 }}
        whileHover={prefersReduced ? undefined : { opacity: 0.88 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-agency-accent px-6 py-3 text-sm font-semibold text-agency-bg transition-colors disabled:opacity-60"
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
      </motion.button>

      <ContactToast toast={toast} onDismiss={() => setToast(null)} />
    </form>
  );
}
