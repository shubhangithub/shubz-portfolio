#!/usr/bin/env node
// slice-sprites.mjs — cut the owner's generated character sheet into
// registered, baseline-aligned sprite cells (V6 Walk girl).
//
// Input: a sheet with a night set (dark bg) on top and a day set (cream
// bg) below; each half = one standing pose + 6 walk frames left→right.
// Output (public/art/sprites/): {night,day}-stand.png and
// {night,day}-walk-strip.png (6 equal cells, feet on a common baseline)
// + a JSON manifest with cell dimensions.
//
// Registration is what makes the animation effortless: background keyed
// by sampled colour, figures found by alpha column-projection, each
// frame placed on a shared canvas bottom-aligned at its feet.
//
// Usage: node scripts/slice-sprites.mjs <sheet.png>

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const input = process.argv[2];
if (!input) { console.error("usage: node scripts/slice-sprites.mjs <sheet.png>"); process.exit(1); }
const OUT = path.resolve(process.argv[3] || "public/art/sprites");
fs.mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const px = (x, y) => {
  const i = (y * W + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};

// --- find the horizontal boundary between the two sets (biggest row-colour jump)
const rowMean = (y) => {
  let r = 0, g = 0, b = 0, n = 0;
  for (let x = 0; x < W; x += 8) { const p = px(x, y); r += p[0]; g += p[1]; b += p[2]; n++; }
  return [r / n, g / n, b / n];
};
let boundary = Math.floor(H / 2), best = 0;
for (let y = Math.floor(H * 0.3); y < H * 0.7; y++) {
  const a = rowMean(y - 2), b2 = rowMean(y + 2);
  const d = Math.hypot(a[0] - b2[0], a[1] - b2[1], a[2] - b2[2]);
  if (d > best) { best = d; boundary = y; }
}
console.log(`sheet ${W}x${H}, set boundary at y=${boundary}`);

function keyHalf(y0, y1, tol) {
  // border flood-fill: only background CONNECTED to the half's edges is
  // removed, so dark clothing that resembles the bg survives (the rim-lit
  // silhouette acts as the flood barrier).
  const samples = [[4, y0 + 4], [W - 5, y0 + 4], [4, y1 - 5], [W - 5, y1 - 5]];
  const bg = samples.map((s) => px(s[0], s[1]))
    .reduce((acc, p) => [acc[0] + p[0] / 4, acc[1] + p[1] / 4, acc[2] + p[2] / 4], [0, 0, 0]);
  const h = y1 - y0;
  const isBg = (x, y) => {
    const si = ((y + y0) * W + x) * 4;
    return Math.hypot(data[si] - bg[0], data[si + 1] - bg[1], data[si + 2] - bg[2]) < tol;
  };
  const flooded = new Uint8Array(W * h);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, 0, x, h - 1); }
  for (let y = 0; y < h; y++) { stack.push(0, y, W - 1, y); }
  const pending = [];
  for (let i = 0; i < stack.length; i += 2) pending.push([stack[i], stack[i + 1]]);
  while (pending.length) {
    const [x, y] = pending.pop();
    if (x < 0 || y < 0 || x >= W || y >= h) continue;
    const idx = y * W + x;
    if (flooded[idx] || !isBg(x, y)) continue;
    flooded[idx] = 1;
    pending.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  const out = Buffer.alloc(W * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < W; x++) {
      const si = ((y + y0) * W + x) * 4, di = (y * W + x) * 4;
      // soften: a kept pixel whose 4-neighbourhood touches flood gets feathered
      let a = 255;
      if (flooded[y * W + x]) a = 0;
      else {
        let touch = 0;
        if (x > 0 && flooded[y * W + x - 1]) touch++;
        if (x < W - 1 && flooded[y * W + x + 1]) touch++;
        if (y > 0 && flooded[(y - 1) * W + x]) touch++;
        if (y < h - 1 && flooded[(y + 1) * W + x]) touch++;
        if (touch) a = 255 - touch * 45;
      }
      out[di] = data[si]; out[di + 1] = data[si + 1]; out[di + 2] = data[si + 2]; out[di + 3] = a;
    }
  }
  return { buf: out, h };
}

