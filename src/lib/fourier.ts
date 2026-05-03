// @ts-nocheck

export function samplePath(shape, N = 256) {
  const pts = [];
  if (shape === "hex") {
    // H3 hexagon (pointy-top) with gentle handwobble
    for (let i = 0; i < N; i++) {
      const t = i / N;
      // walk 6 edges
      const edge = Math.floor(t * 6);
      const u = (t * 6) - edge;
      const a1 = (edge / 6) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((edge + 1) / 6) * Math.PI * 2 - Math.PI / 2;
      const r = 1 + (Math.sin(t * Math.PI * 12) * 0.012); // subtle wobble
      const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
      const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
      pts.push({ x: x1 + (x2 - x1) * u, y: y1 + (y2 - y1) * u });
    }
  } else if (shape === "orion") {
    // Stylized Orion constellation as polyline segments (Betelgeuse, Bellatrix,
    // belt stars Alnitak/Alnilam/Mintaka, Saiph, Rigel). We trace a closed loop
    // through them with bezier-like interpolation for motif feel.
    const stars = [
      [0.55,-0.95],[-0.55,-0.85],[-0.55,-0.15],[-0.12,-0.05],[0.22,0.05],
      [0.55,0.15],[0.75,0.85],[-0.65,0.95],[-0.35,0.3],[0.38,0.35]
    ];
    for (let i = 0; i < N; i++) {
      const t = i / N * stars.length;
      const k = Math.floor(t) % stars.length;
      const nk = (k + 1) % stars.length;
      const u = t - Math.floor(t);
      const s = u * u * (3 - 2 * u); // smoothstep
      pts.push({
        x: stars[k][0] + (stars[nk][0] - stars[k][0]) * s,
        y: stars[k][1] + (stars[nk][1] - stars[k][1]) * s,
      });
    }
  } else if (shape === "initials") {
    // "SS" stylized single-stroke, walked along a figure-eight-ish path
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2;
      const r = 0.95;
      pts.push({
        x: r * Math.sin(a) * (1 - 0.35 * Math.cos(a * 2)),
        y: r * Math.sin(a * 2) * 0.7,
      });
    }
  } else {
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      pts.push({ x: Math.cos(a), y: Math.sin(a) });
    }
  }
  return pts;
}

export function dft(samples) {
  const N = samples.length;
  const out = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += samples[n].x * Math.cos(phi) + samples[n].y * Math.sin(phi);
      im += samples[n].y * Math.cos(phi) - samples[n].x * Math.sin(phi);
    }
    re /= N; im /= N;
    const freq = k <= N / 2 ? k : k - N;
    const amp = Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    out.push({ freq, amp, phase });
  }
  out.sort((a, b) => b.amp - a.amp);
  return out;
}
