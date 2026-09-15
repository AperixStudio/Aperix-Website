"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** SVG path string(s) (d attribute) to render as particles. Can be a single path or an array of paths. */
  svgPath: string | readonly string[];
  /** Original viewBox width of the SVG path */
  viewBoxWidth?: number;
  /** Original viewBox height of the SVG path */
  viewBoxHeight?: number;
  /** Height of the logo in pixels (desktop) */
  logoHeight?: number;
  /** Height of the logo in pixels (mobile) */
  mobileLogoHeight?: number;
  /** Color of particles when scattered by mouse interaction */
  scatteredColor?: string;
  /** Base color of particles */
  particleColor?: string;
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Whether to fill or stroke the SVG path */
  pathStyle?: "fill" | "stroke";
  /** Stroke width when using stroke style (in viewBox units) */
  strokeWidth?: number;
  /** Line join style for stroke corners */
  lineJoin?: CanvasLineJoin;
  /** Line cap style for stroke endpoints */
  lineCap?: CanvasLineCap;
  /** Force multiplier for particle scattering */
  forceMu?: number;
  /** Interaction mode: "scatter" pushes particles while mouse is near, "spill" gives particles velocity that decays over time */
  interactionMode?: "scatter" | "spill";
  /** How quickly particles return to their base position (0-1, lower = slower) */
  returnSpeed?: number;
  /** Friction applied to particle velocity in spill mode (0-1, lower = more friction) */
  friction?: number;
  /** Whether to enable particle death */
  enableParticleDeath?: boolean;
  /** Multiplier for particle count (use >1 for small canvases) */
  particleDensity?: number;
  /** Min/max particle dot size in px */
  particleSizeMin?: number;
  particleSizeMax?: number;
  /** viewBox origin — paths are drawn offset by these values */
  viewBoxMinX?: number;
  viewBoxMinY?: number;
  /** Canvas fill rule when pathStyle is fill */
  fillRule?: CanvasFillRule;
  /** Subtle idle shimmer amplitude (px) when the pointer is not interacting */
  idleMotion?: number;
  /** Idle = shimmering blob; hover = particles form the SVG shape */
  revealOnHover?: boolean;
  /** Blob shimmer speed multiplier when revealOnHover is on */
  blobShimmerSpeed?: number;
  /** Blob shimmer amplitude (px) when revealOnHover is on */
  blobShimmerAmplitude?: number;
  /** Blob radius as a fraction of canvas width/height (larger = wider spread) */
  blobSpread?: number;
  /** Idle blob layout: filled disc or tilted orbital rings */
  blobStyle?: "disc" | "atom";
  /** How quickly blob particles chase the shimmer target (0–1) */
  blobFollowSpeed?: number;
  /** How quickly particles snap into the shape on hover (0–1) */
  formReturnSpeed?: number;
  /** Keep particles in the formed shape (parent hover / preview) */
  forceRevealed?: boolean;
  /** When set, overrides hover detection — true = phone, false = blob */
  formedOverride?: boolean;
};

