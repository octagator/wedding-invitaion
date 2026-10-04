"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { content } from "@/content/invitation";
import { prefersReducedMotion } from "@/lib/device";
import { SCENE, type SceneHandle } from "@/components/scenes/scene";
import { NamesScene } from "@/components/scenes/NamesScene";
import { DateScene } from "@/components/scenes/DateScene";
import { VenueScene } from "@/components/scenes/VenueScene";
import { BeOnTimeScene } from "@/components/scenes/BeOnTimeScene";
import { NoteScene } from "@/components/scenes/NoteScene";
import { LocationScene } from "@/components/scenes/LocationScene";
import { BigDayScene } from "@/components/scenes/BigDayScene";
import { KeepsakeScene } from "@/components/scenes/KeepsakeScene";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const COUNT = 8;
const OVERLAP = SCENE.exit;
/** Dominant tones of each scene, for the blurred desktop backdrop. */
const TONES: [string, string][] = [
  ["#d6e4ea", "#e3d2b8"],
  ["#f3c58f", "#e6d3bb"],
  ["#e4a56d", "#e5c8a6"],
  ["#e3cdb0", "#dcc3a3"],
  ["#f3eadf", "#e2d0b8"],
  ["#efe3d3", "#ddc7ab"],
  ["#2b2b40", "#7a5a4a"],
  ["#f1e5d6", "#d6bd9e"],
];

type Props = {
  /** The doors have opened: scrolling may begin. */
  active: boolean;
  onCountdownDone: () => void;
  /** Receives the scroll spacer height in px so the page can size itself. */
  spacerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Seven scenes and the keepsake on one master timeline, scrubbed by scroll.
 * Each scene's enter overlaps the previous scene's exit, so every handover
 * is a move and never a cut.
 */
export function Journey({ active, onCountdownDone, spacerRef }: Props) {
  const handles = useRef<(SceneHandle | null)[]>(Array(COUNT).fill(null));
  const warm = useRef<HTMLDivElement>(null);
  const dusk = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const activeRef = useRef(0);
  const sceneStarts = useRef<number[]>([]);

  // Build the master timeline once all scenes are mounted.
  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;
    const reduced = prefersReducedMotion();
    const master = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const starts: number[] = [];
    handles.current.forEach((h, i) => {
      if (!h) return;
      const tl = h.build();
      // Every scene is exactly one unit long, whatever its last tween.
      tl.add(() => undefined, 1);
      const at = i === 0 ? 0 : Math.max(0, master.duration() - OVERLAP);
      starts.push(at);
      master.add(tl, at);
    });
    sceneStarts.current = starts;

    // The colour temperature moves from daylight to dusk across the journey.
    if (warm.current && dusk.current) {
      master.fromTo(warm.current, { opacity: 0 }, { opacity: 0.22, duration: starts[2] + 0.4 }, 0.3);
      master.to(warm.current, { opacity: 0.1, duration: 0.6 }, starts[4]);
      master.fromTo(dusk.current, { opacity: 0 }, { opacity: 0.28, duration: 0.5 }, starts[6]);
      master.to(dusk.current, { opacity: 0, duration: 0.4 }, starts[7]);
      master.to(warm.current, { opacity: 0, duration: 0.4 }, starts[7]);
    }

    const total = master.duration();
    spacer.style.height = `${total * SCENE.vhPerUnit}svh`;

    const st = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? true : 0.7,
      animation: master,
      onUpdate: (self) => {
        const t = self.progress * total;
        let idx = 0;
        for (let i = 0; i < starts.length; i++) if (t >= starts[i] + OVERLAP * 0.5) idx = i;
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActiveIndex(idx);
          handles.current[idx]?.onActive?.();
        }
        if (self.progress > 0.004) setScrolled(true);
      },
    });
    handles.current[0]?.onActive?.();

    return () => {
      st.kill();
      master.kill();
    };
  }, [spacerRef]);

  // Smooth scrolling begins once the doors have opened.
  useEffect(() => {
    if (!active) return;
    const reduced = prefersReducedMotion();
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [active]);

  const near = (i: number) => Math.abs(i - activeIndex) <= 1;

  useEffect(() => {
    const [a, b] = TONES[activeIndex] ?? TONES[0];
    document.documentElement.style.setProperty("--scene-a", a);
    document.documentElement.style.setProperty("--scene-b", b);
  }, [activeIndex]);

  return (
    <div className="absolute inset-0" aria-hidden={!active ? true : undefined}>
      <NamesScene ref={(h) => void (handles.current[0] = h)} active={activeIndex === 0} near={near(0)} />
      <DateScene ref={(h) => void (handles.current[1] = h)} active={activeIndex === 1} near={near(1)} />
      <VenueScene ref={(h) => void (handles.current[2] = h)} active={activeIndex === 2} near={near(2)} />
      <BeOnTimeScene ref={(h) => void (handles.current[3] = h)} active={activeIndex === 3} near={near(3)} />
      <NoteScene ref={(h) => void (handles.current[4] = h)} active={activeIndex === 4} near={near(4)} />
      <LocationScene ref={(h) => void (handles.current[5] = h)} active={activeIndex === 5} near={near(5)} />
      <BigDayScene ref={(h) => void (handles.current[6] = h)} active={activeIndex === 6} near={near(6)} onCountdownDone={onCountdownDone} />
      <KeepsakeScene ref={(h) => void (handles.current[7] = h)} active={activeIndex === 7} near={near(7)} />

      {/* colour temperature */}
      <div ref={warm} className="pointer-events-none absolute inset-0" style={{ background: "#e9a84f", mixBlendMode: "multiply", opacity: 0, zIndex: 20 }} />
      <div ref={dusk} className="pointer-events-none absolute inset-0" style={{ background: "#3a3552", mixBlendMode: "multiply", opacity: 0, zIndex: 20 }} />

      {/* scroll hint after the doors, gone once the guest moves */}
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center gap-2"
        style={{ bottom: "calc(var(--safe-bottom) + 18px)", zIndex: 21, opacity: active && !scrolled ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}
      >
        <span className="hint">{content.ui.scroll}</span>
        <svg className="bob" width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
          <rect x="1" y="1" width="12" height="20" rx="6" fill="none" stroke="#6b7257" strokeWidth="1" />
          <circle cx="7" cy="7" r="1.6" fill="#6b7257" />
        </svg>
      </div>
    </div>
  );
}
