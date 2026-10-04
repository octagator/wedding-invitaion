"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Arch } from "@/components/scenery/Arch";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { PlateImage } from "@/components/ui/PlateImage";
import { PocketWatch } from "@/components/ui/PocketWatch";
import { prefersReducedMotion } from "@/lib/device";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, linesIn } from "./scene";

/** Scene 4: the pocket watch sweeps to 3:00, then the Katb El-Kitab message. */
export const BeOnTimeScene = forwardRef<SceneHandle, SceneProps>(function BeOnTimeScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const watchWrap = useRef<HTMLDivElement>(null);
  const watch = useRef<SVGSVGElement>(null);
  const lines = useRef<HTMLDivElement>(null);
  const swept = useRef(false);

  const sweep = () => {
    if (swept.current || !watch.current) return;
    swept.current = true;
    const hour = watch.current.querySelector('[data-hand="hour"]');
    const minute = watch.current.querySelector('[data-hand="minute"]');
    const second = watch.current.querySelector('[data-hand="second"]');
    const pivot = { svgOrigin: "100 136" };
    if (prefersReducedMotion()) {
      gsap.set(hour, { rotate: 90, ...pivot });
      gsap.set(minute, { rotate: 0, ...pivot });
      gsap.set(second, { rotate: 0, ...pivot });
      return;
    }
    // Hands sweep round and settle exactly on 3:00.
    gsap.fromTo(hour, { rotate: -300, ...pivot }, { rotate: 90, duration: 3.2, ease: "power3.out", ...pivot });
    gsap.fromTo(minute, { rotate: -720, ...pivot }, { rotate: 0, duration: 3.2, ease: "power3.out", ...pivot });
    gsap.fromTo(second, { rotate: -1080, ...pivot }, { rotate: 0, duration: 3.4, ease: "power3.out", ...pivot });
    // A faint tick after settling.
    gsap.to(second, { rotate: 6, duration: 0.5, delay: 3.6, ease: "steps(1)", repeat: 3, yoyo: true, ...pivot });
  };

  useImperativeHandle(ref, () => ({
    onActive: sweep,
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "10%");
      tl.fromTo(watchWrap.current, { opacity: 0, y: -30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }, 0.14);
      linesIn(tl, lines.current!.children, 0.36, 0.14, 0.08);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden" }}>
      <Arch
        tone="#e7d5bf"
        behind={<div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #e3cdb0 0%, #f0dfc9 60%, #e3cdb0 100%)" }} />}
      >
        <LeafShadows opacity={0.15} />
      </Arch>
      <PlateImage src={plates.beOnTime} alt="" />
      <div className="absolute inset-0 flex flex-col items-center px-7 text-center" style={{ paddingTop: "calc(var(--safe-top) + 9svh)" }}>
        <div ref={watchWrap} data-depth="0.25">
          <PocketWatch ref={watch} size={0} className="h-auto w-[clamp(140px,40vw,190px)]" />
        </div>
        <div ref={lines} className="mt-7 max-w-[360px]">
          <p className="caps text-olive" style={{ fontSize: "clamp(0.86rem, 3.9vw, 1.05rem)", letterSpacing: "0.2em" }}>
            {content.beOnTime.line1}
          </p>
          <p className="font-serif mt-5 text-olive" style={{ fontSize: "clamp(1.05rem, 4.6vw, 1.3rem)", lineHeight: 1.55 }}>
            {content.beOnTime.line2}
          </p>
        </div>
      </div>
    </div>
  );
});
