"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
 *
 * Opening is hover-driven on a real pointer, but on a touchscreen there is no
 * hover: a tap on the collapsed pill triggers a browser's synthetic ":hover"
 * to satisfy the CSS, and the click that immediately follows lands wherever
 * the now-wider pill re-laid itself out under that same fingertip — usually
 * straight onto a link, firing it in the same touch that only meant to open
 * the menu. `open` state below replaces that guesswork on touch devices with
 * an explicit two-tap flow: pointer-events keep every link (and the chevron)
 * unhittable until `is-open` is set, so a first tap can only ever land on the
 * pill itself. The hover CSS is scoped to `(hover: hover)` so it never fires
 * this way on a touchscreen to begin with — see BubbleNav.css.
 */
export default function BubbleNav() {
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const openPill = useCallback(
    (event: React.MouseEvent) => {
      // Once open, the pill's own background is never what a tap lands on —
      // that area is a link, a divider, or the gap around one — so this only
      // ever fires for the tap that opens it.
      if (open) return;
      event.preventDefault();
      setOpen(true);
    },
    [open],
  );

  const closePill = useCallback(() => setOpen(false), []);

  // Tapping outside, or Escape, closes it again. Mouse users never set `open`
  // in the first place (they close by moving the pointer away), so this only
  // does anything once a touch tap has opened it.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={shellRef}
      className={`bubble-nav-shell${open ? " is-open" : ""}`}
    >
      <nav className="bubble-nav" aria-label="Site navigation" onClick={openPill}>
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
                  onClick={closePill}
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
