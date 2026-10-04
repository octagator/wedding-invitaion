"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { ScriptText } from "@/components/ui/ScriptText";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, linesIn, scriptWrite } from "./scene";

const INK = "#4f4a30";

/** "A Note from / the Bride" on two lines, as in the design. */
function TitleLine({ text }: { text: string }) {
  const i = text.lastIndexOf(" the ");
  if (i < 0) return <>{text}</>;
  return (
    <>
      <span className="block">{text.slice(0, i)}</span>
      <span className="block">{text.slice(i + 1)}</span>
    </>
  );
}

/** "Girls: White wedding dresses" set on two lines, as in the design, without changing the words. */
function DressLine({ text }: { text: string }) {
  const i = text.indexOf(": ");
  if (i < 0) return <>{text}</>;
  return (
    <>
      <span className="block">{text.slice(0, i + 1)}</span>
      <span className="block">{text.slice(i + 2)}</span>
    </>
  );
}

/** Scene 5: A Note from the Bride; the little guests make a small entrance. */
export const NoteScene = forwardRef<SceneHandle, SceneProps>(function NoteScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const heart = useRef<SVGSVGElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const kids = useRef<HTMLDivElement>(null);
  const dress = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "8%");
      scriptWrite(tl, title.current, 0.14, 0.18);
      tl.fromTo(heart.current, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.08 }, 0.3)
        .fromTo(note.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.32)
        .fromTo(kids.current, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" }, 0.42)
        // a gentle sway, like a small curtsy and bow
        .fromTo(kids.current, { rotate: -1.2 }, { rotate: 1.2, duration: 0.07, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.52);
      linesIn(tl, dress.current!.children, 0.62, 0.12, 0.06);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#efe2cf" }}>
      <Plate src={plates.note} width={798} height={1449}>
        <PlateText top="16.4%" left="15%" width="70%">
          <h2 style={{ fontSize: "7.3cqw", lineHeight: 1.05, color: INK }}>
            <ScriptText ref={title} className="!block">
              <TitleLine text={content.note.title} />
            </ScriptText>
          </h2>
        </PlateText>
        <Flourish ref={heart} kind="heart" color={INK} className="absolute" style={{ top: "34.6%", left: "32%", width: "36%" }} />
        <PlateText top="39.4%" left="12%" width="76%" innerRef={note}>
          <p className="font-serif" style={{ fontSize: "3.5cqw", lineHeight: 1.42, color: INK }}>
            {content.note.body}
          </p>
        </PlateText>
        <div ref={kids} className="absolute" style={{ left: "13%", top: "55%", width: "49%", transformOrigin: "50% 100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plates.kids} alt="A little girl in a white dress and a little boy in a suit" className="h-auto w-full" draggable={false} />
        </div>
        <div ref={dress} className="absolute inset-0 pointer-events-none">
          <PlateText top="77.6%">
            <p className="font-serif" style={{ fontSize: "3.3cqw", lineHeight: 1.3, color: INK }}>
              <DressLine text={content.note.dressCode.girls} />
            </p>
          </PlateText>
          <Flourish color={INK} className="absolute" style={{ top: "85%", left: "35%", width: "30%" }} />
          <PlateText top="87.4%">
            <p className="font-serif" style={{ fontSize: "3.3cqw", lineHeight: 1.3, color: INK }}>
              <DressLine text={content.note.dressCode.boys} />
            </p>
          </PlateText>
        </div>
      </Plate>
    </div>
  );
});
