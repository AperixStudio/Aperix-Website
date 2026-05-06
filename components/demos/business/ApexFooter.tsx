"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexFooter — PRD §8 (shared footer)
   Dark --apex-dark background. Logo, links, contact, socials,
   "Website by Aperix →".
   ──────────────────────────────────────────────────────────── */

const quickLinks = [
  { label: "Home", href: "/demo/business" },
  { label: "Services", href: "/demo/business/services" },
  { label: "Projects", href: "/demo/business/projects" },
  { label: "Emergency", href: "/demo/business/emergency" },
  { label: "About", href: "/demo/business/about" },
  { label: "Request a Quote", href: "/demo/business/contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ApexFooter() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <footer className="bg-[#0f172a]" role="contentinfo">
      <motion.div
        className="mx-auto max-w-6xl px-6 py-14"
        variants={stagger}
        {...motionProps}
      >
        <div className="grid gap-10 md:grid-cols-3">
          {/* col 1: logo + tagline */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="#f59e0b"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-(family-name:--font-apex-display) text-lg font-bold text-white">
                APEX ELECTRICAL
              </span>
            </div>
            <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/50">
              Licenced electrical contractor serving Richmond &amp; greater
              Melbourne. Residential, commercial &amp; emergency.
            </p>
            <p className="mt-2 font-(family-name:--font-apex-body) text-xs text-white/30">
              Lic. No. XXXXX · ABN: XX XXX XXX XXX
            </p>
          </motion.div>

          {/* col 2: quick links */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.15em] text-[#f59e0b]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-(family-name:--font-apex-body) text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* col 3: contact + socials */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.15em] text-[#f59e0b]">
              Contact
            </h4>
            <div className="space-y-2 font-(family-name:--font-apex-body) text-sm text-white/60">
              <p>📞 (03) 9600 1234</p>
              <p>✉️ info@apexelectrical.com.au</p>
              <p>📍 Richmond, VIC 3121</p>
            </div>
            <div className="mt-4 flex gap-3">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-[#f59e0b]/40 hover:text-[#f59e0b]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Google */}
              <a
                href="#"
                aria-label="Google Business"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-[#f59e0b]/40 hover:text-[#f59e0b]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row"
        >
          <p className="font-(family-name:--font-apex-body) text-xs text-white/30">
            © 2024 Apex Electrical. All rights reserved.
          </p>
          <Link
            href="/"
            className="font-(family-name:--font-apex-body) text-xs text-white/30 transition-colors hover:text-[#f59e0b]"
          >
            Website by Aperix →
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
