"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ORB_FRAGMENT_SHADER, ORB_VERTEX_SHADER } from "./heroReceptionistOrbShader";
import "./HeroReceptionistOrb.css";

type Speaker = "caller" | "ai" | "booked";
type Line = { from: Speaker; text: string };

// Same placeholder pitch as before. The last line is tagged "booked" rather
// than "ai" so it gets its own distinct colour (success green) instead of
// reading as just another AI line — the booking is the point of the demo.
const SCRIPT: Line[] = [
  { from: "caller", text: "Anything free Saturday?" },
  { from: "ai", text: "10am or 2pm — pick one." },
  { from: "caller", text: "2pm works." },
  { from: "booked", text: "You're booked. ✓" },
];

const TINTS: Record<Speaker, [number, number, number]> = {
  caller: [1.0, 0.82, 0.58], // warm platinum
  ai: [0.24, 0.66, 0.98], // site accent blue
  booked: [0.35, 0.93, 0.6], // success green
};

const LINE_HOLD_MS = 1900;
const END_HOLD_MS = 2400;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create orb shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info ?? "Orb shader compile failed");
  }
  return shader;
}

/**
 * Hero AI-receptionist teaser: a raw-WebGL ray-marched liquid silver orb
 * that IS the demo, not a decoration next to one. Idle, it breathes and
 * drifts with the pointer with "Tap to start a call" set right into its
 * surface. Tapping it is the only action — there's no separate CTA — and
 * it plays a short call: the orb tints toward whoever's "speaking" and
 * that line's words sit in the same spot the prompt was, in the orb's own
 * light rather than a chat bubble beside it. It ends on a green "booked"
 * beat, then settles back to silver and waits to be tapped again.
 */
export default function HeroReceptionistOrb({ show }: { show: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tintTarget = useRef<[number, number, number]>([1, 1, 1]);
  const tintMixTarget = useRef(0);
  const energyTarget = useRef(0);

  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [active, setActive] = useState<{ id: number; line: Line } | null>(null);
  const lineIdRef = useRef(0);
  const playTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── WebGL setup ────────────────────────────────────────────────
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return undefined;

    const vertex = compile(gl, gl.VERTEX_SHADER, ORB_VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, ORB_FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "Orb program link failed");
    }
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      tint: gl.getUniformLocation(program, "u_tint"),
      tintMix: gl.getUniformLocation(program, "u_tintMix"),
      energy: gl.getUniformLocation(program, "u_energy"),
    };

    let targetMx = 0;
    let targetMy = 0;
    let mx = 0;
    let my = 0;
    let tintMix = 0;
    let tint: [number, number, number] = [1, 1, 1];
    let energy = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      targetMx = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
      targetMy = -(((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 - 1);
    };

    const render = (now: number) => {
      mx += (targetMx - mx) * 0.05;
      my += (targetMy - my) * 0.05;
      tintMix += (tintMixTarget.current - tintMix) * 0.08;
      energy += (energyTarget.current - energy) * 0.12;
      tint = [
        tint[0] + (tintTarget.current[0] - tint[0]) * 0.08,
        tint[1] + (tintTarget.current[1] - tint[1]) * 0.08,
        tint[2] + (tintTarget.current[2] - tint[2]) * 0.08,
      ];

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - start) * 0.001);
      gl.uniform2f(u.mouse, mx, my);
      gl.uniform3f(u.tint, tint[0], tint[1], tint[2]);
      gl.uniform1f(u.tintMix, tintMix);
      gl.uniform1f(u.energy, energy);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = visible && !document.hidden ? requestAnimationFrame(render) : 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !raf) raf = requestAnimationFrame(render);
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });

    resize();
    raf = requestAnimationFrame(render);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
    };
  }, []);

  // ── Conversation playback ─────────────────────────────────────
  useEffect(() => {
    const timers = playTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Clicking the orb IS "try it live" — there's no separate CTA. Right now
  // that means playing the in-orb demo conversation below.
  // TODO(partner): this is also the hook point for the real call — once the
  // backend exists, kick it off here too (e.g. a tel: redirect or an API
  // call), alongside or instead of the visual demo.
  const startDemo = () => {
    if (phase === "playing") return;
    setPhase("playing");

    const at = (ms: number, fn: () => void) => {
      playTimers.current.push(setTimeout(fn, ms));
    };

    SCRIPT.forEach((line, index) => {
      at(index * LINE_HOLD_MS, () => {
        tintTarget.current = TINTS[line.from];
        tintMixTarget.current = 0.85;
        energyTarget.current = 1;
        const id = lineIdRef.current++;
        setActive({ id, line });
        at(280, () => { energyTarget.current = 0.15; });
      });
    });

    at(SCRIPT.length * LINE_HOLD_MS + END_HOLD_MS, () => {
      tintMixTarget.current = 0;
      energyTarget.current = 0;
      setActive(null);
      setPhase("idle");
    });
  };

  return (
    <motion.div
      className="home-hero__ai-demo hero-orb"
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: show ? 0.2 : 0 }}
    >
      <button
        ref={hostRef}
        type="button"
        className={`hero-orb__stage${phase === "idle" ? " is-idle" : ""}${prefersReducedMotion ? " no-motion" : ""}`}
        onClick={startDemo}
        disabled={phase === "playing"}
        aria-label="Play a demo call with the Aperix AI receptionist"
      >
        <canvas ref={canvasRef} className="hero-orb__canvas" />

        <span className="hero-orb__overlay">
          <AnimatePresence mode="wait">
            {phase === "idle" ? (
              <motion.span
                key="prompt"
                className="hero-orb__text hero-orb__text--prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Tap to start a call
              </motion.span>
            ) : active ? (
              <motion.span
                key={active.id}
                className={`hero-orb__text hero-orb__text--${active.line.from}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {active.line.text}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      </button>
    </motion.div>
  );
}
