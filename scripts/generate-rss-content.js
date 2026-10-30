#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import sharp from "sharp";
import { getEssayExport } from "./export-markdown.js";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const POSTS_PATH = path.join(ROOT, "src/data/posts.ts");
const FIGURE_SOURCE = path.join(ROOT, "exported/figures");
const FIGURE_PUBLIC = path.join(ROOT, "public/rss-figures");
const OUTPUT_PATH = path.join(ROOT, "src/data/rss-content.generated.json");
const BASE_URL = "https://shubzsharma.com";
const FRAME_DELAY_MS = 1300;

function publishedSlugs() {
  const postsSource = fs.readFileSync(POSTS_PATH, "utf8");
  const blocks = postsSource.matchAll(
    /\{\s*slug:\s*"([^"]+)",([\s\S]*?)\n\s*\},/g,
  );

  return [...blocks]
    .filter((match) => !/\bdraft:\s*true\b/.test(match[2]))
    .map((match) => match[1]);
}

function importMarkdown(slug, essay) {
  return [
    `*${essay.meta.dek}*`,
    "",
    essay.md,
    "",
    "---",
    "",
    `_Originally published at [shubzsharma.com/${slug}](${BASE_URL}/${slug}), where the diagrams are live and interactive._`,
  ].join("\n");
}

function renderFootnotes(slug, markdown) {
  const definitions = [];
  const referenceCounts = new Map();
  const footerMatch = markdown.match(
    /\n---\n\n(_Originally published[\s\S]+)$/,
  );
  const footer = footerMatch ? `\n\n---\n\n${footerMatch[1]}` : "";
  let body = (footerMatch ? markdown.slice(0, footerMatch.index) : markdown)
    .replace(/\n+---\n+(?=\[\^\d+\]:)/, "\n\n")
    .replace(/^\[\^(\d+)\]:\s*(.+)$/gm, (_, number, definition) => {
      definitions.push({ number, definition });
      return "";
    })
    .replace(/\[\^(\d+)\]/g, (_, number) => {
      const reference = (referenceCounts.get(number) ?? 0) + 1;
      referenceCounts.set(number, reference);
      return `<sup><a href="#fn-${slug}-${number}" id="fnref-${slug}-${number}-${reference}">${number}</a></sup>`;
    })
    .replace(/\n{3,}/g, "\n\n");

  const footerHtml = marked.parse(footer, { async: false, gfm: true });
  let html = marked.parse(body, { async: false, gfm: true });
  if (definitions.length === 0) return `${html}${footerHtml}`;

  const items = definitions
    .sort((a, b) => Number(a.number) - Number(b.number))
    .map(({ number, definition }) => {
      const backlinks = Array.from(
        { length: referenceCounts.get(number) ?? 1 },
        (_, index) => {
          const reference = index + 1;
          const label = reference === 1 ? "↩" : `↩${reference}`;
          return `<a href="#fnref-${slug}-${number}-${reference}" aria-label="Back to citation ${number}, reference ${reference}">${label}</a>`;
        },
      ).join(" ");
      return `<li id="fn-${slug}-${number}">${marked.parseInline(definition, { async: false, gfm: true })} ${backlinks}</li>`;
    })
    .join("\n");

  return `${html}<section aria-label="Footnotes">\n<hr>\n<ol>\n${items}\n</ol>\n</section>\n${footerHtml}`;
}

async function generateFigureAnimations() {
  if (!fs.existsSync(FIGURE_PUBLIC)) return 0;

  const firstFrames = fs.readdirSync(FIGURE_PUBLIC)
    .filter((filename) => filename.endsWith("-a.png"))
    .sort();

  let generated = 0;
  for (const firstFrame of firstFrames) {
    const stem = firstFrame.slice(0, -"-a.png".length);
    const secondFrame = `${stem}-b.png`;
    const firstPath = path.join(FIGURE_PUBLIC, firstFrame);
    const secondPath = path.join(FIGURE_PUBLIC, secondFrame);
    if (!fs.existsSync(secondPath)) continue;

    let frames = await Promise.all(
      [firstPath, secondPath].map((filename) =>
        sharp(filename).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      ),
    );
    // Slider labels can wrap differently at the two capture values. Pad the
    // shorter frame rather than crop its caption or reject a valid diagram.
    const width = Math.max(...frames.map(f => f.info.width));
    const height = Math.max(...frames.map(f => f.info.height));
    const channels = 4;
    frames = await Promise.all(frames.map(async frame => {
      if (frame.info.width === width && frame.info.height === height) return frame;
      const [r, g, b, alpha] = frame.data;
      return sharp(frame.data, { raw: frame.info })
        .extend({ top: 0, left: 0, right: width - frame.info.width,
          bottom: height - frame.info.height, background: { r, g, b, alpha: alpha / 255 } })
        .raw().toBuffer({ resolveWithObject: true });
    }));

    await sharp(Buffer.concat(frames.map(({ data }) => data)), {
      raw: {
        width,
        height: height * frames.length,
        channels,
        pageHeight: height,
      },
    })
      .gif({ delay: frames.map(() => FRAME_DELAY_MS), loop: 0 })
      .toFile(path.join(FIGURE_PUBLIC, `${stem}.gif`));
    generated++;
  }

  return generated;
}

function copyFigure(filename) {
  const source = path.join(FIGURE_SOURCE, filename);
  const destination = path.join(FIGURE_PUBLIC, filename);

  if (fs.existsSync(source)) {
    fs.mkdirSync(FIGURE_PUBLIC, { recursive: true });
    fs.copyFileSync(source, destination);
    return;
  }

  // Captured figures are ignored locally, while their RSS-ready copies are
  // committed. Production builds can therefore reuse the committed asset.
  if (!fs.existsSync(destination)) {
    throw new Error(`Missing RSS figure: ${source} or ${destination}`);
  }
}

const content = {};
const copiedFigures = new Set();
const animatedFigures = await generateFigureAnimations();

for (const slug of publishedSlugs()) {
  const essay = getEssayExport(slug);
  const markdown = importMarkdown(slug, essay);

  for (const match of markdown.matchAll(/\]\(figures\/([^)]+)\)/g)) {
    const filename = match[1];
    if (!copiedFigures.has(filename)) {
      copyFigure(filename);
      copiedFigures.add(filename);
    }
  }

  content[slug] = renderFootnotes(slug, markdown)
    .replaceAll(
      'src="figures/',
      `src="${BASE_URL}/rss-figures/`,
    );
}

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(content, null, 2)}\n`);
console.log(
  `✓ ${Object.keys(content).length} full RSS articles · ${copiedFigures.size} figure files · ${animatedFigures} animations`,
);
