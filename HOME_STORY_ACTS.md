# Homepage Story — Acts 1–3

Brief for recreating the Aperix homepage scroll story: a **dark room**, a **retro PC** under a **spotlight**, **static/video on the monitor**, then **how-it-works steps**, then **iPhone + monitor** for “desktop and mobile from day 1”.

---

## Creative intent

| Beat | What the user should feel |
|------|---------------------------|
| **Act 1** | Alone in a dark room. A single machine is lit like a desk lamp / overhead spot. The camera starts **fully zoomed into the CRT** (static/noise on the glass), then **pulls back** to reveal the retro PC. Hero headline fades in over the wide shot, then fades out as we push toward the screen again. 
| **Act 2** | Same PC, same dark room. Camera **pushes into the monitor**. The screen evolves: **blueprint → wireframe → live site** (MP4 on the glass). Three **how-it-works** cards scroll in sync with each era. |
| **Act 3** | Hard cut / noise dissolve (no white flash) to a new scene: **iPhone + desktop monitor** on black, optional **floor light pool**, heading: *“Optimised for desktop and mobile from day 1”*. Both device screens play video. Camera eases to a wide hero framing. |

**Background:** Pure black (`#000`) for the full story scroll section — not the site’s light grey page bg. Hero copy is **white on black** during Acts 1–3.

**Lighting (Acts 1–2):** Low ambient, strong **key + rim** directional lights on the PC (tuned in dev playground). Reads like a object lit in an otherwise dark space — not a bright studio.

**Lighting (Act 3):** Key + fill directionals, optional **spotlight** (usually off in current prod tuning), plus a **fake floor pool** (radial gradient disc — not a full 3D floor).

---

## Scroll structure

One sticky full-viewport WebGL canvas (`StoryExperienceCanvas`) driven by scroll progress **0 → 1**.

| Setting | Desktop | Mobile |
|---------|---------|--------|
| Total scroll height | `450vh` | `300vh` |
| Constant | `HOME_STORY_SCROLL_VH` | `HOME_STORY_SCROLL_VH_MOBILE` |

### Global timeline (`lib/homeStoryTimeline.ts`)

| Act | Global scroll | Local meaning |
|-----|---------------|---------------|
| **Act 1 — zoom out** | `0% → 30%` | Camera: tight on monitor → pull back → slight push-in before Act 2 |
| **Act 2 — monitor evolution** | `30% → 72%` | Camera **held**; PC **slides left**; screen: blueprint → wireframe → live. Step cards. |
| **Act 3 — reveal** | `72% → 100%` | iPhone + monitor scene. DOM heading + camera widen. |

### Act 1 camera (Hero / PC scene)

Mapped by `mapPcCameraProgress()`:

- **Progress 0** = zoomed **into** the monitor (fill frame with screen).
- **Progress 1** = pulled **back** (full PC visible).
- Beat: **in → out → slight in → out** across Act 1 + start of Act 2.

Hero copy opacity: fades in during pull-back (`mapHeroTextOpacity`), fades out before Act 2 push-in.

### Act 2 screen evolution

Mapped by `mapScreenEvolutionProgress()` (Act 2 local 0–1):

| Local progress | Era label (top-left) | Screen content |
|----------------|----------------------|----------------|
| `0 → ~0.38` | **Blueprint** | Blueprint-style drawing on monitor plane |
| `~0.38 → ~0.66` | **Wireframe** | Wireframe mock on monitor plane |
| `~0.66 → 1` | **Live site** | MP4 texture (`badreception.mp4`) on monitor |

Constants: `ACT2_WIREFRAME_START = 0.38`, `ACT2_WIREFRAME_END = 0.66`.

Blueprint grid overlay (CSS) fades in during Act 2 only — subtle blue grid on black.

### Act 2 → Act 3 transition

- **No white crossfade.** Noise **dissolve** on desktop (`70.5%–73.5%` scroll).
- **Mobile:** hard swap at **72%** when Act 3 models are ready.
- PC scene disposed after swap to save GPU memory.

Constants: `lib/experience/constants.ts` (`ACT3_TRANSITION_START`, `ACT3_SCENE_START`, etc.).

### Act 3

- Models animate from start pose → end pose on scroll.
- Heading (DOM, not WebGL): **“Optimised for desktop and mobile from day 1”**
- Floor pool defaults: `floorPoolY: -0.32`, `floorPoolScale: 8.4`, `floorPoolOpacity: 0.55`

---

## 3D assets

All paths are under **`/public/`** (served as `/filename` in the browser).

### Act 1 & 2 — Retro PC

| File | Size (approx) | Notes |
|------|---------------|--------|
| **`retro_pc_comp.glb`** | ~732 KB | **Primary.** Draco-compressed (`KHR_draco_mesh_compression`). Requires **`/public/draco/gltf/`** decoder WASM/JS (from Three.js examples). |
| **`retro_electronics_retro_pc.glb`** | ~3.3 MB | **Fallback** if compressed load fails. |

