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

// resting blob
await page.mouse.move(1000, 300, { steps: 10 });
await new Promise(r => setTimeout(r, 1800));
await page.screenshot({ path: `${OUT}/final-rest.png`, captureBeyondViewport: false });

// fast sweep -> long tail, capture mid-motion
await page.mouse.move(1250, 130, { steps: 3 });
await new Promise(r => setTimeout(r, 40));
await page.mouse.move(450, 340, { steps: 5 });
await page.screenshot({ path: `${OUT}/final-sweep.png`, captureBeyondViewport: false });
console.log("ok");
await browser.close();
