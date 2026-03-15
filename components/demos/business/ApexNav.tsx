"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/* ────────────────────────────────────────────────────────────
   ApexUtilityBar — PRD §8.3.1
   Sticky utility bar above nav: phone · email · emergency notice
   ──────────────────────────────────────────────────────────── */

export default function ApexUtilityBar() {
  return (
    <div className="bg-[#1c1917] py-2 px-4 text-center text-xs text-white/80 sm:flex sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <a
          href="tel:0390000000"
          className="flex items-center gap-1.5 transition-colors hover:text-[#f59e0b]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          (03) 9000 0000
        </a>
        <a
          href="mailto:info@apexelectrical.com.au"
          className="flex items-center gap-1.5 transition-colors hover:text-[#f59e0b]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          info@apexelectrical.com.au
        </a>
      </div>
      <p className="mt-1.5 font-semibold text-[#f59e0b] sm:mt-0">
        ⚡ 24/7 Emergency Service Available
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ApexNav — PRD §8.3.1
   Multi-page sticky nav with mobile hamburger
   ──────────────────────────────────────────────────────────── */

const navLinks = [
  { href: "/demo/business", label: "Home" },
  { href: "/demo/business/services", label: "Services" },
  { href: "/demo/business/about", label: "About" },
  { href: "/demo/business/contact", label: "Contact" },
];

export function ApexNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-(--demo-banner-h) z-40 border-b border-[#292524] bg-[#0c0a09] shadow-lg">
      <ApexUtilityBar />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Wordmark */}
        <Link
          href="/demo/business"
          className="flex items-center gap-2 font-(family-name:--font-apex-heading) text-xl font-bold text-white"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded bg-[#f59e0b] text-sm text-[#0c0a09]"
            aria-hidden="true"
          >
            ⚡
          </span>
          Apex Electrical
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-(family-name:--font-apex-body) text-sm font-medium transition-colors hover:text-[#f59e0b] ${
                  pathname === href ? "text-[#f59e0b]" : "text-white/80"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/demo/business/contact"
              className="inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-5 py-2 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0c0a09] transition-all hover:scale-[1.03] hover:bg-[#d97706] active:scale-[0.97]"
            >
              Get a Free Quote
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex items-center text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#292524] bg-[#0c0a09] px-5 pb-5 md:hidden">
          <ul className="flex flex-col gap-3 pt-3">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block font-(family-name:--font-apex-body) text-sm font-medium transition-colors hover:text-[#f59e0b] ${
                    pathname === href ? "text-[#f59e0b]" : "text-white/80"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/demo/business/contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#f59e0b] px-5 py-2.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0c0a09] transition-all hover:bg-[#d97706]"
              >
                Get a Free Quote
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
