import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   LuminaFooter — PRD §9
   Dark --lm-dark background, 3-column layout.
   ──────────────────────────────────────────────────────────── */

export default function LuminaFooter() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#1a1118] px-6 py-16 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex flex-col leading-none">
              <span className="font-(family-name:--font-lm-display) text-2xl font-light tracking-[0.3em] text-white">
                LUMINA
              </span>
              <span className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                MED SPA
              </span>
            </div>
            <p className="mt-4 font-(family-name:--font-lm-body) text-sm leading-relaxed text-white/50">
              South Yarra&apos;s premium medical aesthetics clinic. Natural
              results, registered practitioners, honest conversations.
            </p>
            <p className="mt-3 font-(family-name:--font-lm-body) text-xs text-white/30">
              ABN 00 000 000 000 · South Yarra, VIC 3141
            </p>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <h3 className="mb-4 font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]">
              Navigate
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Treatments", href: "/demo/premium/treatments" },
                { label: "About Us", href: "/demo/premium/about" },
                { label: "FAQ", href: "/demo/premium/faq" },
                { label: "Book a Consultation", href: "/demo/premium/book" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-(family-name:--font-lm-body) text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h3 className="mb-4 font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]">
              Contact
            </h3>
            <ul className="space-y-3 font-(family-name:--font-lm-body) text-sm text-white/60">
              <li>123 Toorak Road, South Yarra VIC 3141</li>
              <li>
                <a
                  href="tel:0396001234"
                  className="transition-colors hover:text-white"
                >
                  (03) 9600 1234
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@luminamedspa.com.au"
                  className="transition-colors hover:text-white"
                >
                  hello@luminamedspa.com.au
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Lumina on Instagram"
                className="text-white/40 transition-colors hover:text-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#c9a96e]/20 pt-8 sm:flex-row">
          <p className="font-(family-name:--font-lm-body) text-xs text-white/30">
            © {new Date().getFullYear()} Lumina Med Spa. All rights reserved.
          </p>
          <Link
            href="/"
            className="font-(family-name:--font-lm-body) text-xs text-white/30 transition-colors hover:text-white"
          >
            Website by Aperix →
          </Link>
        </div>
      </div>
    </footer>
  );
}