export default function SVGParticles({
  svgPath,
  viewBoxWidth = 100,
  viewBoxHeight = 100,
  logoHeight: desktopLogoHeight = 120,
  mobileLogoHeight = 60,
  scatteredColor = "#00DCFF",
  particleColor = "white",
  backgroundColor = "black",
  pathStyle = "fill",
  strokeWidth = 1,
  lineJoin = "miter",
  lineCap = "butt",
  forceMu = 1,
  interactionMode = "scatter",
  returnSpeed = 0.1,
  friction = 0.95,
  enableParticleDeath = true,
  particleDensity = 1,
  particleSizeMin = 0.5,
  particleSizeMax = 1.5,
  viewBoxMinX = 0,
  viewBoxMinY = 0,
  fillRule = "nonzero",
  idleMotion = 0,
  revealOnHover = false,
  blobShimmerSpeed = 7,
  blobShimmerAmplitude = 5,
  blobSpread = 0.22,
  blobStyle = "disc",
  blobFollowSpeed = 0.42,
  formReturnSpeed = 0.22,
  forceRevealed = false,
  formedOverride,
  className,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseInsideRef = useRef(false);
  const isTouchingRef = useRef(false);
  const forceRevealedRef = useRef(forceRevealed);
  const formedOverrideRef = useRef(formedOverride);
  forceRevealedRef.current = forceRevealed;
  formedOverrideRef.current = formedOverride;
  const svgPathKey = Array.isArray(svgPath) ? svgPath.join("|") : svgPath;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasWidth = 0;
    let canvasHeight = 0;

    const isCompactLayout = () =>
      (container?.getBoundingClientRect().width ?? 0) < 768;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      let width = rect.width;
      let height = rect.height;
      if (revealOnHover && blobStyle === "atom") {
        const size = Math.max(width, height);
        width = size;
        height = size;
      }
      canvas.width = width;
      canvas.height = height;
      canvasWidth = width;
      canvasHeight = height;
    };

    updateCanvasSize();

    function isFormed() {
      const override = formedOverrideRef.current;
      if (override === true) return true;
      if (override === false) return false;
      const pointerActive =
        isMouseInsideRef.current || isTouchingRef.current;
      return pointerActive || forceRevealedRef.current;
    }

    function snapParticlesToFormed() {
      for (const p of particles) {
        p.x = p.baseX;
        p.y = p.baseY;
      }
    }

    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      blobX: number;
      blobY: number;
      orbitA: number;
      orbitB: number;
      orbitTilt: number;
      orbitPhase: number;
      orbitSpeed: number;
      wobble: number;
      size: number;
      life: number;
      vx: number;
      vy: number;
      phase: number;
    }[] = [];

    let textImageData: ImageData | null = null;

    function createTextImage() {
      if (!ctx || !canvas) return 0;

      ctx.fillStyle = particleColor;
      ctx.save();

      const logoHeight = isCompactLayout() ? mobileLogoHeight : desktopLogoHeight;
      const scale = logoHeight / viewBoxHeight;
      const logoWidth = viewBoxWidth * scale;

      ctx.translate(
        canvas.width / 2 - logoWidth / 2,
        canvas.height / 2 - logoHeight / 2,
      );

      ctx.scale(scale, scale);
      ctx.translate(-viewBoxMinX, -viewBoxMinY);

      const paths = Array.isArray(svgPath) ? svgPath : [svgPath];
      for (const pathStr of paths) {
        const path = new Path2D(pathStr);
        if (pathStyle === "stroke") {
          ctx.strokeStyle = particleColor;
          ctx.lineWidth = strokeWidth;
          ctx.lineJoin = lineJoin;
          ctx.lineCap = lineCap;
          ctx.stroke(path);
        } else {
          ctx.fill(path, fillRule);
        }
      }

      ctx.restore();

      if (canvas.width === 0 || canvas.height === 0) {
        return scale;
      }

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      return scale;
    }

    function createParticle() {
      if (!ctx || !canvas || !textImageData) return null;

      const data = textImageData.data;

      const spawnAttempts = Math.max(100, Math.floor(400 * particleDensity));
      for (let attempt = 0; attempt < spawnAttempts; attempt++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          const sizeSpan = particleSizeMax - particleSizeMin;
          return {
            x,
            y,
            baseX: x,
            baseY: y,
            blobX: x,
            blobY: y,
            orbitA: 0,
            orbitB: 0,
            orbitTilt: 0,
            orbitPhase: 0,
            orbitSpeed: 0,
            wobble: Math.random() * Math.PI * 2,
            size: Math.random() * sizeSpan + particleSizeMin,
            life: Math.random() * 100 + 50,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
          };
        }
      }

      return null;
    }

    function blobRadii() {
      if (!canvas) return { rx: 0, ry: 0 };
      return {
        rx: canvas.width * blobSpread,
        ry: canvas.height * blobSpread,
      };
    }

    function atomPosition(
      p: (typeof particles)[number],
      now: number,
    ) {
      if (!canvas) return { x: p.blobX, y: p.blobY };
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const t = (now - animStart) * 0.001;
      const theta = p.orbitPhase + t * p.orbitSpeed;
      const lx = p.orbitA * Math.cos(theta);
      const ly = p.orbitB * Math.sin(theta);
      const cos = Math.cos(p.orbitTilt);
      const sin = Math.sin(p.orbitTilt);
      const wobbleAmp = blobShimmerAmplitude * 0.35;
      const wx = Math.sin(t * blobShimmerSpeed * 0.7 + p.wobble) * wobbleAmp;
      const wy = Math.cos(t * blobShimmerSpeed * 0.55 + p.wobble * 1.3) * wobbleAmp;

      return {
        x: cx + lx * cos - ly * sin + wx,
        y: cy + lx * sin + ly * cos + wy,
      };
    }

    function initAtomOrbit(p: (typeof particles)[number], index: number) {
      if (!canvas) return;
      const spread = blobSpread;
      const half = Math.min(canvas.width, canvas.height) * 0.5;
      const shell = index % 5;
      const shellScale = 0.55 + shell * 0.18;
      const axis = half * spread * shellScale;

      p.orbitA = axis * (0.9 + Math.random() * 0.35);
      p.orbitB = axis * (0.28 + Math.random() * 0.22);
      p.orbitTilt = (shell * Math.PI) / 5 + Math.random() * 0.9;
      p.orbitPhase = Math.random() * Math.PI * 2;
      p.orbitSpeed =
        blobShimmerSpeed *
        0.055 *
        (0.65 + Math.random() * 0.7) *
        (Math.random() > 0.5 ? 1 : -1);
      p.wobble = Math.random() * Math.PI * 2;

      const pos = atomPosition(p, animStart);
      p.blobX = pos.x;
      p.blobY = pos.y;
      if (revealOnHover) {
        p.x = pos.x;
        p.y = pos.y;
      }
    }

    function assignBlobPositions() {
      if (!canvas) return;
      if (blobStyle === "atom") {
        particles.forEach((p, i) => initAtomOrbit(p, i));
        return;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const { rx, ry } = blobRadii();

      for (const p of particles) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());
        p.blobX = cx + Math.cos(angle) * rx * radius;
        p.blobY = cy + Math.sin(angle) * ry * radius;
        if (revealOnHover) {
          p.x = p.blobX;
          p.y = p.blobY;
        }
      }
    }

    function seedBlobPosition(p: (typeof particles)[number], index: number) {
      if (blobStyle === "atom") {
        initAtomOrbit(p, index);
        return;
      }
      if (!canvas) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const { rx, ry } = blobRadii();
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());
      p.blobX = cx + Math.cos(angle) * rx * radius;
      p.blobY = cy + Math.sin(angle) * ry * radius;
      p.x = p.blobX;
      p.y = p.blobY;
    }

    function blobTarget(p: (typeof particles)[number], now: number) {
      if (blobStyle === "atom") return atomPosition(p, now);
      return blobOffset(p.blobX, p.blobY, p.phase, now);
    }

    function createInitialParticles() {
      if (!ctx || !canvas) return;

      const baseParticleCount = 7000 * particleDensity;
      const particleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      );
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        if (particle) particles.push(particle);
      }
      if (revealOnHover && !isFormed()) assignBlobPositions();
      if (isFormed()) snapParticlesToFormed();
    }

    let animationFrameId: number;
    const animStart = performance.now();

    function blobOffset(blobX: number, blobY: number, phase: number, now: number) {
      const t = (now - animStart) * 0.001;
      return {
        x: blobX + Math.sin(t * blobShimmerSpeed + phase + blobX * 0.06) * blobShimmerAmplitude,
        y: blobY + Math.cos(t * blobShimmerSpeed * 1.25 + phase * 1.5 + blobY * 0.06) * blobShimmerAmplitude,
      };
    }

    function cloudAlpha(x: number, y: number, now: number) {
      if (!canvas) return 1;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseR = Math.min(canvas.width, canvas.height) * 0.46 * blobSpread;
      const angle = Math.atan2(y - cy, x - cx);
      const t = (now - animStart) * 0.001;
      const wobble =
        Math.sin(angle * 3 + t * 0.9) * baseR * 0.07 +
        Math.cos(angle * 5 - t * 0.7) * baseR * 0.05;
      const edgeR = baseR + wobble;
      const dist = Math.hypot(x - cx, y - cy);
      const soft = baseR * 0.24;
      if (dist > edgeR + soft) return 0;
      if (dist < edgeR - soft) return 1;
      return 1 - (dist - (edgeR - soft)) / (soft * 2);
    }

    function idleOffset(baseX: number, baseY: number, phase: number, now: number) {
      if (idleMotion <= 0) return { x: baseX, y: baseY };
      const t = (now - animStart) * 0.001;
      return {
        x: baseX + Math.sin(t * 2.1 + phase + baseX * 0.05) * idleMotion,
        y: baseY + Math.cos(t * 1.65 + phase * 1.4 + baseY * 0.05) * idleMotion,
      };
    }

    function animate(now: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = 240;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (revealOnHover) {
          const formed = isFormed();
          const target = formed
            ? { x: p.baseX, y: p.baseY }
            : blobTarget(p, now);
          const follow = formed ? 1 : blobFollowSpeed;

          p.x += (target.x - p.x) * follow;
          p.y += (target.y - p.y) * follow;

          const alpha = formed ? 1 : cloudAlpha(p.x, p.y, now);
          if (alpha <= 0.03) {
            ctx.globalAlpha = 1;
            continue;
          }

          ctx.globalAlpha = alpha;
          ctx.fillStyle = formed ? particleColor : scatteredColor;
        } else {
        const pointerActive =
          isMouseInsideRef.current || isTouchingRef.current;
        const isInteracting =
          pointerActive &&
          distance < maxDistance &&
          (isTouchingRef.current || !("ontouchstart" in window));

        const idle = idleOffset(p.baseX, p.baseY, p.phase, now);

        if (interactionMode === "spill") {
          if (isInteracting) {
            const force = (forceMu * (maxDistance - distance)) / maxDistance;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force * 2;
            p.vy -= Math.sin(angle) * force * 2;
          } else if (idleMotion > 0) {
            p.vx += (idle.x - p.x) * 0.04;
            p.vy += (idle.y - p.y) * 0.04;
          }

          p.x += p.vx;
          p.y += p.vy;

          p.vx *= friction;
          p.vy *= friction;

          const homeX = isInteracting ? p.baseX : idle.x;
          const homeY = isInteracting ? p.baseY : idle.y;
          const returnDx = homeX - p.x;
          const returnDy = homeY - p.y;
          p.vx += returnDx * returnSpeed * 0.1;
          p.vy += returnDy * returnSpeed * 0.1;

          const distFromBase = Math.sqrt(
            returnDx * returnDx + returnDy * returnDy,
          );
          ctx.fillStyle = distFromBase > 2 ? scatteredColor : particleColor;
        } else {
          if (isInteracting) {
            const force = (forceMu * (maxDistance - distance)) / maxDistance;
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * force * 60;
            const moveY = Math.sin(angle) * force * 60;
            p.x = p.baseX - moveX;
            p.y = p.baseY - moveY;

            ctx.fillStyle = scatteredColor;
          } else {
            const idleFollow = Math.max(returnSpeed, 0.38);
            p.x += (idle.x - p.x) * idleFollow;
            p.y += (idle.y - p.y) * idleFollow;
            ctx.fillStyle = particleColor;
          }
        }
        }

        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;

        if (enableParticleDeath) p.life--;
        if (p.life <= 0) {
          const newParticle = createParticle();
          if (newParticle) {
            if (revealOnHover) seedBlobPosition(newParticle, i);
            particles[i] = newParticle;
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      const baseParticleCount = 7000 * particleDensity;
      const targetParticleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      );
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle();
        if (newParticle) {
          if (revealOnHover) seedBlobPosition(newParticle, particles.length);
          particles.push(newParticle);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    createTextImage();
    createInitialParticles();
    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const prevW = canvasWidth;
      const prevH = canvasHeight;
      updateCanvasSize();
      if (canvasWidth === prevW && canvasHeight === prevH) return;
      createTextImage();
      particles = [];
      createInitialParticles();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const handleMove = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = { x: x - rect.left, y: y - rect.top };
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = () => {
      isTouchingRef.current = true;
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      mousePositionRef.current = { x: 0, y: 0 };
    };

    const handleMouseEnter = () => {
      isMouseInsideRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInsideRef.current = false;
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 };
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [
    svgPathKey,
    viewBoxWidth,
    viewBoxHeight,
    desktopLogoHeight,
    mobileLogoHeight,
    scatteredColor,
    particleColor,
    backgroundColor,
    pathStyle,
    strokeWidth,
    lineJoin,
    lineCap,
    forceMu,
    interactionMode,
    returnSpeed,
    friction,
    enableParticleDeath,
    particleDensity,
    particleSizeMin,
    particleSizeMax,
    viewBoxMinX,
    viewBoxMinY,
    fillRule,
    idleMotion,
    revealOnHover,
    blobShimmerSpeed,
    blobShimmerAmplitude,
    blobSpread,
    blobStyle,
    blobFollowSpeed,
    formReturnSpeed,
  ]);

  return (
    <div ref={containerRef} className={cn("relative", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 h-full w-full touch-none"
        aria-label="Interactive particle effect"
      />
    </div>
  );
}