function segments(buf, h) {
  const colCount = new Array(W).fill(0);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < W; x++)
      if (buf[(y * W + x) * 4 + 3] > 40) colCount[x]++;
  const runs = [];
  let start = -1, gap = 0;
  for (let x = 0; x < W; x++) {
    if (colCount[x] > 2) {
      if (start < 0) start = x;
      gap = 0;
    } else if (start >= 0) {
      gap++;
      if (gap > 14) { runs.push([start, x - gap]); start = -1; gap = 0; }
    }
  }
  if (start >= 0) runs.push([start, W - 1]);
  // merge slivers, drop noise
  const merged = [];
  for (const r of runs) {
    if (merged.length && r[0] - merged[merged.length - 1][1] < 18) merged[merged.length - 1][1] = r[1];
    else merged.push([...r]);
  }
  return merged.filter((r) => r[1] - r[0] > 40);
}

function bbox(buf, h, x0, x1) {
  let minY = h, maxY = 0, minX = x1, maxX = x0;
  for (let y = 0; y < h; y++)
    for (let x = x0; x <= x1; x++)
      if (buf[(y * W + x) * 4 + 3] > 40) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
  return { minX, maxX, minY, maxY };
}

async function crop(buf, h, box, cw, ch) {
  // place the figure on a cw×ch canvas, feet at bottom-6, centred
  const canvas = Buffer.alloc(cw * ch * 4);
  const fw = box.maxX - box.minX + 1, fh = box.maxY - box.minY + 1;
  const ox = Math.floor((cw - fw) / 2), oy = ch - 6 - fh;
  for (let y = 0; y < fh; y++)
    for (let x = 0; x < fw; x++) {
      const si = ((y + box.minY) * W + (x + box.minX)) * 4;
      const di = ((y + oy) * cw + (x + ox)) * 4;
      if (buf[si + 3] > 0) {
        canvas[di] = buf[si]; canvas[di + 1] = buf[si + 1];
        canvas[di + 2] = buf[si + 2]; canvas[di + 3] = buf[si + 3];
      }
    }
  return sharp(canvas, { raw: { width: cw, height: ch, channels: 4 } }).png();
}

const manifest = {};
for (const [setName, y0, y1, tol] of [
  ["night", 0, boundary, 30],
  ["day", boundary, H, 34],
]) {
  const { buf, h } = keyHalf(y0, y1, tol);
  const segs = segments(buf, h);
  console.log(`${setName}: ${segs.length} column clusters`);
  let standBoxSeg, walkBoxes;
  if (segs.length >= 7) {
    const boxes = segs.map((s) => bbox(buf, h, s[0], s[1]));
    standBoxSeg = boxes[0];
    walkBoxes = boxes.slice(1, 7);
  } else if (segs.length >= 2) {
    // frames overlap into one band: stand = first cluster, then split the
    // final band evenly into 6 (the generator spaces frames uniformly)
    standBoxSeg = bbox(buf, h, segs[0][0], segs[0][1]);
    const band = segs[segs.length - 1];
    const bw = (band[1] - band[0] + 1) / 6;
    walkBoxes = Array.from({ length: 6 }, (_, i) =>
      bbox(buf, h, Math.round(band[0] + i * bw), Math.round(band[0] + (i + 1) * bw) - 1));
  } else { console.error(`only ${segs.length} clusters — adjust tol`); continue; }
  const cw = Math.max(...walkBoxes.map((b) => b.maxX - b.minX + 1)) + 12;
  const ch = Math.max(...walkBoxes.map((b) => b.maxY - b.minY + 1)) + 12;

  const scw = standBoxSeg.maxX - standBoxSeg.minX + 13, sch = standBoxSeg.maxY - standBoxSeg.minY + 13;
  await (await crop(buf, h, standBoxSeg, scw, sch)).toFile(path.join(OUT, `${setName}-stand.png`));

  const cells = [];
  for (const b of walkBoxes) cells.push(await (await crop(buf, h, b, cw, ch)).toBuffer());
  await sharp({ create: { width: cw * 6, height: ch, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(cells.map((c, i) => ({ input: c, left: i * cw, top: 0 })))
    .png()
    .toFile(path.join(OUT, `${setName}-walk-strip.png`));
  manifest[setName] = { cellW: cw, cellH: ch, standW: scw, standH: sch };
  console.log(`${setName}: strip 6×${cw}x${ch}, stand ${scw}x${sch}`);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("✓ sprites written to public/art/sprites/");
