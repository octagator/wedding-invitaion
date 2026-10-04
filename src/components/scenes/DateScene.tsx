"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { Caps } from "@/components/ui/Caps";
import { Scratch } from "@/components/ui/Scratch";
import { CalendarButtons } from "@/components/ui/CalendarButtons";
import { SCENE, type SceneHandle, type SceneProps, enterSoft } from "./scene";

const INK = "#4f4a30";

/** Scene 2: the arch of the date and venue picture, close up, with the date under gold foil. */
export const DateScene = forwardRef<SceneHandle, SceneProps>(function DateScene({ active }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "22%");
      tl.fromTo(zoom.current, { scale: 1.32 }, { scale: 1.3, duration: SCENE.bodyEnd, ease: "none" }, 0)
        .fromTo(card.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.2)
        // Zoom out into the venue scene, which continues the same picture.
        .to(zoom.current, { scale: 1, duration: SCENE.exit, ease: "power2.inOut" }, SCENE.bodyEnd)
        .to(r, { autoAlpha: 0, duration: SCENE.exit * 0.8, ease: "power1.in" }, SCENE.bodyEnd + SCENE.exit * 0.2);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#efdfc9" }}>
      <div ref={zoom} className="absolute inset-0" style={{ transformOrigin: "50% 18%" }}>
        <Plate src={plates.dateVenue} width={857} height={1600} eager>
          <div ref={card} className="absolute" style={{ left: "22%", top: "18%", width: "56%" }}>
            <Scratch active={active} onRevealed={() => setRevealed(true)} className="rounded-[1.5cqw]">
              <div className="flex flex-col items-center" style={{ paddingBlock: "1.6cqw 1.4cqw", gap: "0.9cqw" }}>
                <Caps as="p" style={{ fontSize: "2.7cqw", color: INK, letterSpacing: "0.3em" }}>
                  Saturday
                </Caps>
                <p className="font-serif font-medium" style={{ fontSize: "9cqw", lineHeight: 1, color: INK }}>
                  31
                </p>
                <Caps as="p" style={{ fontSize: "2.7cqw", color: INK, letterSpacing: "0.3em" }}>
                  October 2026
                </Caps>
                <Flourish color={INK} style={{ width: "22cqw", marginBlock: "0.4cqw" }} />
                <Caps as="p" style={{ fontSize: "2.9cqw", color: INK, letterSpacing: "0.26em" }}>
                  {content.date.time}
                </Caps>
                <Flourish color={INK} style={{ width: "22cqw", marginTop: "0.4cqw" }} />
              </div>
            </Scratch>
          </div>
          <PlateText top="46%" className="pointer-events-auto" style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s", pointerEvents: revealed ? "auto" : "none" }}>
            <CalendarButtons />
          </PlateText>
        </Plate>
      </div>
    </div>
  );
});
