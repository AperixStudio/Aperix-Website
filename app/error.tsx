"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-agency-bg text-agency-text">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-agency-accent">
            Something broke
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The page hit an unexpected error.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-agency-muted">
            We’ve logged the issue. You can retry this page now, or email hello@aperix.com.au if you need help immediately.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-agency-accent px-5 py-3 text-sm font-semibold text-agency-bg transition-colors hover:bg-agency-accent/85"
            >
              Try again
            </button>
            <a
              href="mailto:hello@aperix.com.au"
              className="rounded-full border border-agency-border px-5 py-3 text-sm font-semibold text-agency-text transition-colors hover:border-agency-border-dark hover:bg-agency-surface"
            >
              Email support
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
