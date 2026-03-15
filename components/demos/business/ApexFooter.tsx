import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   ApexFooter — PRD §8.3
   Dark footer with nav links, contact details, licence info
   ──────────────────────────────────────────────────────────── */

export default function ApexFooter() {
  return (
    <footer className="bg-[#0c0a09] pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              href="/demo/business"
              className="flex items-center gap-2 font-(family-name:--font-apex-heading) text-lg font-bold text-white"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded bg-[#f59e0b] text-xs text-[#0c0a09]"
                aria-hidden="true"
              >
                ⚡
              </span>
              Apex Electrical
            </Link>
            <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/60">
              Licensed electricians serving Richmond and inner Melbourne. Fast,
              reliable, and fairly priced.
            </p>
            <p className="mt-4 font-(family-name:--font-apex-body) text-xs text-white/40">
              Lic. EC12345 · $20M insured
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-(family-name:--font-apex-heading) text-sm font-semibold uppercase tracking-wider text-white/40">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                "Residential Wiring",
                "Commercial Fit-outs",
                "Safety Inspections",
                "Emergency Callouts",
                "Solar & Battery",
                "EV Charger Install",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/demo/business/services"
                    className="font-(family-name:--font-apex-body) text-sm text-white/60 transition-colors hover:text-[#f59e0b]"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-(family-name:--font-apex-heading) text-sm font-semibold uppercase tracking-wider text-white/40">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/demo/business", label: "Home" },
                { href: "/demo/business/about", label: "About Us" },
                { href: "/demo/business/contact", label: "Contact" },
                { href: "/demo/business/contact", label: "Free Quote" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-(family-name:--font-apex-body) text-sm text-white/60 transition-colors hover:text-[#f59e0b]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-(family-name:--font-apex-heading) text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:0390000000"
                  className="font-(family-name:--font-apex-body) text-sm text-white/60 transition-colors hover:text-[#f59e0b]"
                >
                  (03) 9000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@apexelectrical.com.au"
                  className="font-(family-name:--font-apex-body) text-sm text-white/60 transition-colors hover:text-[#f59e0b]"
                >
                  info@apexelectrical.com.au
                </a>
              </li>
              <li>
                <p className="font-(family-name:--font-apex-body) text-sm text-white/60">
                  Richmond VIC 3121
                </p>
              </li>
              <li>
                <p className="font-(family-name:--font-apex-body) text-xs font-semibold text-[#f59e0b]">
                  ⚡ 24/7 Emergency Service
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center font-(family-name:--font-apex-body) text-xs text-white/30">
          © {new Date().getFullYear()} Apex Electrical Pty Ltd. All rights
          reserved. Demo site built by{" "}
          <Link href="/" className="transition-colors hover:text-[#f59e0b]">
            Aperix Studio
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
