"use client";

import UnicornScene from "unicornstudio-react/next";
import "./SiteBackground.css";

const BG_UNICORN_JSON = "/unicorn/aperixbg_scene.json";
const BG_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";
const BG_RENDER = {
  scale: 1,
  dpi: 1.5,
  fps: 60 as const,
} as const;

export default function SiteBackground() {

  return (
    <div className="site-bg" aria-hidden="true">
      <UnicornScene
        jsonFilePath={BG_UNICORN_JSON}
        sdkUrl={BG_SDK_URL}
        width="100%"
        height="100%"
        scale={BG_RENDER.scale}
        dpi={BG_RENDER.dpi}
        fps={BG_RENDER.fps}
        lazyLoad={false}
        altText=""
        ariaLabel=""
        className="site-bg__scene"
      />
    </div>
  );
}
