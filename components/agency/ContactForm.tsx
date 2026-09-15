"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  contactSchema,
  toFieldErrors,
  type ContactFieldErrors,
} from "@/lib/contactSchema";
import {
  BRIEFING_STEP_COUNT,
  briefingQuestions,
  emptyBriefingDraft,
  needFromTierParam,
  needOptions,
  timingOptions,
  validateBriefingStep,
  type BriefingDraft,
  type BriefingStep,
} from "@/lib/contactBriefing";
import { SITE_EMAIL } from "@/lib/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ContactFormProps = {
  kicker: string;
  heading: string;
  headingId: string;
  headingAs?: "h1" | "h2";
  lede: string;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="contact-field-error mt-1.5 text-xs text-red-600" role="alert">
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
          <span className="flex-1">{toast.message}</span>
          <button onClick={onDismiss} className="opacity-70 hover:opacity-100" aria-label="Dismiss">
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Recap({
  draft,
  className,
}: {
  draft: BriefingDraft;
  className?: string;
}) {
  const rows = [
    draft.need ? { label: "Need", value: draft.need } : null,
    draft.timing ? { label: "Start", value: draft.timing } : null,
    draft.name ? { label: "Name", value: draft.name } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  if (rows.length === 0) {
    return null;
  }

  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.label} className="contact-recap__row">
          <dt className="contact-recap__label">{row.label}</dt>
          <dd className="contact-recap__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AgencyContactForm({
  kicker,
  heading,
  headingId,
  headingAs = "h2",
  lede,
}: ContactFormProps) {
  const prefersReduced = useReducedMotion();
  const questionId = useId();
  const questionRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);
  const prevStep = useRef<BriefingStep | null>(null);
  const [ready, setReady] = useState(false);

  const [draft, setDraft] = useState<BriefingDraft>(emptyBriefingDraft);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("there");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const HeadingTag = headingAs;
  const QuestionTag = headingAs === "h1" ? "h2" : "h3";
  const step = draft.step;
  const question = briefingQuestions[step];
  const progress = ((step + 1) / BRIEFING_STEP_COUNT) * 100;
  const isChipStep = step === 0 || step === 1;
  const chipValue = step === 0 ? draft.need : draft.timing;
  const chipOptions = step === 0 ? needOptions : timingOptions;
  const showContinue = !isChipStep || Boolean(chipValue);

  useEffect(() => {
    window.sessionStorage.removeItem("aperix-contact-brief");
    const tierNeed = needFromTierParam(new URLSearchParams(window.location.search).get("tier"));
    if (tierNeed) {
      setDraft((current) => ({ ...current, need: tierNeed }));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (prevStep.current === null) {
      prevStep.current = step;
      return;
    }

    if (prevStep.current === step) {
      return;
    }

    prevStep.current = step;

    if (step === 2 || step === 3) {
      inputRef.current?.focus();
      return;
    }

    questionRef.current?.focus();
  }, [ready, step]);

  useEffect(() => {
    return () => {
      window.clearTimeout(advanceTimer.current);
    };
  }, []);

  function updateDraft(patch: Partial<BriefingDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    const cleared = Object.keys(patch).reduce<ContactFieldErrors>((acc, key) => {
      acc[key as keyof ContactFieldErrors] = undefined;
      return acc;
    }, {});
    setErrors((prev) => ({ ...prev, ...cleared }));
    setSubmitError(null);
  }

  function goToStep(nextStep: BriefingStep) {
    updateDraft({ step: nextStep });
  }

  function goBack() {
    if (step === 0) {
      return;
    }
    window.clearTimeout(advanceTimer.current);
    goToStep((step - 1) as BriefingStep);
  }

  function advanceFrom(nextDraft: BriefingDraft) {
    const stepErrors = validateBriefingStep(nextDraft.step, nextDraft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }

    setErrors({});
    if (nextDraft.step < BRIEFING_STEP_COUNT - 1) {
      goToStep((nextDraft.step + 1) as BriefingStep);
    }
    return true;
  }

  function selectChip(value: string) {
    window.clearTimeout(advanceTimer.current);
    const field = step === 0 ? "need" : "timing";
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    setErrors({});
    setSubmitError(null);

    advanceTimer.current = window.setTimeout(() => {
      advanceFrom(nextDraft);
    }, prefersReduced ? 0 : 160);
  }

  async function submitDraft(nextDraft: BriefingDraft) {
    const parsed = contactSchema.safeParse({
      name: nextDraft.name,
      email: nextDraft.email,
      phone: nextDraft.phone,
      need: nextDraft.need,
      timing: nextDraft.timing,
      website: nextDraft.website,
    });

    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      const msg = "Please review the highlighted fields and try again.";
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 6000);
      return;
    }

    setSubmitting(true);

    try {
      if (parsed.data.website) {
        const firstName = parsed.data.name.split(" ")[0] || "there";
        setSubmittedName(firstName);
        setSubmitted(true);
        setToast({ type: "success", message: "Thanks, your enquiry has been received." });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const body = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: ContactFieldErrors;
      } | null;

      if (!response.ok) {
        if (body?.fieldErrors) {
          setErrors(body.fieldErrors);
        }
        const msg = body?.error ?? "Your enquiry could not be sent. Please try again.";
        setSubmitError(msg);
        setToast({ type: "error", message: msg });
        setTimeout(() => setToast(null), 6000);
        return;
      }

      const firstName = parsed.data.name.split(" ")[0] || "there";
      setSubmittedName(firstName);
      setSubmitted(true);
      setToast({ type: "success", message: "Enquiry sent. We'll be in touch within 24 hours." });
      setTimeout(() => setToast(null), 5000);
    } catch {
      const msg = `The connection dropped before we could send your enquiry. Please try again or email ${SITE_EMAIL}.`;
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 6000);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleContinue(event?: FormEvent) {
    event?.preventDefault();
    window.clearTimeout(advanceTimer.current);
    const stepErrors = validateBriefingStep(step, draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (step === BRIEFING_STEP_COUNT - 1) {
      await submitDraft(draft);
      return;
    }

    advanceFrom(draft);
  }

  function handleTextKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleContinue();
    }
  }

  const inputClass = (name: keyof ContactFieldErrors) =>
    `contact-brief__input w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 ${
      errors[name] ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/20" : ""
    }`;

  return (
    <>
      <div className="contact-page__intro">
        <p className="contact-page__kicker">{kicker}</p>
        <HeadingTag id={headingId} className="contact-page__heading">
          {heading}
        </HeadingTag>
        {draft.need || draft.timing || draft.name ? (
          <Recap draft={draft} className="contact-recap contact-recap--desktop" />
        ) : (
          <p className="contact-page__lede">{lede}</p>
        )}
        <p className="contact-brief__mail">
          Prefer email?{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
        </p>
      </div>

      <div className="contact-page__form">
        {submitted ? (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col items-center justify-center px-7 py-12 text-center lg:px-8 lg:py-14"
          >
            <div className="contact-success-icon mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="contact-success-title font-display text-2xl font-bold">
              Thanks, {submittedName}!
            </h3>
            <p className="contact-success-copy mt-2 text-base">
              We will review your details and be in touch within 24 hours.
            </p>
            <p className="contact-success-meta mt-6 text-xs">
              Your enquiry has been delivered securely.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleContinue}
            noValidate
            className="contact-brief"
            aria-label="Contact briefing"
            data-ready={ready ? "true" : "false"}
          >
            <div className="sr-only">
              <label htmlFor="ac-website">Website</label>
              <input
                id="ac-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={draft.website}
                onChange={(event) => updateDraft({ website: event.target.value })}
              />
            </div>

            <div
              className="contact-brief__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={BRIEFING_STEP_COUNT}
              aria-valuenow={step + 1}
              aria-label={`Question ${step + 1} of ${BRIEFING_STEP_COUNT}`}
            >
              <span className="contact-brief__progress-bar" style={{ width: `${progress}%` }} />
            </div>

            <Recap draft={draft} className="contact-recap contact-recap--mobile" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReduced ? 0 : 0.22 }}
                className="contact-brief__body"
              >
                <QuestionTag
                  ref={questionRef}
                  id={questionId}
                  tabIndex={-1}
                  className="contact-brief__question"
                >
                  {question}
                </QuestionTag>

                {isChipStep ? (
                  <div className="contact-brief__chips" role="group" aria-labelledby={questionId}>
                    {chipOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={!ready}
                        className={`contact-brief__chip ${chipValue === option ? "contact-brief__chip--active" : ""}`}
                        onClick={() => selectChip(option)}
                        aria-pressed={chipValue === option}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <label htmlFor="ac-name" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="ac-name"
                      ref={inputRef}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={draft.name}
                      onChange={(event) => updateDraft({ name: event.target.value })}
                      onKeyDown={handleTextKeyDown}
                      className={inputClass("name")}
                      aria-labelledby={questionId}
                      aria-describedby={errors.name ? "err-name" : undefined}
                    />
                    <FieldError id="err-name" message={errors.name} />
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="contact-brief__email">
                    <label htmlFor="ac-email" className="sr-only">
                      Best email
                    </label>
                    <input
                      id="ac-email"
                      ref={inputRef}
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      onChange={(event) => updateDraft({ email: event.target.value })}
                      onKeyDown={handleTextKeyDown}
                      className={inputClass("email")}
                      aria-labelledby={questionId}
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    <FieldError id="err-email" message={errors.email} />

                    <button
                      type="button"
                      className="contact-brief__prefer"
                      onClick={() => updateDraft({ preferCall: !draft.preferCall })}
                      aria-expanded={draft.preferCall}
                    >
                      Prefer a call?
                    </button>

                    {draft.preferCall ? (
                      <div>
                        <label htmlFor="ac-phone" className="mb-1.5 block text-sm font-medium">
                          Phone
                        </label>
                        <input
                          id="ac-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={draft.phone}
                          onChange={(event) => updateDraft({ phone: event.target.value })}
                          onKeyDown={handleTextKeyDown}
                          className={inputClass("phone")}
                          placeholder="0412 345 678"
                          aria-describedby={errors.phone ? "err-phone" : undefined}
                        />
                        <FieldError id="err-phone" message={errors.phone} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {submitError ? (
              <div className="contact-error-banner rounded-2xl border px-4 py-2 text-sm" role="alert">
                <p>{submitError}</p>
              </div>
            ) : null}

            <div className="contact-brief__nav">
              {step > 0 ? (
                <button type="button" className="contact-brief__back" onClick={goBack}>
                  Back
                </button>
              ) : (
                <span />
              )}

              {showContinue ? (
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                  className="contact-submit contact-brief__next flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-[filter] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : step === BRIEFING_STEP_COUNT - 1 ? "Send enquiry" : "Continue"}
                </motion.button>
              ) : null}
            </div>
          </form>
        )}
        <ContactToast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </>
  );
}
