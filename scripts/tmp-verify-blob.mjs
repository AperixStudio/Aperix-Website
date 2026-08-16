import puppeteer from "puppeteer";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin-Desktop-Aperix/6c2ef8e2-1a6a-439d-9b2a-d3059a1767b1/scratchpad";

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#home-hero h1", { timeout: 30000 });
await new Promise((r) => setTimeout(r, 4500));

const top = await page.evaluate(() => document.getElementById("our-work").offsetTop);
await page.evaluate((t) => window.scrollTo(0, t + 700), top);
await new Promise((r) => setTimeout(r, 1000));

// Fast sweep to stretch the tail out, capture mid-motion.
await page.mouse.move(1250, 120, { steps: 3 });
await new Promise((r) => setTimeout(r, 40));
await page.mouse.move(500, 300, { steps: 5 });
await page.screenshot({ path: `${OUT}/blob-sweep1.png` });

const state = await page.evaluate(() => {
  const hole = document.querySelector(".home-work__backdrop path");
  const reveal = document.querySelector(".home-work__lens");
  const glowG = document.querySelector(".home-work__ribbon g g");
  const d = hole?.getAttribute("d") ?? "";
  return {
    holeCommandCount: (d.match(/[ML]/g) || []).length,
    holeHasArc: d.includes("A"),
    holeSnippet: d.slice(0, 90),
    revealClip: (reveal?.style.clipPath ?? "").slice(0, 70),
    revealBox: `${reveal?.style.left} ${reveal?.style.top} ${reveal?.style.width} ${reveal?.style.height}`,
    revealOpacity: getComputedStyle(reveal).opacity,
    glowOpacity: glowG ? getComputedStyle(glowG).opacity : null,
  };
});
console.log(JSON.stringify(state, null, 2));

await new Promise((r) => setTimeout(r, 200));
await page.mouse.move(900, 420, { steps: 5 });
await page.screenshot({ path: `${OUT}/blob-sweep2.png` });

// At rest it should collapse to just the round head.
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: `${OUT}/blob-rest.png` });

await browser.close();
