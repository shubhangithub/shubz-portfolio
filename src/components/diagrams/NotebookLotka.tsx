// @ts-nocheck
/* eslint-disable */
/**
 * NotebookLotka — canvas-based animated Lotka–Volterra phase orbit.
 *
 * Per AGENTS-v5.md §6 "math diagrams": maths drawn clean (smooth ellipse,
 * no noise), chrome is sketchy (hand axes with arrowheads). The point on
 * the orbit advances ~0.45 rad/s; everything else is static. SSR-safe via
 * the `if (!ref.current) return;` guard inside the effect.
 */
import React from "react";

export function NotebookLotka({
  w = 290,
  h = 210,
  ink,
  accent,
  paper,
  muted,
}: {
  w?: number;
  h?: number;
  ink: string;
  accent: string;
  paper: string;
  muted: string;
}) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const tref = React.useRef(0);
  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    let raf = 0;
    let last = performance.now();
    function draw(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      tref.current += dt * 0.45;
      const tt = tref.current;
      ctx.clearRect(0, 0, w, h);
      function sketchLine(x1: number, y1: number, x2: number, y2: number) {
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // arrowhead
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        ctx.lineTo(x2 - ux * 6 - uy * 3, y2 - uy * 6 + ux * 3);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ux * 6 + uy * 3, y2 - uy * 6 - ux * 3);
        ctx.stroke();
      }
      sketchLine(40, h - 30, w - 20, h - 30);
      sketchLine(40, h - 30, 40, 20);
      ctx.fillStyle = ink;
      ctx.font = "italic 14px Fraunces, serif";
      ctx.fillText("predator", 50, 32);
      ctx.fillText("prey", w - 60, h - 14);
      ctx.fillStyle = muted;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("+ eq", w / 2 - 12, h / 2 + 4);
      // Smooth orbit — closed-form ellipse, no wobble.
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      const cx = w / 2;
      const cy = h / 2 + 4;
      const a = (w - 100) * 0.34;
      const b = (h - 80) * 0.30;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const th = (i / 360) * Math.PI * 2;
        const x = cx + a * Math.cos(th);
        const y = cy + b * Math.sin(th);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // current state — dot with paper-coloured ring
      const x = cx + a * Math.cos(tt);
      const y = cy + b * Math.sin(tt);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = paper;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [w, h, ink, accent, paper, muted]);
  return <canvas ref={ref} width={w} height={h} style={{ width: w, height: h, display: "block" }} />;
}
