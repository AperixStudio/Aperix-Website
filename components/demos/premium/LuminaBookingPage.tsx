"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   LuminaBookingPage — PRD §9
   Two-step booking flow with animated step transition.
   Step 1: Treatment selector + practitioner + new/returning
   Step 2: Contact details form + consent checkbox
   Success: SVG path draw animation + confirmation message
   ──────────────────────────────────────────────────────────── */

const allTreatments = [
  { id: "anti-wrinkle", name: "Anti-Wrinkle Injections", category: "Injectables", price: "From $350" },
  { id: "dermal-fillers", name: "Dermal Fillers", category: "Injectables", price: "From $650" },
  { id: "hydrafacial", name: "HydraFacial", category: "Skin Treatments", price: "From $280" },
  { id: "laser-resurfacing", name: "Laser Skin Resurfacing", category: "Advanced Skin", price: "From $450" },
  { id: "body-contouring", name: "Body Contouring", category: "Body", price: "From $600" },
  { id: "collagen-induction", name: "Collagen Induction Therapy", category: "Skin Treatments", price: "From $320" },
  { id: "skin-needling", name: "Skin Needling", category: "Skin Treatments", price: "From $280" },
  { id: "led-therapy", name: "LED Light Therapy", category: "Skin Treatments", price: "From $150" },
];

const practitioners = [
  {
    id: "amelie",
    name: "Dr. Amelie Tremblay",
    gradient: "from-[#e8d0d8] to-[#9d6e82]",
  },
  {
    id: "jessica",
    name: "Jessica Park",
    gradient: "from-[#c9a96e] to-[#9d6e82]",
  },
  {
    id: "chloe",
    name: "Chloe Marchand",
    gradient: "from-[#f0e6d3] to-[#c9a96e]",
  },
  { id: "none", name: "No preference", gradient: "" },
];

const referralSources = [
  "",
  "Google",
  "Instagram",
  "Referral",
  "Walked Past",
  "Other",
];

