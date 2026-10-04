"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/device";

/**
 * Layers marked data-depth move a little with the pointer on desktop and
 * with the phone's tilt where allowed. Transform only, and nothing in the
 * calm (reduced motion) version.
 */
export function useParallax(stageRef: React.RefObject<HTMLElement | null>, tiltAllowed: boolean, enabled: boolean) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled || prefersReducedMotion()) return;
    const touch = isTouchDevice();
    let frame = 0;
    let dirty = false;
    let layers: { el: HTMLElement; depth: number }[] = [];

    const collect = () => {
      layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]"))
        .filter((el) => el.offsetParent !== null)
        .map((el) => ({ el, depth: parseFloat(el.dataset.depth || "0") || 0 }));
    };
    collect();
    const observer = new MutationObserver(() => collect());
    observer.observe(stage, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

    const apply = () => {
      frame = 0;
      if (!dirty) return;
      dirty = false;
      const { x, y } = target.current;
      for (const { el, depth } of layers) {
        gsap.to(el, { x: x * depth * 18, y: y * depth * 12, duration: 0.9, ease: "power2.out", overwrite: "auto" });
      }
    };
    const schedule = () => {
      dirty = true;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onPointer = (e: PointerEvent) => {
      if (touch) return;
      const r = stage.getBoundingClientRect();
      target.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      schedule();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      target.current = { x: Math.max(-1, Math.min(1, e.gamma / 25)), y: Math.max(-1, Math.min(1, (e.beta - 45) / 30)) };
      schedule();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    if (touch && tiltAllowed) window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [stageRef, tiltAllowed, enabled]);
}
