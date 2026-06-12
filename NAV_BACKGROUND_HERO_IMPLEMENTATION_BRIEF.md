# Nav, Background, And Hero Implementation Brief

Use this brief to recreate the current Aperix top-of-page system in another project: the fixed glass nav, warm atmospheric background, and scroll-driven 3D hero.

## What To Recreate

The system has three connected parts:

- `SiteAtmosphere`: a fixed, full-window background with warm gradients, blurred colour fields, frost, sheen, and subtle noise.
- `AgencyNavV2`: a fixed navigation bar with logo left, centered glass nav pill, contact CTA right, and mobile slide-over menu.
- `HeroV2`: a sticky scroll hero that drives a Three.js GLB/video animation, then reveals compact text on the left.

These parts are designed to work together. The nav and hero use the same CSS tokens as the background, so they feel like one interface rather than separate sections.

## Current Source Files

Port or recreate these:

- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `components/agency/AgencyNavV2.tsx`
- `components/agency/SiteAtmosphere.tsx`
- `components/agency/HeroV2.tsx`
- `components/animations/HeroCanvas.jsx`
- `components/animations/HeroCanvas.css`
- `lib/heroCanvasConfig.js`
- `lib/heroVideo.ts`
- `lib/useReducedMotion.ts`

Current page order:

```tsx
<AgencyNavV2 />
<HeroV2 />
```

Current app root order:

```tsx
<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
<SiteAtmosphere />
{children}
```

## Dependencies

Current implementation uses:

- `next`
- `react`
- `framer-motion`
- `motion`
- `three`
- Tailwind CSS v4

If the new project is not Next.js:

- Replace `next/link` with the target router link.
- Replace `next/image` with an optimized image or normal `img`.
- Replace `next/dynamic` with a client-only lazy import for `HeroCanvas`.
- Move the theme bootstrap script into the app shell or document head.

## Design Tokens

The visual system is driven by CSS custom properties. Keep this structure even if the colours change.

```css
:root {
  --agency-bg: #f3f4f6;
  --agency-surface: #ffffff;
  --agency-surface2: #ffffff;
  --agency-border: #e5e7eb;
  --agency-border-dark: #a3a3a3;
  --agency-text: #171717;
  --agency-text-secondary: #404040;
  --agency-muted: #737373;
  --agency-accent: #0ea5e9;
  --agency-accent-dark: #0284c7;
  --agency-accent2: #84cc16;
  --agency-accent3: #38bdf8;
  --agency-ink: #171717;

  --agency-atmosphere-red: #d08a7a;
  --agency-atmosphere-blue: #c8d8e4;
  --agency-atmosphere-peach: #ecd4bc;
  --agency-atmosphere-ghost: #faf5ef;
  --agency-atmosphere-base: #fffaf6;
  --agency-glass-frost: rgba(255, 248, 242, 0.3);
  --agency-glass-frost-blur: 96px;

  --agency-glass-border: rgba(255, 255, 255, 0.72);
  --agency-glass-bg: rgba(255, 255, 255, 0.6);
  --agency-glass-soft-border: rgba(23, 23, 23, 0.08);
  --agency-glass-soft-bg: rgba(255, 255, 255, 0.88);
  --agency-glass-shadow: 0 8px 32px rgba(23, 23, 23, 0.08), 0 1.5px 0 rgba(255, 255, 255, 0.8) inset;
}
```

Dark mode overrides the same variables:

```css
html[data-theme="dark"] {
  color-scheme: dark;
  --agency-bg: #171717;
  --agency-surface: #262626;
  --agency-surface2: #404040;
  --agency-border: #525252;
  --agency-text: #ffffff;
  --agency-muted: #a3a3a3;
  --agency-accent: #38bdf8;
  --agency-accent-dark: #0ea5e9;
  --agency-accent2: #a3e635;
  --agency-accent3: #7dd3fc;
  --agency-ink: #ffffff;

  --agency-atmosphere-red: #a87868;
  --agency-atmosphere-blue: #7a98a8;
  --agency-atmosphere-peach: #a89078;
  --agency-atmosphere-ghost: #221e1c;
  --agency-atmosphere-base: #1a1614;
  --agency-glass-frost: rgba(255, 255, 255, 0.08);
  --agency-glass-frost-blur: 72px;

  --agency-glass-border: rgba(255, 255, 255, 0.12);
  --agency-glass-bg: rgba(38, 38, 38, 0.72);
  --agency-glass-soft-border: rgba(255, 255, 255, 0.08);
  --agency-glass-soft-bg: rgba(23, 23, 23, 0.68);
  --agency-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.38), 0 1.5px 0 rgba(255, 255, 255, 0.08) inset;
}
```

