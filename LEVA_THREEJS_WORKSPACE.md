# Leva + Three.js dev workspace — porting guide

This document describes the **Leva playground pattern** used in AperixV2 so you can replicate it in another Next.js project. It is the implementation spec an agent (or you) should follow when setting this up elsewhere.

---

## What this system does

1. **Production scenes** (`HeroCanvas`, `Rocket`) are plain React components that own a **raw Three.js** loop (no React Three Fiber).
2. **Default tuning** lives in small JS config files under `lib/`.
3. **Dev routes** under `/dev/*` mount the same components with:
   - **Leva** sliders (right panel)
   - A **progress scrubber** (0 → 1) to preview scroll-driven animation
   - **Copy config** button → JSON on clipboard → paste into `lib/*Config.js`
4. **Intro screen** is skipped on `/dev` paths so playgrounds load immediately.

---

## Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^12.x",
    "leva": "^0.10.1",
    "motion": "^12.x",
    "next": "16.x",
    "react": "19.x",
    "react-dom": "19.x",
    "three": "^0.184.0"
  }
}
```

Install:

```bash
npm install three leva framer-motion motion
```

**Next.js config** — Leva must be transpiled:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["leva"],
};
export default nextConfig;
```

No `@react-three/fiber` or `@react-three/drei` in this setup. Loaders come from:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

---

## Folder layout (copy this structure)

```
app/
  dev/
    layout.tsx                 # passthrough layout (optional comment)
    hero-canvas/
      page.tsx                 # dynamic import, ssr: false
      PlaygroundClient.tsx     # Leva + scrubber + scene
    rocket/
      page.tsx
      PlaygroundClient.tsx

components/
  animations/
    HeroCanvas.jsx             # Three.js scene component
    HeroCanvas.css
    Rocket.jsx
    Rocket.css

lib/
  heroCanvasConfig.js        # DEFAULT_HERO_CANVAS_CONFIG
  RocketConfig.js            # DEFAULT_ROCKET_CONFIG
  heroVideo.ts                 # video src + offscreen class (hero only)

public/
  iFruit Vintage Computer.glb  # hero model
  Rocketship.glb               # rocket model
  a.mp4                        # hero screen video texture
```

---

## Core architecture pattern

```
┌─────────────────────────────────────────────────────────┐
│  lib/mySceneConfig.js     ← production defaults        │
└───────────────────────────┬─────────────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                      ▼
┌─────────────────┐                 ┌──────────────────────┐
│  Production     │                 │  /dev/my-scene       │
│  HeroV2.tsx     │                 │  PlaygroundClient    │
│  (scroll 0→1)   │                 │  Leva + scrubber     │
└────────┬────────┘                 └──────────┬───────────┘
         │                                     │
         │   scrollProgress (MotionValue)      │   liveConfig prop
         │   (no liveConfig)                   │   + scrollProgress
         ▼                                     ▼
┌─────────────────────────────────────────────────────────┐
│              MyScene.jsx (Three.js component)            │
│  resolveConfig(liveConfig) ?? DEFAULT_CONFIG             │
│  animate loop reads progressRef + latestConfigRef        │
└─────────────────────────────────────────────────────────┘
```

### Rules every scene component should follow

| Concern | Pattern |
|--------|---------|
| Config source | `liveConfig ?? DEFAULT_*_CONFIG` via `resolveConfig()` |
| Scroll input | `scrollProgress` — Framer `MotionValue<number>`; subscribe with `useMotionValueEvent` into `progressRef` |
| Live Leva tuning | Pass `liveConfig={...}` from playground; component sets `isDevPlaygroundRef = liveConfig != null` and reapplies config **every frame** (HeroCanvas) or via ref on every frame (Rocket) |
| GLB path | In config (`modelPath`) or constant in component |
| Resize | `ResizeObserver` on container + `renderer.setSize` |
| Cleanup | `cancelAnimationFrame`, `resizeObserver.disconnect()`, `renderer.dispose()`, remove canvas from DOM |
| SSR | Never import Three on the server — use `dynamic(..., { ssr: false })` on the page |

---

## Dev route boilerplate

### `app/dev/layout.tsx`

