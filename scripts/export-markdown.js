#!/usr/bin/env node
//
// export-markdown.js
//
// Converts each essay React component into a Substack-ready Markdown file
// (also fine for Medium / Ghost / Hashnode). Saved to exported/<slug>.md.
//
//   • sidenotes            → [^n] footnotes (collected at the bottom)
//   • pull-quotes          → blockquotes
//   • equation boxes       → fenced code blocks (keeps the monospace look)
//   • interactive diagrams → a figure placeholder that (a) references the
//                            static capture in exported/figures/<slug>-NN.png
//                            and (b) links to the live interactive version.
//   • drop-cap / place-stamp / headings / lists / links preserved.
//
// Frontmatter carries the canonical URL — set it as the Substack canonical
// so Google credits shubzsharma.com as the original.
//
// Usage:
//   node scripts/export-markdown.js            # all essays → exported/
//   node scripts/export-markdown.js fisher-wave
//   node scripts/export-markdown.js --list
//
// No npm install. Just node.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const ESSAY_DIR = path.join(ROOT, "src/components/essays");
const POSTS_SRC = fs.readFileSync(path.join(ROOT, "src/data/posts.ts"), "utf-8");
const BASE_URL = "https://shubzsharma.com";
const OUT_DIR = path.join(ROOT, "exported");
const RSS_FIGURE_DIR = path.join(ROOT, "public/rss-figures");

// figure manifest (written by capture-figures.js): per essay, each figure's
// frame filename(s) + whether it's a slider sweep. Optional — falls back to
// single "<slug>-NN.png" if the capture hasn't run yet.
let MANIFEST = {};
try { MANIFEST = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "figures", "manifest.json"), "utf-8")); } catch {}

function getFigureEntry(slug, n) {
  const captured = (MANIFEST[slug] || []).find((figure) => figure.n === n);
  if (captured) return captured;

  const stem = `${slug}-${String(n).padStart(2, "0")}`;
  const sliderFrames = [`${stem}-a.png`, `${stem}-b.png`];
  if (sliderFrames.every((filename) =>
    fs.existsSync(path.join(RSS_FIGURE_DIR, filename))
  )) {
    return { n, slider: true, sliderLabel: "slider", frames: sliderFrames };
  }

  const staticFrame = `${stem}.png`;
  if (fs.existsSync(path.join(RSS_FIGURE_DIR, staticFrame))) {
    return { n, slider: false, frames: [staticFrame] };
  }

  return null;
}

// slug → essay component (each lives in src/components/essays/<Component>.tsx)
export const ESSAYS = {
  "bluedot-unit1":         "BluedotEssay",
  "bluedot-assumptions":   "BluedotAssumptionsEssay",
  "bluedot-civilization":  "BluedotCivilizationEssay",
  "bluedot-killchain":     "BluedotKillchainEssay",
  "six-engines":           "SixEnginesEssay",
  "turing-morphogenesis":  "TuringEssay",
  "may-2026":              "MayEssay",
  "fisher-wave":           "FisherWaveEssay",
  "ross-threshold":        "RossThresholdEssay",
  "september-queue": "SeptemberQueueEssay",
  "october-feedback": "OctoberFeedbackEssay",
};

// --- POSTS metadata -------------------------------------------------------
export function getPostMeta(slug) {
  const re = new RegExp(
    `slug:\\s*"${slug}",[\\s\\S]*?title:\\s*"([^"]+)",[\\s\\S]*?kicker:\\s*"([^"]+)",[\\s\\S]*?dek:\\s*"([^"]+)",[\\s\\S]*?minutes:\\s*(\\d+)`,
    "m",
  );
  const m = POSTS_SRC.match(re);
  if (!m) return null;
  const pubM = POSTS_SRC.slice(m.index).match(/publishedAt:\s*"([^"]+)"/);
  return { title: m[1], kicker: m[2], dek: m[3], minutes: Number(m[4]), publishedAt: pubM ? pubM[1] : "" };
}

// --- pull the essay's returned JSX ----------------------------------------
export function getEssayBody(component) {
  const file = path.join(ESSAY_DIR, `${component}.tsx`);
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf-8");
  const re = new RegExp(`function\\s+${component}\\s*\\([^)]*\\)\\s*\\{`, "m");
  const m = src.match(re);
  if (!m) return null;
  // brace-match to the end of the function
  let depth = 1, i = m.index + m[0].length;
  while (i < src.length && depth > 0) {
    const c = src[i++];
    if (c === "{") depth++;
    else if (c === "}") depth--;
  }
  const body = src.slice(m.index + m[0].length, i - 1);
  // the component's main JSX return: return ( <> ... </> );  (greedy: outermost fragment)
  const retM = body.match(/return\s*\(\s*<>([\s\S]*)<\/>\s*\)\s*;/);
  return retM ? retM[1].trim() : null;
}

