"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import "./ForumInbox.css";

type ForumPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  tag: string;
  snippet: string;
  body: string[];
};

// Placeholder posts — no forum backend wired up yet. Swap this array (or a
// fetch) for real data once there's somewhere to write from.
const FORUM_POSTS: ForumPost[] = [
  {
    id: "welcome-to-the-forum",
    title: "Welcome to the Aperix forum",
    author: "Aperix Studio",
    date: "Sep 1, 2026",
    tag: "Announcement",
    snippet: "A place for build notes, launch write-ups, and things we've learned shipping client sites.",
    body: [
      "This is the first post in what will become a running log of build notes, launch write-ups, and small lessons picked up while shipping client work.",
      "Nothing here is final yet — the layout, the categories, and the posts themselves are all placeholders while the real thing gets designed.",
    ],
  },
  {
    id: "how-we-scope-a-project",
    title: "How we scope a new project",
    author: "Aperix Studio",
    date: "Aug 24, 2026",
    tag: "Process",
    snippet: "A quick look at how a project moves from first enquiry to a signed-off scope.",
    body: [
      "Every project starts with a short discovery call, then a written scope covering pages, features, timeline, and price before any code is written.",
      "This keeps expectations aligned on both sides and gives us a clear reference point for revisions later in the build.",
    ],
  },
  {
    id: "notes-on-fast-sites",
    title: "Notes on keeping sites fast",
    author: "Aperix Studio",
    date: "Aug 12, 2026",
    tag: "Engineering",
    snippet: "A few of the defaults we reach for to keep hand-built sites loading quickly.",
    body: [
      "Custom-built sites start with an advantage over template platforms: no unused CSS, no plugin bloat, and full control over what actually ships to the browser.",
      "From there it's the usual discipline — image optimisation, lazy-loading below the fold, and keeping the JavaScript bundle honest.",
    ],
  },
];

/**
 * Forum — inbox-style layout. A post list on the left, the selected post
 * expanded on the right, echoing an email client rather than a classic blog
 * grid. Placeholder content only; no backend yet.
 *
 * Below sm the two columns collapse into one: the list is the default view,
 * and picking a post swaps it for the detail pane full-width with a way
 * back, since side-by-side has no room to breathe on a phone.
 */
export default function ForumInbox() {
  const [selectedId, setSelectedId] = useState<string>(FORUM_POSTS[0].id);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const selected = FORUM_POSTS.find((post) => post.id === selectedId) ?? FORUM_POSTS[0];

  const selectPost = (id: string) => {
    setSelectedId(id);
    setMobileShowDetail(true);
  };

  return (
    <div className="forum-inbox mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-8">
      {/* Distortion map for the liquid-glass panel below — a warped SVG
          filter, not just blur+opacity, so the wavy background actually
          bends through the glass instead of merely showing through it
          faded. Chromium reads `url(#id)` inside backdrop-filter; Safari
          doesn't, so ForumInbox.css keeps a blur-only fallback for it. */}
      <svg aria-hidden="true" className="forum-glass-defs">
        <filter
          id="forum-liquid-glass"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010 0.014"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={3} result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={46}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <header className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-agency-muted">
          Forum
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-agency-ink sm:text-3xl">
          Build notes &amp; write-ups
        </h1>
      </header>

      <div className="forum-panel grid flex-1 gap-0 rounded-[1.75rem] sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* ── Post list ─────────────────────────────────────── */}
        <ul
          role="list"
          className={cn(
            "forum-panel__list forum-panel__divider flex flex-col overflow-y-auto py-2",
            mobileShowDetail && "hidden sm:flex",
          )}
        >
          {FORUM_POSTS.map((post) => (
            <li key={post.id} className="forum-post-row">
              <button
                type="button"
                onClick={() => selectPost(post.id)}
                aria-current={post.id === selectedId ? "true" : undefined}
                className="forum-post-btn block w-[calc(100%-1.1rem)] px-4 py-3.5 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="forum-tag text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
                    {post.tag}
                  </span>
                  <span className="shrink-0 text-[11px] text-agency-muted">{post.date}</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-agency-ink">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-agency-muted">
                  {post.snippet}
                </p>
              </button>
            </li>
          ))}
        </ul>

        {/* ── Selected post ─────────────────────────────────── */}
        <div
          className={cn(
            "flex flex-col overflow-y-auto px-6 py-6 sm:px-8 sm:py-8",
            !mobileShowDetail && "hidden sm:flex",
          )}
        >
          <button
            type="button"
            onClick={() => setMobileShowDetail(false)}
            className="forum-back-btn mb-4 flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-agency-muted transition-colors hover:text-agency-ink sm:hidden"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to posts
          </button>

          <span className="forum-tag w-fit text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
            {selected.tag}
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-agency-ink sm:text-2xl">
            {selected.title}
          </h2>
          <p className="mt-1.5 text-xs text-agency-muted">
            {selected.author} · {selected.date}
          </p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-agency-text-secondary">
            {selected.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
