import Link from "next/link";
import "./BubbleNav.css";

const NAV_LINKS = [
  { label: "Our Work", href: "/#our-work" },
  { label: "About",    href: "/#about"     },
  { label: "Contact",  href: "/#contact"  },
];

/**
 * Floating pill nav anchored to the bottom of the viewport.
 *
 * Collapsed: shows "TABS" with a slow idle glitch.
 * Hover/focus: expands to reveal site links, each with a per-letter glitch on hover.
 */
export default function BubbleNav() {
  return (
    <nav className="bubble-nav" aria-label="Site navigation">
      {/* Collapsed state label */}
      <span className="bubble-nav__label" aria-hidden="true">
        TABS
      </span>

      {/* Expanded links */}
      <ul className="bubble-nav__links" role="list">
        {NAV_LINKS.map((link, i) => (
          <>
            {i > 0 && (
              <li key={`div-${i}`} className="bubble-nav__divider" aria-hidden="true" />
            )}
            <li key={link.href}>
              <Link
                href={link.href}
                className="bubble-nav__link"
                data-text={link.label}
              >
                {link.label}
              </Link>
            </li>
          </>
        ))}
      </ul>
    </nav>
  );
}
