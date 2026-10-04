// Renders the saved poster, the link preview and the Apple touch icon from
// the built site. Run `npm run build`, serve `out` on port 3000, then this.
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const out = resolve("public");
mkdirSync(out, { recursive: true });

// Use a locally installed Chromium when Playwright's own download is absent.
const launchOptions = process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};
const browser = await chromium.launch(launchOptions);
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
};

const poster = await browser.newPage({ viewport: { width: 1024, height: 1536 }, deviceScaleFactor: 1 });
await poster.goto(`${base}/poster/`, { waitUntil: "networkidle" });
await settle(poster);
await poster.screenshot({ path: resolve(out, "poster.jpg"), type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1024, height: 1536 } });

const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await og.goto(`${base}/og/`, { waitUntil: "networkidle" });
await settle(og);
await og.screenshot({ path: resolve(out, "og.jpg"), type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });

const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
const svg = readFileSync(resolve("public/icon.svg"), "utf8");
await icon.setContent(`<html><body style="margin:0;background:#efe5dc">${svg.replace("<svg ", '<svg width="180" height="180" ')}</body></html>`);
await icon.screenshot({ path: resolve(out, "apple-icon.png"), type: "png" });

await browser.close();
console.log("rendered public/poster.jpg, public/og.jpg, public/apple-icon.png");
