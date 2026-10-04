"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Chandelier } from "@/components/scenery/Chandelier";
import { Candles } from "@/components/scenery/Candles";
import { PlateImage } from "@/components/ui/PlateImage";
import { ScriptText } from "@/components/ui/ScriptText";
import { Caps } from "@/components/ui/Caps";
import { Countdown } from "@/components/ui/Countdown";
import { type SceneHandle, type SceneProps, capsIn, exitSoft, scriptWrite } from "./scene";

/** Scene 7: dusk, chandeliers and candles alive, a live countdown and the closing line. */
export const BigDayScene = forwardRef<SceneHandle, SceneProps & { onCountdownDone?: () => void }>(function BigDayScene({ onCountdownDone }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const closing = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const boxes = useRef<HTMLDivElement>(null);
  const chandeliers = useRef<HTMLDivElement>(null);
  const done = useCallback(() => onCountdownDone?.(), [onCountdownDone]);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      // Light fades towards dusk: a long, slow cross-fade.
      tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" }, 0)
        .fromTo(chandeliers.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.08);
      scriptWrite(tl, closing.current, 0.2, 0.26);
      capsIn(tl, title.current, 0.4, 0.1);
      tl.fromTo(boxes.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.46);
      exitSoft(tl, r, "-4%");
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "linear-gradient(180deg, #2b2b40 0%, #4a3b48 40%, #7a5a4a 75%, #3a2a24 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(70% 40% at 50% 60%, rgba(255, 190, 110, 0.35), transparent 70%)" }} />
      <div ref={chandeliers} className="absolute inset-x-0 top-0 flex justify-between px-[4%]" data-depth="0.3">
        <Chandelier size={0} className="h-auto w-[34%]" />
        <Chandelier size={0} className="h-auto w-[26%]" style={{ marginTop: "6%" }} />
        <Chandelier size={0} className="h-auto w-[34%]" />
      </div>
      <Candles count={9} bottom="5%" scale={1.05} />
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: "linear-gradient(180deg, transparent, rgba(20, 12, 10, 0.5))" }} />
      <PlateImage src={plates.countdown} alt="" />
      <div className="absolute inset-0 flex flex-col items-center px-6 text-center" style={{ paddingTop: "calc(var(--safe-top) + 30svh)" }}>
        <p className="leading-tight" style={{ fontSize: "clamp(1.7rem, 8vw, 2.5rem)", color: "#fbeed2", textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}>
          <ScriptText ref={closing}>{content.closing}</ScriptText>
        </p>
        <Caps ref={title} as="h2" className="mt-8" style={{ fontSize: "clamp(0.95rem, 4.4vw, 1.2rem)", color: "#e9cf93" }}>
          {content.countdown.title}
        </Caps>
        <div ref={boxes} className="mt-5">
          <Countdown onDone={done} />
        </div>
      </div>
    </div>
  );
});
