import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   SootheFooter — PRD §6.3.8
   Dark --soothe-dark background.
   Wordmark, ABN, credentials, Instagram, "Website by Aperix →".
   ──────────────────────────────────────────────────────────── */

export default function SootheFooter() {
  return (
    <footer className="bg-[#2c2825]" role="contentinfo">
      <div className="mx-auto max-w-5xl px-6 py-14 text-center">
        {/* wordmark */}
        <p className="font-(family-name:--font-soothe) text-xl font-bold text-white">
          Soothe Mobile Massage
        </p>

        {/* credentials */}
        <p className="mt-3 font-(family-name:--font-soothe) text-sm text-white/50">
          ABN: XX XXX XXX XXX · Fully Insured · Police Checked
        </p>

        {/* instagram */}
        <div className="mt-6 flex justify-center">
          <a
            href="#"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/40 transition-colors hover:border-[#7a9e87]/50 hover:text-[#7a9e87]"
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
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* divider + Aperix link */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <Link
            href="/"
            className="font-(family-name:--font-soothe) text-xs text-white/30 transition-colors hover:text-[#7a9e87]"
          >
            Website by Aperix →
          </Link>
        </div>
      </div>
    </footer>
  );
}