/* ── Step indicator ─────────────────────────────────────────── */
function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-(family-name:--font-lm-body) text-sm transition-colors ${
              step >= s
                ? "border-[#c9a96e] bg-[#c9a96e] text-[#1a1118]"
                : "border-[#ede5e9] text-[#8b7a83]"
            }`}
          >
            {s}
          </div>
          {s === 1 && (
            <div
              className={`h-px w-10 transition-colors ${
                step >= 2 ? "bg-[#c9a96e]" : "bg-[#ede5e9]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LuminaBookingPage() {
  const prefersReduced = useReducedMotion();

  /* ── Step 1 state ─────────────────────────────────── */
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState("none");
  const [clientType, setClientType] = useState<"new" | "returning">("new");

  /* ── Step 2 state ─────────────────────────────────── */
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [referral, setReferral] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  /* ── Flow state ───────────────────────────────────── */
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goToStep2 = () => {
    setDirection(1);
    setStep(2);
  };

  const goToStep1 = () => {
    setDirection(-1);
    setStep(1);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  const variants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : dir * 60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : dir * -60,
      opacity: 0,
    }),
  };

  const baseInput =
    "w-full rounded-lg border border-[#ede5e9] bg-white px-4 py-3 font-(family-name:--font-lm-body) text-sm text-[#2d2228] outline-none transition-colors focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20";

  return (
    <main role="main">
      {/* Hero */}
      <section className="bg-[#1a1118] pb-12 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]">
            Book a Consultation
          </p>
          <h1 className="mt-3 font-(family-name:--font-lm-display) text-4xl font-light text-white md:text-5xl">
            Begin your Lumina journey.
          </h1>
        </div>
      </section>

      <section className="bg-[#fdfcfb] py-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Success state */}
          {submitted ? (
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-[#ede5e9] bg-white px-8 py-14 text-center"
            >
              {/* SVG path draw animation */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c9a96e]">
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M6 16l7 7 13-13"
                    stroke="#c9a96e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </motion.svg>
              </div>
              <h2 className="font-(family-name:--font-lm-display) text-3xl font-light text-[#1a1118]">
                Consultation request received.
              </h2>
              <p className="mt-3 font-(family-name:--font-lm-body) text-sm text-[#8b7a83]">
                We&apos;ll contact you within 24 hours at{" "}
                <span className="text-[#c9a96e]">{email || "your email"}</span>.
              </p>
              <p className="mt-6">
                <Link
                  href="/demo/premium/faq"
                  className="font-(family-name:--font-lm-body) text-sm text-[#9d6e82] underline underline-offset-4"
                >
                  While you wait, read our FAQ →
                </Link>
              </p>
              <p className="mt-8 font-(family-name:--font-lm-body) text-xs text-[#8b7a83]">
                In the real build, this integrates with Cliniko or Timely and
                triggers a confirmation email via Resend.
              </p>
            </motion.div>
          ) : (
            <>
              <StepIndicator step={step} />

              <div className="overflow-hidden rounded-2xl border border-[#ede5e9] bg-white">
                <AnimatePresence custom={direction} mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="p-8"
                    >
                      <h2 className="font-(family-name:--font-lm-display) text-3xl font-light text-[#1a1118]">
                        What brings you in?
                      </h2>

                      {/* Treatment grid */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {allTreatments.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTreatment(t.id)}
                            className={`rounded-xl border p-4 text-left transition-all ${
                              selectedTreatment === t.id
                                ? "border-[#c9a96e] bg-[#f0e6d3]/40"
                                : "border-[#ede5e9] hover:border-[#c9a96e]/50"
                            }`}
                          >
                            <p className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-widest text-[#8b7a83]">
                              {t.category}
                            </p>
                            <p className="mt-0.5 font-(family-name:--font-lm-display) text-base text-[#1a1118]">
                              {t.name}
                            </p>
                            <p className="font-(family-name:--font-lm-body) text-xs text-[#c9a96e]">
                              {t.price}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Practitioner */}
                      <div className="mt-8">
                        <p className="font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118]">
                          Practitioner preference
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {practitioners.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPractitioner(p.id)}
                              className={`rounded-xl border p-3 text-center transition-all ${
                                selectedPractitioner === p.id
                                  ? "border-[#c9a96e] bg-[#f0e6d3]/40"
                                  : "border-[#ede5e9] hover:border-[#c9a96e]/50"
                              }`}
                            >
                              {p.gradient ? (
                                <div
                                  className={`mx-auto mb-2 h-10 w-10 rounded-full bg-linear-to-br ${p.gradient}`}
                                />
                              ) : (
                                <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-[#ede5e9]" />
                              )}
                              <p className="font-(family-name:--font-lm-body) text-xs text-[#2d2228]">
                                {p.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* New / returning */}
                      <div className="mt-6">
                        <p className="font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118]">
                          Are you a new or returning client?
                        </p>
                        <div className="mt-2 flex gap-2">
                          {(["new", "returning"] as const).map((ct) => (
                            <button
                              key={ct}
                              onClick={() => setClientType(ct)}
                              className={`rounded-full px-5 py-2 font-(family-name:--font-lm-body) text-sm transition-colors ${
                                clientType === ct
                                  ? "bg-[#c9a96e] text-[#1a1118]"
                                  : "border border-[#ede5e9] text-[#8b7a83] hover:border-[#c9a96e]"
                              }`}
                            >
                              {ct === "new" ? "New Client" : "Returning Client"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={goToStep2}
                        disabled={!selectedTreatment}
                        className="mt-8 w-full rounded-full bg-[#c9a96e] py-4 font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118] transition-colors hover:bg-[#d4b87e] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Continue →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="p-8"
                    >
                      <button
                        onClick={goToStep1}
                        className="mb-4 flex items-center gap-1 font-(family-name:--font-lm-body) text-sm text-[#8b7a83] hover:text-[#2d2228]"
                      >
                        ← Back
                      </button>
                      <h2 className="font-(family-name:--font-lm-display) text-3xl font-light text-[#1a1118]">
                        Tell us about yourself.
                      </h2>

                      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="bk-name"
                              className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                            >
                              Full Name *
                            </label>
                            <input
                              id="bk-name"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={baseInput}
                              placeholder="Sophie Chen"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="bk-phone"
                              className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                            >
                              Phone *
                            </label>
                            <input
                              id="bk-phone"
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={baseInput}
                              placeholder="0412 345 678"
                            />
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="bk-email"
                              className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                            >
                              Email *
                            </label>
                            <input
                              id="bk-email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={baseInput}
                              placeholder="sophie@email.com"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="bk-dob"
                              className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                            >
                              Date of Birth *
                            </label>
                            <p className="mb-1 font-(family-name:--font-lm-body) text-xs text-[#8b7a83]">
                              Required for medical records
                            </p>
                            <input
                              id="bk-dob"
                              type="date"
                              required
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className={baseInput}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="bk-referral"
                            className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                          >
                            How did you hear about us?
                          </label>
                          <select
                            id="bk-referral"
                            value={referral}
                            onChange={(e) => setReferral(e.target.value)}
                            className={baseInput}
                          >
                            {referralSources.map((s) => (
                              <option key={s} value={s}>
                                {s || "Select…"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="bk-notes"
                            className="mb-1.5 block font-(family-name:--font-lm-body) text-sm font-medium text-[#2d2228]"
                          >
                            Notes for your practitioner{" "}
                            <span className="text-[#8b7a83]">(optional)</span>
                          </label>
                          <textarea
                            id="bk-notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className={`${baseInput} resize-none`}
                            placeholder="Anything your practitioner should know before your consultation…"
                          />
                        </div>

                        <div className="rounded-xl border border-[#ede5e9] p-4">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              required
                              checked={consent}
                              onChange={(e) => setConsent(e.target.checked)}
                              className="mt-0.5 h-4 w-4 accent-[#c9a96e]"
                            />
                            <span className="font-(family-name:--font-lm-body) text-sm leading-relaxed text-[#8b7a83]">
                              I understand this is a request for consultation, not a
                              confirmed appointment. A team member will contact me within
                              24 hours to provide pre-consultation information. *
                            </span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting || !consent}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a96e] py-4 font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118] transition-colors hover:bg-[#d4b87e] disabled:cursor-not-allowed disabled:opacity-50"
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
                            "Request Consultation"
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
