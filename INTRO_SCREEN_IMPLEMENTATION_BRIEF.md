# Intro Screen Implementation Brief

Use this brief to recreate the current Aperix intro animation in another project.

## What It Is

The intro is a full-screen loading/brand reveal that plays once per session:

- A server-rendered dark cover blocks the page before hydration.
- A client-side intro overlay mounts above everything.
- The intro starts on a light grey base.
- A near-black panel slides left-to-right across the screen.
- A glowing geometric Aperix SVG logo draws in.
- The APERIX wordmark appears in white with blue/lime glow.
- A segmented progress bar fills while the logo animation runs.
- A subtle scanline overlay adds texture.
- The overlay fades out and removes the pre-hydration cover.

## Current Source Files

Port or recreate:

- `components/animations/IntroScreen.tsx`
- The intro cover block in `app/layout.tsx`
- Optional: `components/animations/PageReveal.tsx` if the new project should keep page content hidden until the intro finishes.

Current root layout order:

```tsx
<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
<div id="aperix-intro-cover" aria-hidden="true" style={...} />
<IntroScreen />
<SiteAtmosphere />
<PageReveal>{children}</PageReveal>
```

## Dependencies

The current intro uses:

- `react`
- `framer-motion`

Important imports:

```tsx
import { useAnimate, AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
```

## Colour Palette

### Pre-Hydration Cover

This cover is rendered in the server layout so users never see unstyled page content before the intro mounts.

```tsx
background: "linear-gradient(135deg,#07070f 0%,#0a0a18 100%)"
```

Colours:

- Deep navy black: `#07070f`
- Deep blue-black: `#0a0a18`

### Intro Base

The mounted intro starts on a light grey base:

```tsx
background: "#F3F4F6"
```

Colour:

- Soft grey: `#F3F4F6`

### Dark Slide Overlay

A near-black panel slides over the light base:

```tsx
background: "#171717"
```

Colour:

- Near black: `#171717`

### Scanline Overlay

Subtle scanlines sit over the intro:

```tsx
background:
  "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)"
```

Colour:

- Black at 6% opacity: `rgba(0,0,0,0.06)`

### Logo Gradient

The inner logo fill uses a vertical blue gradient:

```tsx
<linearGradient id="ix-grad" x1="384" y1="106" x2="384" y2="730">
  <stop offset="0" stopColor="#BAE6FD" />
  <stop offset="1" stopColor="#0EA5E9" />
</linearGradient>
```

Colours:

- Light sky: `#BAE6FD`
- Sky blue: `#0EA5E9`

### Logo Strokes

Outer stroke:

```tsx
stroke="#0EA5E9"
```

Inner stroke:

```tsx
stroke="rgba(255,255,255,0.9)"
```

Grid lines:

```tsx
stroke="#FFFFFF"
```

Colours:

- Sky blue: `#0EA5E9`
- White: `#FFFFFF`
- White at 90% opacity: `rgba(255,255,255,0.9)`

### Logo Glow

The SVG logo has a blue drop shadow:

```tsx
filter: "drop-shadow(0 0 18px rgba(14,165,233,0.55))"
```

Colour:

- Sky blue glow: `rgba(14,165,233,0.55)`

### Wordmark

The APERIX text is white with blue, white, and lime glow offsets:

```tsx
color: "#FFFFFF"
textShadow:
  "0 0 32px rgba(14,165,233,0.55), 2px 0 0 rgba(255,255,255,0.35), -2px 0 0 rgba(132,204,22,0.4)"
```

Colours:

- White: `#FFFFFF`
- Blue glow: `rgba(14,165,233,0.55)`
- White offset: `rgba(255,255,255,0.35)`
- Lime offset: `rgba(132,204,22,0.4)`

### Progress Bar

Outer bar:

```tsx
border: "1.5px solid rgba(255,255,255,0.4)"
background: "rgba(23,23,23,0.35)"
```

Filling stripes:

```tsx
background:
  "repeating-linear-gradient(90deg,rgba(255,255,255,0.92) 0px,rgba(255,255,255,0.92) 10px,transparent 10px,transparent 14px)"
```

Colours:

- White border: `rgba(255,255,255,0.4)`
- Near-black glass: `rgba(23,23,23,0.35)`
- White stripes: `rgba(255,255,255,0.92)`

### Copyright Text

```tsx
color: "rgba(243,244,246,0.45)"
```

Colour:

- Soft grey at 45% opacity: `rgba(243,244,246,0.45)`

## Timing

Current constants:

```tsx
const TOTAL_MS = 3800;
const HOLD_MS = 200;
const EXIT_MS = 300;
export const INTRO_FULL_MS = HOLD_MS + TOTAL_MS + EXIT_MS;
```

Meaning:

- `HOLD_MS`: first pause before the logo starts.
- `TOTAL_MS`: main animation duration.
- `EXIT_MS`: fade-out duration.
- `INTRO_FULL_MS`: total time consumers can use as a failsafe.

Current full intro duration:

```txt
200ms + 3800ms + 300ms = 4300ms
```

## Animation Sequence

After the initial `200ms` hold:

