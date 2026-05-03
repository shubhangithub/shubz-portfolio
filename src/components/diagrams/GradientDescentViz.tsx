// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function GradientDescentViz({
  width = 260,
  height = 220,
  strokeColor = "currentColor",
  mutedColor = "rgba(0,0,0,0.35)",
  accentColor = "#3F4B7E",
  onStateChange,
}) {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const stateRef = useRef({
    x: 1.6, y: -1.2, trail: [], step: 0, converged: false,
    lastT: performance.now(),
  });
  const [, force] = useState(0);
  const [ariaState, setAriaState] = useState("descending");

  // loss: multi-basin landscape  f(x,y) = sin(2.5x)cos(2.5y) + 0.12(x²+y²)
  // Rx/Ry scale with aspect ratio so craters stay circular, we just get MORE of them when wider
  const aspect = width / height;
  const Ry = 2.5;
  const Rx = Ry * aspect;
  const fn  = (x, y) => Math.sin(2.5 * x) * Math.cos(2.5 * y) + 0.12 * (x * x + y * y);
  const gfx = (x, y) => { const h = 0.0005; return (fn(x + h, y) - fn(x - h, y)) / (2 * h); };
  const gfy = (x, y) => { const h = 0.0005; return (fn(x, y + h) - fn(x, y - h)) / (2 * h); };

  const toCanvas = (x, y) => [(x + Rx) / (2 * Rx) * width, (y + Ry) / (2 * Ry) * height];
  const fromCanvas = (cx, cy) => [cx / width * (2 * Rx) - Rx, cy / height * (2 * Ry) - Ry];

  // parse hex colour to [r,g,b]
  function hexRGB(hex) {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  // pre-render heatmap (static — loss landscape doesn't change)
  useEffect(() => {
    const bg = document.createElement("canvas");
    bg.width = width; bg.height = height;
    const ctx = bg.getContext("2d");
    const img = ctx.createImageData(width, height);

    // compute loss range
    let lo = Infinity, hi = -Infinity;
    const grid = new Float32Array(width * height);
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const [x, y] = fromCanvas(px, py);
        const v = fn(x, y);
        grid[py * width + px] = v;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }

    const [cr, cg, cb] = hexRGB(accentColor);
    const span = hi - lo || 1;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const idx = (py * width + px);
        const t = (grid[idx] - lo) / span;             // 0 = valley, 1 = ridge
        const q = Math.floor(t * 8) / 8;               // quantise → contour bands
        const pidx = idx * 4;
        img.data[pidx]     = cr;
        img.data[pidx + 1] = cg;
        img.data[pidx + 2] = cb;
        img.data[pidx + 3] = Math.round((1 - q) * 105 + 18);

        // contour edges: darken pixels where the band changes
        if (px > 0) {
          const prevQ = Math.floor(((grid[idx - 1] - lo) / span) * 8);
          const curQ  = Math.floor(t * 8);
          if (prevQ !== curQ) {
            img.data[pidx + 3] = Math.min(255, img.data[pidx + 3] + 60);
          }
        }
        if (py > 0) {
          const aboveQ = Math.floor(((grid[(py - 1) * width + px] - lo) / span) * 8);
          const curQ   = Math.floor(t * 8);
          if (aboveQ !== curQ) {
            img.data[pidx + 3] = Math.min(255, img.data[pidx + 3] + 60);
          }
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    bgRef.current = bg;
  }, [width, height, accentColor]);

  // animation loop
  useEffect(() => {
    let raf;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameCount = 0;

    function tick(now) {
      const s = stateRef.current;
      const dt = Math.min((now - s.lastT) / 1000, 0.1);
      s.lastT = now;
      frameCount++;

      // step every 2 frames for visible motion
      if (!s.converged && frameCount % 2 === 0) {
        const gx = gfx(s.x, s.y);
        const gy = gfy(s.x, s.y);
        const gnorm = Math.sqrt(gx * gx + gy * gy);
        const lr = 0.025;
        s.x -= lr * gx;
        s.y -= lr * gy;
        s.x = Math.max(-Rx, Math.min(Rx, s.x));
        s.y = Math.max(-Ry, Math.min(Ry, s.y));
        s.trail.push([s.x, s.y]);
        if (s.trail.length > 400) s.trail.shift();
        s.step++;
        if (gnorm < 0.008) {
          s.converged = true;
          setAriaState("converged");
        }
      }

      // draw
      const cvs = canvasRef.current;
      if (!cvs) { raf = requestAnimationFrame(tick); return; }
      const ctx = cvs.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      // heatmap
      if (bgRef.current) ctx.drawImage(bgRef.current, 0, 0);

      // trail
      if (s.trail.length > 1) {
        ctx.beginPath();
        const [sx, sy] = toCanvas(s.trail[0][0], s.trail[0][1]);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < s.trail.length; i++) {
          const [tx, ty] = toCanvas(s.trail[i][0], s.trail[i][1]);
          ctx.lineTo(tx, ty);
        }
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.55;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ball
      const [bx, by] = toCanvas(s.x, s.y);
      ctx.beginPath();
      ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // glow when converged
      if (s.converged) {
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.4 + 0.2 * Math.sin(now / 500);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // readout
      ctx.font = "10px monospace";
      ctx.fillStyle = mutedColor;
      const lossVal = fn(s.x, s.y);
      ctx.fillText(
        "loss " + lossVal.toFixed(3) + "  step " + s.step + (s.converged ? "  \u2713" : ""),
        6, height - 6
      );

      if (onStateChange) onStateChange({ loss: lossVal, step: s.step, converged: s.converged });

      raf = requestAnimationFrame(tick);
    }

    if (!reduced) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // click to restart
  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (width / rect.width);
    const cy = (e.clientY - rect.top) * (height / rect.height);
    const [x, y] = fromCanvas(cx, cy);
    const s = stateRef.current;
    s.x = x; s.y = y;
    s.trail = [[x, y]];
    s.step = 0;
    s.converged = false;
    setAriaState("descending");
  };

  // touch support
  const handleTouch = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (touch.clientX - rect.left) * (width / rect.width);
    const cy = (touch.clientY - rect.top) * (height / rect.height);
    const [x, y] = fromCanvas(cx, cy);
    const s = stateRef.current;
    s.x = x; s.y = y;
    s.trail = [[x, y]];
    s.step = 0;
    s.converged = false;
    setAriaState("descending");
  };

  return (
    <canvas ref={canvasRef} width={width} height={height}
      onClick={handleClick}
      onTouchStart={handleTouch}
      style={{ width: "100%", height, display: "block", cursor: "crosshair" }}
      aria-label={"Gradient descent on a loss landscape — " + ariaState + ". Click to restart from a new point."}
      role="img" tabIndex={0}
    />
  );
}
