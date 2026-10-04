"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { PlateImage } from "@/components/ui/PlateImage";
import { ScriptText } from "@/components/ui/ScriptText";
import { Divider } from "@/components/ui/Divider";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, linesIn, scriptWrite } from "./scene";

/** A watercolour girl in a white dress and a boy in a suit, drawn as SVG. */
function Children({ girlRef, boyRef }: { girlRef: React.RefObject<SVGGElement | null>; boyRef: React.RefObject<SVGGElement | null> }) {
  return (
    <svg viewBox="0 0 240 200" className="h-auto w-[clamp(200px,62vw,300px)]" aria-hidden="true">
      <defs>
        <radialGradient id="wcDress" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e1d5" />
        </radialGradient>
        <linearGradient id="wcSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e6472" />
          <stop offset="1" stopColor="#3b3f4a" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="190" rx="100" ry="8" fill="#c9b79a" opacity="0.35" />
      {/* girl */}
      <g ref={girlRef} style={{ transformOrigin: "80px 190px" }}>
        <path d="M80 70 C60 90, 42 140, 38 186 L122 186 C118 140, 100 90, 80 70Z" fill="url(#wcDress)" stroke="#d9cdbb" strokeWidth="1" />
        <path d="M58 150 C70 160, 90 160, 102 150" fill="none" stroke="#e5d8c3" strokeWidth="1" />
        <path d="M66 70 C70 60, 90 60, 94 70 L92 90 L68 90Z" fill="#fff" />
        <circle cx="80" cy="50" r="15" fill="#f3d9c4" />
        <path d="M64 48 C66 32, 94 32, 96 48 C92 40, 68 40, 64 48Z" fill="#5a3d2b" />
        <path d="M64 48 c-4 12, -2 22, 4 26 M96 48 c4 12, 2 22, -4 26" fill="none" stroke="#5a3d2b" strokeWidth="5" strokeLinecap="round" />
        <circle cx="76" cy="52" r="1.3" fill="#3b2a20" />
        <circle cx="84" cy="52" r="1.3" fill="#3b2a20" />
        <path d="M77 58 q3 2 6 0" fill="none" stroke="#b86f6a" strokeWidth="1" />
        <circle cx="80" cy="36" r="4" fill="#f1dfe6" />
        <circle cx="86" cy="38" r="3" fill="#f6e9ef" />
      </g>
      {/* boy */}
      <g ref={boyRef} style={{ transformOrigin: "165px 190px" }}>
        <rect x="146" y="130" width="16" height="56" rx="4" fill="#3b3f4a" />
        <rect x="168" y="130" width="16" height="56" rx="4" fill="#3b3f4a" />
        <path d="M140 80 C140 70, 190 70, 190 80 L194 134 L136 134Z" fill="url(#wcSuit)" />
        <path d="M158 80 L165 120 L172 80 Z" fill="#fff" />
        <path d="M160 80 l5 4 l5 -4 l-2 8 l-3 -2 l-3 2z" fill="#8a1f2b" />
        <circle cx="165" cy="58" r="15" fill="#f3d9c4" />
        <path d="M150 54 C152 40, 178 40, 180 54 C176 48, 154 48, 150 54Z" fill="#3d2a1e" />
        <circle cx="161" cy="60" r="1.3" fill="#3b2a20" />
        <circle cx="169" cy="60" r="1.3" fill="#3b2a20" />
        <path d="M162 66 q3 2 6 0" fill="none" stroke="#b86f6a" strokeWidth="1" />
        <rect x="150" y="184" width="14" height="5" rx="2" fill="#2a2420" />
        <rect x="166" y="184" width="14" height="5" rx="2" fill="#2a2420" />
      </g>
    </svg>
  );
}

/** Scene 5: A Note from the Bride, with the little guests and the dress code. */
export const NoteScene = forwardRef<SceneHandle, SceneProps>(function NoteScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLParagraphElement>(null);
  const figures = useRef<HTMLDivElement>(null);
  const girl = useRef<SVGGElement>(null);
  const boy = useRef<SVGGElement>(null);
  const dress = useRef<HTMLDivElement>(null);
  const divider = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "8%");
      scriptWrite(tl, title.current, 0.14, 0.18);
      tl.fromTo(divider.current, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.3)
        .fromTo(note.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.32)
        .fromTo(figures.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.42)
        // a gentle sway of the dress and a tiny bow
        .fromTo(girl.current, { rotate: -3 }, { rotate: 3, duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.5)
        .fromTo(boy.current, { rotate: 0 }, { rotate: 7, duration: 0.07, ease: "power1.inOut", yoyo: true, repeat: 1 }, 0.52);
      linesIn(tl, dress.current!.children, 0.62, 0.12, 0.06);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "linear-gradient(180deg, #f3eadf 0%, #eadcc8 70%, #e2d0b8 100%)" }}>
      <div className="grain absolute inset-0" />
      <LeafShadows opacity={0.12} />
      <PlateImage src={plates.note} alt="" />
      <div className="absolute inset-0 flex flex-col items-center px-7 text-center" style={{ paddingTop: "calc(var(--safe-top) + 8svh)" }}>
        <h2 className="leading-none text-olive" style={{ fontSize: "clamp(2.2rem, 10vw, 3.3rem)" }}>
          <ScriptText ref={title}>{content.note.title}</ScriptText>
        </h2>
        <div ref={divider} className="mt-2">
          <Divider />
        </div>
        <p ref={note} className="font-serif mt-4 max-w-[360px] text-olive" style={{ fontSize: "clamp(1rem, 4.4vw, 1.2rem)", lineHeight: 1.5 }}>
          {content.note.body}
        </p>
        <div ref={figures} className="mt-4" data-depth="0.3">
          <Children girlRef={girl} boyRef={boy} />
        </div>
        <div ref={dress} className="mt-2">
          <p className="caps text-olive" style={{ fontSize: "clamp(0.8rem, 3.6vw, 0.98rem)", letterSpacing: "0.18em" }}>
            {content.note.dressCode.girls}
          </p>
          <p className="caps mt-2 text-olive" style={{ fontSize: "clamp(0.8rem, 3.6vw, 0.98rem)", letterSpacing: "0.18em" }}>
            {content.note.dressCode.boys}
          </p>
        </div>
      </div>
    </div>
  );
});