```tsx
animate("#ix-outer", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });
animate("#ix-inner-fill", { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.45 });
animate("#ix-inner-stroke", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.55 });
animate("#ix-line-v",  { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.85 });
animate("#ix-line-d1", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.92 });
animate("#ix-line-d2", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.99 });
animate("#ix-line-h",  { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 1.06 });
```

The dark slide and progress bar are CSS animations synced to `TOTAL_MS`.

```css
@keyframes ixSlide {
  0%   { transform: scaleX(0); }
  15%  { transform: scaleX(0.05); }
  60%  { transform: scaleX(0.65); }
  100% { transform: scaleX(1); }
}

@keyframes ixBarGrow {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
```

CSS animation usage:

```tsx
animation: `ixSlide ${totalSec}s cubic-bezier(0.55,0,0.45,1) forwards`
animation: `ixBarGrow ${totalSec}s cubic-bezier(0.4,0,0.6,1) 0.2s forwards`
```

## Layout

Intro overlay:

```tsx
style={{
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background: "#F3F4F6",
}}
```

Pre-hydration cover:

```tsx
<div
  id="aperix-intro-cover"
  aria-hidden="true"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9998,
    background: "linear-gradient(135deg,#07070f 0%,#0a0a18 100%)",
    pointerEvents: "all",
  }}
/>
```

Content scale:

```tsx
className="[--ix-scale:0.72] sm:[--ix-scale:1]"
style={{
  transform: "scale(var(--ix-scale,1))",
  transformOrigin: "center center",
}}
```

This makes the logo/wordmark smaller on mobile and full-size on larger screens.

## Typography

Wordmark:

```tsx
fontFamily: "var(--font-syne), sans-serif"
fontSize: "clamp(2.6rem, 6vw, 3.8rem)"
fontWeight: 800
letterSpacing: "0.22em"
lineHeight: 1
```

Copyright:

```tsx
fontFamily: "var(--font-jetbrains-mono), monospace"
fontSize: "clamp(0.55rem,1.1vw,0.68rem)"
letterSpacing: "0.12em"
```

If the new project does not use Syne or JetBrains Mono, replace with the target brand display and mono fonts.

## Logo Structure

The current logo is inline SVG:

- ViewBox: `0 0 768 836`
- Display size: `96px` wide
- Height derived from source ratio: `Math.round(96 * (836 / 768))`
- Animated pieces are selected by ID:
  - `#ix-outer`
  - `#ix-inner-fill`
  - `#ix-inner-stroke`
  - `#ix-line-v`
  - `#ix-line-d1`
  - `#ix-line-d2`
  - `#ix-line-h`

If replacing the logo:

- Keep separate SVG paths for each animated part.
- Give each path stable IDs.
- Set path elements that should draw to `opacity={0}` and animate `pathLength`.
- Set fill elements to `opacity={0}` and animate opacity.

## One-Time Play Behaviour

The current module-level state prevents the intro from replaying during the same app session:

```tsx
export let introHasPlayed = false;
let doneSubscribers: Array<() => void> = [];
```

On completion:

```tsx
introHasPlayed = true;
doneSubscribers.forEach((fn) => fn());
doneSubscribers = [];
```

Dev routes skip the intro:

```tsx
if (window.location.pathname.startsWith("/dev")) {
  introHasPlayed = true;
  releaseIntroGate();
  doneSubscribers.forEach((cb) => cb());
  doneSubscribers = [];
  return;
}
```

For another project, change or remove the `/dev` skip condition.

## Gate Release

The intro must always release the cover, even if an animation fails.

```tsx
function releaseIntroGate() {
  const cover = document.getElementById("aperix-intro-cover");
  if (cover) {
    cover.style.transition = "opacity 0.25s ease";
    cover.style.opacity = "0";
    setTimeout(() => cover.remove(), 280);
  }
  document.documentElement.removeAttribute("data-aperix-intro");
  document.getElementById("aperix-intro-gate")?.remove();
}
```

Keep the `try/finally` around the animation sequence so the page is never permanently blocked.

## Implementation Checklist

1. Install `framer-motion`.
2. Copy or recreate `IntroScreen.tsx`.
3. Add the pre-hydration `aperix-intro-cover` div in the root layout.
4. Mount `<IntroScreen />` near the top of the app root.
5. Confirm z-index values are above the rest of the app.
6. Replace APERIX wordmark text if needed.
7. Replace the SVG logo if needed, preserving animated IDs.
8. Update copyright text.
9. Update colours to match the target brand.
10. Keep `releaseIntroGate()` and the failsafe behaviour.
11. Test first page load, client-side navigation, mobile, and dev routes.

## Quick Colour Reference

```txt
Pre-cover dark 1:       #07070f
Pre-cover dark 2:       #0a0a18
Intro light base:       #F3F4F6
Dark slide:             #171717
Logo blue:              #0EA5E9
Logo light blue:        #BAE6FD
Logo white:             #FFFFFF
Brand lime glow:        rgba(132,204,22,0.4)
Blue glow:              rgba(14,165,233,0.55)
Scanline black:         rgba(0,0,0,0.06)
Progress border:        rgba(255,255,255,0.4)
Progress dark fill:     rgba(23,23,23,0.35)
Progress stripe:        rgba(255,255,255,0.92)
Copyright grey:         rgba(243,244,246,0.45)
```
