// Walks the whole journey at four screen sizes and saves a screenshot of
// every scene to ./screenshots. Serve `out` on port 3000 first.
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const dir = resolve("screenshots");
mkdirSync(dir, { recursive: true });

const sizes = [
  { name: "360x800", width: 360, height: 800, mobile: true },
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "768x1024", width: 768, height: 1024, mobile: true },
  { name: "1440x900", width: 1440, height: 900, mobile: false },
];
const guest = process.env.GUEST ?? "Uncle Ahmed & family";
const SCENES = ["names", "date", "venue", "be-on-time", "note", "location", "big-day", "keepsake"];
const UNIT = 0.82; // scene length minus overlap
const TOTAL = 7 * UNIT + 1;

// Use a locally installed Chromium when Playwright's own download is absent.
const launchOptions = process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};
const browser = await chromium.launch(launchOptions);
const problems = [];

for (const size of sizes) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.mobile ? 2 : 1,
    isMobile: size.mobile,
    hasTouch: size.mobile,
    userAgent: size.mobile ? devices["iPhone 13"].userAgent : undefined,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    // 404s are the probes for optional plates and the song.
    if (m.type() === "error" && !/google|maps|404/i.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  const shot = (name) => page.screenshot({ path: resolve(dir, `${size.name}-${name}.png`) });

  await page.goto(`${base}/?to=${encodeURIComponent(guest)}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await shot("00-envelope");

  const seal = page.getByRole("button", { name: "Tap to open" }).first();
  await seal.click();
  await page.waitForTimeout(1200);
  await shot("01-envelope-opening");
  await page.waitForTimeout(2600);
  await shot("02-doors");

  const latch = page.getByRole("button", { name: "Tap to open" }).first();
  await latch.click({ force: true });
  await page.waitForTimeout(1500);
  await shot("03-doors-opening");
  await page.waitForTimeout(3500);

  // Horizontal overflow check
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) problems.push(`${size.name}: horizontal scroll present`);

  for (let i = 0; i < SCENES.length; i++) {
    const t = i * UNIT + (i === 0 ? 0.7 : 0.55);
    const p = Math.min(1, t / TOTAL);
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, p * max);
    }, p);
    await page.waitForTimeout(1800);
    if (SCENES[i] === "date") {
      // tap the foil to reveal the date (the fallback), then show the calendar control
      const foil = page.getByRole("button", { name: "Scratch to reveal the date" });
      if (await foil.count()) {
        await shot(`1${i}-date-foil`);
        await foil.first().click({ force: true });
        await page.waitForTimeout(1500);
      }
    }
    if (SCENES[i] === "be-on-time") await page.waitForTimeout(3000);
    await shot(`1${i}-${SCENES[i]}`);
  }

  // Music button present and toggles
  const music = page.getByRole("button", { name: /Music/ });
  if (!(await music.count())) problems.push(`${size.name}: music button missing`);
  else {
    const before = await music.getAttribute("aria-pressed");
    await music.click({ force: true });
    const after = await music.getAttribute("aria-pressed");
    if (before === after) problems.push(`${size.name}: music button did not toggle (${before} -> ${after})`);
  }

  // The map button points at the shared pin
  const href = await page.locator("a.btn-olive").first().getAttribute("href");
  if (!href || !href.startsWith("https://maps.app.goo.gl/")) problems.push(`${size.name}: map link is ${href}`);

  if (errors.length) problems.push(`${size.name}: ${errors.join(" | ")}`);
  await context.close();
}

// Arabic guest name on the envelope
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${base}/?to=${encodeURIComponent("عمو أحمد والعائلة")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.screenshot({ path: resolve(dir, `390x844-00-envelope-arabic.png`) });
  const txt = await page.locator("p.font-script[lang='ar']").first().textContent();
  if (txt !== "عمو أحمد والعائلة") problems.push(`arabic name rendered as ${txt}`);
  await context.close();
}

// Reduced motion: the calm version
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Tap to open" }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "Tap to open" }).first().click({ force: true });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, (1.37 / 6.74) * max);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(dir, `390x844-reduced-motion-date.png`) });
  await context.close();
}

await browser.close();
if (problems.length) {
  console.log("PROBLEMS:\n" + problems.join("\n"));
  process.exitCode = 1;
} else console.log("all checks passed; screenshots in ./screenshots");
