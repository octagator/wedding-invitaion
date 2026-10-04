"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { ScriptText } from "@/components/ui/ScriptText";
import { Caps } from "@/components/ui/Caps";
import { SCENE, type SceneHandle, type SceneProps, capsIn, exitSoft, scriptWrite } from "./scene";

const INK = "#4f4a30";

/** Scene 3: the whole picture at sunset; the venue writes itself above the hotel entrance. */
export const VenueScene = forwardRef<SceneHandle, SceneProps>(function VenueScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const warm = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const city = useRef<HTMLSpanElement>(null);
  const hall = useRef<HTMLSpanElement>(null);
  const setting = useRef<HTMLSpanElement>(null);
  const flourish = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: SCENE.enter, ease: "power1.inOut" }, 0)
        .fromTo(warm.current, { opacity: 0.35 }, { opacity: 0, duration: 0.5, ease: "none" }, 0.1);
      scriptWrite(tl, name.current, 0.2, 0.22);
      capsIn(tl, city.current, 0.36);
      capsIn(tl, hall.current, 0.42);
      capsIn(tl, setting.current, 0.48);
      tl.fromTo(flourish.current, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.08 }, 0.54);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#efdfc9" }}>
      <Plate src={plates.dateVenue} width={857} height={1600}>
        <PlateText top="44.4%">
          <h2 style={{ fontSize: "7cqw", lineHeight: 1.1, color: INK }}>
            <ScriptText ref={name}>{content.venue.name}</ScriptText>
          </h2>
        </PlateText>
        <PlateText top="51.8%">
          <Caps ref={city} as="p" style={{ fontSize: "2.7cqw", color: INK, letterSpacing: "0.3em" }}>
            {content.venue.city}
          </Caps>
        </PlateText>
        <PlateText top="54.6%">
          <Caps ref={hall} as="p" className="italic" style={{ fontSize: "3cqw", color: INK, letterSpacing: "0.22em" }}>
            {content.venue.hall}
          </Caps>
        </PlateText>
        <PlateText top="57.9%">
          <Caps ref={setting} as="p" style={{ fontSize: "1.9cqw", color: INK, letterSpacing: "0.36em" }}>
            {content.venue.setting}
          </Caps>
        </PlateText>
        <Flourish ref={flourish} color={INK} className="absolute" style={{ top: "60.4%", left: "43%", width: "14%" }} />
      </Plate>
      {/* the sky warms as the scene settles */}
      <div ref={warm} className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255, 236, 210, 0.9) 0%, rgba(255, 236, 210, 0.2) 60%, transparent 100%)" }} />
    </div>
  );
});
