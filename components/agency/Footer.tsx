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
            <strong className="text-agency-text">Aperix Studio</strong> (ABN 57
            379 139 292) (&ldquo;<strong className="text-agency-text">we</strong>&rdquo;,
            &ldquo;<strong className="text-agency-text">us</strong>&rdquo;,
            &ldquo;<strong className="text-agency-text">our</strong>&rdquo;) is
            committed to protecting your privacy and handling personal
            information in accordance with the <em>Privacy Act 1988</em> (Cth)
            and the Australian Privacy Principles (APPs).
          </p>
          <p>
            This policy explains what information we collect when you visit{" "}
            <a
              href="https://aperix.com.au"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              aperix.com.au
            </a>{" "}
            or interact with us, how we use it, and the choices you have.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            1. Who we are
          </h3>
          <p>
            This website is operated by Aperix Studio. If you have any
            questions about this Privacy Policy, you can contact us at{" "}
            <a
              href="mailto:hello@aperix.com.au"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              hello@aperix.com.au
            </a>
            .
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            2. Information we collect
          </h3>
          <p>
            We only collect personal information that is reasonably necessary
            for the activities of our business.
          </p>
          <p>
            <strong className="text-agency-text">
              Information you give us directly,
            </strong>{" "}
            such as your name, email address, phone number, and any
            business details you include when you submit an enquiry, request a
            quote, or engage us for a project.
          </p>
          <p>
            <strong className="text-agency-text">
              Information collected automatically.
            </strong>{" "}
            When you visit our website, limited technical information
            is processed to operate and secure the site, including:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>IP address and approximate location (country/region only);</li>
            <li>browser type, language, and device information;</li>
            <li>pages visited, referring URL, and timestamps.</li>
          </ul>
          <p>
            We do not knowingly collect sensitive information (as defined in
            the Privacy Act) and we do not collect information from children
            under 13.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            3. Analytics
          </h3>
          <p>
            We use <strong className="text-agency-text">Netlify Analytics</strong>{" "}
            to understand how visitors use our website in aggregate. Netlify
            Analytics provides anonymous, aggregated usage statistics and does
            not rely on tracking cookies or fingerprinting to identify
            individual visitors.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            4. Contact forms and project enquiries
          </h3>
          <p>
            Information you submit through our contact forms is used solely to
            respond to your enquiry and provide the services you request. Form
            submissions are processed by{" "}
            <strong className="text-agency-text">Netlify Forms</strong> and
            delivered to us by email. We do not use enquiry information for
            marketing without your express consent.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            5. Client materials handled during engagements
          </h3>
          <p>
            As a web and software development studio, we routinely receive
            material from clients in order to build, deploy, and maintain
            their products. This may include brand assets, copy, source code,
            access tokens, repository invitations (GitHub/GitLab), hosting and
            DNS credentials, analytics access, and content destined for the
            client&rsquo;s own production database.
          </p>
          <p>
            We treat these materials as <strong className="text-agency-text">confidential</strong>:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Credentials and access tokens are stored in a password manager
              with multi-factor authentication and are revoked at the end of
              the engagement.
            </li>
            <li>
              Source code is held in private repositories accessible only to
              assigned team members.
            </li>
            <li>
              We do not access client production data beyond what is necessary
              to perform the contracted work, and we never copy live customer
              records to local development machines without consent.
            </li>
            <li>
              Where you process personal information on infrastructure we
              build or maintain for you, you remain the data controller; we
              act as your data processor under the terms of our engagement.
            </li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            6. Cookies
          </h3>
          <p>
            This website does not use advertising, profiling, or cross-site
            tracking cookies. Essential technical cookies may be set where
            required for website functionality, security, or to remember your
            preferences. You can block or delete cookies in your browser
            settings at any time, although doing so may affect site
            functionality.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            7. Third-party services and overseas disclosure
          </h3>
          <p>
            We rely on a small number of trusted service providers to operate
            the website:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-agency-text">Hosting.</strong> Our
              site is hosted by <strong className="text-agency-text">Netlify</strong>,
              which may process technical request information as part of
              providing hosting and security services. See{" "}
              <a
                href="https://www.netlify.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
              >
                Netlify&rsquo;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-agency-text">Analytics.</strong> See
              Section 3.
            </li>
          </ul>
          <p>
            Some of these providers store and process data outside Australia,
            primarily in the{" "}
            <strong className="text-agency-text">United States</strong>. By
            submitting information through this site, you acknowledge that
            your information may be transferred to and processed in those
            locations under equivalent privacy protections.
          </p>
          <p>We do not sell, rent, or trade your personal information.</p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            8. Data security and retention
          </h3>
          <p>
            We take reasonable steps to protect personal information from
            misuse, interference, loss, and unauthorised access, modification,
            or disclosure. This includes encrypted transport (HTTPS), access
            controls, and using reputable service providers.
          </p>
          <p>
            Enquiry information is retained for no longer than{" "}
            <strong className="text-agency-text">24 months</strong>, after
            which it is deleted or de-identified, unless we are required by
            law to keep it for longer (for example, records relating to
            invoiced engagements).
          </p>
          <p>
            Project repositories, design files, and build artefacts are
            retained for the duration of the engagement and for up to{" "}
            <strong className="text-agency-text">7 years</strong> afterwards,
            in line with our tax and warranty obligations. At any point you
            may request that we destroy or hand over your project files
            (subject to outstanding invoices).
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            9. Changes to this policy
          </h3>
          <p>
            We may update this Privacy Policy from time to time. The latest
            version will always be available on this page, with the
            &ldquo;Last updated&rdquo; date below revised accordingly.
            Material changes will be highlighted on the website.
          </p>

          <h3 className="pt-2 text-base font-semibold text-agency-text">
            10. Access, correction, and complaints
          </h3>
          <p>
            You have the right to request access to, or correction of, the
            personal information we hold about you. To make a request, or to
            raise a privacy concern, please contact us at{" "}
            <a
              href="mailto:hello@aperix.com.au"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              hello@aperix.com.au
            </a>
            . We will respond within{" "}
            <strong className="text-agency-text">30 days</strong>.
          </p>
          <p>
            If you are not satisfied with our response, you may lodge a
            complaint with the{" "}
            <strong className="text-agency-text">
              Office of the Australian Information Commissioner (OAIC)
            </strong>{" "}
            at{" "}
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80"
            >
              www.oaic.gov.au
            </a>
            .
          </p>

          <p className="pt-2 text-xs text-agency-muted/60">
            Last updated: 1 June 2026
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
                <p>
                  <strong className="text-agency-text">Aperix Studio</strong> (ABN 57 379 139 292) is a web and software development studio based in Victoria, Australia. By engaging us or by using this website you agree to the following terms. Specific engagements are also governed by the written proposal or Statement of Work (SOW) we issue you, which prevails over these terms in the event of conflict.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">1. Our services</h3>
                <p>
                  We design, build, deploy, and maintain websites, web applications, and bespoke software, and provide related advisory and digital marketing services. Each engagement is defined by a written proposal or SOW that sets out scope, deliverables, timeline, and price.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">2. Fees, deposits, and payment</h3>
                <p>
                  Unless otherwise stated, a deposit of 30 to 50% is payable before work commences. Milestone or progress invoices fall due within{" "}
                  <strong className="text-agency-text">7 days</strong> of issue, and final balances are due before production launch or final handover. Overdue amounts may attract interest at 1.5% per month, calculated daily, and we may suspend work or withhold access to deliverables while invoices remain unpaid.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">3. Intellectual property</h3>
                <p>
                  All custom code, designs, and written deliverables produced by Aperix under an engagement are licensed to you for review during the project, and{" "}
                  <strong className="text-agency-text">ownership transfers to you on receipt of full payment</strong>. Until then we retain ownership and may revoke access to unpaid work.
                </p>
                <p>
                  We retain a perpetual, non-exclusive licence to reuse generic code patterns, internal utilities, components, and learnings developed during the engagement, provided they do not include your confidential information, brand, or proprietary data.
                </p>
                <p>
                  Third-party assets, including fonts, stock imagery, icon sets, open-source libraries, hosting platforms, plugins, and APIs, remain subject to their own licences. You are responsible for maintaining any required subscriptions after handover.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">4. Revisions and scope changes</h3>
                <p>
                  Each engagement includes the revision rounds specified in the SOW. Additional work, new features, or significant scope changes will be quoted as a written variation and added to the engagement before they are undertaken.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">5. Hosting, domains, and third-party services</h3>
                <p>
                  Where we configure hosting, domain registration, email, or third-party services on your behalf, accounts are registered in your name wherever possible. Any recurring fees charged by those providers (e.g. Netlify, Vercel, Supabase, Stripe, domain registrars) are your responsibility unless explicitly bundled in our SOW.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">6. Browser, device, and platform support</h3>
                <p>
                  Unless agreed otherwise, deliverables are tested against the current and previous major versions of the latest evergreen browsers (Chrome, Safari, Firefox, Edge) on modern desktop and mobile devices. We do not warrant compatibility with end-of-life browsers or with third-party services that change their APIs after handover.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">7. Post-launch warranty and ongoing support</h3>
                <p>
                  We provide a <strong className="text-agency-text">30-day</strong> defect-correction warranty from launch: any reproducible bug in code we authored, in the scope as built, will be fixed at no additional cost. The warranty does not cover changes you (or third parties) make after handover, hosting outages outside our control, or new feature requests.
                </p>
                <p>
                  Ongoing support, retainers, and managed-hosting arrangements are offered under separate agreements.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">8. Confidentiality</h3>
                <p>
                  Each party agrees to keep the other&rsquo;s confidential information, including business plans, code, credentials, and customer data, secret, and to use it only for the purpose of the engagement. We will sign a separate Non-Disclosure Agreement on request.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">9. Cancellation and termination</h3>
                <p>
                  Either party may terminate an engagement on written notice if the other materially breaches these terms and fails to remedy the breach within{" "}
                  <strong className="text-agency-text">14 days</strong>. On cancellation, fees are payable for all work completed up to the termination date, and unpaid deposits are non-refundable to the extent that work has already been performed.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">10. Limitation of liability</h3>
                <p>
                  To the maximum extent permitted by law, Aperix&rsquo;s total liability arising out of or in connection with an engagement is limited to the fees paid by you for the specific service in the{" "}
                  <strong className="text-agency-text">six (6) months</strong> preceding the claim. We exclude liability for indirect, incidental, special, or consequential losses, including loss of profit, revenue, data, or goodwill.
                </p>
                <p>
                  Nothing in these terms excludes any rights or guarantees you have under the{" "}
                  <em>Australian Consumer Law</em> that cannot lawfully be excluded.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">11. Portfolio and case studies</h3>
                <p>
                  Unless you ask us in writing not to, we may reference your project in our portfolio, case studies, and marketing materials, including screenshots, logo, and a brief description of the work. We will not disclose confidential business information without your consent.
                </p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">12. Governing law</h3>
                <p>These terms are governed by the laws of Victoria, Australia, and each party submits to the non-exclusive jurisdiction of the courts of that State.</p>

                <p className="pt-2 text-xs text-agency-muted/60">Last updated: 1 June 2026</p>
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
                <p><strong className="text-agency-text">Aperix Studio</strong> is committed to making our website, and the websites and software we build for our clients, accessible to everyone, including people with disabilities.</p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">Our standard</h3>
                <p>We aim to conform to the{" "}
                  <strong className="text-agency-text">Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA</strong>. In practice this means:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>full keyboard navigation with a visible focus state;</li>
                  <li>semantic HTML and ARIA labels for assistive technologies;</li>
                  <li>colour contrast of at least 4.5:1 for body text;</li>
                  <li>descriptive alt text on meaningful imagery;</li>
                  <li>respect for the operating system&rsquo;s &ldquo;reduce motion&rdquo; preference; and</li>
                  <li>a maximum width and line height tuned for readable long-form text.</li>
                </ul>

                <h3 className="pt-2 text-base font-semibold text-agency-text">Known limitations</h3>
                <p>Some third-party embeds (e.g. external maps, analytics dashboards, or vendor widgets) may not yet fully meet WCAG 2.2 AA. Where we are responsible for these, we work to replace or wrap them with accessible alternatives.</p>

                <h3 className="pt-2 text-base font-semibold text-agency-text">Feedback</h3>
                <p>If you experience an accessibility barrier on this site, or on a site we have built for a client, please contact us at <a href="mailto:hello@aperix.com.au" className="text-agency-accent underline underline-offset-2 hover:text-agency-accent/80">hello@aperix.com.au</a>. We aim to respond within 5 business days and to remediate confirmed issues as quickly as practicable.</p>

                <p className="pt-2 text-xs text-agency-muted/60">Last updated: 1 June 2026</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

