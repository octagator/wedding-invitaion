"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { content, music, plates } from "@/content/invitation";
import { DoorsFace } from "@/components/DoorsFace";
import { Medallion } from "@/components/ui/Medallion";
import { Chandelier } from "@/components/scenery/Chandelier";
import { Candles } from "@/components/scenery/Candles";
import { PlateImage } from "@/components/ui/PlateImage";
import { prefersReducedMotion, softHaptic } from "@/lib/device";

type Props = {
  /** Seconds since the seal was tapped, for the music cue. */
  openedAt: number;
  /** The camera has gone through: the first scene is now fully in view. */
  onEntered: () => void;
};

/** What lies behind the doors: a chandelier, white flowers, candles and marble steps. */
function Interior() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(90% 70% at 50% 35%, #5a4634 0%, #2f2420 70%, #1d1715 100%)" }}>
      <div className="absolute inset-x-0 top-[2%] flex justify-center" data-depth="0.3">
        <Chandelier size={0} className="h-auto w-[52%]" />
      </div>
      <div className="absolute inset-x-[10%] top-[36%] h-[4%]" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255, 220, 160, 0.45), transparent 70%)" }} />
      {/* white flowers */}
      <svg viewBox="0 0 400 200" className="absolute inset-x-0 top-[40%] w-full" aria-hidden="true" data-depth="0.6">
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 20 + ((i * 53) % 360);
          const y = 40 + ((i * 37) % 120);
          const r = 6 + ((i * 7) % 3) * 3;
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? "#f7f1e6" : "#eadfcc"} opacity={0.9} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse key={`l${i}`} cx={40 + i * 26} cy={150 + (i % 2) * 14} rx="14" ry="5" fill="#6c7a52" transform={`rotate(${(i * 23) % 60 - 30} ${40 + i * 26} ${150 + (i % 2) * 14})`} />
        ))}
      </svg>
      {/* marble steps */}
      <div className="absolute inset-x-0 bottom-0 h-[30%]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-x-0"
            style={{
              bottom: `${i * 24}%`,
              height: "26%",
              background: `linear-gradient(180deg, #e9dfd2 0%, #d8cbba ${60 + i * 8}%, #b9a894 100%)`,
              boxShadow: "0 -3px 8px rgba(0,0,0,0.25)",
              transform: `scaleX(${1 - i * 0.06})`,
            }}
          />
        ))}
      </div>
      <Candles count={6} bottom="22%" scale={0.9} />
      <PlateImage src={plates.doorsOpen} alt="" />
    </div>
  );
}

/**
 * The gatefold card as two real leaves, hinged at their outer edges. The
 * medallion is the latch. A tap, or dragging the leaves apart, parts the
 * medallion, spills light, swings the doors and carries the camera through.
 */
