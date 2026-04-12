"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── quick‑link data ───────────────────────────────────── */
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Demo Sites", href: "/#tiers" },
  { label: "Contact", href: "/contact" },
];

/* ── privacy modal ─────────────────────────────────────── */
function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy"
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-agency-border bg-agency-surface p-8 shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close privacy policy"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-agency-muted transition-colors hover:bg-agency-border hover:text-agency-text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-6 font-display text-2xl font-bold text-agency-text">
          Privacy Policy
        </h2>

        <div className="space-y-4 text-sm leading-relaxed text-agency-muted">
          <p>
            <strong className="text-agency-text">Aperix Studio</strong> (ABN 22
            720 293 315) is committed to protecting your privacy in accordance
            with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy
            Principles (APPs).
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            1. Information We Collect
          </h3>
          <p>
            We may collect personal information including your name, email
            address, phone number, and business details when you enquire about
            our services, submit a contact form, or engage us for a project.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            2. How We Use Your Information
          </h3>
          <p>
            Your information is used to respond to your enquiries, provide
            our web development and digital marketing services, issue invoices,
            and communicate project updates. We will not use your information
            for purposes other than those for which it was collected without
            your consent.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            3. Disclosure to Third Parties
          </h3>
          <p>
            We do not sell, trade, or rent your personal information. We may
            share information with trusted service providers (e.g. hosting,
            payment processing) who assist us in operating our business, subject
            to confidentiality obligations.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            4. Data Security
          </h3>
          <p>
            We take reasonable steps to protect your personal information from
            misuse, interference, loss, and unauthorised access or disclosure.
            Data is stored securely using industry‑standard encryption and
            access controls.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            5. Access &amp; Correction
          </h3>
          <p>
            You may request access to, or correction of, any personal
            information we hold about you by contacting us at{" "}
            <a
              href="mailto:hello@aperix.com.au"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              hello@aperix.com.au
            </a>
            . We will respond within 30 days.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            6. Cookies &amp; Analytics
          </h3>
          <p>
            Our website may use cookies and analytics tools (e.g. Google
            Analytics) to understand how visitors use our site. You can disable
            cookies in your browser settings at any time.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            7. Changes to This Policy
          </h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated effective date.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            8. Contact
          </h3>
          <p>
            If you have questions or complaints about our privacy practices,
            please contact us at{" "}
            <a
              href="mailto:hello@aperix.com.au"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              hello@aperix.com.au
            </a>
            .
          </p>

          <p className="pt-2 text-xs text-agency-muted/60">
            Last updated: January 2025
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── footer component ──────────────────────────────────── */
export default function Footer() {
  const prefersReduced = useReducedMotion();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const openPrivacy = useCallback(() => setPrivacyOpen(true), []);
  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <footer role="contentinfo" className="border-t border-agency-border bg-agency-surface">
      {/* ── main grid ─────────────────────────────────── */}
      <motion.div
        className="mx-auto max-w-7xl px-6 py-16 lg:py-20"
        variants={stagger}
        {...motionProps}
      >
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* ── col 1: brand ──────────────────────────── */}
          <motion.div variants={fadeUp} className="space-y-4">
            {/* wordmark */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="relative overflow-hidden rounded-sm transition-opacity duration-150 group-hover:opacity-90">
                <Image
                  src="/aperix-logo.svg"
                  alt=""
                  width={40}
                  height={44}
                  aria-hidden="true"
                  className="h-10 w-auto"
                />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-agency-text transition-colors group-hover:text-agency-accent">
                Aperix
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-agency-muted">
              Custom web development &amp; social media management for Melbourne
              businesses.
            </p>

            <p className="text-xs text-agency-muted/60">ABN: 22 720 293 315</p>

            {/* socials */}
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/aperixstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-agency-border text-agency-muted transition-colors hover:border-agency-accent hover:text-agency-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/aperixstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-agency-border text-agency-muted transition-colors hover:border-agency-accent hover:text-agency-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* ── col 2: quick links ────────────────────── */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-agency-text">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-agency-muted transition-colors hover:text-agency-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── col 3: contact details ────────────────── */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-agency-text">
              Contact
            </h3>
            <ul className="space-y-3">
              {/* email */}
              <li className="flex items-start gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-agency-accent"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a
                  href="mailto:hello@aperix.com.au"
                  className="text-sm text-agency-muted transition-colors hover:text-agency-accent"
                >
                  hello@aperix.com.au
                </a>
              </li>

              {/* location */}
              <li className="flex items-start gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-agency-accent"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-agency-muted">
                  Melbourne, VIC
                </span>
              </li>

              {/* LinkedIn */}
              <li className="flex items-start gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mt-0.5 shrink-0 text-agency-accent"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <a
                  href="https://linkedin.com/company/aperixstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-agency-muted transition-colors hover:text-agency-accent"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* ── bottom bar ────────────────────────────────── */}
      <div className="border-t border-agency-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-xs text-agency-muted/60">
            © 2025 Aperix Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={openPrivacy}
              className="text-xs text-agency-muted/60 underline underline-offset-2 transition-colors hover:text-agency-accent"
            >
              Privacy Policy
            </button>

            <a
              href="https://aperix.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-agency-muted/60 transition-colors hover:text-agency-accent"
            >
              Website by Aperix →
            </a>
          </div>
        </div>
      </div>

      {/* ── privacy policy modal ──────────────────────── */}
      <AnimatePresence>
        {privacyOpen && <PrivacyModal onClose={closePrivacy} />}
      </AnimatePresence>
    </footer>
  );
}
