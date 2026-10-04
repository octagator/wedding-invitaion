"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Arch } from "@/components/scenery/Arch";
import { Palms } from "@/components/scenery/Palms";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { PlateImage } from "@/components/ui/PlateImage";
import { ScriptText } from "@/components/ui/ScriptText";
import { ChildrenPhoto } from "@/components/ui/ChildrenPhoto";
import { Divider } from "@/components/ui/Divider";
import { SCENE, type SceneHandle, type SceneProps, exitSoft, scriptWrite } from "./scene";

/** Scene 1: daylight, sheer curtains, the names written on, the children's photo. */
export const NamesScene = forwardRef<SceneHandle, SceneProps>(function NamesScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const curtainL = useRef<HTMLDivElement>(null);
  const curtainR = useRef<HTMLDivElement>(null);
  const invite = useRef<HTMLParagraphElement>(null);
  const names = useRef<HTMLSpanElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const arabic = useRef<HTMLParagraphElement>(null);
  const divider = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      gsap.set(r, { autoAlpha: 1 });
      // The curtains part.
      tl.fromTo(curtainL.current, { x: "0%" }, { x: "-80%", duration: 0.22, ease: "power2.inOut" }, 0.02)
        .fromTo(curtainR.current, { x: "0%" }, { x: "80%", duration: 0.22, ease: "power2.inOut" }, 0.02)
        .fromTo(invite.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.12);
      scriptWrite(tl, names.current, 0.2, 0.24);
      tl.fromTo(divider.current, { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: 0.1 }, 0.4)
        .fromTo(photo.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, 0.44)
        .fromTo(arabic.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12 }, 0.62);
      exitSoft(tl, r, "-22%");
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden" }}>
      <Arch
        tone="#eadbc6"
        behind={
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #d6e4ea 0%, #e9eef0 50%, #f1e9dd 100%)" }}>
            <Palms opacity={0.85} />
            <div className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: "linear-gradient(180deg, transparent, rgba(214, 196, 168, 0.6))" }} />
          </div>
        }
      >
        <LeafShadows opacity={0.14} />
      </Arch>
      <PlateImage src={plates.names} alt="" />
      {/* sheer curtains */}
      <div ref={curtainL} className="pointer-events-none absolute inset-y-0 left-0 w-[55%]" data-depth="0.5" style={{ background: "linear-gradient(90deg, rgba(255, 252, 247, 0.92) 0%, rgba(255, 252, 247, 0.75) 70%, rgba(255, 252, 247, 0.2) 100%)", backdropFilter: "blur(2px)" }} />
      <div ref={curtainR} className="pointer-events-none absolute inset-y-0 right-0 w-[55%]" data-depth="0.5" style={{ background: "linear-gradient(270deg, rgba(255, 252, 247, 0.92) 0%, rgba(255, 252, 247, 0.75) 70%, rgba(255, 252, 247, 0.2) 100%)", backdropFilter: "blur(2px)" }} />

      <div className="absolute inset-0 flex flex-col items-center px-6 text-center" style={{ paddingTop: "calc(var(--safe-top) + 10svh)" }}>
        <p ref={invite} className="font-serif italic text-olive" style={{ fontSize: "clamp(1rem, 4.4vw, 1.25rem)" }}>
          {content.invitation.namesScene}
        </p>
        <h1 className="mt-2 leading-none text-olive" style={{ fontSize: "clamp(2.9rem, 13vw, 4.4rem)" }}>
          <ScriptText ref={names}>{content.couple.names}</ScriptText>
        </h1>
        <div ref={divider} className="mt-3">
          <Divider />
        </div>
        <ChildrenPhoto ref={photo} size="min(46%, 230px)" className="mt-6" />
        <p ref={arabic} className="font-arabic mt-6 text-olive" lang="ar" dir="rtl" style={{ fontSize: "clamp(1.5rem, 6.5vw, 2.1rem)" }}>
          {content.invitation.arabic}
        </p>
      </div>
    </div>
  );
});
