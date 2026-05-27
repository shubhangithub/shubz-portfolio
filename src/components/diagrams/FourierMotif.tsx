// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { samplePath, dft } from '../../lib/fourier';

export function FourierMotif({
  shape = "hex",
  size = 260,
  strokeColor = "currentColor",
  trailColor,
  epicycleColor,
  density = 18,
  speed = 0.08,
  cursorReactive = true,
  paused = false,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const cursorRef = useRef({ x: 0.5, y: 0.5, near: 0 });
  const tRef = useRef(0);
  const trailRef = useRef([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const samples = samplePath(shape, 256);
    const coefs = dft(samples).slice(0, density);

    const cx = size / 2, cy = size / 2;
    const radius = size * 0.36;

    function handleCursor(e) {
      if (!cursorReactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const dx = x - 0.5, dy = y - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      cursorRef.current = { x, y, near: Math.max(0, 1 - dist * 1.8) };
    }
    window.addEventListener("mousemove", handleCursor);

    function draw() {
      const t = tRef.current;
      ctx.clearRect(0, 0, size, size);

      // subtle paper noise via blend
      ctx.save();

      // epicycle chain
      let x = cx, y = cy;
      const near = cursorRef.current.near;
      const phaseBoost = near * 0.4;

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = epicycleColor || "rgba(0,0,0,0.14)";

      for (let i = 0; i < coefs.length; i++) {
        const c = coefs[i];
        const theta = c.freq * t * speed + c.phase + phaseBoost * (i / coefs.length);
        const r = c.amp * radius;
        const nx = x + Math.cos(theta) * r;
        const ny = y + Math.sin(theta) * r;
        if (i > 0) {
          // circle outline (epicycle)
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
          // arm
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
        x = nx; y = ny;
      }

      // append trail point (x,y) is the tip
      trailRef.current.push({ x, y });
      if (trailRef.current.length > 420) trailRef.current.shift();

      // draw trail with pencil-like texture: varied alpha + width
      ctx.lineCap = "round";
      const trail = trailRef.current;
      for (let i = 1; i < trail.length; i++) {
        const a = i / trail.length;
        ctx.strokeStyle = trailColor || `rgba(0,0,0,${0.18 + a * 0.55})`;
        ctx.lineWidth = 0.9 + a * 1.3;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      // tip dot
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      if (!paused && !reduced.current) {
        tRef.current += 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleCursor);
    };
  }, [shape, size, density, speed, cursorReactive, paused, strokeColor, trailColor, epicycleColor]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
