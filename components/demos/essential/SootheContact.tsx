"use client";

import { useState, type FormEvent } from "react";

/* ────────────────────────────────────────────────────────────
   SootheContact — PRD §6.3.7
   HTML5 form with `required` only — NO Zod.
   DOM show/hide success — NO animation (Essential tier).
   ──────────────────────────────────────────────────────────── */

const services = [
  "Remedial Massage",
  "Relaxation Massage",
  "Corporate Chair Massage",
];

export default function SootheContact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-(family-name:--font-soothe) text-3xl font-bold text-[#3a3530] md:text-4xl">
            Book a session
          </h2>
          <p className="mt-3 font-(family-name:--font-soothe) text-base text-[#8a8078]">
            Fill in the form below and I&apos;ll respond within 24&nbsp;hours to
            confirm your booking.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-10 lg:grid-cols-5">
          {/* ── form (3 cols) ─────────────────────────── */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-2xl border border-[#c8ddd0] bg-[#c8ddd0]/20 p-8 text-center">
                <p className="font-(family-name:--font-soothe) text-lg font-bold text-[#5c7a67]">
                  Thanks! I&apos;ll be in touch soon.
                </p>
                <p className="mt-2 font-(family-name:--font-soothe) text-sm text-[#8a8078]">
                  I&apos;ll respond within 24&nbsp;hours to confirm your
                  booking.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate={false}
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="soothe-name"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Name
                  </label>
                  <input
                    id="soothe-name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="Your name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="soothe-phone"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Phone
                  </label>
                  <input
                    id="soothe-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="04XX XXX XXX"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="soothe-email"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Email
                  </label>
                  <input
                    id="soothe-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Service */}
                <div>
                  <label
                    htmlFor="soothe-service"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Service
                  </label>
                  <select
                    id="soothe-service"
                    name="service"
                    required
                    defaultValue=""
                    className="w-full appearance-none rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Suburb */}
                <div>
                  <label
                    htmlFor="soothe-suburb"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Suburb
                  </label>
                  <input
                    id="soothe-suburb"
                    name="suburb"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="e.g. Fitzroy"
                  />
                </div>

                {/* Preferred day/time */}
                <div>
                  <label
                    htmlFor="soothe-datetime"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Preferred day / time
                  </label>
                  <input
                    id="soothe-datetime"
                    name="datetime"
                    type="text"
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="e.g. Saturday morning"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="soothe-message"
                    className="mb-1.5 block font-(family-name:--font-soothe) text-sm font-semibold text-[#3a3530]"
                  >
                    Message
                  </label>
                  <textarea
                    id="soothe-message"
                    name="message"
                    rows={4}
                    className="w-full rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-3 font-(family-name:--font-soothe) text-sm text-[#3a3530] outline-none transition-colors focus:border-[#7a9e87] focus:ring-2 focus:ring-[#7a9e87]/20"
                    placeholder="Anything else I should know?"
                  />
                </div>

                {/* submit */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#7a9e87] px-6 py-3.5 font-(family-name:--font-soothe) text-sm font-semibold text-white transition-colors hover:bg-[#5c7a67]"
                >
                  Send Booking Request
                </button>
              </form>
            )}
          </div>

          {/* ── sidebar contact info (2 cols) ─────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* phone */}
            <div className="rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] p-6 text-center">
              <span className="text-2xl" aria-hidden="true">
                📞
              </span>
              <p className="mt-2 font-(family-name:--font-soothe) text-sm font-bold text-[#3a3530]">
                Call or text
              </p>
              <a
                href="tel:0400000000"
                className="mt-1 block font-(family-name:--font-soothe) text-sm text-[#7a9e87] transition-colors hover:text-[#5c7a67]"
              >
                0400 000 000
              </a>
            </div>

            {/* email */}
            <div className="rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] p-6 text-center">
              <span className="text-2xl" aria-hidden="true">
                ✉️
              </span>
              <p className="mt-2 font-(family-name:--font-soothe) text-sm font-bold text-[#3a3530]">
                Email
              </p>
              <a
                href="mailto:hello@soothemassage.com.au"
                className="mt-1 block font-(family-name:--font-soothe) text-sm text-[#7a9e87] transition-colors hover:text-[#5c7a67]"
              >
                hello@soothemassage.com.au
              </a>
            </div>

            {/* instagram */}
            <div className="rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] p-6 text-center">
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7a9e87"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <p className="mt-2 font-(family-name:--font-soothe) text-sm font-bold text-[#3a3530]">
                Instagram
              </p>
              <a
                href="#"
                className="mt-1 block font-(family-name:--font-soothe) text-sm text-[#7a9e87] transition-colors hover:text-[#5c7a67]"
              >
                @soothe.massage
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
