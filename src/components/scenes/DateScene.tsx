"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Arch } from "@/components/scenery/Arch";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { PlateImage } from "@/components/ui/PlateImage";
import { Scratch } from "@/components/ui/Scratch";
import { Divider } from "@/components/ui/Divider";
import { Crest } from "@/components/ui/Crest";
import { CalendarButtons } from "@/components/ui/CalendarButtons";
import { SCENE, type SceneHandle, type SceneProps, enterSoft } from "./scene";

/** Scene 2: the date under brushed gold foil, scratched away by the guest. */
export const DateScene = forwardRef<SceneHandle, SceneProps>(function DateScene({ active }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const crest = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "24%");
      tl.fromTo(crest.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.2)
        .fromTo(card.current, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" }, 0.26);
      // The venue scene is the lower half of the same picture: pan upward into it.
      tl.to(r, { y: "-26%", autoAlpha: 0, duration: SCENE.exit, ease: "power1.in" }, SCENE.bodyEnd);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden" }}>
      <Arch
        tone="#e8d6bf"
        behind={<div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #f3c58f 0%, #f6dcc0 55%, #eadcc8 100%)" }} />}
      >
        <LeafShadows opacity={0.16} />
      </Arch>
      <PlateImage src={plates.dateVenue} alt="" style={{ objectPosition: "50% 0%" }} />

      <div className="absolute inset-0 flex flex-col items-center px-6 text-center" style={{ paddingTop: "calc(var(--safe-top) + 12svh)" }}>
        <div ref={crest}>
          <Crest size={86} />
        </div>
        <div ref={card} className="mt-8 w-full" style={{ maxWidth: 360 }}>
          <Scratch active={active} onRevealed={() => setRevealed(true)} className="rounded-[10px]">
            <div className="flex flex-col items-center rounded-[10px] px-4 py-5" style={{ background: "rgba(252, 246, 238, 0.7)", border: "1px solid rgba(200, 168, 106, 0.5)" }}>
              <p className="caps text-olive" style={{ fontSize: "clamp(0.9rem, 4vw, 1.1rem)" }}>
                {content.date.display}
              </p>
              <Divider width={120} className="my-3" />
              <p className="caps text-olive" style={{ fontSize: "clamp(0.9rem, 4vw, 1.1rem)" }}>
                {content.date.time}
              </p>
            </div>
          </Scratch>
        </div>
        <div className="mt-6" style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s", pointerEvents: revealed ? "auto" : "none" }}>
          <CalendarButtons />
        </div>
      </div>
    </div>
  );
});