```tsx
/** Dev routes skip intro / heavy shell wrappers where needed */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `app/dev/[scene]/page.tsx`

```tsx
"use client";

import dynamic from "next/dynamic";

const PlaygroundClient = dynamic(() => import("./PlaygroundClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      Loading playground…
    </div>
  ),
});

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
```

**Critical:** `ssr: false` on both the page’s dynamic import and/or the Three component import.

---

## Intro gate skip (required for `/dev`)

In `IntroScreen.tsx` (or equivalent), bail out when pathname starts with `/dev`:

```tsx
if (window.location.pathname.startsWith("/dev")) {
  introHasPlayed = true;
  releaseIntroGate(); // removes #aperix-intro-cover
  doneSubscribers.forEach((cb) => cb());
  doneSubscribers = [];
  return;
}
```

Without this, a fixed intro overlay from `app/layout.tsx` can block the canvas.

---

## Leva playground template (`PlaygroundClient.tsx`)

This is the reusable pattern both playgrounds use:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { Leva, button, useControls } from "leva";
import MyScene from "@/components/animations/MyScene";
import { DEFAULT_MY_SCENE_CONFIG } from "@/lib/mySceneConfig";

const D = DEFAULT_MY_SCENE_CONFIG;
const RAD = 180 / Math.PI;

function mapLevaToConfig(values: /* your Leva shape */) {
  return {
    ...DEFAULT_MY_SCENE_CONFIG,
    modelOffsetEndX: values.endX,
    // map degrees → radians where needed:
    modelRotationY: (values.rotationYDeg * Math.PI) / 180,
  };
}

export default function PlaygroundClient() {
  const progress = useMotionValue(0);
  const [scrub, setScrub] = useState(0);

  const poseValues = useControls("Model end", {
    endX: { value: D.modelOffsetEndX, min: -2, max: 2, step: 0.01, label: "x" },
    endY: { value: D.modelOffsetEndY, min: -2, max: 2, step: 0.01, label: "y" },
    endZ: { value: D.modelOffsetEndZ, min: -2, max: 2, step: 0.01, label: "z" },
  });

  const liveConfig = mapLevaToConfig({ ...poseValues });
  const liveConfigForExport = useRef(liveConfig);
  liveConfigForExport.current = liveConfig;

  useControls("Export", {
    "Copy config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("Config copied:\n", text);
    }),
    "Reset page": button(() => window.location.reload()),
  });

  useEffect(() => {
    progress.set(scrub);
  }, [progress, scrub]);

  return (
    <div className="min-h-screen">
      <Leva collapsed={false} titleBar={{ title: "MyScene" }} />

      {/* Fixed toolbar: scrubber + live readout */}
      <div className="fixed inset-x-0 top-0 z-50 border-b px-4 py-3 backdrop-blur">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={scrub}
          onChange={(e) => setScrub(Number(e.target.value))}
          className="w-full max-w-md"
        />
      </div>

      <div className="fixed inset-0 pt-24">
        <MyScene scrollProgress={progress} liveConfig={liveConfig} className="h-full" />
      </div>
    </div>
  );
}
```

### Export workflow (tune → ship)

1. Open `/dev/my-scene` locally.
2. Scrub progress to **0%**, **50%**, **100%** and verify poses.
3. Adjust Leva folders.
4. Click **Export → Copy config**.
5. Paste values into `lib/mySceneConfig.js` (merge into `DEFAULT_*_CONFIG`).
6. Production page uses defaults only — **no Leva** in production bundle for that route.

---

## Scene 1: HeroCanvas (`/dev/hero-canvas`)

### Purpose

Scroll-driven vintage computer GLB with **video texture** on the monitor (`mat16` material).

### Config file: `lib/heroCanvasConfig.js`

Key groups:

