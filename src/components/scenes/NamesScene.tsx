"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { ScriptText } from "@/components/ui/ScriptText";
import { Caps } from "@/components/ui/Caps";
import { type SceneHandle, type SceneProps, capsIn, exitSoft, scriptWrite } from "./scene";

const INK = "#4f4a30";

/** "We invite you / to celebrate our wedding" on two lines, as in the design. */
function InviteLine({ text }: { text: string }) {
  const i = text.indexOf(" to ");
  if (i < 0) return <>{text}</>;
  return (
    <>
      <span className="block">{text.slice(0, i)}</span>
      <span className="block">{text.slice(i + 1)}</span>
    </>
  );
}

/** Scene 1: daylight under the sheer curtains; the names are written on, the photo fades up. */
export const NamesScene = forwardRef<SceneHandle, SceneProps>(function NamesScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const curtainL = useRef<HTMLDivElement>(null);
  const curtainR = useRef<HTMLDivElement>(null);
  const invite = useRef<HTMLDivElement>(null);
  const dateBlock = useRef<HTMLDivElement>(null);
  const names = useRef<HTMLSpanElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const arabic = useRef<HTMLDivElement>(null);
  const flourishes = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      gsap.set(r, { autoAlpha: 1 });
      tl.fromTo(curtainL.current, { x: "0%" }, { x: "-85%", duration: 0.2, ease: "power2.inOut" }, 0.02)
        .fromTo(curtainR.current, { x: "0%" }, { x: "85%", duration: 0.2, ease: "power2.inOut" }, 0.02)
        .fromTo(invite.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.1)
        .fromTo(flourishes.current!.children, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.08, stagger: 0.05 }, 0.14)
        .fromTo(dateBlock.current!.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.08, stagger: 0.02 }, 0.16);
      scriptWrite(tl, names.current, 0.24, 0.2);
      tl.fromTo(photo.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, 0.42)
        .fromTo(arabic.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.1 }, 0.6);
      exitSoft(tl, r, "-18%");
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#e9dcc7" }}>
      <Plate src={plates.names} width={1024} height={1536} eager>
        <div ref={flourishes} className="absolute inset-0 pointer-events-none">
          {["24.9%", "37.8%", "45.2%", "67.5%", "74.1%"].map((top) => (
            <Flourish key={top} color={INK} className="absolute" style={{ top, left: "42%", width: "16%" }} />
          ))}
        </div>
        <PlateText top="20.3%" left="30%" width="40%" innerRef={invite}>
          <p className="font-serif" style={{ fontSize: "2.4cqw", lineHeight: 1.3, color: INK }}>
            <InviteLine text={content.invitation.namesScene} />
          </p>
        </PlateText>
        <PlateText top="27.2%" innerRef={dateBlock}>
          <Caps as="p" style={{ fontSize: "1.9cqw", color: INK, letterSpacing: "0.3em" }}>
            Saturday
          </Caps>
          <p className="font-serif font-medium" style={{ fontSize: "6cqw", lineHeight: 1, marginTop: "0.4cqw", color: INK }}>
            31
          </p>
          <Caps as="p" style={{ fontSize: "1.9cqw", color: INK, letterSpacing: "0.3em", marginTop: "0.5cqw" }}>
            October 2026
          </Caps>
          <Caps as="p" style={{ fontSize: "1.75cqw", color: INK, letterSpacing: "0.3em", marginTop: "0.6cqw" }}>
            {content.date.time}
          </Caps>
        </PlateText>
        <PlateText top="39%">
          <h1 style={{ fontSize: "5.4cqw", lineHeight: 1.1, color: INK }}>
            <ScriptText ref={names}>{content.couple.names}</ScriptText>
          </h1>
        </PlateText>
        <div
          ref={photo}
          className="absolute overflow-hidden rounded-full"
          style={{ left: "35.75%", top: "47.2%", width: "28.5%", aspectRatio: "1 / 1", boxShadow: "inset 0 0 0 0.3cqw rgba(201, 173, 120, 0.9)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plates.childrenPhoto} alt="Two children hugging" className="h-full w-full object-cover" draggable={false} />
        </div>
        <PlateText top="69.6%" innerRef={arabic}>
          <p className="font-arabic" lang="ar" dir="rtl" style={{ fontSize: "3.1cqw", lineHeight: 1.3, color: INK }}>
            {content.invitation.arabic}
          </p>
        </PlateText>
      </Plate>
      {/* sheer curtains that part */}
      <div ref={curtainL} className="pointer-events-none absolute inset-y-0 left-0 w-[56%]" style={{ background: "linear-gradient(90deg, rgba(255, 252, 247, 0.9) 0%, rgba(255, 252, 247, 0.72) 70%, rgba(255, 252, 247, 0.15) 100%)", backdropFilter: "blur(1.5px)" }} />
      <div ref={curtainR} className="pointer-events-none absolute inset-y-0 right-0 w-[56%]" style={{ background: "linear-gradient(270deg, rgba(255, 252, 247, 0.9) 0%, rgba(255, 252, 247, 0.72) 70%, rgba(255, 252, 247, 0.15) 100%)", backdropFilter: "blur(1.5px)" }} />
    </div>
  );
});
