"use client";

import { useEffect, useRef } from "react";
import { isWeakDevice, prefersReducedMotion } from "@/lib/device";

type Particle = {
  kind: "petal" | "dust";
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vrot: number;
  phase: number;
  alpha: number;
};

export type ParticlesHandle = {
  /** Temporarily raise the petal count, e.g. when the countdown reaches zero. */
  setPetalFall: (on: boolean) => void;
  /** A one-off burst of gold dust at a point (stage coordinates, 0..1). */
  burst: (x: number, y: number, count?: number) => void;
};

/**
 * One shared canvas of a few jasmine petals and specks of gold dust that
 * drift through every scene. Few and slow on purpose.
 */
export function Particles({
  handleRef,
  density = 1,
  className = "",
}: {
  handleRef?: React.MutableRefObject<ParticlesHandle | null>;
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const weak = isWeakDevice();
    const dpr = Math.min(window.devicePixelRatio || 1, weak ? 1.25 : 2);
    let w = 0;
    let h = 0;
    let petalFall = false;
    const particles: Particle[] = [];
    const bursts: Particle[] = [];

    const basePetals = reduced ? 0 : Math.round((weak ? 4 : 7) * density);
    const baseDust = reduced ? 0 : Math.round((weak ? 10 : 18) * density);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (kind: Particle["kind"], fromTop = false): Particle => {
      const petal = kind === "petal";
      return {
        kind,
        x: Math.random() * w,
        y: fromTop ? -20 : Math.random() * h,
        vx: (Math.random() - 0.5) * (petal ? 10 : 4),
        vy: petal ? 10 + Math.random() * 10 : 3 + Math.random() * 5,
        r: petal ? 5 + Math.random() * 5 : 0.8 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: petal ? 0.55 + Math.random() * 0.3 : 0.35 + Math.random() * 0.4,
      };
    };

    for (let i = 0; i < basePetals; i++) particles.push(spawn("petal"));
    for (let i = 0; i < baseDust; i++) particles.push(spawn("dust"));

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      const g = ctx.createLinearGradient(-p.r, 0, p.r, 0);
      g.addColorStop(0, "#fff9f0");
      g.addColorStop(1, "#f1e2cf");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.6, p.r * 0.9, p.r * 0.6, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.6, -p.r * 0.9, -p.r * 0.6, 0, -p.r);
      ctx.fill();
      ctx.restore();
    };

    const drawDust = (p: Particle, t: number) => {
      const tw = 0.6 + 0.4 * Math.sin(t * 0.002 + p.phase * 3);
      ctx.save();
      ctx.globalAlpha = p.alpha * tw;
      ctx.fillStyle = "#e9cf93";
      ctx.shadowColor = "rgba(233, 207, 147, 0.9)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    let frame = 0;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      const wantPetals = petalFall ? basePetals * 4 + 6 : basePetals;
      let petalCount = 0;
      for (const p of particles) if (p.kind === "petal") petalCount++;
      if (petalCount < wantPetals && Math.random() < 0.3) particles.push(spawn("petal", true));

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const swayX = Math.sin(now * 0.0006 + p.phase) * (p.kind === "petal" ? 18 : 6);
        p.x += (p.vx + swayX) * dt;
        p.y += p.vy * dt * (p.kind === "petal" ? 1 : 0.7);
        p.rot += p.vrot * dt;
        if (p.y > h + 24 || p.x < -30 || p.x > w + 30) {
          if (p.kind === "petal" && petalCount > wantPetals) {
            particles.splice(i, 1);
            petalCount--;
            continue;
          }
          Object.assign(p, spawn(p.kind, true));
        }
        if (p.kind === "petal") drawPetal(p);
        else drawDust(p, now);
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.vy += 60 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.alpha -= dt * 0.9;
        if (b.alpha <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        drawDust(b, now);
      }

      frame = requestAnimationFrame(tick);
    };

    if (!reduced) frame = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reduced) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (handleRef) {
      handleRef.current = {
        setPetalFall: (on) => (petalFall = on),
        burst: (x, y, count = 40) => {
          if (reduced) return;
          for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = 40 + Math.random() * 120;
            bursts.push({
              kind: "dust",
              x: x * w,
              y: y * h,
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s - 40,
              r: 0.8 + Math.random() * 1.6,
              rot: 0,
              vrot: 0,
              phase: Math.random() * 6,
              alpha: 0.9,
            });
          }
        },
      };
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (handleRef) handleRef.current = null;
    };
  }, [handleRef, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