Tailwind v4 mapping:

```css
@theme inline {
  --color-agency-bg: var(--agency-bg);
  --color-agency-surface: var(--agency-surface);
  --color-agency-surface2: var(--agency-surface2);
  --color-agency-border: var(--agency-border);
  --color-agency-border-dark: var(--agency-border-dark);
  --color-agency-text: var(--agency-text);
  --color-agency-muted: var(--agency-muted);
  --color-agency-accent: var(--agency-accent);
  --color-agency-accent-dark: var(--agency-accent-dark);
  --color-agency-accent2: var(--agency-accent2);
  --color-agency-accent3: var(--agency-accent3);
  --color-agency-ink: var(--agency-ink);
}
```

## Background System

Component:

```tsx
export default function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="site-atmosphere">
      <div className="site-atmosphere__gradient" />
      <div className="site-atmosphere__blobs">
        <div className="site-atmosphere__blob site-atmosphere__blob--coral" />
        <div className="site-atmosphere__blob site-atmosphere__blob--peach" />
        <div className="site-atmosphere__blob site-atmosphere__blob--sky" />
        <div className="site-atmosphere__blob site-atmosphere__blob--rose" />
      </div>
      <div className="site-atmosphere__frost" />
      <div className="site-atmosphere__sheen" />
    </div>
  );
}
```

Core CSS:

```css
body {
  background-color: var(--agency-atmosphere-base);
  color: var(--agency-ink);
}

.site-atmosphere {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  background: var(--agency-atmosphere-base);
}

.site-atmosphere__gradient {
  position: absolute;
  inset: 0;
  background: var(--agency-atmosphere-gradient);
  background-attachment: fixed;
}

.site-atmosphere__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
}

.site-atmosphere__frost {
  position: absolute;
  inset: 0;
  background: var(--agency-glass-frost);
  backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.55) brightness(1.03);
  -webkit-backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.55) brightness(1.03);
}
```

Implementation note: keep page sections mostly transparent or glassy. Do not cover this background with solid full-page blocks unless intentionally creating contrast.

## Nav Bar

The nav structure:

- Fixed header at top.
- Three-column layout: logo, centered nav pill, contact button.
- Logo sits outside the glass pill.
- Nav links sit inside a frosted rounded pill.
- Contact CTA sits outside the pill.
- On mobile, desktop links hide and a circular menu button opens a full-screen slide-over.
- When scrolled, `agency-header--scrolled` increases the header underlay/frost.

Important component constants:

```tsx
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/our-work" },
];
```

Root nav shape:

```tsx
<header className="agency-header fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
  <div aria-hidden="true" className="agency-header-underlay" />
  <div className="relative z-10 mx-auto grid h-18 max-w-6xl grid-cols-[1fr_auto_1fr] items-center">
    <Logo />
    <CenteredGlassNav />
    <ContactAndMobileMenu />
  </div>
</header>
```

Nav glass CSS:

```css
.agency-glass-pill {
  border: 1px solid var(--agency-glass-border);
  background: var(--agency-glass-bg);
  box-shadow: var(--agency-glass-shadow);
  backdrop-filter: blur(40px) saturate(1.8) brightness(1.04);
  -webkit-backdrop-filter: blur(40px) saturate(1.8) brightness(1.04);
}

.agency-glass-pill--soft {
  border-color: var(--agency-glass-soft-border);
  background: var(--agency-glass-soft-bg);
}
```

Header underlay CSS:

