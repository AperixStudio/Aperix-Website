# HeroV2 Implementation Brief

Use this brief to recreate the current Aperix `HeroV2` experience in another project with different assets.

## Goal

Build a first-screen hero that starts as an immersive scroll experience:

- A sticky full-viewport section spans roughly `300vh`.
- A hidden MP4 video is used as a Three.js `VideoTexture`.
- A GLB model is rendered full-screen behind the copy.
- The video texture is attached to a specific screen material inside the GLB model.
- Scroll progress drives a camera move from a tight screen view into an angled 3D product/model view.
- Hero copy fades in during the zoom.
- The headline uses a typed/deleted text loop unless the user prefers reduced motion.
- Reduced-motion users get the final camera state and static text.

## Current Source Files

Port these files or recreate their behavior:

- `components/agency/HeroV2.tsx`
- `components/animations/HeroCanvas.jsx`
- `components/animations/HeroCanvas.css`
- `lib/heroCanvasConfig.js`
- `lib/heroVideo.ts`
- `lib/useReducedMotion.ts`

Current page usage:

- `app/page.tsx` imports `HeroV2` and places it directly below the nav.
- `HeroV2` is a client component.
- `HeroCanvas` is dynamically imported with `ssr: false`.

## Required Dependencies

The current implementation depends on:

- `next`
- `react`
- `framer-motion`
- `three`
- Tailwind CSS, or equivalent utility classes/CSS

If the target project is not Next.js, keep the React/Three/Framer Motion logic but replace:

- `next/dynamic` with a client-only/lazy import pattern.
- `next/link` with the router/link component used by that project.
- Absolute `@/` imports with target-project aliases or relative imports.

## Asset Contract

The assets can change, but the integration contract must be preserved.

### GLB Model

Current model:

```js
const MODEL_PATH = "/iFruit Vintage Computer.glb";
```

Replacement requirements:

- Place the new `.glb` in `public/` or equivalent static assets directory.
- Update `MODEL_PATH` in `HeroCanvas.jsx`.
- Identify the material name on the model surface that should receive the video.
- Update:

```js
const SCREEN_MATERIAL_NAMES = ["mat16"];
```

Important: the current code finds the first mesh with a material named `mat16`, hides that material, measures its frame, then attaches a new `PlaneGeometry` with the video texture. If the new GLB does not have a stable named material for the target screen/surface, the video plane will not attach.

### Video

Current video:

```ts
export const HERO_VIDEO_SRC = "badreception.mp4";
```

Replacement requirements:

- Use an MP4 that browsers can autoplay muted.
- Keep the hidden video mounted in the DOM with real dimensions.
- Do not hide it as `display: none`, width `0`, or height `0`; browsers may skip decoding and the Three.js texture can stay black.

Current hidden video class:

```ts
export const HERO_VIDEO_OFFSCREEN_CLASS =
  "pointer-events-none fixed left-[-9999px] top-0 h-[360px] w-[640px] opacity-0";
```

## HeroV2 Behavior

`HeroV2.tsx` owns:

- The sticky scroll section.
- The hidden video element.
- The scroll progress via `useScroll`.
- The reduced-motion fallback.
- The headline typing loop.
- The text fade-in timing.
- CTA buttons and trust pills.

Key constants to customize:

```ts
const HEADLINE_WORDS = ["Custom Websites and", "Software Solutions", "built for", "Melbourne businesses."];
const SECONDARY_HEADLINE_WORDS = ["Hand coded,", "Fast turnaround,", "Tailored solutions."];
const TRUST_PILLS = [
  "Custom code, no templates",
  "Melbourne-based",
  "Fast turnaround",
  "Hosted & maintained",
];
const SCROLL_HEIGHT_VH = 300;
```

Important scroll mapping:

```ts
const zoomProgress = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
const textOpacity = useTransform(zoomProgress, [0.45, 0.55], [0, 1]);
const textY = useTransform(zoomProgress, [0.45, 0.55], [48, 0]);
```

This means:

- The camera animation completes before the end of the sticky section.
- The text appears halfway through the 3D zoom.
- The remaining scroll gives the user time to read before the next section arrives.

## HeroCanvas Behavior

`HeroCanvas.jsx` owns:

- Three.js scene setup.
- GLB loading via `GLTFLoader`.
- Video texture creation.
- Screen material detection.
- Screen-plane measurement.
- Camera orbit interpolation.
- Resize handling.
- Cleanup/disposal.

The component receives:

```tsx
<HeroCanvas
  scrollProgress={cameraProgress}
  showIntroLabel={!prefersReduced}
  videoElement={heroVideo}
  className="hero-canvas--scroll"
/>
```

The `videoElement` prop is required because the canvas uses the same mounted DOM video as the source for `THREE.VideoTexture`.

## Camera And Model Tuning

Tune these values in `lib/heroCanvasConfig.js` for each new GLB:

