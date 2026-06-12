# Rocket HowItWorksV2 Implementation Brief

Use this brief to recreate the current Aperix `HowItWorksV2` rocket section in another project. Transfer the GLB asset, section component, Three.js rocket renderer, config, text cards, and CSS together.

## What It Is

The section is a scroll-driven "How it works" experience:

- The page scrolls through a tall `300vh` section.
- The viewport sticks in place while the user scrolls.
- A transparent Three.js canvas fills the viewport.
- A `Rocketship.glb` model moves through three poses: start, middle, end.
- Text cards fade in/out at specific scroll progress windows.
- Cards are positioned using percentage coordinates, so placement is tuned in data rather than CSS.
- Reduced-motion users see the rocket at its final state and the text stacked normally.

## Current Source Files

Port or recreate these files:

- `components/agency/HowItWorksV2.tsx`
- `components/agency/RocketTextBlock.tsx`
- `components/animations/Rocket.jsx`
- `components/animations/Rocket.css`
- `lib/RocketConfig.js`
- `lib/howItWorksContent.ts`
- `lib/useReducedMotion.ts`
- `public/Rocketship.glb`

Current page usage:

```tsx
<HeroV2 />
<div className="winding-section winding-section-left">
  <SocialProofBar />
</div>
<HowItWorksV2 />
```

## Dependencies

Current implementation uses:

- `react`
- `next/dynamic`
- `framer-motion`
- `three`
- Tailwind CSS utility classes

If the target project is not Next.js:

- Replace `next/dynamic` with a client-only lazy import.
- Keep `Rocket` client-only because it uses `window`, `ResizeObserver`, and WebGL.
- Replace `@/` imports with the target project's path aliases or relative imports.

## Asset Contract

Current rocket model path:

```js
modelPath: "/Rocketship.glb"
```

Current asset:

```txt
public/Rocketship.glb
```

Transfer requirements:

- Place the GLB in the target app's public/static assets directory.
- Keep the URL path in `DEFAULT_ROCKET_CONFIG.modelPath` in sync.
- The current GLB does not require named materials or texture injection.
- The model is centered with a bounding box before being animated:

```js
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
model.position.sub(center);
```

If the replacement model has a different size or orientation, retune `RocketConfig.js`.

## HowItWorksV2 Structure

Current component shape:

```tsx
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useMotionValue, useScroll } from "framer-motion";
import RocketTextBlock from "@/components/agency/RocketTextBlock";
import { ROCKET_TEXT_BLOCKS } from "@/lib/howItWorksContent";
import { useReducedMotion } from "@/lib/useReducedMotion";

const Rocket = dynamic(() => import("@/components/animations/Rocket"), {
  ssr: false,
});

const SCROLL_HEIGHT_VH = 300;
```

The section uses `useScroll` against the section itself:

```tsx
const { scrollYProgress } = useScroll({
  target: scrollRef,
  offset: ["start start", "end end"],
});
```

Reduced motion swaps animated progress for a static final value:

```tsx
const staticEnd = useMotionValue(1);
const rocketProgress = prefersReduced ? staticEnd : scrollYProgress;
```

Layout:

```tsx
<section
  ref={scrollRef}
  id="how-it-works"
  style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
  className="relative isolate"
  aria-label="How it works"
>
  <div className="sticky top-0 h-screen w-full overflow-hidden">
    <div className="pointer-events-none absolute inset-0 z-0">
      <Rocket scrollProgress={rocketProgress} className="rocket-scene--scroll h-full w-full" />
    </div>

    <div className="pointer-events-none absolute inset-0 z-10">
      {ROCKET_TEXT_BLOCKS.map((block) => (
        <RocketTextBlock
          key={block.id}
          block={block}
          scrollYProgress={scrollYProgress}
          prefersReduced={false}
        />
      ))}
    </div>
  </div>
</section>
```

## Rocket Renderer

`Rocket.jsx` owns:

- Three.js scene creation.
- Transparent WebGL renderer.
- GLB loading via `GLTFLoader`.
- Camera setup.
- Ambient and directional lighting.
- Resize handling.
- Scroll-progress sampling.
- Cleanup.

Core renderer setup:

```js
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
```

Lighting:

```js
scene.add(new THREE.AmbientLight(0xffffff, 0.65));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);
```

The canvas is transparent, so it sits over the existing atmospheric background.

## Rocket Motion Model

The rocket uses three key poses:

- Start pose at progress `0`.
- Middle pose at progress `0.5`.
- End pose at progress `1`.

The interpolation uses cubic easing:

```js
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
```

Position and rotation sample across start/middle/end:

```js
sampleThreePointVector(t, offsetStart, offsetMiddle, offsetEnd, model.position);

model.rotation.set(
  sampleThreePoint(t, config.modelRotationStartX, config.modelRotationMiddleX, config.modelRotationEndX),
  sampleThreePoint(t, config.modelRotationStartY, config.modelRotationMiddleY, config.modelRotationEndY),
  sampleThreePoint(t, config.modelRotationStartZ, config.modelRotationMiddleZ, config.modelRotationEndZ)
);
```

