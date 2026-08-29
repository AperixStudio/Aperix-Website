import puppeteer from "puppeteer";
const OUT = "C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin-Desktop-Aperix/6c2ef8e2-1a6a-439d-9b2a-d3059a1767b1/scratchpad";
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#home-hero h1", { timeout: 30000 });
await new Promise(r => setTimeout(r, 4500));
const top = await page.evaluate(() => document.getElementById("our-work").offsetTop);
await page.evaluate((t) => window.scrollTo(0, t + 700), top);
await new Promise(r => setTimeout(r, 1000));

// realistic continuous motion: ~45 small steps along an arc, one per frame
await page.mouse.move(1250, 180);
await new Promise(r => setTimeout(r, 400));

const N = 45;
for (let i = 0; i <= N; i++) {
  const p = i / N;
  const x = 1250 - 700 * p;
  const y = 180 + 200 * Math.sin(p * Math.PI * 0.9);
  await page.mouse.move(x, y);
  await new Promise(r => setTimeout(r, 16));
  if (i === Math.round(N * 0.75)) {
    await page.screenshot({ path: `${OUT}/real-mid.png`, captureBeyondViewport: false });
  }
}
await page.screenshot({ path: `${OUT}/real-end.png`, captureBeyondViewport: false });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: `${OUT}/real-rest.png`, captureBeyondViewport: false });
console.log("ok");
await browser.close();
