"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "aperix-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeToggle({ className }: { className?: string }) {
  // IMPORTANT: keep the initial state identical on server and client to
  // avoid hydration mismatches (React error #418). The real preference is
  // read from localStorage/matchMedia after mount. The pre-hydration script
  // in app/layout.tsx already sets `documentElement.dataset.theme`, so the
  // page colours are correct from byte-one regardless of this button's
  // rendered icon for the first frame.
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Sync from storage / system after mount.
  useEffect(() => {
    setTheme(getPreferredTheme());
    setMounted(true);
  }, []);

  // Apply theme to <html> whenever it changes (after mount only).
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-cursor-pill
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      suppressHydrationWarning
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border border-agency-border bg-agency-surface/80 px-4 text-sm font-semibold text-agency-ink shadow-[0_10px_30px_rgba(67,92,122,0.08)] supports-backdrop-filter:backdrop-blur-xl hover:border-agency-border-dark hover:bg-agency-surface2/80",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border border-agency-border/80",
          theme === "dark"
            ? "bg-agency-accent/15 text-agency-accent"
            : "bg-agency-accent2/15 text-agency-accent2",
        )}
      >
        {theme === "dark" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span suppressHydrationWarning>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}