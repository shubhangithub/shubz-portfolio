#!/usr/bin/env node
//
// export-markdown.js
//
// Pulls each essay component out of index.html and emits a Markdown file
// suitable for pasting into Substack / Medium / Hashnode. Sidenotes become
// proper footnotes, pull-quotes become blockquotes, custom diagrams become
// "[Live interactive figure → shubzsharma.com/<slug>]" placeholders.
//
// Frontmatter sets the canonical URL — point Substack / Medium at it when
// you cross-post and Google credits the original.
//
// Usage:
//   node scripts/export-markdown.js              # all essays → exported/
//   node scripts/export-markdown.js jaya         # one essay
//   node scripts/export-markdown.js --list       # list known slugs
//
// No npm install. Just node.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = fs.readFileSync(path.join(ROOT, "index.html"), "utf-8");
const BASE_URL = "https://shubzsharma.com";
const OUT_DIR = path.join(ROOT, "exported");

// --- map of slug → essay component name -----------------------------------
const ESSAYS = {
  "jaya":                  "JayaEssay",
  "threshold-gate":        "ThresholdEssay",
  "constraint-clustering": "ConstraintClusterEssay",
  "six-engines":           "SixEnginesEssay",
  "fashion-trends":        "FashionEssay",
  "may-2026":              "MayEssay",
};

// --- POSTS metadata -------------------------------------------------------
function getPostMeta(slug) {
  const re = new RegExp(
    `slug:\\s*"${slug}",[\\s\\S]*?title:\\s*"([^"]+)",[\\s\\S]*?kicker:\\s*"([^"]+)",[\\s\\S]*?dek:\\s*"([^"]+)",[\\s\\S]*?minutes:\\s*(\\d+)`,
    "m",
  );
  const m = SRC.match(re);
  if (!m) return null;
  return { title: m[1], kicker: m[2], dek: m[3], minutes: Number(m[4]) };
}

// --- pull a function's return-statement body ------------------------------
function getEssayBody(funcName) {
  const re = new RegExp(`function\\s+${funcName}\\s*\\([^)]*\\)\\s*\\{`, "m");
  const m = SRC.match(re);
  if (!m) return null;
  // walk forward from the opening brace, count nesting, find matching close
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < SRC.length && depth > 0) {
    const c = SRC[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  const body = SRC.slice(start, i - 1);
  // find the return ( ... ); block
  const retM = body.match(/return\s*\(\s*<>([\s\S]*)<\/>\s*\)\s*;/);
  if (!retM) return null;
  return retM[1].trim();
}

// --- inline-tag normaliser ------------------------------------------------
function cleanInline(s) {
  let out = s;
  // <em>...</em>  →  _.._  (italic)
  out = out.replace(/<em(?:\s[^>]*)?>([\s\S]*?)<\/em>/g, "_$1_");
  // <strong style={...}>...</strong>  →  **..**
  out = out.replace(/<strong(?:\s[^>]*)?>([\s\S]*?)<\/strong>/g, "**$1**");
  // <a ...>text</a>  →  [text](url) (capture href, drop onClick/style/className)
  out = out.replace(/<a([^>]*)>([\s\S]*?)<\/a>/g, (_, attrs, text) => {
    const hrefM = attrs.match(/href="([^"]+)"/);
    const href = hrefM ? hrefM[1] : "#";
    return `[${cleanInline(text.trim())}](${href})`;
  });
  // <span className="mono" style={...}>code</span>  →  `code`
  out = out.replace(/<span\s+className="mono"[^>]*>([\s\S]*?)<\/span>/g, "`$1`");
  // strip remaining JSX expressions {...} that survived (style={{ ... }}, etc.)
  // do this iteratively because expressions can be nested
  let prev;
  do { prev = out; out = out.replace(/\{[^{}]*\}/g, ""); } while (out !== prev);
  // strip any leftover tags
  out = out.replace(/<\/?[a-zA-Z][^>]*\/?>/g, "");
  // entities
  out = out.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&mdash;/g, "—");
  // collapse whitespace, but preserve double-newlines for paragraph breaks
  out = out.replace(/[ \t]+/g, " ").trim();
  return out;
}