## Current Rocket Config

```js
export const DEFAULT_ROCKET_CONFIG = {
  modelPath: "/Rocketship.glb",

  modelOffsetStartX: 0.8,
  modelOffsetStartY: 1.70,
  modelOffsetStartZ: 0.07,

  modelOffsetMiddleX: -0.93,
  modelOffsetMiddleY: 1.03,
  modelOffsetMiddleZ: -0.2,

  modelOffsetEndX: 0.6,
  modelOffsetEndY: 0.6,
  modelOffsetEndZ: 0.8,

  modelRotationStartX: 0,
  modelRotationStartY: -Math.PI,
  modelRotationStartZ: -Math.PI,

  modelRotationMiddleX: -0.017453292519943295,
  modelRotationMiddleY: 0,
  modelRotationMiddleZ: -Math.PI,

  modelRotationEndX: -0.5410520681182421,
  modelRotationEndY: Math.PI,
  modelRotationEndZ: -Math.PI,

  cameraX: 0,
  cameraY: 0.4,
  cameraZ: 2.8,
  lookAtX: 0,
  lookAtY: 0.35,
  lookAtZ: 0,
};
```

Most likely values to tune in another project:

- `modelPath`
- `modelOffsetStartX/Y/Z`
- `modelOffsetMiddleX/Y/Z`
- `modelOffsetEndX/Y/Z`
- `modelRotationStartX/Y/Z`
- `modelRotationMiddleX/Y/Z`
- `modelRotationEndX/Y/Z`
- `cameraX/Y/Z`
- `lookAtX/Y/Z`

## Text Card Data Model

Text content, timing, and placement live in `lib/howItWorksContent.ts`.

Types:

```ts
export type RocketTextProgress = {
  in: number;
  holdStart: number;
  holdEnd: number;
  out: number;
};

export type RocketTextPlacement = {
  x: number;
  y: number;
  anchor?: RocketTextAnchor;
};
```

Meaning:

- `in`: fade in begins.
- `holdStart`: card is fully visible.
- `holdEnd`: card is still fully visible.
- `out`: fade out completes.
- `x`: horizontal percentage from viewport left.
- `y`: vertical percentage from viewport top.
- `anchor`: which part of the card attaches to the x/y point.

Available anchors:

```ts
type RocketTextAnchor =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "center-left"
  | "center-right";
```

Current cards:

```ts
export const ROCKET_TEXT_BLOCKS = [
  {
    id: "step-1",
    number: "01",
    title: "Start the Conversation",
    body: "You send through a brief and we talk through the business, the goals, and what the site needs to do. You get a direct point of contact, a clear scope, and a straightforward next step before any work begins.",
    progress: { in: 0.02, holdStart: 0.06, holdEnd: 0.28, out: 0.36 },
    placement: { x: 20, y: 20, anchor: "top-left" },
  },
  {
    id: "step-2",
    number: "02",
    title: "Shape the Direction",
    body: "We map out the page structure, content flow, and visual direction with you before the build gets underway. Depending on the project, that might be a Figma concept or a working draft in code so we can test the ideas properly.",
    progress: { in: 0.32, holdStart: 0.4, holdEnd: 0.58, out: 0.66 },
    placement: { x: 76, y: 42, anchor: "center-right" },
  },
  {
    id: "step-3",
    number: "03",
    title: "Build, Refine & Launch",
    body: "Once the direction feels right, we build the site, test it across devices, refine the details, and get it live. You also get handover support so the launch feels smooth and the site is ready to use from day one.",
    progress: { in: 0.58, holdStart: 0.63, holdEnd: 0.94, out: 0.98 },
    placement: { x: 20, y: 72, anchor: "bottom-left" },
  },
];
```

## Text Card Component

`RocketTextBlock` converts progress windows into opacity and y motion:

```tsx
const opacity = useTransform(scrollYProgress, (progress) => {
  if (progress < fadeIn || progress > fadeOut) return 0;
  if (progress < holdStart) return (progress - fadeIn) / (holdStart - fadeIn);
  if (progress <= holdEnd) return 1;
  return (fadeOut - progress) / (fadeOut - holdEnd);
});

const y = useTransform(scrollYProgress, (progress) => {
  if (progress < fadeIn || progress > fadeOut) return 0;
  if (progress < holdStart) {
    const t = (progress - fadeIn) / (holdStart - fadeIn);
    return 20 * (1 - t);
  }
  return 0;
});
```

Card width:

```tsx
const CARD_WIDTH_CLASS = "w-[min(22rem,calc(100vw-3rem))]";
```

Placement anchors:

```tsx
const ANCHOR_TRANSLATE = {
  "top-left": "translate(0, 0)",
  "top-right": "translate(-100%, 0)",
  "bottom-left": "translate(0, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  center: "translate(-50%, -50%)",
  "center-left": "translate(0, -50%)",
  "center-right": "translate(-100%, -50%)",
};
```