export function Doors({ openedAt, onEntered }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const medLeftRef = useRef<HTMLDivElement>(null);
  const medRightRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

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
      tl.to([medLeftRef.current, medRightRef.current], { autoAlpha: 0, duration: 0.5 })
        .to([left, right], { autoAlpha: 0, duration: 0.9 }, 0.3)
        .to(bloom, { autoAlpha: 1, duration: 0.8 }, 0.8)
        .to(bloom, { autoAlpha: 0, duration: 0.8 }, 1.8);
      return;
    }
    tl
      // the medallion parts
      .to(medLeftRef.current, { x: "-30%", duration: 0.6, ease: "power2.inOut" }, 0)
      .to(medRightRef.current, { x: "30%", duration: 0.6, ease: "power2.inOut" }, 0)
      // warm light spills through the gap first
      .fromTo(spillRef.current, { scaleX: 0.02, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.35)
      // the leaves swing with weight and a slight overshoot
      .to(left, { rotateY: -112, duration: 1.7, ease: "back.out(1.1)" }, 0.75)
      .to(right, { rotateY: 112, duration: 1.7, ease: "back.out(1.1)" }, 0.75)
      .to([medLeftRef.current, medRightRef.current], { autoAlpha: 0, duration: 0.4 }, 1.3)
      .to(spillRef.current, { autoAlpha: 0, duration: 0.6 }, 1.4)
      // the camera moves forward through the doorway
      .to(world, { scale: 2.6, duration: 1.9, ease: "power2.in" }, 1.5)
      .to(interior, { scale: 1.35, duration: 1.9, ease: "power2.in" }, 1.5)
      .to(bloom, { autoAlpha: 1, duration: 1.1, ease: "power1.in" }, 2.3)
      // and the light resolves into the first scene
      .to(interior, { autoAlpha: 0, duration: 0.4 }, 3.1)
      .to(bloom, { autoAlpha: 0, duration: 1.2, ease: "power2.out" }, 3.35);
  };

  // Optional music cue: open on their own at a swell in the song.
  useEffect(() => {
    if (!music.doorCueSeconds) return;
    const elapsed = (performance.now() - openedAt) / 1000;
    const wait = Math.max(0, music.doorCueSeconds - elapsed);
    const id = window.setTimeout(open, wait * 1000);
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
      const left = leftRef.current;
      const right = rightRef.current;
      if (!left || !right) return;
      const amount = Math.min(28, Math.abs(dx) / 6);
      gsap.to(left, { rotateY: -amount, duration: 0.2, overwrite: true });
      gsap.to(right, { rotateY: amount, duration: 0.2, overwrite: true });
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

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 25, touchAction: "none" }}>
      <div ref={interiorRef} className="absolute inset-0" style={{ transformOrigin: "50% 45%" }}>
        <Interior />
      </div>
      {/* light spilling through the seam */}
      <div
        ref={spillRef}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[70%] -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255, 225, 160, 0.75) 50%, transparent 100%)", opacity: 0, transformOrigin: "50% 50%", zIndex: 2, filter: "blur(6px)" }}
      />
      <div ref={worldRef} className="absolute inset-0" style={{ perspective: "1400px", transformStyle: "preserve-3d", transformOrigin: "50% 50%", zIndex: 3 }}>
        <div ref={leftRef} className="absolute inset-y-0 left-0" style={{ width: "50.5%", transformOrigin: "0% 50%", transformStyle: "preserve-3d", backfaceVisibility: "hidden", boxShadow: "6px 0 24px rgba(0,0,0,0.25)" }}>
          <DoorsFace side="left" withMedallion={false} />
          <PlateImage src={plates.doorsClosed} alt="" style={{ objectPosition: "left center", width: "198%", maxWidth: "none" }} />
          <div ref={medLeftRef} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" style={{ width: "60%" }}>
            <Medallion width={0} half="left" className="breathe h-auto w-full" />
          </div>
        </div>
        <div ref={rightRef} className="absolute inset-y-0 right-0" style={{ width: "50.5%", transformOrigin: "100% 50%", transformStyle: "preserve-3d", backfaceVisibility: "hidden", boxShadow: "-6px 0 24px rgba(0,0,0,0.25)" }}>
          <DoorsFace side="right" withMedallion={false} />
          <PlateImage src={plates.doorsClosed} alt="" style={{ objectPosition: "right center", width: "198%", maxWidth: "none", left: "auto", right: 0 }} />
          <div ref={medRightRef} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ width: "60%" }}>
            <Medallion width={0} half="right" className="breathe h-auto w-full" />
          </div>
        </div>
        {/* the latch: an invisible, breathing tap target over the medallion */}
        <button
          type="button"
          onClick={open}
          aria-label={content.ui.tapToOpen}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "32%", aspectRatio: "1 / 1.3", background: "transparent", border: 0, zIndex: 4 }}
        />
      </div>
      <div ref={bloomRef} className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, #fff3d6 0%, #f3d8a6 45%, #efe5dc 100%)", opacity: 0, visibility: "hidden", zIndex: 5 }} />
    </div>
  );
}
