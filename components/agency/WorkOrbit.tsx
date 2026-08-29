"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  createOrbitBasis,
  fitOrbit,
  orbitTileFrameAt,
  orbitTilePsi,
  type OrbitPreset,
} from "@/lib/workOrbit";
import "./WorkOrbit.css";

export type WorkOrbitItem = { key: string; node: ReactNode };

type WorkOrbitProps = {
  /** Ring geometry, card count and pace — see WORK_ORBIT_WIDE / _NARROW. */
  preset: OrbitPreset;
  items: WorkOrbitItem[];
  /** Sits at the ring's centre, with half the cards passing in front of it. */
  center: ReactNode;
  /** False while the section is off-screen — freezes the ring where it is. */
  playing: boolean;
  /** Skips the revolution entirely; the ring is still laid out in perspective. */
  still?: boolean;
};

/**
 * A tilted ring of cards turning through perspective, one revolution every
 * WORK_ORBIT_DURATION_S seconds.
 *
 * The reference study draws its tiles into a canvas. These are real elements
 * carrying the same CSS matrix the canvas would have used, which is what lets
 * each one stay a playing <video> of a live site with its own hover, focus and
 * case-study dialog intact. Positions are written straight to style on every
 * frame — the ring never re-renders React.
 */
export default function WorkOrbit({
  preset,
  items,
  center,
  playing,
  still = false,
}: WorkOrbitProps) {
  const { frame, ring, durationS } = preset;
  const stageRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Survives pause/resume so the ring picks up where it stopped.
  const progressRef = useRef(0);
  const holdRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const basis = createOrbitBasis(ring.axis, ring.ratio);
    let fit = fitOrbit(stage.clientWidth, stage.clientHeight, frame);

    const draw = () => {
      const spin = progressRef.current * Math.PI * 2;
      const slots = slotsRef.current;
      for (let i = 0; i < slots.length; i += 1) {
        const el = slots[i];
        if (!el) continue;
        const psi = orbitTilePsi(ring, i, slots.length, spin);
        const placed = orbitTileFrameAt(basis, ring, fit, psi);
        if (!placed.visible) {
          el.style.visibility = "hidden";
          continue;
        }
        const m = placed.matrix;
        el.style.visibility = "visible";
        el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
        // Centre of the stage is z-index 500, so the far half of the ring
        // lands behind the headline and the near half in front of it.
        el.style.zIndex = String(Math.round(500 + placed.depth * 400));
        el.style.setProperty("--orbit-depth", (placed.depth * 0.5 + 0.5).toFixed(3));
        el.style.opacity = placed.edge.toFixed(3);
        el.dataset.facing = placed.facing ? "front" : "back";
        el.dataset.mirrored = placed.mirrored ? "true" : "false";
      }
    };

    const measure = () => {
      fit = fitOrbit(stage.clientWidth, stage.clientHeight, frame);
      stage.style.setProperty("--orbit-tile-w", `${ring.tileW * fit.k}px`);
      stage.style.setProperty("--orbit-tile-h", `${ring.tileH * fit.k}px`);
      draw();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    measure();

    if (still || !playing) {
      return () => observer.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    let speed = 1;

    const tick = (now: number) => {
      // Capped so a backgrounded tab does not jump the ring on return.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = holdRef.current ? 0 : 1;
      speed += (target - speed) * Math.min(1, dt * 5);
      progressRef.current =
        (progressRef.current + (dt * speed) / durationS) % 1;
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [durationS, frame, items.length, playing, ring, still]);

  // The ring holds still while someone is reading a card, keeping a focus ring
  // or an opening dialog anchored to a target that is not sliding away.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const overCard = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".work-orbit__slot"));

    const onOver = (event: PointerEvent) => {
      if (overCard(event.target)) holdRef.current = true;
    };
    const onOut = (event: PointerEvent) => {
      if (overCard(event.target) && !overCard(event.relatedTarget)) {
        holdRef.current = false;
      }
    };
    const onFocusIn = () => {
      holdRef.current = true;
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!overCard(event.relatedTarget)) holdRef.current = false;
    };

    stage.addEventListener("pointerover", onOver);
    stage.addEventListener("pointerout", onOut);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);

    // A case study is open: stop entirely, so the morph has a still origin to
    // return to. MorphingDialog flags this on <body>.
    const body = document.body;
    const syncDialog = () => {
      if (body.dataset.dialogOpen === "true") holdRef.current = true;
    };
    const dialogObserver = new MutationObserver(syncDialog);
    dialogObserver.observe(body, { attributeFilter: ["data-dialog-open"] });
    syncDialog();

    return () => {
      stage.removeEventListener("pointerover", onOver);
      stage.removeEventListener("pointerout", onOut);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
      dialogObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="work-orbit"
      style={{ aspectRatio: `${frame.w} / ${frame.h}` }}
    >
      <div className="work-orbit__centre">{center}</div>

      {items.map((item, index) => (
        <div
          key={item.key}
          ref={(el) => {
            slotsRef.current[index] = el;
          }}
          className="work-orbit__slot"
        >
          <div className="work-orbit__card">{item.node}</div>
        </div>
      ))}
    </div>
  );
}