```css
.agency-header {
  isolation: isolate;
}

.agency-header-underlay {
  position: absolute;
  inset: -1.5rem 0 auto;
  z-index: 0;
  height: 12rem;
  opacity: 0.38;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--agency-bg) 92%, white 8%) 0%,
    color-mix(in oklab, var(--agency-bg) 72%, transparent 28%) 48%,
    transparent 100%
  );
  backdrop-filter: blur(28px) saturate(1.5);
  -webkit-backdrop-filter: blur(28px) saturate(1.5);
  mask-image: linear-gradient(180deg, black 0%, black 66%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, black 0%, black 66%, transparent 100%);
}

.agency-header--scrolled .agency-header-underlay {
  opacity: 1;
  backdrop-filter: blur(44px) saturate(1.8);
  -webkit-backdrop-filter: blur(44px) saturate(1.8);
}
```

Nav link hover effect:

```css
.agency-nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -0.55rem;
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 999px;
  background: currentColor;
  opacity: 0;
  transform: translate(-50%, 0.35rem) scale(0.35);
  transition: opacity 180ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.agency-nav-link:hover::after,
.agency-nav-link:focus-visible::after {
  opacity: 0.65;
  transform: translate(-50%, 0) scale(1);
}
```

Wiggle text classes:

```css
.agency-wiggle-word {
  display: inline-flex;
  white-space: nowrap;
  perspective: 420px;
}

.agency-wiggle-letter {
  display: inline-block;
  transform-origin: 50% 70%;
  will-change: transform;
}

.group:hover .agency-wiggle-letter,
.group:focus-visible .agency-wiggle-letter {
  animation: agency-letter-wiggle 780ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--wiggle-index) * 38ms);
}
```

Mobile menu tokens:

```css
:root {
  --agency-mobile-overlay: rgba(23, 23, 23, 0.72);
  --agency-mobile-panel-border: rgba(255, 255, 255, 0.16);
  --agency-mobile-panel-bg: rgba(38, 38, 38, 0.92);
}

.agency-mobile-overlay {
  background: var(--agency-mobile-overlay);
}

.agency-mobile-panel {
  border: 1px solid var(--agency-mobile-panel-border);
  background: var(--agency-mobile-panel-bg);
}
```

## Hero Component

The hero is not a standard static hero. It is a scroll scene:

- Outer section height is `300vh`.
- Inner hero is `position: sticky; top: 0; height: 100vh`.
- Hidden video is mounted off-screen and passed to Three.js as a `VideoTexture`.
- `HeroCanvas` renders a GLB model full-screen.
- Scroll progress drives the camera from close-up video-screen view to a wider 3D view.
- Text fades in halfway through the zoom.
- Final text is constrained to the left side so it does not cover the 3D object.

Key constants:

```tsx
const HEADLINE_WORDS = ["Custom Websites and", "Software Solutions", "built for", "Melbourne businesses."];
const SECONDARY_HEADLINE_WORDS = ["Hand coded,", "Fast turnaround,", "Tailored solutions."];
const SCROLL_HEIGHT_VH = 300;
```

Scroll mapping:

```tsx
const { scrollYProgress } = useScroll({
  target: scrollRef,
  offset: ["start start", "end end"],
});

const zoomProgress = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
const textOpacity = useTransform(zoomProgress, [0.45, 0.55], [0, 1]);
const textY = useTransform(zoomProgress, [0.45, 0.55], [48, 0]);
```

Current final text layout:

```tsx
<div className="relative z-10 mx-auto grid h-full w-full max-w-450 items-end pb-2 sm:pb-6 lg:grid-cols-[minmax(0,0.46fr)_minmax(360px,0.54fr)] lg:items-center lg:pb-0">
  <motion.div className="min-w-0 max-w-xl lg:col-start-1">
    <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-agency-muted sm:text-xs">
      Melbourne Web Design and Software Studio
    </p>
    <p className="font-display font-bold leading-[0.94] tracking-tight">
      <span className="block min-h-[4.1lh]">
        <span className="block whitespace-pre-line text-[clamp(2.15rem,6vw,4.8rem)] text-agency-ink lg:text-[clamp(2.35rem,4.1vw,4.4rem)]">
          {visibleHeadlineText}
        </span>
      </span>
    </p>
  </motion.div>
</div>
```

Important layout choice: avoid large fixed headline reserves like `h-[20lh]`; the current version uses `min-h-[4.1lh]` so the copy no longer blankets the 3D scene.

## Hero Asset Contract

Current assets:

```js
const MODEL_PATH = "/iFruit Vintage Computer.glb";
const SCREEN_MATERIAL_NAMES = ["mat16"];
```