| Group | Keys | Meaning |
|-------|------|---------|
| Model start | `modelOffsetStartX/Y/Z` | PC position at progress 0 |
| Model end | `modelOffsetEndX/Y/Z`, `modelRotationY` | PC position at progress 1 |
| Camera start | `screenFillMargin`, `cameraStartBackoff`, `cameraStartAzimuth`, `cameraStartElevation`, `cameraStartZRatio` | Head-on zoom framing |
| Camera end | `cameraTargetYRatio`, `cameraOrbitPivotYRatio`, `cameraDistanceX/Y/Z` | Orbit + pull-back |
| Screen | `screenPlaneOffset`, `screenPlaneScaleWidth/Height`, `screenPlanePolygonOffset` | Video plane on monitor glass |
| Intro label | `introLabelGap`, offsets, `introLabelWidthRatio`, `introLabelTextFill` | 3D “APERIX STUDIOS” plane above video |

### Leva folders (mirror of config)

- Model start
- Model end (+ spin Y°)
- Camera start
- Camera end
- Screen
- Intro label
- Export

### Extra playground features

- **Hidden `<video>`** with real dimensions (not 1×1) — see `lib/heroVideo.ts`. Browsers skip decoding tiny hidden videos; WebGL `VideoTexture` stays black.
- **`showIntroLabel`** prop — enable in playground only; tune intro label at progress **0%**.
- **Sticky scroll mode** checkbox — toggles `300vh` section + `useScroll` like production hero (`scrollYProgress` mapped `[0, 0.78] → [0, 1]`).

### Production usage (`HeroV2.tsx`)

```tsx
const zoomProgress = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
<HeroCanvas scrollProgress={cameraProgress} videoElement={heroVideo} />
// No liveConfig in production
```

### Dev-only hot reload

When `liveConfig` prop is non-null, `HeroCanvas` sets `isDevPlaygroundRef` and calls `applyLiveConfig(config)` **every animation frame** so Leva changes apply without remounting the WebGL context.

### Assets

| File | Path |
|------|------|
| GLB | `/public/iFruit Vintage Computer.glb` (hardcoded `MODEL_PATH` in component) |
| Video | `/public/a.mp4` via `HERO_VIDEO_SRC` |

---

## Scene 2: Rocket (`/dev/rocket`)

### Purpose

**3-point** scroll interpolation: start (0%) → middle (50%) → end (100%) for position and rotation.

### Config file: `lib/RocketConfig.js`

```js
export const DEFAULT_ROCKET_CONFIG = {
  modelPath: '/Rocketship.glb',

  modelOffsetStartX/Y/Z,
  modelOffsetMiddleX/Y/Z,
  modelOffsetEndX/Y/Z,

  modelRotationStartX/Y/Z,   // radians
  modelRotationMiddleX/Y/Z,
  modelRotationEndX/Y/Z,

  cameraX/Y/Z,
  lookAtX/Y/Z,
};
```

### Interpolation (in `Rocket.jsx`)

```js
function sampleThreePoint(t, start, middle, end) {
  if (t <= 0.5) return lerp(start, middle, ease(t / 0.5));
  return lerp(middle, end, ease((t - 0.5) / 0.5));
}
```

### Leva folders

- Model start (+ rot X°/Y°/Z°)
- Model middle
- Model end
- Camera (pos + lookAt)
- Export

### Production usage (`HowItWorksV2.tsx`)

Tall scroll track (`300vh`) + sticky viewport; `useScroll` → `scrollYProgress` → `Rocket scrollProgress={...}`.

### Note on `liveConfig` updates

`Rocket`’s `useEffect` has `[]` deps (single WebGL init), but `latestConfigRef.current` is updated every React render and `applyConfig()` runs every `requestAnimationFrame` — so Leva still works in the playground.

---

## CSS for full-bleed canvases

Both scenes need the container chain to pass height through:

```css
/* HeroCanvas.css */
.hero-canvas--scroll {
  min-height: 100%;
  height: 100%;
}
.hero-canvas__container {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Rocket.css */
.rocket-scene.h-full,
.rocket-scene--scroll {
  min-height: 100%;
  height: 100%;
}
```

Playground wrappers use `className="h-full min-h-0"` or `hero-canvas--scroll`.

---

## Adding a **new** Three.js scene + playground

Checklist for a third scene (e.g. `/dev/product-spin`):

1. **Create** `lib/productSpinConfig.js` with `DEFAULT_PRODUCT_SPIN_CONFIG`.
2. **Create** `components/animations/ProductSpin.jsx`:
   - Accept `scrollProgress`, optional `liveConfig`.
   - `resolveConfig(liveConfig) ?? DEFAULT`.
   - Read `progressRef` + `latestConfigRef` in animate loop.