// --- inline normaliser ----------------------------------------------------
function cleanInline(s) {
  let out = s;
  out = out.replace(/<sub>([\s\S]*?)<\/sub>/g, "_$1");     // u<sub>t</sub> → u_t
  out = out.replace(/<sup>([\s\S]*?)<\/sup>/g, "^$1");
  out = out.replace(/<em(?:\s[^>]*)?>([\s\S]*?)<\/em>/g, "_$1_");
  out = out.replace(/<strong(?:\s[^>]*)?>([\s\S]*?)<\/strong>/g, "**$1**");
  out = out.replace(/<a([^>]*)>([\s\S]*?)<\/a>/g, (_, attrs, text) => {
    const h = attrs.match(/href="([^"]+)"/);
    return `[${cleanInline(text.trim())}](${h ? h[1] : "#"})`;
  });
  out = out.replace(/<span\s+className="mono"[^>]*>([\s\S]*?)<\/span>/g, "`$1`");
  out = out.replace(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/g, "`$1`");
  // strip nested JSX expressions {…}
  let prev; do { prev = out; out = out.replace(/\{[^{}]*\}/g, ""); } while (out !== prev);
  out = out.replace(/<\/?[a-zA-Z][^>]*\/?>/g, "");
  out = out.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&mdash;/g, "—").replace(/&hellip;/g, "…");
  out = out.replace(/[ \t]+/g, " ").trim();
  return out;
}

// --- JSX → Markdown -------------------------------------------------------
export function jsxToMarkdown(jsx, slug) {
  let md = jsx;
  const figures = []; // preserve document order

  // strip §NN mono heading anchors
  md = md.replace(/<span\s+className="mono"[^>]*>§\d+\w*<\/span>\s*/g, "");

  // sidenotes → footnotes
  const notes = [];
  md = md.replace(/<span\s+className="sidenote-number"[^>]*>(\d+)<\/span>/g, (_, n) => `[^${n}]`);
  md = md.replace(/<span\s+className="sidenote"[^>]*>\s*<strong[^>]*>(\d+)\.\s*<\/strong>\s*([\s\S]*?)<\/span>/g,
    (_, n, c) => { notes.push({ n: Number(n), content: cleanInline(c) }); return ""; });

  // pull-quotes → blockquote
  md = md.replace(/<PullQuote(?:\s[^>]*)?>([\s\S]*?)<\/PullQuote>/g,
    (_, c) => `\n\n> ${cleanInline(c)}\n\n`);

  // Ordinary article artwork → image + credit. Unlike interactive diagrams,
  // these already have a public site URL and do not need a screenshot.
  md = md.replace(/<figure\b[^>]*>[\s\S]*?<img\b([\s\S]*?)\/>[\s\S]*?<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g,
    (_, attrs, caption) => {
      const srcMatch = attrs.match(/src="([^"]+)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);
      if (!srcMatch) return "";
      const src = srcMatch[1].startsWith("/") ? `${BASE_URL}${srcMatch[1]}` : srcMatch[1];
      const alt = altMatch ? altMatch[1] : "Article artwork";
      return `\n\n![${alt}](${src})\n*${cleanInline(caption)}*\n\n`;
    });

  // <Figure caption="…">…</Figure> → figure token
  md = md.replace(/<Figure\s+caption="([^"]*)"[^>]*>[\s\S]*?<\/Figure>/g, (_, cap) => {
    figures.push(cap || "Figure"); return `\n\n@@FIG:${figures.length}@@\n\n`;
  });

  // Shared formula style used by the monthly essays.
  md = md.replace(/<p\s+style=\{formula\}>([\s\S]*?)<\/p>/g,
    (_, c) => `\n\n\`\`\`\n${cleanInline(c)}\n\`\`\`\n\n`);

  // equation boxes: a <p> styled monospace → fenced code (keeps the look)
  md = md.replace(/<p\s+style=\{\{[^}]*var\(--f-mono\)[\s\S]*?\}\}[^>]*>([\s\S]*?)<\/p>/g,
    (_, c) => `\n\n\`\`\`\n${cleanInline(c)}\n\`\`\`\n\n`);

  // any remaining custom (capitalised) component = an interactive diagram.
  // paired first, then self-closing.
  md = md.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, (m0, name) => {
    figures.push(name); return `\n\n@@FIG:${figures.length}@@\n\n`;
  });
  md = md.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, (m0, name) => {
    figures.push(name); return `\n\n@@FIG:${figures.length}@@\n\n`;
  });

  // headings
  md = md.replace(/<h2\s+className="display"[^>]*>([\s\S]*?)<\/h2>/g, (_, c) => `\n\n## ${cleanInline(c)}\n\n`);
  md = md.replace(/<h3(?:\s[^>]*)?>([\s\S]*?)<\/h3>/g, (_, c) => `\n\n### ${cleanInline(c)}\n\n`);

  // lists
  md = md.replace(/<ul(?:\s[^>]*)?>([\s\S]*?)<\/ul>/g, (_, inner) => {
    const items = [...inner.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/g)].map(x => `- ${cleanInline(x[1])}`);
    return `\n\n${items.join("\n")}\n\n`;
  });
  md = md.replace(/<ol(?:\s[^>]*)?>([\s\S]*?)<\/ol>/g, (_, inner) => {
    const items = [...inner.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/g)].map((x, i) => `${i + 1}. ${cleanInline(x[1])}`);
    return `\n\n${items.join("\n")}\n\n`;
  });

  // drop-cap lede
  md = md.replace(/<p\s+className="drop-cap"[^>]*>([\s\S]*?)<\/p>/g, (_, c) => `\n\n${cleanInline(c)}\n\n`);
  // closing italic place-stamp
  md = md.replace(/<p\s+style=\{\{\s*marginTop:\s*"2\.4rem"[\s\S]*?fontStyle:\s*"italic"[\s\S]*?\}\}[^>]*>([\s\S]*?)<\/p>/g,
    (_, c) => `\n\n*${cleanInline(c)}*\n\n`);
  // remaining paragraphs
  md = md.replace(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g, (_, c) => `\n\n${cleanInline(c)}\n\n`);

  // strip leftover tags + JSX expressions
  md = md.replace(/<\/?[a-zA-Z][^>]*\/?>/g, "");
  let prev; do { prev = md; md = md.replace(/\{[^{}]*\}/g, ""); } while (md !== prev);
  md = md.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&hellip;/g, "…");

  // expand figure tokens in document order → image + interactive link
  md = md.replace(/@@FIG:(\d+)@@/g, (_, i) => {
    const n = Number(i);
    const name = figures[n - 1] || "figure";
    const nn = String(n).padStart(2, "0");
    const entry = getFigureEntry(slug, n);
    // slider diagram → two frames (low & high) so the static version shows it responding
    if (entry && entry.slider && entry.frames.length >= 2) {
      const s = entry.sliderLabel || "slider";
      const animation = `${slug}-${nn}.gif`;
      if (fs.existsSync(path.join(RSS_FIGURE_DIR, animation))) {
        return [
          `![Figure ${n} — ${name} · animated ${s} sweep](figures/${animation})`,
          `*▶ Two ${s} settings — drag it live at ${BASE_URL}/${slug}*`,
        ].join("\n");
      }
      return [
        `![Figure ${n}a — ${name} · ${s} low](figures/${entry.frames[0]})`,
        `![Figure ${n}b — ${name} · ${s} high](figures/${entry.frames[1]})`,
        `*▶ Same diagram at two ${s} settings — drag it live at ${BASE_URL}/${slug}*`,
      ].join("\n");
    }
    const file = entry && entry.frames[0] ? entry.frames[0] : `${slug}-${nn}.png`;
    return `![Figure ${n} — ${name}](figures/${file})\n*▶ Interactive version at ${BASE_URL}/${slug}*`;
  });

  // footnotes
  if (notes.length) {
    notes.sort((a, b) => a.n - b.n);
    md += "\n\n---\n\n";
    notes.forEach((sn) => { md += `[^${sn.n}]: ${sn.content}\n\n`; });
  }

  md = md.split("\n").map((l) => (l.trim() === "" ? "" : l)).join("\n");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return { md, figureCount: figures.length };
}

