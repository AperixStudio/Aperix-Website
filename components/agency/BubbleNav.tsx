"use client";

import { Fragment } from "react";
import HashLink from "@/components/agency/HashLink";
import "./BubbleNav.css";

const NAV_LINKS = [
  { label: "Our Work", href: "/#our-work" },
  { label: "About",    href: "/#about"     },
  { label: "Contact",  href: "/#contact"  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Floating pill nav anchored to the bottom of the viewport.
 *
 * Collapsed: shows "TABS" with a slow idle glitch.
 * Hover/focus: expands to reveal site links, each with a per-letter glitch on
 * hover, plus a small "back to top" chevron floating above centre.
 *
 * The shell (not the pill) owns the fixed positioning and hover/focus-within
 * triggers. That's what lets the chevron sit outside the pill's own
 * overflow:hidden — needed so the width transition doesn't clip it — while
 * still counting as "still hovering the widget" when the pointer is over the
 * gap between the two.
 */
export default function BubbleNav() {
  return (
    <div className="bubble-nav-shell">
      <nav className="bubble-nav" aria-label="Site navigation">
        {/* Collapsed state label */}
        <span className="bubble-nav__label" aria-hidden="true">
          TABS
        </span>

        {/* Expanded links */}
        <ul className="bubble-nav__links" role="list">
          {NAV_LINKS.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && (
                <li className="bubble-nav__divider" aria-hidden="true" />
              )}
              <li>
                <HashLink
                  href={link.href}
                  className="bubble-nav__link"
                  data-text={link.label}
                >
                  {link.label}
                </HashLink>
              </li>
            </Fragment>
          ))}
        </ul>
      </nav>

      {/* Visually above the pill (see `order` in CSS) but last in reading
          and tab order, as the bonus action past the real nav links. Present
          at all times rather than only once expanded, the same way the links
          themselves are — so tabbing to it from the last link is what
          reveals it for a keyboard user, exactly as landing on a link does. */}
      <button
        type="button"
        className="bubble-nav__top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
      </button>
    </div>
  );
}