3. **Create** `components/animations/ProductSpin.css` if needed.
4. **Create** `app/dev/product-spin/page.tsx` + `PlaygroundClient.tsx`:
   - `useControls` groups matching config fields.
   - `mapLevaToConfig`.
   - Export button.
   - Range scrubber 0–1.
5. **Put GLB** in `public/`.
6. **Wire production** section with `dynamic(..., { ssr: false })` + scroll `MotionValue`.
7. **Confirm** `/dev/product-spin` skips intro gate.

---

## Production vs dev — what not to ship

| Dev only | Production |
|----------|------------|
| `import { Leva } from "leva"` | Omit Leva entirely |
| `liveConfig` prop | Omit — use `DEFAULT_*_CONFIG` only |
| Fixed scrubber toolbar | Real scroll (`useScroll`) |
| `showIntroLabel` (hero) | Only if needed on homepage |

Leva is only imported inside `app/dev/*/PlaygroundClient.tsx`, so production pages do not bundle the panel.

---

## URLs in this repo

| Playground | URL | Config file |
|------------|-----|-------------|
| Hero computer | `http://localhost:3000/dev/hero-canvas` | `lib/heroCanvasConfig.js` |
| Rocket | `http://localhost:3000/dev/rocket` | `lib/RocketConfig.js` |

---

## Common gotchas

1. **Black video texture** — hidden video must have real width/height (`heroVideo.ts` offscreen class uses `640×360`).
2. **Intro cover blocks canvas** — ensure `/dev` path skip in `IntroScreen` + `releaseIntroGate()`.
3. **Leva build errors** — add `transpilePackages: ["leva"]` in `next.config`.
4. **GLB 404** — paths are from site root (`/Rocketship.glb`), files live in `public/`.
5. **Radians vs degrees** — config files store **radians**; Leva UI uses **degrees** with `* RAD` conversion in `mapLevaToConfig`.
6. **Sticky scroll + overflow** — parent `overflow-hidden` breaks `position: sticky` (rocket section was moved outside `<main>` for this reason).
7. **Turbopack root** — if the project sits inside a monorepo-style parent folder, set `turbopack.root` in `next.config` to the app directory (see AperixV2 `next.config.ts`).

---

## Minimal port checklist (new project)

- [ ] `npm install three leva framer-motion motion`
- [ ] `transpilePackages: ["leva"]` in Next config
- [ ] Copy `app/dev/` structure (layout + 1+ playgrounds)
- [ ] Copy `lib/*Config.js` pattern
- [ ] Copy or adapt `HeroCanvas.jsx` / `Rocket.jsx` (or start from Rocket as minimal template)
- [ ] Copy CSS files for scene containers
- [ ] Add GLB/MP4 assets to `public/`
- [ ] Add `/dev` skip in intro/splash logic in root layout
- [ ] Verify playground: scrubber moves model, Leva updates live, Copy config works
- [ ] Paste exported JSON into config file for production defaults

---

## Reference: which file to edit for what

| Goal | File |
|------|------|
| Change hero computer **end position** | `lib/heroCanvasConfig.js` → `modelOffsetEndX/Y/Z` (or tune in `/dev/hero-canvas`) |
| Change hero **camera** end framing | `lib/heroCanvasConfig.js` → `cameraDistance*`, `cameraTargetYRatio`, etc. |
| Change monitor **video plane** | `lib/heroCanvasConfig.js` → `screenPlane*` keys |
| Change rocket **poses** | `lib/RocketConfig.js` → start/middle/end offsets & rotations |
| Change rocket **camera** | `lib/RocketConfig.js` → `cameraX/Y/Z`, `lookAtX/Y/Z` |
| Add Leva sliders | `app/dev/*/PlaygroundClient.tsx` |
| Change scroll mapping on homepage | `components/agency/HeroV2.tsx` or `HowItWorksV2.tsx` |

---

*Generated from AperixV2 — conversation context: Leva workspaces for HeroCanvas + Rocket, raw Three.js (no R3F), config export workflow.*
