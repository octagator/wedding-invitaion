"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/content/invitation";
import { prefersReducedMotion } from "@/lib/device";

/**
 * Brushed gold foil over its children. The guest rubs it away with a
 * finger; gold dust falls from the stroke. The reveal completes on its own
 * once about half is cleared, and a plain tap on the foil also reveals it,
 * so nobody can get stuck. Only the foil itself blocks scrolling; a drag
 * that is mostly vertical is handed back to the page.
 */
export function Scratch({
  children,
  active,
  onRevealed,
  className = "",
}: {
  children: React.ReactNode;
  active: boolean;
  onRevealed?: () => void;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [calm, setCalm] = useState(false);
  const [fading, setFading] = useState(false);
  const [nudge, setNudge] = useState(false);
  const revealedRef = useRef(false);
  const onRevealedRef = useRef(onRevealed);
  onRevealedRef.current = onRevealed;

  useEffect(() => setCalm(prefersReducedMotion()), []);

  // Offer the tap fallback (a gentle pulse) a few seconds after the scene is reached.
  useEffect(() => {
    if (!active || revealed) return;
    const id = window.setTimeout(() => setNudge(true), 4500);
    return () => window.clearTimeout(id);
  }, [active, revealed]);

  const finish = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setFading(true);
    window.setTimeout(() => {
      setRevealed(true);
      onRevealedRef.current?.();
    }, 700);
  };

  useEffect(() => {
    if (calm) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const paintFoil = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#d9b86f");
      g.addColorStop(0.3, "#f0dca6");
      g.addColorStop(0.5, "#c9a35e");
      g.addColorStop(0.72, "#efd9a0");
      g.addColorStop(1, "#b8924c");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // brushed lines
      ctx.globalAlpha = 0.18;
      for (let y = 0; y < h; y += 2) {
        ctx.fillStyle = Math.random() > 0.5 ? "#fff3cf" : "#a67f3c";
        ctx.fillRect(0, y, w, 1);
      }
      ctx.globalAlpha = 1;
      // hint text drawn into the foil
      ctx.fillStyle = "rgba(90, 70, 30, 0.75)";
      ctx.font = `500 ${Math.max(11, Math.min(13, w / 26))}px var(--font-serif), serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const hint = content.ui.scratch.toUpperCase().split("").join(" ");
      ctx.fillText(hint, w / 2, h / 2);
      ctx.globalCompositeOperation = "destination-out";
    };
    paintFoil();
    const ro = new ResizeObserver(() => {
      if (!revealedRef.current) paintFoil();
    });
    ro.observe(wrap);

    // Falling gold dust from the stroke.
    const dust: { x: number; y: number; vx: number; vy: number; a: number }[] = [];
    const dustCanvas = document.createElement("canvas");
    dustCanvas.className = "pointer-events-none absolute inset-0";
    dustCanvas.style.width = "100%";
    dustCanvas.style.height = "140%";
    dustCanvas.style.top = "0";
    wrap.appendChild(dustCanvas);
    const dctx = dustCanvas.getContext("2d");
    let dustFrame = 0;
    const drawDust = () => {
      if (!dctx) return;
      const dw = w;
      const dh = h * 1.4;
      if (dustCanvas.width !== Math.round(dw * dpr)) {
        dustCanvas.width = Math.round(dw * dpr);
        dustCanvas.height = Math.round(dh * dpr);
        dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      dctx.clearRect(0, 0, dw, dh);
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.vy += 0.12;
        d.x += d.vx;
        d.y += d.vy;
        d.a -= 0.012;
        if (d.a <= 0) {
          dust.splice(i, 1);
          continue;
        }
        dctx.globalAlpha = d.a;
        dctx.fillStyle = "#e9cf93";
        dctx.beginPath();
        dctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
        dctx.fill();
      }
      if (dust.length) dustFrame = requestAnimationFrame(drawDust);
    };

    let drawing = false;
    let moved = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let strokes = 0;

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const clearedRatio = () => {
      const sw = 40;
      const sh = 16;
      const sample = ctx.getImageData(0, 0, canvas.width, canvas.height, { colorSpace: "srgb" }).data;
      let clear = 0;
      let total = 0;
      const stepX = Math.max(1, Math.floor(canvas.width / sw));
      const stepY = Math.max(1, Math.floor(canvas.height / sh));
      for (let y = 0; y < canvas.height; y += stepY) {
        for (let x = 0; x < canvas.width; x += stepX) {
          total++;
          if (sample[(y * canvas.width + x) * 4 + 3] < 40) clear++;
        }
      }
      return total ? clear / total : 0;
    };

    const scratchAt = (x: number, y: number) => {
      const r = Math.max(14, w / 12);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = r * 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        dust.push({ x: x + (Math.random() - 0.5) * r, y, vx: (Math.random() - 0.5) * 0.8, vy: Math.random() * 0.5, a: 0.9 });
      }
      if (dust.length && !dustFrame) dustFrame = requestAnimationFrame(drawDust);
      else if (dust.length) {
        cancelAnimationFrame(dustFrame);
        dustFrame = requestAnimationFrame(drawDust);
      }
    };

    const onDown = (e: PointerEvent) => {
      if (revealedRef.current) return;
      drawing = true;
      moved = 0;
      const p = pos(e);
      startX = lastX = p.x;
      startY = lastY = p.y;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing || revealedRef.current) return;
      const p = pos(e);
      moved += Math.hypot(p.x - lastX, p.y - lastY);
      scratchAt(p.x, p.y);
      lastX = p.x;
      lastY = p.y;
      strokes++;
      if (strokes % 6 === 0 && clearedRatio() >= 0.5) finish();
    };
    const onUp = (e: PointerEvent) => {
      if (!drawing) return;
      drawing = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const p = pos(e);
      const dist = Math.hypot(p.x - startX, p.y - startY);
      // A plain tap reveals everything: the fallback for guests who do not scratch.
      if (moved < 6 && dist < 6) finish();
      else if (clearedRatio() >= 0.5) finish();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(dustFrame);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      dustCanvas.remove();
    };
  }, [calm]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div aria-hidden={!revealed && !calm ? true : undefined}>{children}</div>
      {!revealed && (
        <>
          {calm ? (
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-[10px] uppercase tracking-[0.28em] text-[#5a4620]"
              style={{ fontSize: "clamp(0.6rem, 2.4cqw, 0.9rem)", background: "linear-gradient(120deg, #d9b86f, #f0dca6 40%, #c9a35e 60%, #efd9a0)" }}
              onClick={finish}
            >
              {content.ui.scratch}
            </button>
          ) : (
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full rounded-[10px] ${nudge ? "breathe" : ""}`}
              style={{
                touchAction: "none",
                cursor: "pointer",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.7s ease",
                boxShadow: "0 8px 24px rgba(120, 90, 40, 0.25)",
              }}
              role="button"
              tabIndex={0}
              aria-label={content.ui.scratch}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") finish();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
