"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── legal links ───────────────────────────────────────── */
const legalLinks = [
  { label: "Privacy Policy", id: "privacy" },
  { label: "Terms & Conditions", id: "terms" },
  { label: "Accessibility Statement", id: "accessibility" },
];
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
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [legalsOpen, setLegalsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const legalsRef = useRef<HTMLDivElement>(null);

  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (legalsRef.current && !legalsRef.current.contains(e.target as Node)) {
        setLegalsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openLegal(id: string) {
    setLegalsOpen(false);
    if (id === "privacy") {
      setPrivacyOpen(true);
    } else {
      setActiveModal(id);
    }
  }

  return (
    <footer role="contentinfo" className="agency-glass-pill rounded-none border-x-0">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Left — logo */}
        <Link href="/" aria-label="Aperix home">
          <Image
            src="/aperix-logo.svg"
            alt="Aperix"
            width={28}
            height={36}
            className="h-7 w-auto opacity-70 transition hover:opacity-100"
          />
        </Link>

        {/* Centre — copyright */}
        <p className="absolute left-1/2 -translate-x-1/2 text-xs text-agency-muted/50">
          © {new Date().getFullYear()} Aperix Studio. All rights reserved.
        </p>

        {/* Right — legals dropdown */}
        <div className="relative" ref={legalsRef}>
          <button
            onClick={() => setLegalsOpen((v) => !v)}
            aria-expanded={legalsOpen}
            aria-haspopup="menu"
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-agency-muted/50 transition hover:text-agency-muted"
          >
            <span className="text-agency-muted/25">(</span>
            Legals
            <span className="text-agency-muted/25">)</span>
          </button>

          <AnimatePresence>
            {legalsOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-full right-0 mb-2.5 min-w-52 overflow-hidden rounded-2xl border border-agency-border bg-agency-surface shadow-2xl"
              >
                {legalLinks.map((link) => (
                  <button
                    key={link.id}
                    role="menuitem"
                    onClick={() => openLegal(link.id)}
                    className="block w-full px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-agency-muted/60 transition hover:bg-agency-border/40 hover:text-agency-text"
                  >
                    {link.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── privacy policy modal ──────────────────────── */}
      <AnimatePresence>
        {privacyOpen && <PrivacyModal onClose={closePrivacy} />}
      </AnimatePresence>

      {/* ── terms modal ───────────────────────────────── */}
      <AnimatePresence>
        {activeModal === "terms" && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveModal(null)}
            role="dialog" aria-modal="true" aria-label="Terms & Conditions"
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-agency-border bg-agency-surface p-8 shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveModal(null)} aria-label="Close" className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-agency-muted transition-colors hover:bg-agency-border hover:text-agency-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <h2 className="mb-6 font-display text-2xl font-bold text-agency-text">Terms &amp; Conditions</h2>
              <div className="space-y-4 text-sm leading-relaxed text-agency-muted">
                <p><strong className="text-agency-text">Aperix Studio</strong> (ABN 22 720 293 315). By engaging our services you agree to the following terms.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">1. Services</h3>
                <p>Aperix Studio provides web development, design, and digital marketing services as agreed in a written proposal or invoice. All deliverables are subject to the scope outlined at the time of engagement.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">2. Payment</h3>
                <p>A deposit is required before work commences. Final payment is due upon project completion prior to site launch. Overdue invoices may incur a late fee of 1.5% per month.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">3. Intellectual Property</h3>
                <p>All custom work produced by Aperix Studio transfers to the client upon receipt of full payment. Third-party assets (fonts, stock images, plugins) remain subject to their respective licences.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">4. Revisions</h3>
                <p>Projects include a reasonable number of revision rounds as specified in the proposal. Additional revisions beyond scope will be quoted separately.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">5. Limitation of Liability</h3>
                <p>Aperix Studio&apos;s liability is limited to the amount paid for the specific service. We are not liable for indirect or consequential losses arising from use of delivered work.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">6. Governing Law</h3>
                <p>These terms are governed by the laws of Victoria, Australia.</p>
                <p className="pt-2 text-xs text-agency-muted/60">Last updated: January 2025</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── accessibility modal ───────────────────────── */}
      <AnimatePresence>
        {activeModal === "accessibility" && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveModal(null)}
            role="dialog" aria-modal="true" aria-label="Accessibility Statement"
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-agency-border bg-agency-surface p-8 shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveModal(null)} aria-label="Close" className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-agency-muted transition-colors hover:bg-agency-border hover:text-agency-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <h2 className="mb-6 font-display text-2xl font-bold text-agency-text">Accessibility Statement</h2>
              <div className="space-y-4 text-sm leading-relaxed text-agency-muted">
                <p><strong className="text-agency-text">Aperix Studio</strong> is committed to making our website accessible to everyone, including people with disabilities.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">Our Commitment</h3>
                <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. This includes providing keyboard navigation, sufficient colour contrast, descriptive alt text, and screen-reader-friendly markup.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">Known Limitations</h3>
                <p>Some third-party content or older sections of the site may not yet fully meet accessibility standards. We are actively working to address these areas.</p>
                <h3 className="pt-2 text-base font-semibold text-agency-text">Feedback</h3>
                <p>If you experience any accessibility barriers on our site, please contact us at <a href="mailto:hello@aperix.com.au" className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80">hello@aperix.com.au</a> and we will do our best to assist you promptly.</p>
                <p className="pt-2 text-xs text-agency-muted/60">Last updated: January 2025</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

