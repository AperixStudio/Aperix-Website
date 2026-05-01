export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-24">
      <div className="rounded-[28px] border border-agency-border bg-agency-surface px-8 py-10 text-center shadow-[0_24px_70px_rgba(15,24,35,0.08)]">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-agency-border border-t-agency-accent" />
        <p className="mt-5 text-sm font-medium text-agency-text">Loading Aperix…</p>
        <p className="mt-2 text-sm text-agency-muted">Preparing the next section.</p>
      </div>
    </main>
  );
}
