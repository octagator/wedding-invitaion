"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { ScriptText } from "@/components/ui/ScriptText";
import { Countdown } from "@/components/ui/Countdown";
import { type SceneHandle, type SceneProps, exitSoft, scriptWrite } from "./scene";

const INK = "#5a553a";

/** A soft pulse of candle and chandelier light. */
function Glow({ left, top, size, delay = 0 }: { left: string; top: string; size: string; delay?: number }) {
  return (
    <div
      className="glow pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ left, top, width: size, aspectRatio: "1 / 1", background: "radial-gradient(circle, rgba(255, 214, 150, 0.45) 0%, rgba(255, 190, 110, 0.18) 40%, transparent 70%)", animationDelay: `${delay}s`, mixBlendMode: "screen" }}
    />
  );
}

/** Scene 7: dusk, chandeliers and candles alive, the closing line across the sky and the countdown. */
export const BigDayScene = forwardRef<SceneHandle, SceneProps & { onCountdownDone?: () => void }>(function BigDayScene({ onCountdownDone }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const closing = useRef<HTMLSpanElement>(null);
  const heart = useRef<SVGSVGElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const boxes = useRef<HTMLDivElement>(null);
  const done = useCallback(() => onCountdownDone?.(), [onCountdownDone]);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" }, 0);
      scriptWrite(tl, closing.current, 0.18, 0.26);
      tl.fromTo(heart.current, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.08 }, 0.42);
      scriptWrite(tl, title.current, 0.4, 0.14);
      tl.fromTo(boxes.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.5);
      exitSoft(tl, r, "-4%");
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#4a3b48" }}>
      <Plate src={plates.countdown} width={900} height={1600}>
        <Glow left="17%" top="46%" size="30%" />
        <Glow left="83%" top="46%" size="30%" delay={1.3} />
        <Glow left="10%" top="84%" size="26%" delay={0.6} />
        <Glow left="90%" top="84%" size="26%" delay={1.9} />
        <PlateText top="7.2%" left="16%" width="68%">
          <p style={{ fontSize: "5.4cqw", lineHeight: 1.18, color: "#fff7ea", textShadow: "0 0.3cqw 2cqw rgba(60, 30, 40, 0.35)" }}>
            <ScriptText ref={closing}>{content.closing}</ScriptText>
          </p>
        </PlateText>
        <Flourish ref={heart} kind="heart" color="#fff7ea" className="absolute" style={{ top: "23%", left: "31%", width: "38%" }} />
        <PlateText top="44.4%">
          <h2 style={{ fontSize: "5.6cqw", lineHeight: 1.1, color: INK }}>
            <ScriptText ref={title}>{content.countdown.title}</ScriptText>
          </h2>
        </PlateText>
        <PlateText top="51.3%" innerRef={boxes}>
          <Countdown onDone={done} />
        </PlateText>
      </Plate>
    </div>
  );
});