Current card styling:

```tsx
<div className="rounded-xl border border-agency-border/60 bg-agency-bg/85 p-5 shadow-[0_12px_40px_rgba(15,17,20,0.08)] backdrop-blur-sm lg:p-6">
  <p className="font-display text-4xl font-bold leading-none text-agency-surface2 lg:text-5xl">
    {block.number}
  </p>
  <h3 className="mt-4 font-display text-xl font-semibold text-agency-ink lg:text-2xl">
    {block.title}
  </h3>
  <p className="mt-3 text-sm leading-relaxed text-agency-muted lg:text-base">
    {block.body}
  </p>
</div>
```

This depends on the site's `agency-*` colour tokens. In another project, either copy the tokens or replace these classes with local equivalents.

## Rocket CSS

Copy `Rocket.css`:

```css
.rocket-scene {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.rocket-scene.h-full {
  min-height: 100%;
}

.rocket-scene--scroll {
  min-height: 100%;
  height: 100%;
}

.rocket-scene__container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  pointer-events: none;
}

.rocket-scene__container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.rocket-scene__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--agency-text-secondary);
  font-size: 0.95rem;
  pointer-events: none;
}

.rocket-scene__overlay--error {
  color: #ff8a8a;
}
```

## Reduced Motion

Reduced motion behavior:

- Rocket progress becomes a static `1`, so the rocket renders at its end pose.
- Text cards render in normal document flow instead of absolute scroll-driven placement.
- Text cards remain visible.

Reduced-motion layout:

```tsx
{prefersReduced ? (
  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center gap-6 px-6 py-24 lg:px-16">
    {ROCKET_TEXT_BLOCKS.map((block) => (
      <RocketTextBlock
        key={block.id}
        block={block}
        scrollYProgress={scrollYProgress}
        prefersReduced
      />
    ))}
  </div>
) : (
  ...
)}
```

## Implementation Checklist

1. Install `three` and `framer-motion`.
2. Add `Rocketship.glb` to the target project's public/static directory.
3. Copy `lib/RocketConfig.js`.
4. Update `modelPath` if the public URL is different.
5. Copy `components/animations/Rocket.jsx`.
6. Copy `components/animations/Rocket.css`.
7. Copy `lib/howItWorksContent.ts`.
8. Copy `components/agency/RocketTextBlock.tsx`.
9. Copy `components/agency/HowItWorksV2.tsx`.
10. Replace `next/dynamic`, `@/` aliases, or Tailwind classes as needed for the target project.
11. Mount `<HowItWorksV2 />` after the hero/social-proof area.
12. Test desktop and mobile viewport sizes.
13. Test reduced motion.
14. Open the browser console and confirm the GLB loads without `[Rocket] Failed to load model`.

## Tuning Workflow

If the rocket appears too small, too large, or off-screen:

1. Adjust `cameraZ` first.
2. Adjust `cameraY` and `lookAtY` next.
3. Adjust `modelOffsetStart*`, `modelOffsetMiddle*`, and `modelOffsetEnd*`.
4. Adjust rotations only after the rocket is in the right area of the viewport.

If text overlaps the rocket:

1. Adjust `placement.x` and `placement.y` in `ROCKET_TEXT_BLOCKS`.
2. Change the `anchor`.
3. Adjust each card's progress window so the text appears at a better part of the rocket path.
4. Reduce `CARD_WIDTH_CLASS` if cards feel too wide.

If the section scrolls too quickly or slowly:

```tsx
const SCROLL_HEIGHT_VH = 300;
```

- Increase to `350` or `400` for a slower, longer sequence.
- Decrease to `220` or `250` for a faster sequence.

## Common Problems

If the rocket does not render:

- Confirm the GLB is available at `modelPath`.
- Confirm `three` is installed.
- Confirm `Rocket` only runs on the client.
- Check the console for `[Rocket] Failed to load model`.

If the canvas is blank but no error appears:

- Confirm the container has a real height.
- Confirm `.rocket-scene--scroll` and `.rocket-scene__container` CSS is loaded.
- Confirm the camera is pointed at the model with `lookAtX/Y/Z`.

If the section blocks clicks:

- The rocket canvas and text wrapper intentionally use `pointer-events-none`.
- If adding buttons inside cards, remove `pointer-events-none` from the relevant wrapper or add `pointer-events-auto` to the button/card.

If the card layout looks wrong in another project:

- Copy or replace these tokens: `agency-bg`, `agency-border`, `agency-ink`, `agency-muted`, `agency-surface2`.
- Keep the fixed card width pattern: `w-[min(22rem,calc(100vw-3rem))]`.

## Customization Points

For the target project, update:

- GLB asset path.
- Rocket start/middle/end pose.
- Camera position and look-at target.
- Step titles.
- Step body copy.
- Step timing windows.
- Card placements.
- Card styling tokens.
- Section placement on the page.
