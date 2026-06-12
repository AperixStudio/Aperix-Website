/** Canvas-drawn site evolution: blueprint → wireframe → live site mock. */

export const DESK_SCREEN_WIDTH = 960;
export const DESK_SCREEN_HEIGHT = 600;

const W = DESK_SCREEN_WIDTH;
const H = DESK_SCREEN_HEIGHT;

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function drawBrowserChrome(ctx, variant) {
  ctx.fillStyle = variant === "blueprint" ? "#0a1628" : variant === "wireframe" ? "#1a1a1a" : "#262626";
  ctx.fillRect(0, 0, W, 40);

  const dots = ["#ff5f57", "#febc2e", "#28c840"];
  dots.forEach((color, index) => {
    ctx.fillStyle = variant === "blueprint" ? "rgba(224, 242, 254, 0.35)" : color;
    ctx.beginPath();
    ctx.arc(20 + index * 18, 20, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle =
    variant === "blueprint"
      ? "rgba(147, 197, 253, 0.18)"
      : variant === "wireframe"
        ? "#333333"
        : "#404040";
  ctx.beginPath();
  ctx.roundRect(W * 0.22, 10, W * 0.56, 20, 10);
  ctx.fill();
}

function drawBlueprint(ctx) {
  ctx.fillStyle = "#081526";
  ctx.fillRect(0, 0, W, H);
  drawBrowserChrome(ctx, "blueprint");

  ctx.strokeStyle = "rgba(147, 197, 253, 0.18)";
  ctx.lineWidth = 1;
  const grid = 40;
  for (let x = 0; x <= W; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 40; y <= H; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(224, 242, 254, 0.9)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 5]);

  const boxes = [
    [64, 72, W - 128, 64],
    [64, 160, W - 128, 220],
    [64, 408, (W - 160) / 3, 128],
    [64 + (W - 160) / 3 + 16, 408, (W - 160) / 3, 128],
    [64 + ((W - 160) / 3 + 16) * 2, 408, (W - 160) / 3, 128],
  ];

  boxes.forEach(([x, y, width, height]) => {
    ctx.strokeRect(x, y, width, height);
  });

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(224, 242, 254, 0.88)";
  ctx.font = "600 22px monospace";
  ctx.fillText("SITE PLAN v1.0", 80, 108);
  ctx.font = "15px monospace";
  ctx.fillText("HEADER", 80, 196);
  ctx.fillText("HERO BLOCK", 80, 268);
  ctx.fillText("FEATURE A", 80, 456);
  ctx.fillText("FEATURE B", 80 + (W - 160) / 3 + 16, 456);
  ctx.fillText("FEATURE C", 80 + ((W - 160) / 3 + 16) * 2, 456);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 300);
  ctx.lineTo(W - 80, 380);
  ctx.stroke();
  ctx.fillStyle = "rgba(125, 211, 252, 0.75)";
  ctx.font = "12px monospace";
  ctx.fillText("measure content flow →", W - 220, 392);
}

function drawWireframe(ctx) {
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, W, H);
  drawBrowserChrome(ctx, "wireframe");

  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 40, W, 56);
  ctx.fillRect(64, 120, W - 128, 220);
  ctx.fillRect(64, 368, (W - 160) / 3, 128);
  ctx.fillRect(64 + (W - 160) / 3 + 16, 368, (W - 160) / 3, 128);
  ctx.fillRect(64 + ((W - 160) / 3 + 16) * 2, 368, (W - 160) / 3, 128);

  ctx.strokeStyle = "#525252";
  ctx.lineWidth = 2;
  [
    [64, 120, W - 128, 220],
    [64, 368, (W - 160) / 3, 128],
    [64 + (W - 160) / 3 + 16, 368, (W - 160) / 3, 128],
    [64 + ((W - 160) / 3 + 16) * 2, 368, (W - 160) / 3, 128],
  ].forEach(([x, y, width, height]) => {
    ctx.strokeRect(x, y, width, height);
  });

  ctx.fillStyle = "#737373";
  ctx.fillRect(88, 144, 280, 16);
  ctx.fillRect(88, 176, 420, 12);
  ctx.fillRect(88, 200, 360, 12);
  ctx.fillRect(88, 232, 200, 48);

  ctx.font = "600 14px monospace";
  ctx.fillStyle = "#a3a3a3";
  ctx.fillText("WIREFRAME DRAFT", 80, 68);
  ctx.fillText("Structure locked — awaiting content", 88, 288);
}

function drawLiveSite(ctx) {
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, W, H);
  drawBrowserChrome(ctx, "live");

  const gradient = ctx.createLinearGradient(0, 40, W, 40);
  gradient.addColorStop(0, "#0ea5e9");
  gradient.addColorStop(1, "#38bdf8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 40, W, 56);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText("Your Brand", 80, 74);

  ctx.fillStyle = "#f3f4f6";
  ctx.font = "700 42px system-ui, sans-serif";
  ctx.fillText("Built to perform.", 80, 168);
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillStyle = "#a3a3a3";
  ctx.fillText("Fast, clear, and ready from day one.", 80, 208);

  ctx.fillStyle = "#84cc16";
  ctx.beginPath();
  ctx.roundRect(80, 236, 168, 46, 10);
  ctx.fill();
  ctx.fillStyle = "#171717";
  ctx.font = "600 15px system-ui, sans-serif";
  ctx.fillText("Start your project", 98, 266);

  const cards = ["Custom code", "Fast pages", "Ongoing support"];
  cards.forEach((label, index) => {
    const cardWidth = (W - 160) / 3;
    const x = 64 + index * (cardWidth + 16);
    ctx.fillStyle = "#262626";
    ctx.beginPath();
    ctx.roundRect(x, 368, cardWidth, 128, 14);
    ctx.fill();
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.fillText(label, x + 18, 408);
  });

  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(W - 88, 68, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 13px monospace";
  ctx.fillText("LIVE", W - 128, 72);
}

function blendPhase(ctx, drawFn, alpha) {
  if (alpha <= 0) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  drawFn(ctx);
  ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} progress 0–1 scroll progress
 */
export function drawDeskScreen(ctx, progress) {
  const blueprintWeight = 1 - smoothstep(0.22, 0.42, progress);
  const wireframeWeight =
    smoothstep(0.18, 0.38, progress) * (1 - smoothstep(0.52, 0.72, progress));
  const liveWeight = smoothstep(0.58, 0.78, progress);

  ctx.clearRect(0, 0, W, H);
  blendPhase(ctx, drawBlueprint, blueprintWeight);
  blendPhase(ctx, drawWireframe, wireframeWeight);
  blendPhase(ctx, drawLiveSite, liveWeight);

  if (blueprintWeight + wireframeWeight + liveWeight < 0.05) {
    drawBlueprint(ctx);
  }
}
