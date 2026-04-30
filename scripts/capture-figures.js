#!/usr/bin/env node
//
// capture-figures.js
//
// Headless-Chrome screenshots of every diagram inside every essay, saved as
// PNG. Each PNG matches a "[Live interactive figure → ...]" placeholder in
// the corresponding exported/<slug>.md.
//
// Captures:
//   • <figure className="v4-figure"> wrappers (the standard Figure component)
//   • bordered <div>s containing an SVG (e.g. the May essay's centerpiece)
//
// Usage:
//   node scripts/capture-figures.js                              # all essays vs. production
//   node scripts/capture-figures.js jaya                         # one essay
//   node scripts/capture-figures.js --base http://localhost:8000 # local server
//
// Requires:
//   npm install puppeteer

const fs = require("fs");
const path = require("path");

let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch (e) {
  console.error("puppeteer is not installed. Run `npm install puppeteer` first.");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exported", "figures");

const ESSAYS = [
  "jaya",
  "threshold-gate",
  "constraint-clustering",
  "six-engines",
  "fashion-trends",
  "may-2026",
];

// --- args -----------------------------------------------------------------
let baseUrl = "https://shubzsharma.com";
const positional = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === "--base" || a === "-b") baseUrl = process.argv[++i];
  else if (a === "--list" || a === "-l") {
    console.log("known essays:");
    ESSAYS.forEach((s) => console.log(`  ${s}`));
    process.exit(0);
  } else positional.push(a);
}
const targets = positional.length ? positional : ESSAYS;

// --- main -----------------------------------------------------------------
(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 2 });

  let totalCaptured = 0;

  for (const slug of targets) {
    const url = `${baseUrl}/${slug}`;
    process.stdout.write(`→ ${url}\n`);

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      // Wait for hydration — h1.display means React has mounted the article
      await page.waitForSelector("article h1.display, h1.display", { timeout: 15000 });
      // Let animations settle (LV trail, JAYA swarm motion, etc.)
      await new Promise((r) => setTimeout(r, 2000));

      // Find every diagram container inside the article body. Walk up from
      // each SVG to its nearest "figure-like" ancestor (figure.v4-figure or
      // a bordered div). Dedupe to avoid capturing the same container twice.
      const targets = await page.evaluate(() => {
        const article = document.querySelector("article") || document.body;
        const svgs = Array.from(article.querySelectorAll("svg"));
        const seen = new Set();
        const out = [];
        for (const svg of svgs) {
          const sb = svg.getBoundingClientRect();
          if (sb.width < 240 || sb.height < 140) continue; // skip icons / tiny rails

          let target = svg;
          let el = svg.parentElement;
          let depth = 0;
          while (el && el !== article && depth < 6) {
            if (el.tagName === "FIGURE" && el.classList.contains("v4-figure")) { target = el; break; }
            const style = getComputedStyle(el);
            if (style.borderTopStyle === "solid" && style.borderTopWidth !== "0px") { target = el; break; }
            el = el.parentElement;
            depth++;
          }

          if (seen.has(target)) continue;
          seen.add(target);

          const b = target.getBoundingClientRect();
          out.push({
            x: Math.max(0, Math.round(b.left + window.scrollX)),
            y: Math.max(0, Math.round(b.top + window.scrollY)),
            width: Math.round(b.width),
            height: Math.round(b.height),
          });
        }
        return out;
      });

      if (targets.length === 0) {
        console.log("  (no figures found)");
        continue;
      }

      for (let i = 0; i < targets.length; i++) {
        const clip = targets[i];
        const filename = `${slug}-${String(i + 1).padStart(2, "0")}.png`;
        const outPath = path.join(OUT_DIR, filename);
        await page.screenshot({ path: outPath, clip, omitBackground: false });
        console.log(`  ✓ ${filename}  (${clip.width}×${clip.height})`);
        totalCaptured++;
      }
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n${totalCaptured} figure(s) captured into ${path.relative(ROOT, OUT_DIR)}/`);
})();