// --- main JSX → Markdown converter ---------------------------------------
function jsxToMarkdown(jsx, slug) {
  let md = jsx;

  // Strip §NN mono prefixes that live inside headings — they're a layout
  // anchor on the site, meaningless in cross-posted Markdown.
  md = md.replace(/<span\s+className="mono"[^>]*>§\d+\w*<\/span>\s*/g, "");

  // --- collect sidenotes (do this BEFORE paragraph extraction) --------
  const sidenotes = [];
  // <span className="sidenote-number">1</span>  →  [^1] inline marker
  md = md.replace(/<span\s+className="sidenote-number"[^>]*>(\d+)<\/span>/g, (_, n) => `[^${n}]`);
  // <span className="sidenote"><strong>1.</strong> ...note... </span>  →  remove inline, capture for footer
  md = md.replace(/<span\s+className="sidenote"[^>]*>\s*<strong[^>]*>(\d+)\.\s*<\/strong>\s*([\s\S]*?)<\/span>/g,
    (_, n, content) => {
      sidenotes.push({ n: Number(n), content: cleanInline(content) });
      return "";
    });

  // --- block-level transforms -----------------------------------------
  // PullQuote
  md = md.replace(/<PullQuote(?:\s[^>]*)?>([\s\S]*?)<\/PullQuote>/g,
    (_, content) => `\n\n> ${cleanInline(content)}\n\n`);

  // <Figure caption="..." palette={p}>...</Figure>
  md = md.replace(/<Figure\s+caption="([^"]*)"[^>]*>[\s\S]*?<\/Figure>/g,
    (_, cap) => `\n\n*[Live interactive figure → ${BASE_URL}/${slug} (${cap})]*\n\n`);

  // bare custom diagram blocks like <div ...><LotkaVolterra .../></div>
  // (used in the May essay's centerpiece)
  md = md.replace(/<div[^>]*>\s*<(LotkaVolterra|JayaSwarm|BiomarkerScatter|RecEngineSwarm|EnsembleConsensus|TrendSignalFlow|LMSRPriceCurve|ConsensusGrid|SeasonalSpecimen)\s[\s\S]*?\/>\s*<\/div>/g,
    (_, name) => `\n\n*[Live interactive figure: ${name} → ${BASE_URL}/${slug}]*\n\n`);

  // h2.display headings
  md = md.replace(/<h2\s+className="display"[^>]*>([\s\S]*?)<\/h2>/g,
    (_, content) => `\n\n## ${cleanInline(content)}\n\n`);

  // drop-cap paragraph (treat as normal lede paragraph)
  md = md.replace(/<p\s+className="drop-cap"[^>]*>([\s\S]*?)<\/p>/g,
    (_, content) => `\n\n${cleanInline(content)}\n\n`);

  // closing italic place-stamp paragraph (preserve italic for that one)
  md = md.replace(/<p\s+style=\{\{\s*marginTop:\s*"2\.4rem"[^}]*fontStyle:\s*"italic"[^}]*\}\}\s*[^>]*>([\s\S]*?)<\/p>/g,
    (_, content) => `\n\n*${cleanInline(content)}*\n\n`);

  // any remaining paragraph
  md = md.replace(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g,
    (_, content) => `\n\n${cleanInline(content)}\n\n`);

  // strip anything still wrapped in JSX
  md = md.replace(/<\/?[a-zA-Z][^>]*\/?>/g, "");
  // strip remaining JSX expressions
  let prev;
  do { prev = md; md = md.replace(/\{[^{}]*\}/g, ""); } while (md !== prev);

  // entities
  md = md.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

  // append sidenote footer
  if (sidenotes.length > 0) {
    sidenotes.sort((a, b) => a.n - b.n);
    md += "\n\n---\n\n";
    sidenotes.forEach((sn) => { md += `[^${sn.n}]: ${sn.content}\n\n`; });
  }

  // tidy whitespace — kill leading-spaces-on-otherwise-blank-lines first,
  // then collapse multi-blank-line runs into a single empty line.
  md = md.split("\n").map((l) => (l.trim() === "" ? "" : l)).join("\n");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

// --- write one essay ------------------------------------------------------
function exportOne(slug) {
  const funcName = ESSAYS[slug];
  if (!funcName) {
    console.error(`unknown slug: ${slug}`);
    return false;
  }
  const meta = getPostMeta(slug);
  const body = getEssayBody(funcName);
  if (!meta) { console.error(`missing POSTS metadata for ${slug}`); return false; }
  if (!body) { console.error(`could not extract essay body for ${funcName}`); return false; }

  const md = jsxToMarkdown(body, slug);

  const out = `---
title: "${meta.title}"
kicker: "${meta.kicker}"
dek: "${meta.dek}"
minutes: ${meta.minutes}
canonical_url: ${BASE_URL}/${slug}
source: shubzsharma.com
---

# ${meta.title}

*${meta.dek}*

${md}

---

_Originally published on [shubzsharma.com](${BASE_URL}/${slug}). The interactive diagrams are live there — this version is text-only. When you paste into Substack / Medium / Hashnode, set the canonical URL to ${BASE_URL}/${slug} so search engines credit the original._
`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, out);
  console.log(`✓ wrote ${path.relative(ROOT, outPath)} (${meta.minutes} min, ${out.length} chars)`);
  return true;
}

// --- CLI ------------------------------------------------------------------
const arg = process.argv[2];
if (arg === "--list" || arg === "-l") {
  console.log("known essays:");
  Object.keys(ESSAYS).forEach((s) => console.log(`  ${s}`));
  process.exit(0);
}

const targets = arg ? [arg] : Object.keys(ESSAYS);
let okCount = 0;
for (const slug of targets) {
  if (exportOne(slug)) okCount++;
}
console.log(`\n${okCount}/${targets.length} essays exported to ${path.relative(ROOT, OUT_DIR)}/`);
