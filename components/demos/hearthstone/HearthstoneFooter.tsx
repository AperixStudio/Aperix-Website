"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   HearthstoneFooter — PRD §6.3.8
   Dark espresso background. Logo, links, socials, ABN,
   "Website by Aperix →".
   ──────────────────────────────────────────────────────────── */

const links = [
  { label: "Home", href: "/demo/starter" },
  { label: "Menu", href: "/demo/starter/menu" },
  { label: "About", href: "/demo/starter/about" },
  { label: "Visit", href: "/demo/starter/contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HearthstoneFooter() {
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
    <footer className="bg-[#1c1612]" role="contentinfo">
      <motion.div
        className="mx-auto max-w-6xl px-6 py-14"
        variants={stagger}
        {...motionProps}
      >
        <div className="grid gap-10 md:grid-cols-3">
          {/* col 1: logo */}
          <motion.div variants={fadeUp}>
            <span className="font-(family-name:--font-hs-display) text-xl font-bold text-white">
              HEARTHSTONE
            </span>
            <p className="mt-2 font-(family-name:--font-hs-body) text-sm text-[#c49a6c]/70">
              Specialty coffee &amp; seasonal brunch.
              <br />
              Smith Street, Fitzroy.
            </p>
          </motion.div>

          {/* col 2: links */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-3 font-(family-name:--font-hs-mono) text-[10px] uppercase tracking-[0.2em] text-[#c49a6c]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-(family-name:--font-hs-body) text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* col 3: socials */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-3 font-(family-name:--font-hs-mono) text-[10px] uppercase tracking-[0.2em] text-[#c49a6c]">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-[#c49a6c]/40 hover:text-[#c49a6c]"
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

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-[#c49a6c]/40 hover:text-[#c49a6c]"
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
            </div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row"
        >
          <p className="font-(family-name:--font-hs-body) text-xs text-white/30">
            ABN: XX XXX XXX XXX · Privacy Policy
          </p>
          <Link
            href="/"
            className="font-(family-name:--font-hs-body) text-xs text-white/30 transition-colors hover:text-[#c49a6c]"
          >
            Website by Aperix →
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
