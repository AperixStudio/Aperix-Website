# Social Proof Board — Implementation Brief

Airport-style split-flap “departure board” that replaces the old marquee `SocialProofBar`. One fixed row of mechanical flaps cycles through studio phrases on the homepage, using the same flip animation pattern as `MelbourneFlipClock`.

## What It Does

- Renders a dark Solari-style board with **Status | Message | Origin** columns.
- **Status** and **Origin** are static (`LIVE`, `MELB`).
- **Message** flips character-by-character through `SOCIAL_PROOF_PHRASES` every 4.2 seconds.
- Each character sits in its own flap cell with a center split line and hinge details.
- Respects `prefers-reduced-motion`: no auto-cycle, no flip animation, first phrase only.

## Page Placement

```tsx
// app/page.tsx
<AgencyNavV2 />
<HeroV4 />
<SocialProofBoard />   {/* ← directly below hero, above main content */}
<main>
  <LiveSitesSectionV2 />
  ...
</main>
```

## Source Files

| File | Role |
|------|------|
| `components/agency/SocialProofBoard.tsx` | React component: layout, cycle timer, flip animation |
| `components/agency/SocialProofBoard.css` | Visual styling: frame, grid, flap cells, hinges, responsive |
| `lib/socialProofContent.ts` | Phrase list + padding helper for fixed flap width |
| `lib/useReducedMotion.ts` | Shared hook — disables motion when user prefers reduced motion |
| `app/page.tsx` | Imports and renders `SocialProofBoard` |

**Replaced (unused):** `components/agency/SocialProofBar.tsx` + `SocialProofBar.css` (horizontal marquee of pill badges).

**Animation reference:** `components/agency/MelbourneFlipClock.tsx` — same `AnimatePresence` + spring `y` flip pattern.

---

## Component Tree

```
SocialProofBoard (section)
└── social-proof-board__frame (the “box”)
    ├── header
    │   ├── PlaneIcon
    │   ├── h2 "Studio departures"
    │   └── PlaneIcon
    ├── columns (Status | Message | Origin labels)
    └── row (data row)
        ├── cell--status  → FlapRow("LIVE")
        ├── cell--message → FlapRow(formatted phrase)  ← cycles
        └── cell--origin  → FlapRow("MELB")

FlapRow
└── AnimatedFlapChar × N  (one per character)
    └── board-flap
        └── board-flap__card
            ├── hinge--left
            ├── hinge--right
            ├── split (horizontal line)
            └── motion.span board-flap__tick (animated character)
```

---

## Data Flow

```
SOCIAL_PROOF_PHRASES (lib/socialProofContent.ts)
        │
        ▼
phraseIndex state (0 … length-1), advanced every CYCLE_MS (4200ms)
        │
        ▼
activePhrase = SOCIAL_PROOF_PHRASES[phraseIndex]
        │
        ▼
formatSocialProofMessage(activePhrase)
  → uppercase + padEnd to SOCIAL_PROOF_MESSAGE_WIDTH
        │
        ▼
FlapRow splits string into chars → AnimatedFlapChar per char
        │
        ▼
When char changes, AnimatePresence flips old char out / new char in
```

### Why padding?

Phrases have different lengths. Without padding, the message column would shrink/grow on each cycle and flaps would jump horizontally. `formatSocialProofMessage` uppercases and right-pads with spaces to the longest phrase length so every row has the same number of flap cells.

---

## Layer 1 — The Box (`social-proof-board__frame`)

**CSS:** `.social-proof-board` → outer section spacing; `.social-proof-board__frame` → the visible board.

| Property | Purpose |
|----------|---------|
| `border: 1px solid rgba(255,255,255,0.12)` | Subtle glass edge |
| `background: linear-gradient(#101010 → #080808)` | Deep charcoal panel |
| `box-shadow` (outer + inset highlight) | Depth / recessed panel feel |
| `border-radius: 0.35rem` | Slight rounding — industrial but not pill-shaped |
| Tailwind `max-w-5xl mx-auto px-4` | Centered, responsive horizontal inset |

The section uses `z-index: 2` so it sits above the global `SiteBackground` without clipping.

---

## Layer 2 — Header

**TSX:** `PlaneIcon` SVG flanking `<h2>Studio departures</h2>`.

**CSS:** `.social-proof-board__header` — flex row, centered, bottom border separator.

Typography uses `--font-display` (Hubot Sans), uppercase, wide letter-spacing — matches airport departure signage.

---

## Layer 3 — Column Labels

**CSS:** `.social-proof-board__columns` — CSS grid with three columns:

```
minmax(4.5rem, 0.55fr) | minmax(0, 2.4fr) | minmax(4.5rem, 0.45fr)
     Status                  Message               Origin
```

Center column label is centered; right column is right-aligned. Labels are decorative (`aria-hidden="true"`).

---

## Layer 4 — Data Row

**CSS:** `.social-proof-board__row` — same grid as column labels so cells align.

| Cell | Content | Notes |
|------|---------|-------|
| `--status` | `LIVE` | 4 flaps, left column |
| `--message` | cycling phrase | `aria-live="polite"`, horizontal scroll on tiny screens |
| `--origin` | `MELB` | right-aligned via `justify-content: flex-end` |

---

## Layer 5 — Flap Row

**TSX:** `FlapRow` — `text.split("").map` → one `AnimatedFlapChar` per character.

**CSS:** `.social-proof-board__flap-row` — horizontal flex, small gap between cells. Message row is centered with `min-width: max-content` so long padded strings don’t collapse.

---

## Layer 6 — Individual Flap Cell

**TSX:** `AnimatedFlapChar` — renders one character in a mechanical cell.

