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
await page.mouse.move(1000, 300, { steps: 10 });
await new Promise(r => setTimeout(r, 1800));

// EXPERIMENT A: drop clip-path entirely -> is there a big light-blue rectangle?
await page.evaluate(() => {
  const reveal = document.querySelector(".home-work__lens");
  reveal.style.clipPath = "none";
  reveal.__stop = true;
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: `${OUT}/p3-noclip.png`, captureBeyondViewport: false });
console.log("A captured");

// EXPERIMENT B: also hide the blend-mode ribbon svg
await page.evaluate(() => {
  document.querySelector(".home-work__ribbon").style.display = "none";
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: `${OUT}/p3-noclip-noribbon.png`, captureBeyondViewport: false });
console.log("B captured");
await browser.close();
