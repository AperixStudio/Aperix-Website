/** Self-hosted Unicorn export for HeroV3 (Act 1–3: retro PC → monitor + iPhone). */
export const HERO_V3_UNICORN_JSON = "/unicorn/HeroAct1-3.json";

/** Artboard aspect from HeroAct1-3.json shape layer (1454×762). */
export const HERO_V3_UNICORN_ASPECT = 1.6;

export const HERO_V3_UNICORN_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";

export const HERO_V3_UNICORN_RENDER = {
  desktop: { scale: 1, dpi: 1.5, fps: 60 as const },
  mobile: { scale: 0.68, dpi: 1, fps: 30 as const },
} as const;

/** Sticky scroll runway for HeroV3 — drives Unicorn scroll animations. */
export const HERO_V3_SCROLL_HEIGHT_VH = 280;

/** Hero scroll progress before Unicorn scroll states take over (after appear rests). */
export const HERO_V3_SCROLL_ENGAGE_THRESHOLD = 0.008;

/** Retro PC appear duration from HeroAct1-3.json (+ buffer for rest-pose handoff). */
export const HERO_V3_APPEAR_DURATION_MS = 1100;

/** Retro PC appear transition duration (HeroAct1-3.json). */
export const HERO_V3_MODEL_APPEAR_MS = 1000;

/** Retro PC layer name in HeroAct1-3.json. */
export const HERO_V3_RETRO_PC_LAYER_NAME = "retroPc";

/** Retro PC `pos` after the appear animation (HeroAct1-3.json). */
export const HERO_V3_MODEL_REST_POS = {
  x: 0.742,
  y: 0.5,
  z: -0.133,
} as const;

/** Monitor scroll end pose — further left than JSON default (0.25) to match Unicorn preview. */
export const HERO_V3_MONITOR_SCROLL_END_POS = {
  x: 0.08,
  y: 0.5,
  z: 0,
} as const;

export const HERO_V3_MONITOR_LAYER_NAME = "Monitor";

export type HeroV3UnicornLayer = {
  isModel?: boolean;
  layerName?: string;
  opacity?: number;
  pos?: {
    _x?: number;
    _y?: number;
    _z?: number;
    x?: number;
    y?: number;
    z?: number;
  };
  local?: { stateEffectProps?: Record<string, unknown> };
  data?: {
    uniforms?: {
      opacity?: { value?: number };
    };
  };
  states?: {
    scroll?: Array<{
      prop: string;
      lastTick?: number;
      progress?: number;
      _velocity?: number;
      value?: {
        _x?: number;
        _y?: number;
        _z?: number;
        x?: number;
        y?: number;
        z?: number;
      };
    }>;
  };
};

export type HeroV3UnicornSceneInstance = {
  isFixed?: boolean;
  element?: HTMLElement;
  layers?: HeroV3UnicornLayer[];
};

/**
 * After appear, Unicorn scroll can read the retro PC appear *start* pose for `pos`
 * at scroll progress 0. Re-commit the rest pose until the user scrolls.
 * Monitor/iPhone stay at opacity 0 until their scroll states run.
 */
export function commitHeroV3ModelRestPose(scene: HeroV3UnicornSceneInstance | null) {
  if (!scene?.layers) {
    return;
  }

  for (const layer of scene.layers) {
    if (!layer.isModel || layer.layerName !== HERO_V3_RETRO_PC_LAYER_NAME) {
      continue;
    }

    if (layer.pos) {
      layer.pos._x = HERO_V3_MODEL_REST_POS.x;
      layer.pos._y = HERO_V3_MODEL_REST_POS.y;
      layer.pos._z = HERO_V3_MODEL_REST_POS.z;
      layer.pos.x = HERO_V3_MODEL_REST_POS.x;
      layer.pos.y = HERO_V3_MODEL_REST_POS.y;
      layer.pos.z = HERO_V3_MODEL_REST_POS.z;
    }

    layer.opacity = 1;
    if (layer.data?.uniforms?.opacity) {
      layer.data.uniforms.opacity.value = 1;
    }

    if (layer.local?.stateEffectProps?.pos) {
      delete layer.local.stateEffectProps.pos;
    }

    for (const state of layer.states?.scroll ?? []) {
      if (state.prop === "pos") {
        state.lastTick = undefined;
        state.progress = 0;
        state._velocity = 0;
      }
    }
  }
}

/** Ensure Monitor scroll `pos` ends further left than the baked JSON target. */
export function applyHeroV3MonitorScrollEnd(scene: HeroV3UnicornSceneInstance | null) {
  if (!scene?.layers) {
    return;
  }

  const layer = scene.layers.find(
    (candidate) => candidate.isModel && candidate.layerName === HERO_V3_MONITOR_LAYER_NAME,
  );
  if (!layer?.states?.scroll) {
    return;
  }

  for (const state of layer.states.scroll) {
    if (state.prop !== "pos" || !state.value || typeof state.value !== "object") {
      continue;
    }

    state.value._x = HERO_V3_MONITOR_SCROLL_END_POS.x;
    state.value._y = HERO_V3_MONITOR_SCROLL_END_POS.y;
    state.value._z = HERO_V3_MONITOR_SCROLL_END_POS.z;
    state.value.x = HERO_V3_MONITOR_SCROLL_END_POS.x;
    state.value.y = HERO_V3_MONITOR_SCROLL_END_POS.y;
    state.value.z = HERO_V3_MONITOR_SCROLL_END_POS.z;
  }
}

/**
 * Unicorn `scrollIntoView` with a pinned scene uses:
 *   progress = (scrollY + viewportHeight) / (sceneHalfHeight + viewportHeight)
 *
 * Map hero progress 0→1 onto that scrollY range. Hold at progress 0 during appear.
 */
export function mapHeroV3UnicornScrollY(
  progress: number,
  viewportHeight: number,
  sceneHalfHeight = viewportHeight / 2,
) {
  const clamped = Math.min(1, Math.max(0, progress));
  const startScrollY = -viewportHeight;
  const endScrollY = sceneHalfHeight;
  return startScrollY + clamped * (endScrollY - startScrollY);
}

/** Scroll position where Unicorn scroll progress is 0 (appear can play). */
export function heroV3UnicornScrollStart(
  viewportHeight: number,
  sceneHalfHeight = viewportHeight / 2,
) {
  return mapHeroV3UnicornScrollY(0, viewportHeight, sceneHalfHeight);
}
