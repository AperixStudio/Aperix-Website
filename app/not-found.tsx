import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-agency-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-agency-text sm:text-5xl">
        That page isn’t part of the site.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-agency-muted">
        The link may be outdated, or the page may have moved while the site was being updated.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-agency-accent px-5 py-3 text-sm font-semibold text-agency-bg transition-colors hover:bg-agency-accent/85"
        >
          Back home
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-agency-border px-5 py-3 text-sm font-semibold text-agency-text transition-colors hover:border-agency-border-dark hover:bg-agency-surface"
        >
          Contact Aperix
        </Link>
      </div>
    </main>
  );
}
