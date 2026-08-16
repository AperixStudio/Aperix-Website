import puppeteer from "puppeteer";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin-Desktop-Aperix/6c2ef8e2-1a6a-439d-9b2a-d3059a1767b1/scratchpad";

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#home-hero h1", { timeout: 30000 });
await new Promise((r) => setTimeout(r, 4500));

const top = await page.evaluate(() => document.getElementById("our-work").offsetTop);
await page.evaluate((t) => window.scrollTo(0, t + 700), top);
await new Promise((r) => setTimeout(r, 1000));

// park the cursor and let everything settle into the round blob
await page.mouse.move(1000, 300, { steps: 10 });
await new Promise((r) => setTimeout(r, 1800));

const info = await page.evaluate(() => {
  const reveal = document.querySelector(".home-work__lens");
  const cs = getComputedStyle(reveal);
  const r = reveal.getBoundingClientRect();
  return {
    backdropFilter: cs.backdropFilter,
    background: cs.backgroundColor,
    opacity: cs.opacity,
    zIndex: cs.zIndex,
    rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`,
    clipStart: (reveal.style.clipPath || "").slice(0, 60),
    backdropFillComputed: getComputedStyle(document.querySelector(".home-work__backdrop-fill")).fill,
  };
});
console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: `${OUT}/probe-blob-with.png`, clip: { x: 800, y: 100, width: 420, height: 420 } });

// Turn the tint+filter off to see what the raw hole looks like underneath.
await page.evaluate(() => {
  const reveal = document.querySelector(".home-work__lens");
  reveal.style.setProperty("backdrop-filter", "none");
  reveal.style.background = "transparent";
});
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: `${OUT}/probe-blob-without.png`, clip: { x: 800, y: 100, width: 420, height: 420 } });

await browser.close();