```js
export const DEFAULT_HERO_CANVAS_CONFIG = {
  screenPlaneOffset: 0.001,
  screenPlaneScaleWidth: 1.02,
  screenPlaneScaleHeight: 0.85,
  screenPlanePolygonOffset: -3,

  introLabelGap: -0.069,
  introLabelOffsetX: 0,
  introLabelOffsetY: 0,
  introLabelOffsetNormal: 0.01,
  introLabelWidthRatio: 0.95,
  introLabelHeightRatio: 0.22,
  introLabelTextFill: 0.92,

  screenFillMargin: 1.08,
  cameraStartBackoff: 1,

  modelOffsetStartX: 0,
  modelOffsetStartY: -0.01,
  modelOffsetStartZ: -0.13,
  modelOffsetEndX: 0.5,
  modelOffsetEndY: 0.1,
  modelOffsetEndZ: 0,

  modelRotationX: 0,
  modelRotationY: Math.PI,
  modelRotationZ: 0,

  cameraTargetYRatio: 0.1,
  cameraDistanceX: 2,
  cameraDistanceY: 0.8,
  cameraDistanceZ: 2.2,
  cameraStartLookAtYRatio: 0.22,
  cameraStartZRatio: 0.09,
  cameraOrbitPivotYRatio: 0,
  cameraStartAzimuth: 0,
  cameraStartElevation: 0,
};
```

Most likely values to retune for a new asset:

- `MODEL_PATH`
- `SCREEN_MATERIAL_NAMES`
- `screenPlaneScaleWidth`
- `screenPlaneScaleHeight`
- `screenPlaneOffset`
- `modelRotationY`
- `modelOffsetStartX/Y/Z`
- `modelOffsetEndX/Y/Z`
- `cameraDistanceX/Y/Z`
- `cameraTargetYRatio`
- `cameraOrbitPivotYRatio`

## Styling Requirements

The current component uses project-specific Tailwind tokens:

- `text-agency-ink`
- `text-agency-muted`
- `bg-agency-surface`
- `border-agency-border`
- `agency-button-primary`
- `agency-button-secondary`
- `agency-type-caret`
- `max-w-450`

In a new project, either recreate these tokens/classes or replace them with the local design system.

Required non-Tailwind CSS from `HeroCanvas.css`:

- `.hero-canvas`
- `.hero-canvas--scroll`
- `.hero-canvas__container`
- `.hero-canvas__overlay`
- `.hero-canvas__overlay--error`

Also recreate the typed caret style from global CSS:

```css
.agency-type-caret {
  display: inline-block;
  width: 0.08em;
  height: 0.8em;
  margin-left: 0.08em;
  background: currentColor;
  vertical-align: -0.08em;
  animation: agency-caret-blink 1s steps(1) infinite;
}

@keyframes agency-caret-blink {
  0%, 48% {
    opacity: 1;
  }
  49%, 100% {
    opacity: 0;
  }
}
```

## Implementation Checklist

1. Install dependencies: `three` and `framer-motion`.
2. Add the new GLB to static assets.
3. Add the new MP4 to static assets.
4. Copy or recreate `useReducedMotion`.
5. Copy or recreate `heroVideo`.
6. Copy `heroCanvasConfig` and retune it for the new GLB.
7. Copy `HeroCanvas` and update `MODEL_PATH` and `SCREEN_MATERIAL_NAMES`.
8. Copy `HeroCanvas.css`.
9. Copy `HeroV2` and replace copy, links, pills, brand text, and design tokens.
10. Mount `HeroV2` near the top of the page, directly below the nav if there is one.
11. Test desktop and mobile viewport sizes.
12. Test reduced motion.
13. Open browser console and confirm there is a log like `Screen plane attached`.

## Debugging Notes

If the video is black:

- Confirm the hidden video has real dimensions and is not `display: none`.
- Confirm the MP4 path works directly in the browser.
- Confirm the video is muted, looping, and `playsInline`.
- Confirm the browser can decode the MP4 codec.

If the video plane does not appear:

- Confirm `SCREEN_MATERIAL_NAMES` matches the new GLB material name.
- Temporarily log all mesh material names during `root.traverse`.
- Check whether the target material is nested deeper in the scene.

If the video z-fights or flickers:

- Adjust `screenPlaneOffset`.
- Adjust `screenPlanePolygonOffset`.
- Slightly reduce or increase `screenPlaneScaleWidth` and `screenPlaneScaleHeight`.

If the model is backwards or off-screen:

- Start with `modelRotationY`.
- Then tune `modelOffsetStart*` and `modelOffsetEnd*`.
- Then tune `cameraDistance*`.

If the intro label is wrong:

- Update `INTRO_LABEL_TEXT` in `HeroCanvas.jsx`.
- Or remove the intro label by passing `showIntroLabel={false}`.

## Notes For Future Codex Implementation

When implementing this in a new project, first inspect the new project structure and design tokens before copying code. Preserve the behavior, but adapt imports, routing, styling, and asset paths to the target app.

Before coding, ask for or inspect:

- New GLB file path.
- New MP4 file path.
- The GLB material name that should receive the video texture.
- Desired headline text.
- CTA labels and destinations.
- Whether the intro label should remain.

Do not assume the replacement GLB uses `mat16`; that is specific to the current Aperix vintage computer model.