// --- build / write one essay ----------------------------------------------
export function getEssayExport(slug) {
  const component = ESSAYS[slug];
  if (!component) throw new Error(`unknown slug: ${slug}`);
  const meta = getPostMeta(slug);
  const body = getEssayBody(component);
  if (!meta) throw new Error(`missing POSTS metadata for ${slug}`);
  if (!body) throw new Error(`could not extract essay body for ${component}`);

  const { md, figureCount } = jsxToMarkdown(body, slug);

  const out = `---
title: "${meta.title}"
subtitle: "${meta.dek}"
kicker: "${meta.kicker}"
canonical_url: ${BASE_URL}/${slug}
published: ${meta.publishedAt || ""}
source: shubzsharma.com
figures: ${figureCount}
---

*${meta.dek}*

${md}

---

_Originally published at [shubzsharma.com/${slug}](${BASE_URL}/${slug}), where the diagrams are live and interactive. When you cross-post, set the Substack canonical URL to ${BASE_URL}/${slug} so search engines credit the original._
`;

  return { meta, md, figureCount, output: out };
}

export function exportOne(slug) {
  let essay;
  try {
    essay = getEssayExport(slug);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return false;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, essay.output);
  console.log(`✓ ${path.relative(ROOT, outPath)}  (${essay.meta.minutes} min · ${essay.figureCount} figure${essay.figureCount === 1 ? "" : "s"} · ${essay.output.length} chars)`);
  return true;
}

// --- CLI ------------------------------------------------------------------
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const arg = process.argv[2];
  if (arg === "--list" || arg === "-l") {
    console.log("essays:"); Object.keys(ESSAYS).forEach((s) => console.log(`  ${s}`)); process.exit(0);
  }
  const targets = arg ? [arg] : Object.keys(ESSAYS);
  let ok = 0;
  for (const slug of targets) if (exportOne(slug)) ok++;
  console.log(`\n${ok}/${targets.length} essays → ${path.relative(ROOT, OUT_DIR)}/`);
}
