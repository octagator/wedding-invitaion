"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { content, music, plates } from "@/content/invitation";
import { prefersReducedMotion, softHaptic } from "@/lib/device";

type Props = {
  /** Milliseconds (performance.now) when the seal was tapped, for the music cue. */
  openedAt: number;
  /** The camera has gone through: the first scene is now fully in view. */
  onEntered: () => void;
};

/** The gatefold card as designed, and where its centre seam falls. */
const CARD = { w: 855, h: 1464, seam: 0.495, medallion: { x: 0.5, y: 0.515, w: 0.17, h: 0.16 } };

type Fit = { cardW: number; cardH: number; offX: number; offY: number; seamX: number; stageW: number; stageH: number };

/**
 * The card as two real leaves, hinged at their outer edges, cut from the
 * design at its centre seam so the medallion parts with them. A tap, or
 * dragging the leaves apart, spills light, swings the doors and carries the
 * camera through into the candle-lit interior of the design.
 */
export function Doors({ openedAt, onEntered }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const [fit, setFit] = useState<Fit | null>(null);

  // Lay the card over the stage like object-fit: cover, and find the seam.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const stageW = root.clientWidth;
      const stageH = root.clientHeight;
      const scale = Math.max(stageW / CARD.w, stageH / CARD.h);
      const cardW = CARD.w * scale;
      const cardH = CARD.h * scale;
      const offX = (stageW - cardW) / 2;
      const offY = (stageH - cardH) / 2;
      setFit({ cardW, cardH, offX, offY, seamX: offX + cardW * CARD.seam, stageW, stageH });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const open = () => {
    if (opened.current) return;
    opened.current = true;
    softHaptic();
    const reduced = prefersReducedMotion();
    const left = leftRef.current;
    const right = rightRef.current;
    const world = worldRef.current;
    const interior = interiorRef.current;
    const bloom = bloomRef.current;
    if (!left || !right || !world || !interior || !bloom) return onEntered();

    const tl = gsap.timeline({ onComplete: onEntered });
    if (reduced) {
      tl.to(glowRef.current, { autoAlpha: 0, duration: 0.3 })
        .to([left, right], { autoAlpha: 0, duration: 0.9 }, 0.3)
        .to(bloom, { autoAlpha: 1, duration: 0.8 }, 0.8)
        .to(bloom, { autoAlpha: 0, duration: 0.8 }, 1.8);
      return;
    }
    tl
      // a breath before the latch gives
      .to(glowRef.current, { autoAlpha: 0, duration: 0.4 }, 0)
      .to([left, right], { scale: 1.01, duration: 0.35, ease: "power1.inOut", transformOrigin: "50% 50%" }, 0)
      // warm light spills through the seam first
      .fromTo(spillRef.current, { scaleX: 0.02, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.3)
      // the leaves swing with weight and a slight overshoot
      .to(left, { rotateY: -112, duration: 1.7, ease: "back.out(1.1)" }, 0.65)
      .to(right, { rotateY: 112, duration: 1.7, ease: "back.out(1.1)" }, 0.65)
      .to(spillRef.current, { autoAlpha: 0, duration: 0.6 }, 1.3)
      // the camera moves forward through the doorway
      .to(world, { scale: 2.6, duration: 1.9, ease: "power2.in" }, 1.4)
      .to(interior, { scale: 1.35, duration: 1.9, ease: "power2.in" }, 1.4)
      .to(bloom, { autoAlpha: 1, duration: 1.1, ease: "power1.in" }, 2.2)
      // and the light resolves into the first scene
      .to(interior, { autoAlpha: 0, duration: 0.4 }, 3.0)
      .to(bloom, { autoAlpha: 0, duration: 1.2, ease: "power2.out" }, 3.25);
  };

  // Optional music cue: open on their own at a swell in the song.
  useEffect(() => {
    if (!music.doorCueSeconds) return;
    const elapsed = (performance.now() - openedAt) / 1000;
    const id = window.setTimeout(open, Math.max(0, music.doorCueSeconds - elapsed) * 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedAt]);

  // Drag the leaves apart.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let startX = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging || opened.current) return;
      const dx = e.clientX - startX;
      const amount = Math.min(28, Math.abs(dx) / 6);
      gsap.to(leftRef.current, { rotateY: -amount, duration: 0.2, overwrite: true });
      gsap.to(rightRef.current, { rotateY: amount, duration: 0.2, overwrite: true });
      if (Math.abs(dx) > 70) {
        dragging = false;
        open();
      }
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (!opened.current) {
        gsap.to(leftRef.current, { rotateY: 0, duration: 0.5, ease: "power2.out", overwrite: true });
        gsap.to(rightRef.current, { rotateY: 0, duration: 0.5, ease: "power2.out", overwrite: true });
      }
    };
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    return () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leafStyle = (side: "left" | "right"): React.CSSProperties => {
    if (!fit) return { visibility: "hidden" };
    const base: React.CSSProperties = {
      backgroundImage: `url(${plates.doorsClosed})`,
      backgroundSize: `${fit.cardW}px ${fit.cardH}px`,
      backgroundRepeat: "no-repeat",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
    };
    if (side === "left") {
      return { ...base, left: 0, width: fit.seamX, backgroundPosition: `${fit.offX}px ${fit.offY}px`, transformOrigin: "0% 50%", boxShadow: "6px 0 24px rgba(0,0,0,0.25)" };
    }
    return { ...base, left: fit.seamX, width: fit.stageW - fit.seamX, backgroundPosition: `${fit.offX - fit.seamX}px ${fit.offY}px`, transformOrigin: "100% 50%", boxShadow: "-6px 0 24px rgba(0,0,0,0.25)" };
  };

  const med = fit
    ? {
        left: fit.offX + fit.cardW * (CARD.medallion.x - CARD.medallion.w / 2),
        top: fit.offY + fit.cardH * (CARD.medallion.y - CARD.medallion.h / 2),
        width: fit.cardW * CARD.medallion.w,
        height: fit.cardH * CARD.medallion.h,
      }
    : null;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 25, touchAction: "none", background: "#2f2420" }}>
      <div ref={interiorRef} className="absolute inset-0" style={{ transformOrigin: "50% 42%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={plates.doorsOpen} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>
      <div
        ref={spillRef}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[70%] -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255, 225, 160, 0.75) 50%, transparent 100%)", opacity: 0, transformOrigin: "50% 50%", zIndex: 2, filter: "blur(6px)" }}
      />
      <div ref={worldRef} className="absolute inset-0" style={{ perspective: "1400px", transformStyle: "preserve-3d", transformOrigin: "50% 50%", zIndex: 3 }}>
        <div ref={leftRef} className="absolute inset-y-0" style={leafStyle("left")} />
        <div ref={rightRef} className="absolute inset-y-0" style={leafStyle("right")} />
        {med && (
          <>
            {/* the medallion breathes softly to invite a touch */}
            <div ref={glowRef} className="breathe pointer-events-none absolute rounded-full" style={{ left: med.left - med.width * 0.5, top: med.top - med.height * 0.3, width: med.width * 2, height: med.height * 1.6, background: "radial-gradient(ellipse, rgba(255, 236, 190, 0.55) 0%, rgba(255, 236, 190, 0) 65%)", zIndex: 4 }} />
            <button type="button" onClick={open} aria-label={content.ui.tapToOpen} className="absolute rounded-full" style={{ left: med.left - 12, top: med.top - 12, width: med.width + 24, height: med.height + 24, background: "transparent", border: 0, zIndex: 5, cursor: "pointer" }} />
          </>
        )}
      </div>
      <div ref={bloomRef} className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, #fff3d6 0%, #f3d8a6 45%, #efe5dc 100%)", opacity: 0, visibility: "hidden", zIndex: 6 }} />
    </div>
  );
}
