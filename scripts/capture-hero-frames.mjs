#!/usr/bin/env node
/**
 * Capture hero WebGL frames via Puppeteer for offline video export.
 *
 * Prerequisites:
 *   1. Dev server running: npm run dev
 *   2. Optional for MP4: ffmpeg on PATH
 *
 * Examples:
 *   node scripts/capture-hero-frames.mjs --act 1 --frames 90 --out ./captures/act1
 *   node scripts/capture-hero-frames.mjs --act 2 --frames 120 --out ./captures/act2 --video ./captures/act2.mp4
 *   node scripts/capture-hero-frames.mjs --story --frames 180 --out ./captures/full --video ./captures/full.mp4
 */

import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

function parseArgs(argv) {
  const options = {
    url: "http://localhost:3000/dev/hero-capture",
    act: 1,
    story: false,
    frames: 60,
    fps: 30,
    out: "./captures/hero",
    video: "",
    width: 1920,
    height: 1080,
    mobile: false,
    timeout: 120_000,
    settleFrames: 3,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--url" && next) {
      options.url = next;
      i += 1;
    } else if (arg === "--act" && next) {
      options.act = Number(next);
      i += 1;
    } else if (arg === "--story") {
      options.story = true;
    } else if (arg === "--frames" && next) {
      options.frames = Number(next);
      i += 1;
    } else if (arg === "--fps" && next) {
      options.fps = Number(next);
      i += 1;
    } else if (arg === "--out" && next) {
      options.out = next;
      i += 1;
    } else if (arg === "--video" && next) {
      options.video = next;
      i += 1;
    } else if (arg === "--width" && next) {
      options.width = Number(next);
      i += 1;
    } else if (arg === "--height" && next) {
      options.height = Number(next);
      i += 1;
    } else if (arg === "--mobile") {
      options.mobile = true;
    } else if (arg === "--timeout" && next) {
      options.timeout = Number(next);
      i += 1;
    } else if (arg === "--settle-frames" && next) {
      options.settleFrames = Number(next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/capture-hero-frames.mjs [options]

Options:
  --url <url>           Capture page (default: http://localhost:3000/dev/hero-capture)
  --act <1|2>           Act to capture (default: 1)
  --story               Capture Act 1 then Act 2 into one sequence
  --frames <n>          Frame count per act, or total when --story splits 50/50 (default: 60)
  --fps <n>             Output video FPS when using --video (default: 30)
  --out <dir>           Output directory for PNG frames (default: ./captures/hero)
  --video <file.mp4>    Optional MP4 path (requires ffmpeg)
  --width <px>          Viewport width (default: 1920)
  --height <px>         Viewport height (default: 1080)
  --mobile              Mobile hero config + viewport framing
  --timeout <ms>        Scene ready timeout (default: 120000)
  --settle-frames <n>   rAF frames to wait after each scrub (default: 3)
`);
}

function scrubForIndex(index, total) {
  if (total <= 1) {
    return 0;
  }
  return index / (total - 1);
}

async function waitForCaptureApi(page, timeoutMs) {
  await page.waitForFunction(
    () => typeof window.__HERO_CAPTURE__?.waitForReady === "function",
    { timeout: timeoutMs },
  );

  await page.waitForSelector('[data-hero-capture-ready="true"]', { timeout: timeoutMs });
}

async function setCaptureProgress(page, input, settleFrames) {
  await page.evaluate(
    async ({ payload, settle }) => {
      await window.__HERO_CAPTURE__.setProgress(payload);
      await window.__HERO_CAPTURE__.waitForFrameSettle(settle);
    },
    { payload: input, settle: settleFrames },
  );
}

async function screenshotCanvas(page, filePath) {
  const canvas = await page.$("canvas");
  if (!canvas) {
    throw new Error("No WebGL canvas found on capture page");
  }
  await canvas.screenshot({ path: filePath, type: "png" });
}

async function captureAct(page, options, act, frameCount, startIndex) {
  const query = new URLSearchParams({
    act: String(act),
    ...(options.mobile ? { mobile: "1" } : {}),
  });

  await page.goto(`${options.url}?${query.toString()}`, {
    waitUntil: "networkidle2",
    timeout: options.timeout,
  });

  await waitForCaptureApi(page, options.timeout);

  for (let i = 0; i < frameCount; i += 1) {
    const scrub = scrubForIndex(i, frameCount);
    await setCaptureProgress(
      page,
      { act, scrub, mobile: options.mobile },
      options.settleFrames,
    );

    const frameNumber = startIndex + i;
    const filename = path.join(
      options.out,
      `frame_${String(frameNumber).padStart(5, "0")}.png`,
    );
    await screenshotCanvas(page, filename);
    process.stdout.write(`\rCaptured frame ${frameNumber + 1} (act ${act}, scrub ${(scrub * 100).toFixed(1)}%)`);
  }

  process.stdout.write("\n");
  return startIndex + frameCount;
}

function runFfmpeg(inputDir, outputFile, fps) {
  return new Promise((resolve, reject) => {
    const inputPattern = path.join(inputDir, "frame_%05d.png");
    const args = [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      inputPattern,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "18",
      "-movflags",
      "+faststart",
      outputFile,
    ];

    const child = spawn("ffmpeg", args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const options = parseArgs(process.argv);
  await mkdir(options.out, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: options.width,
      height: options.height,
      deviceScaleFactor: 1,
    });

    let nextFrameIndex = 0;

    if (options.story) {
      const act1Frames = Math.ceil(options.frames / 2);
      const act2Frames = options.frames - act1Frames;
      nextFrameIndex = await captureAct(page, options, 1, act1Frames, nextFrameIndex);
      nextFrameIndex = await captureAct(page, options, 2, act2Frames, nextFrameIndex);
    } else {
      await captureAct(page, options, options.act, options.frames, nextFrameIndex);
    }

    if (options.video) {
      console.log(`Encoding ${options.video}…`);
      await runFfmpeg(options.out, options.video, options.fps);
      console.log(`Video written to ${options.video}`);
    }

    console.log(`Frames saved in ${path.resolve(options.out)}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  console.error("\nTips:");
  console.error("  • Run `npm run dev` in another terminal first");
  console.error("  • Open http://localhost:3000/dev/hero-capture in a browser to verify it loads");
  console.error("  • Increase --timeout 180000 if the GLB model is slow to load");
  process.exit(1);
});