**CSS:** `.board-flap` — fixed clamp width/height, tabular nums, white text.

`.board-flap__card` — the physical flap housing:
- Dark gradient background (lighter top, darker bottom)
- Inset shadows for depth
- `overflow: hidden` — clips the sliding character during flip

---

## Layer 7 — Split Line & Hinges

**CSS only** (no extra DOM logic):

| Class | Visual |
|-------|--------|
| `.board-flap__split` | 1px horizontal line at 50% — the hinge seam between top/bottom flaps |
| `.board-flap__hinge--left/right` | Small grey pills at the seam on left/right edges — mechanical pivot detail |

These sit above the animated character (`z-index: 2–3`) so the flip reads as happening behind the frame.

---

## Layer 8 — Flip Animation

**TSX:** `motion/react` (`AnimatePresence` + `motion.span`).

Pattern (mirrored from `MelbourneFlipClock`):

```tsx
<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={value}                    // re-mount when character changes
    initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
    exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
    transition={FLIP_TRANSITION}   // spring on y, ease on opacity/blur
  />
</AnimatePresence>
```

| Constant | Value | Effect |
|----------|-------|--------|
| `CYCLE_MS` | 4200 | Time between phrase changes |
| `FLIP_TRANSITION.y` | spring, 0.42s, bounce 0.12 | Mechanical flip feel |
| `FLIP_TRANSITION.opacity/filter` | 0.14s easeOut | Quick fade during travel |

**Key detail:** `key={value}` on the motion span triggers exit/enter when a character changes. `FlapRow` uses `key={index}` on each `AnimatedFlapChar` so the same slot reuses the component while `value` prop changes — only changed characters flip (spaces included when padding differs).

Spaces render as `\u00A0` (non-breaking space) so empty flap slots still occupy width.

---

## Layer 9 — Cycle Timer

**TSX:** `useEffect` + `setInterval`:

```tsx
setPhraseIndex((current) => (current + 1) % SOCIAL_PROOF_PHRASES.length);
```

- Interval cleared on unmount.
- **Not started** when `prefersReduced` is true — user sees phrase index 0 only, characters swap instantly if they did change.

---

## Layer 10 — Accessibility

| Element | Attribute | Purpose |
|---------|-----------|---------|
| `<section>` | `aria-label="Studio status board"` | Landmark name |
| Column labels | `aria-hidden="true"` | Decorative airport chrome |
| Flap visuals | `aria-hidden="true"` | Screen readers shouldn’t read “T W O - P E R S O N …” |
| Message cell | `aria-live="polite"` + `aria-atomic="true"` | Announces full phrase when it cycles |
| Hidden span | `.sr-only` with `{activePhrase}` | Plain-text phrase for assistive tech |
| `PlaneIcon` | `aria-hidden="true"` | Decorative |

---

## Layer 11 — Responsive (mobile)

**CSS:** `@media (max-width: 767px)` — tighter padding, smaller flaps/fonts, reduced gaps.

**Message overflow:** `.social-proof-board__cell--message` gets `overflow-x: auto` with hidden scrollbar so very long padded strings can scroll horizontally on narrow viewports instead of breaking layout.

---

## Layer 12 — Reduced Motion

1. **Hook:** `useReducedMotion()` — `false` on SSR, real value after mount.
2. **Timer:** interval not created when reduced motion preferred.
3. **Animation:** `initial={false}`, `exit={undefined}`, `transition={{ duration: 0 }}`.
4. **CSS:** `@media (prefers-reduced-motion: reduce)` removes blur filter on `.board-flap__tick`.

---

## Customization Guide

### Change phrases

Edit `lib/socialProofContent.ts`:

```ts
export const SOCIAL_PROOF_PHRASES = [
  "Your new phrase here",
  // ...
] as const;
```

`SOCIAL_PROOF_MESSAGE_WIDTH` recalculates automatically from the longest phrase.

### Change cycle speed

In `SocialProofBoard.tsx`:

```ts
const CYCLE_MS = 4200; // milliseconds
```

### Change static columns

In `SocialProofBoard.tsx`:

```tsx
<FlapRow text="LIVE" />   // status
<FlapRow text="MELB" />   // origin
```

Pad shorter strings with spaces in the `text` prop if you need fixed flap counts, e.g. `"LIVE"`.

### Change header / labels

```tsx
<h2 className="social-proof-board__title">Studio departures</h2>
// column spans: Status | Message | Origin
```

### Tune flap size / colors

Edit `SocialProofBoard.css` — `.board-flap`, `.board-flap__card`, `.board-flap__split`, `.board-flap__hinge`.

### Tune flip feel

Adjust `FLIP_TRANSITION` in `SocialProofBoard.tsx` (compare `DIGIT_TRANSITION` in `MelbourneFlipClock.tsx`).

---

## Dependencies

- `react` — state, effects
- `motion/react` — `AnimatePresence`, `motion`, spring transitions
- Tailwind utility classes on the frame wrapper (`mx-auto`, `max-w-5xl`, `px-4`)
- CSS variables: `--font-display`, `--font-sans` (from `app/globals.css`)

---

## Migration From SocialProofBar

| Before | After |
|--------|-------|
| Marquee of pill badges | Single split-flap row |
| Duplicated phrase array in component | Shared `lib/socialProofContent.ts` |
| CSS animation (`marquee-track`) | Framer Motion per-character flip |
| No a11y live region | `aria-live` + `sr-only` plain text |

Old files kept for reference; safe to delete when no longer needed:

- `components/agency/SocialProofBar.tsx`
- `components/agency/SocialProofBar.css`