- **Source:** Sketchfab — [Retro Electronics: Retro PC](https://sketchfab.com/3d-models/retro-electronics-retro-pc-6753e74ab6a449c7a3362894ed055274) by virgodmonkey (CC-BY-4.0).
- **Screen mesh:** material named **`grid`** (used to align the video/blueprint/wireframe plane).
- **Draco repair:** If re-compressed with glTF-Transform and the export drops `scenes` / node `children`, run:
  ```bash
  node scripts/fix-retro-pc-glb.mjs
  ```

### Act 1 & 2 — Monitor video (static / “bad reception”)

| File | Role |
|------|------|
| **`badreception.mp4`** | Texture on the PC monitor plane in Acts 1–2 (and reused on Act 3 screens). |

- Hidden `<video>` element feeds WebGL `VideoTexture` (see `lib/heroVideo.ts`).
- Must **not** use `display: none` or 0×0 size — browsers stop decoding frames.

### Act 3 — iPhone + monitor

| File | Model |
|------|--------|
| **`iphone_16_-_free.glb`** | iPhone 16 (free asset) |
| **`monitor_crossover.glb`** | Desktop monitor |

- MP4 on both screens: **`badreception.mp4`** (configurable in `lib/act3RevealConfig.js`).
- Screen planes are computed in `lib/act3ScreenPlanes.js` (not baked into GLB UVs).

---

## Key code map (recreate from scratch)

```
app/page.tsx
  └── components/agency/HomeStorySection.tsx     ← orchestrator (scroll, copy, cards, heading)
        └── components/experience/StoryExperienceCanvas.jsx   ← single WebGL canvas Acts 1–3

lib/homeStoryTimeline.ts       ← scroll % → act progress (DO NOT change timing without intent)
lib/experience/constants.ts    ← Act 3 transition / preload thresholds
lib/experience/scenes/pcStoryScene.js      ← Acts 1–2 (PC, screen planes, lighting)
lib/experience/scenes/act3RevealScene.js   ← Act 3 (iPhone, monitor, floor pool, lights)
lib/experience/transitions/createStoryCompositor.js  ← desktop noise dissolve
lib/experience/gltfLoader.js   ← GLTF + Draco loader

Config (production tuning):
  lib/heroCanvasConfig.js           ← Act 1–2 desktop (camera, screen plane, lighting)
  lib/heroCanvasConfig.mobile.js    ← Act 1–2 mobile overrides
  lib/act3RevealConfig.js           ← Act 3 desktop
  lib/act3RevealConfig.mobile.js    ← Act 3 mobile overrides

Dev tuning:
  /dev/hero-canvas?act=1|2|3       ← Leva panels, mobile preview, copy config
  /dev/act-3-reveal                ← Act 3 only (legacy)

Copy / content:
  lib/howItWorksContent.ts         ← 3 step cards (Act 2)
  components/agency/RocketTextBlock.tsx  ← card rendering
```

---

## How-it-works cards (Act 2)

Rendered over the 3D scene while user scrolls Act 2 (`30%–72%` global):

1. **01 — Start the Conversation** (blueprint era)
2. **02 — Shape the Direction** (wireframe era)
3. **03 — Build, Refine & Launch** (live site era)

Timing windows are **Act 2 local progress** in `HOW_IT_WORKS_BLOCKS` — remapped to global scroll via `remapBlockProgressForGlobalStory()`.

---

## Lighting reference (current desktop Act 1 tuning)

Stored in `lib/heroCanvasConfig.js`:

- **Ambient:** `2` (high — lifts shadow fill; pair with black bg + strong key)
- **Key light:** intensity `1.28`, position roughly `(-7.6, 5.6, 6.3)`
- **Rim light:** intensity `0.97`, position roughly `(0.8, 1.2, -4.2)`
- **Camera FOV:** `35`

Act 3 lighting + floor pool: `lib/act3RevealConfig.js` — tune via **Lighting**, **Spotlight · overhead**, **Floor pool** in `/dev/hero-canvas?act=3`.

---

## Mobile notes

- Same story beats, shorter scroll (`300vh`).
- **Lite tier:** no dissolve shader, hard Act 3 swap, lower DPR cap (`1.25`), no MSAA on mobile WebGL.
- Separate config overrides in `*.mobile.js` files — always copy from playground with **Mobile preview** on.

---

## Minimal recreate checklist

1. Add all `/public` assets (PC GLB + Draco decoder, iPhone GLB, monitor GLB, `badreception.mp4`).
2. Implement sticky scroll section with progress `0–1` over `450vh` (desktop).
3. **One** WebGL renderer; PC scene for Acts 1–2; Act 3 scene preloaded ~62–66% scroll.
4. PC scene: load GLB, find **`grid`** material mesh, attach video + canvas planes for blueprint/wireframe/live.
5. Map scroll → camera pull-back (Act 1) → push-in + screen evolution (Act 2).
6. Overlay hero copy (Act 1) + three text cards (Act 2) + Act 3 heading in DOM.
7. Black background everywhere in story section; white text.
8. Transition Act 2→3 without white fade (dissolve desktop / hard swap mobile).
9. Act 3: iPhone + monitor GLBs, MP4 screen textures, optional floor pool.
10. Tune via Leva playgrounds → paste into `heroCanvasConfig.js` / `act3RevealConfig.js`.

---

## Feature flag

`NEXT_PUBLIC_UNIFIED_STORY_EXPERIENCE=false` falls back to separate `HeroCanvas` + `Act3RevealCanvas` (legacy). Default: unified single canvas.
