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
console.log("scrollY:", await page.evaluate(() => window.scrollY));

await page.mouse.move(1000, 300, { steps: 10 });
await new Promise(r => setTimeout(r, 1800));

await page.screenshot({ path: `${OUT}/p2-with.png`, captureBeyondViewport: false });

await page.evaluate(() => {
  const reveal = document.querySelector(".home-work__lens");
  reveal.style.setProperty("backdrop-filter", "none");
  reveal.style.background = "transparent";
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${OUT}/p2-without.png`, captureBeyondViewport: false });
await browser.close();