```ts
export const HERO_VIDEO_SRC = "/a.mp4";
```

For a new project:

- Replace the GLB path.
- Replace the MP4 path.
- Identify the material name in the GLB that should receive the video texture.
- Update `SCREEN_MATERIAL_NAMES`.

The GLB must have a stable named material for the target screen/surface. The current code finds that material, hides it, measures its frame, then attaches a video plane in the same place.

Keep the video element off-screen with real dimensions:

```ts
export const HERO_VIDEO_OFFSCREEN_CLASS =
  "pointer-events-none fixed left-[-9999px] top-0 h-[360px] w-[640px] opacity-0";
```

Do not use `display: none`, `width: 0`, or `height: 0`; browsers may skip decoding and the WebGL texture can stay black.

## Shared Buttons

```css
.agency-button-primary {
  border: 1px solid color-mix(in oklab, var(--agency-accent-dark) 55%, transparent 45%);
  background: linear-gradient(135deg, var(--agency-accent), var(--agency-accent-dark));
  color: #ffffff;
  box-shadow:
    0 14px 32px color-mix(in oklab, var(--agency-accent) 28%, transparent 72%),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.agency-button-secondary {
  border: 1px solid color-mix(in oklab, var(--agency-border-dark) 70%, transparent 30%);
  background: color-mix(in oklab, var(--agency-surface) 88%, transparent 12%);
  color: var(--agency-ink);
}
```

## Theme Bootstrap

Run before paint:

```tsx
const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("aperix-theme");
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const theme = stored === "dark" || stored === "light" ? stored : system;
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;
```

For another project, rename the storage key from `aperix-theme` to a project-specific key.

## Reduced Motion

Use `useReducedMotion` across all three areas:

- Nav logo rotation stops.
- Mobile menu animation duration becomes `0`.
- Hero camera uses the final state.
- Hero headline becomes static.
- Global CSS reduces animation and transition durations.

## Implementation Checklist

1. Add global CSS tokens and dark-mode overrides.
2. Add Tailwind mappings or equivalent design-system tokens.
3. Add `SiteAtmosphere` and mount it once at the app root.
4. Add the theme bootstrap script before app content.
5. Add `useReducedMotion`.
6. Port `AgencyNavV2`, replacing logo, links, and CTA copy.
7. Copy nav CSS helpers: glass pill, header underlay, nav link dot, wiggle text, mobile overlay.
8. Port `HeroV2`.
9. Port `HeroCanvas`, `HeroCanvas.css`, `heroCanvasConfig`, and `heroVideo`.
10. Add the new GLB and MP4 assets.
11. Update `MODEL_PATH`, `SCREEN_MATERIAL_NAMES`, and `HERO_VIDEO_SRC`.
12. Mount `<AgencyNavV2 />` directly before `<HeroV2 />`.
13. Test desktop, mobile, dark mode, and reduced motion.
14. Open browser console and confirm `HeroCanvas` logs `Screen plane attached`.

## Things To Customize In The New Project

- Brand name and logo.
- Nav links.
- CTA labels and destinations.
- Storage key for theme.
- Palette token names if the target design system is not `agency-*`.
- Hero headline and secondary headline.
- Trust pills.
- GLB model.
- MP4 video.
- GLB material name for the video surface.

## Common Problems

If the background is not visible:

- Confirm `SiteAtmosphere` is mounted at the root.
- Confirm page sections are not using opaque full-screen backgrounds.
- Confirm `.site-atmosphere` has `position: fixed` and `z-index: -1`.

If the nav glass looks flat:

- Confirm `--agency-glass-bg`, `--agency-glass-border`, and `--agency-glass-shadow` exist.
- Confirm `backdrop-filter` is not being removed by the target CSS setup.

If the hero text covers the 3D object:

- Keep the text column constrained with `max-w-xl`.
- Keep desktop grid columns so the right side remains clear.
- Avoid large fixed heights on the headline wrapper.

If the hero video is black:

- Confirm the hidden video is not `display: none`.
- Confirm the MP4 can play directly in the browser.
- Confirm the video is muted and `playsInline`.
- Confirm `SCREEN_MATERIAL_NAMES` matches the GLB material.
