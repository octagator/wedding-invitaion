"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { PocketWatch } from "@/components/ui/PocketWatch";
import { prefersReducedMotion } from "@/lib/device";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, linesIn } from "./scene";

const INK = "#4f4a30";

/** "Please be on time / at 03:00 PM" on two lines, as in the design. */
function TimeLine({ text }: { text: string }) {
  const i = text.indexOf(" at ");
  if (i < 0) return <>{text}</>;
  return (
    <>
      <span className="block">{text.slice(0, i)}</span>
      <span className="block">{text.slice(i + 1)}</span>
    </>
  );
}

/** Scene 4: the pocket watch sweeps to 3:00, then the Katb El-Kitab message arrives. */
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
    gsap.fromTo(hour, { rotate: -300, ...pivot }, { rotate: 90, duration: 3.2, ease: "power3.out", ...pivot });
    gsap.fromTo(minute, { rotate: -720, ...pivot }, { rotate: 0, duration: 3.2, ease: "power3.out", ...pivot });
    gsap.fromTo(second, { rotate: -1080, ...pivot }, { rotate: 0, duration: 3.4, ease: "power3.out", ...pivot });
    gsap.to(second, { rotate: 6, duration: 0.5, delay: 3.6, ease: "steps(1)", repeat: 3, yoyo: true, ...pivot });
  };

  useImperativeHandle(ref, () => ({
    onActive: sweep,
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "10%");
      tl.fromTo(watchWrap.current, { opacity: 0, y: -24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" }, 0.14);
      linesIn(tl, lines.current!.children, 0.34, 0.14, 0.08);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#efe3d1" }}>
      <Plate src={plates.beOnTime} width={807} height={1466}>
        <div ref={watchWrap} className="absolute" style={{ left: "42.5%", top: "28.6%", width: "15.5%" }}>
          <PocketWatch ref={watch} className="h-auto w-full" />
        </div>
        <div ref={lines} className="absolute inset-0 pointer-events-none">
          <PlateText top="43.8%" left="17%" width="66%">
            <p className="caps" style={{ fontSize: "4.2cqw", lineHeight: 1.22, letterSpacing: "0.1em", color: INK }}>
              <TimeLine text={content.beOnTime.line1} />
            </p>
          </PlateText>
          <Flourish color={INK} className="absolute" style={{ top: "53.2%", left: "35%", width: "30%" }} />
          <PlateText top="56%" left="15%" width="70%">
            <p className="font-serif" style={{ fontSize: "3.7cqw", lineHeight: 1.45, color: INK }}>
              {content.beOnTime.line2}
            </p>
          </PlateText>
          <Flourish color={INK} className="absolute" style={{ top: "75%", left: "35%", width: "30%" }} />
        </div>
      </Plate>
    </div>
  );
});
