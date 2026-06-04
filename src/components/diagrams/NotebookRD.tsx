// @ts-nocheck
/**
 * NotebookRD — canvas-based animated Gray-Scott reaction-diffusion.
 * Companion to NotebookLotka; shows the v-field evolving from multiple seeds.
 * Used on the home page as the June figure.
 *
 * Equations (Gray & Scott, Chem. Eng. Sci. 1983-84):
 *   ∂u/∂t = Du·∇²u − u·v² + F·(1−u)
 *   ∂v/∂t = Dv·∇²v + u·v² − (F+k)·v
 *
 * Parameters F=0.035, k=0.065 produce the spot-forming regime.
 */
import React from "react";

const GW = 100, GH = 72;
const DU = 0.16, DV = 0.08;
const F  = 0.035, K = 0.065;
const STEPS_PER_FRAME = 3;

function parseHex(h: string): [number, number, number] {
  if (h && h[0] === "#" && h.length >= 7)
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  return [20, 20, 20];
}

function initGrid() {
  const u = new Float32Array(GW * GH).fill(1);
  const v = new Float32Array(GW * GH);
  // Five seeds — centre + four quadrant points — for richer early dynamics
  const seeds = [
    [GW/2, GH/2], [GW/4, GH/4], [3*GW/4, GH/4],
    [GW/4, 3*GH/4], [3*GW/4, 3*GH/4],
  ];
  seeds.forEach(([sx, sy]) => {
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const ix = ((Math.floor(sx)+dx+GW) % GW) + ((Math.floor(sy)+dy+GH) % GH) * GW;
        u[ix] = 0.5 + (Math.random() - 0.5) * 0.1;
        v[ix] = 0.25 + (Math.random() - 0.5) * 0.05;
      }
    }
  });
  return { u, v, nu: new Float32Array(GW*GH), nv: new Float32Array(GW*GH) };
}

export function NotebookRD({
  w = 290, h = 210,
  ink, accent, paper, muted,
}: {
  w?: number; h?: number;
  ink: string; accent: string; paper: string; muted: string;
}) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const [pr, pg, pb] = parseHex(paper);
    const [ar, ag, ab] = parseHex(accent);

    let { u, v, nu, nv } = initGrid();

    // Offscreen canvas at grid resolution → scaled up (nearest-neighbour)
    const off = document.createElement("canvas");
    off.width = GW; off.height = GH;
    const oc  = off.getContext("2d")!;
    const img = oc.createImageData(GW, GH);

    function step() {
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const i  = x + y * GW;
          const xp = (x+1)%GW, xm = (x-1+GW)%GW;
          const yp = (y+1)%GH, ym = (y-1+GH)%GH;
          const lu = u[xp+y*GW] + u[xm+y*GW] + u[x+yp*GW] + u[x+ym*GW] - 4*u[i];
          const lv = v[xp+y*GW] + v[xm+y*GW] + v[x+yp*GW] + v[x+ym*GW] - 4*v[i];
          const uvv = u[i] * v[i] * v[i];
          nu[i] = Math.max(0, Math.min(1, u[i] + DU*lu - uvv + F*(1-u[i])));
          nv[i] = Math.max(0, Math.min(1, v[i] + DV*lv + uvv - (F+K)*v[i]));
        }
      }
      u.set(nu);
      v.set(nv);
    }

    function render() {
      for (let i = 0; i < GW * GH; i++) {
        const t = Math.min(v[i] * 5, 1);
        const j = i * 4;
        img.data[j]   = Math.round(pr + (ar - pr) * t);
        img.data[j+1] = Math.round(pg + (ag - pg) * t);
        img.data[j+2] = Math.round(pb + (ab - pb) * t);
        img.data[j+3] = 255;
      }
      oc.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, w, h);

      // Text overlays
      ctx.fillStyle = ink;
      ctx.font = "italic 13px Fraunces, serif";
      ctx.fillText("morphogen field", 9, 22);
      ctx.fillStyle = muted;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`F=${F}  k=${K}`, w - 84, h - 8);
    }

    let raf = 0;
    function loop() {
      for (let s = 0; s < STEPS_PER_FRAME; s++) step();
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [w, h, ink, accent, paper, muted]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      style={{ width: w, height: h, display: "block" }}
    />
  );
}
