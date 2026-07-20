#!/usr/bin/env node
//
// capture-figures.js
//
// Headless-Chrome screenshots of every diagram in every essay → exported/figures/.
// Each PNG matches a "![Figure N — …]" placeholder in exported/<slug>.md.
//
//   • <figure className="v4-figure"> wrappers (SVG or HTML diagrams, with chrome)
//   • bordered <div>s containing an SVG/canvas (fisher / may / turing centrepieces)
//
// Interactive diagrams with a range slider get TWO frames — the slider low and
// high — so the static Substack version shows the thing actually responding.
// A manifest.json records, per figure, its frame filenames + slider label, which
// export-markdown.js reads to lay the frames out.
//
// Usage:
//   node scripts/capture-figures.js                              # all essays vs. production
//   node scripts/capture-figures.js fisher-wave --base http://localhost:4321
//
// Requires:  npm install puppeteer

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let puppeteer;
try { puppeteer = (await import("puppeteer")).default; }
catch { console.error("puppeteer is not installed. Run `npm install puppeteer` first."); process.exit(1); }

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exported", "figures");

const ESSAYS = [
  "bluedot-unit1", "bluedot-assumptions", "bluedot-vocabulary", "bluedot-civilization",
  "bluedot-killchain", "zx-calculus", "jaya", "fashion-trends", "threshold-gate",
  "constraint-clustering", "six-engines", "turing-morphogenesis", "may-2026", "fisher-wave",
];

// --- args -----------------------------------------------------------------
let baseUrl = "https://shubzsharma.com";
const positional = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === "--base" || a === "-b") baseUrl = process.argv[++i];
  else if (a === "--list" || a === "-l") { console.log("essays:"); ESSAYS.forEach((s) => console.log(`  ${s}`)); process.exit(0); }
  else positional.push(a);
}
const slugs = positional.length ? positional : ESSAYS;
const SLIDER_STOPS = [["a", 0.18], ["b", 0.9]]; // low, high

// --- main -----------------------------------------------------------------
(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 2 });

  // load any existing manifest so a single-essay run doesn't wipe the rest
  const manifestPath = path.join(OUT_DIR, "manifest.json");
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")); } catch {}

  let total = 0;

  for (const slug of slugs) {
    const url = `${baseUrl}/${slug}`;
    process.stdout.write(`→ ${url}\n`);
    manifest[slug] = [];

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector("article", { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 2800)); // hydration + animation settle

      // tag every figure container in document order; note if it has a slider
      const metas = await page.evaluate(() => {
        const article = document.querySelector("article") || document.body;
        const seen = new Set(); const rows = [];
        const consider = (el) => {
          if (!el || seen.has(el)) return;
          const b = el.getBoundingClientRect();
          if (b.width < 240 || b.height < 110) return;
          seen.add(el); rows.push({ el, top: b.top + window.scrollY });
        };
        article.querySelectorAll("figure.v4-figure").forEach(consider);
        article.querySelectorAll("svg, canvas").forEach((g) => {
          const gb = g.getBoundingClientRect();
          if (gb.width < 240 || gb.height < 140) return;
          if (g.closest("figure.v4-figure")) return;
          let t = g, el = g.parentElement, d = 0;
          while (el && el !== article && d < 6) {
            const st = getComputedStyle(el);
            if (st.borderTopStyle === "solid" && st.borderTopWidth !== "0px") { t = el; break; }
            el = el.parentElement; d++;
          }
          consider(t);
        });
        rows.sort((a, b) => a.top - b.top);
        return rows.map(({ el }, i) => {
          el.setAttribute("data-cap", String(i));
          const range = el.querySelector('input[type="range"]');
          return { i, hasSlider: !!range, sliderLabel: range ? (range.getAttribute("aria-label") || "") : "" };
        });
      });

      if (metas.length === 0) { console.log("  (no figures found)"); continue; }

      for (const meta of metas) {
        const n = meta.i + 1, nn = String(n).padStart(2, "0");
        const handle = await page.$(`[data-cap="${meta.i}"]`);
        if (!handle) continue;
        await handle.evaluate((el) => el.scrollIntoView({ block: "center" })).catch(() => {});
        await new Promise((r) => setTimeout(r, 300));

        if (meta.hasSlider) {
          const sel = `[data-cap="${meta.i}"] input[type="range"]`;
          const frames = [];
          for (const [suffix, frac] of SLIDER_STOPS) {
            await page.evaluate((s, f) => {
              const r = document.querySelector(s); if (!r) return;
              const min = parseFloat(r.min) || 0, max = parseFloat(r.max) || 1;
              const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
              setter.call(r, String(min + (max - min) * f));
              r.dispatchEvent(new Event("input", { bubbles: true }));
              r.dispatchEvent(new Event("change", { bubbles: true }));
            }, sel, frac);
            await new Promise((r) => setTimeout(r, 1000)); // let it respond
            const fn = `${slug}-${nn}-${suffix}.png`;
            await handle.screenshot({ path: path.join(OUT_DIR, fn) });
            frames.push(fn); total++;
            console.log(`  ✓ ${fn}  (slider ${suffix === "a" ? "low" : "high"}${meta.sliderLabel ? " · " + meta.sliderLabel : ""})`);
          }
          manifest[slug].push({ n, slider: true, sliderLabel: meta.sliderLabel, frames });
        } else {
          const fn = `${slug}-${nn}.png`;
          await handle.screenshot({ path: path.join(OUT_DIR, fn) });
          total++; console.log(`  ✓ ${fn}`);
          manifest[slug].push({ n, slider: false, frames: [fn] });
        }
      }
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log(`\n${total} frame(s) captured into ${path.relative(ROOT, OUT_DIR)}/  ·  manifest.json written`);
})();
