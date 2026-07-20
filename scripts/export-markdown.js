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

// figure manifest (written by capture-figures.js): per essay, each figure's
// frame filename(s) + whether it's a slider sweep. Optional — falls back to
// single "<slug>-NN.png" if the capture hasn't run yet.
let MANIFEST = {};
try { MANIFEST = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "figures", "manifest.json"), "utf-8")); } catch {}

// slug → essay component (each lives in src/components/essays/<Component>.tsx)
const ESSAYS = {
  "bluedot-unit1":         "BluedotEssay",
  "bluedot-assumptions":   "BluedotAssumptionsEssay",
  "bluedot-vocabulary":    "BluedotVocabularyEssay",
  "bluedot-civilization":  "BluedotCivilizationEssay",
  "bluedot-killchain":     "BluedotKillchainEssay",
  "zx-calculus":           "ZXEssay",
  "jaya":                  "JayaEssay",
  "fashion-trends":        "FashionEssay",
  "threshold-gate":        "ThresholdEssay",
  "constraint-clustering": "ConstraintClusterEssay",
  "six-engines":           "SixEnginesEssay",
  "turing-morphogenesis":  "TuringEssay",
  "may-2026":              "MayEssay",
  "fisher-wave":           "FisherWaveEssay",
};

// --- POSTS metadata -------------------------------------------------------
function getPostMeta(slug) {
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
function getEssayBody(component) {
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
function jsxToMarkdown(jsx, slug) {
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

  // <Figure caption="…">…</Figure> → figure token
  md = md.replace(/<Figure\s+caption="([^"]*)"[^>]*>[\s\S]*?<\/Figure>/g, (_, cap) => {
    figures.push(cap || "Figure"); return `\n\n@@FIG:${figures.length}@@\n\n`;
  });

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
    const entry = (MANIFEST[slug] || []).find((f) => f.n === n);
    // slider diagram → two frames (low & high) so the static version shows it responding
    if (entry && entry.slider && entry.frames.length >= 2) {
      const s = entry.sliderLabel || "slider";
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

// --- write one essay ------------------------------------------------------
function exportOne(slug) {
  const component = ESSAYS[slug];
  if (!component) { console.error(`unknown slug: ${slug}`); return false; }
  const meta = getPostMeta(slug);
  const body = getEssayBody(component);
  if (!meta) { console.error(`missing POSTS metadata for ${slug}`); return false; }
  if (!body) { console.error(`could not extract essay body for ${component}`); return false; }

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

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, out);
  console.log(`✓ ${path.relative(ROOT, outPath)}  (${meta.minutes} min · ${figureCount} figure${figureCount === 1 ? "" : "s"} · ${out.length} chars)`);
  return true;
}

// --- CLI ------------------------------------------------------------------
const arg = process.argv[2];
if (arg === "--list" || arg === "-l") {
  console.log("essays:"); Object.keys(ESSAYS).forEach((s) => console.log(`  ${s}`)); process.exit(0);
}
const targets = arg ? [arg] : Object.keys(ESSAYS);
let ok = 0;
for (const slug of targets) if (exportOne(slug)) ok++;
console.log(`\n${ok}/${targets.length} essays → ${path.relative(ROOT, OUT_DIR)}/`);
