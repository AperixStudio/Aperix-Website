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

const FORUM_POSTS: ForumPost[] = [
  {
    id: "how-we-plan-a-project",
    title: "How we plan a project",
    author: "Aperix Studio",
    date: "Sep 8, 2026",
    tag: "Process",
    snippet:
      "From the first message to a written scope, before anyone writes a line of code.",
    body: [
      "Every project starts the same way. You send a note with whatever you have: a rough idea, a half finished brief, or a problem with the current site. It is always us two on the other end. No forms maze, no account manager.",
      "The first call is for the business, not the design. We want to know who the customer is, what is falling short today, and what a good outcome looks like. Pages, features, timeline, and price get written down after that, before any code is written.",
      "That written scope is the reference point for the rest of the build. It keeps both sides honest about what is in, what is out, and what a revision actually means later.",
      "Before we lock anything in, we sketch the structure, flow, and feel. Sometimes that is a wireframe on screen. Sometimes it is a quick coded draft. We pick whichever helps both of us see if it is heading the right way.",
      "Then we build the site, send a private staging link, work through feedback, and launch. After it is live we stay for handover, and we can keep looking after hosting and updates if you want us to. The same people who built it are the ones answering the messages.",
    ],
  },
  {
    id: "national-roofing-solutions",
    title: "National Roofing Solutions: trust on the first screen",
    author: "Aperix Studio",
    date: "Sep 9, 2025",
    tag: "Launch",
    snippet:
      "A local roofing site for urgent enquiries, built so trust and contact land before anything else.",
    body: [
      "Roofing traffic is often urgent. A leak, a storm, a quote needed this week. The site had to feel local and trustworthy from the first screen, then make contact obvious.",
      "National Roofing Solutions is based in Sunbury and services Melbourne's north west. We led with repairs, restorations, and replacements, and put trust signals up front so a first time visitor did not have to hunt for proof.",
      "The typewriter hero is a service reminder, not decoration. It loops the work they actually do so the offer stays in view without adding clutter. Local SEO sat in the structure: service pages, location, and a contact path built for someone who needs a roofer, not a page stuffed with keywords.",
      "We would front load trust again. For local trades, clarity and a direct contact path do more than a long explanation of the business.",
      "Live at nationalroofing.com.au.",
    ],
  },
  {
    id: "complete-trade-solutions",
    title: "Complete Trade Solutions: one site, a lot of trades",
    author: "Aperix Studio",
    date: "Jul 22, 2025",
    tag: "Launch",
    snippet:
      "How we kept a multi service trades homepage scannable, with a quote path you can always find.",
    body: [
      "Kitchen renovations, roof restoration, painting, plumbing, electrical, cabinetry, and flooring. The risk with a business that broad is a homepage that feels like a pile of trades instead of one team.",
      "We grouped the services so the page stayed scannable, then put a quote path where you could always see it. The intro animation is there to set the business up before the list starts, not to decorate the load.",
      "Quote first mattered because most visitors already know they need work done. They are not browsing. They need to find their service and send an enquiry without hunting.",
      "We would keep that structure on any multi service trades site. One capable team, a clear map of the work, and a quote path that does not hide.",
      "Live at completetrade.au.",
    ],
  },
  {
    id: "the-hidden-chapter",
    title: "The Hidden Chapter: making a shop feel like a gift",
    author: "Aperix Studio",
    date: "Feb 18, 2025",
    tag: "Launch",
    snippet:
      "A mood led book shop where the first scroll has to feel like a gift, not a catalogue.",
    body: [
      "A blind date with a book store cannot look like a generic catalogue. The first scroll has to carry mood, mystery, and gifting, or people treat it like any other shop.",
      "We led the homepage with story instead of a wall of books. Product still had to be easy to find, but the brand mood had to land before the grid did. That meant a warmer visual hierarchy and a product path that stayed short on mobile.",
      "The constraint was keeping the shop feeling considered without slowing it down. Heavy imagery and a long browse flow would have killed the gift impulse. We kept the product journey tight so someone on a phone could move from curiosity to a purchase without digging.",
      "We would do the story first homepage again. For a brand like this, the shop has to feel like a gift experience from the first screen, not a catalogue with nicer photos.",
      "Live at thehiddenchapter.com.au.",
    ],
  },
];

/**
 * Forum inbox layout. A post list on the left, the selected post expanded
 * on the right, echoing an email client rather than a classic blog grid.
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
          Forum
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
          Build notes &amp; write ups
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
                  <span className="shrink-0 text-[11px] text-white/60">{post.date}</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-white">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">
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
            className="forum-back-btn mb-4 flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/65 transition-colors hover:text-white sm:hidden"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to posts
          </button>

          <span className="forum-tag w-fit text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
            {selected.tag}
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
            {selected.title}
          </h2>
          <p className="mt-1.5 text-xs text-white/60">
            {selected.author} · {selected.date}
          </p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/90">
            {selected.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
