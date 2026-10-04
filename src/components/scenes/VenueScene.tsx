"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Hotel } from "@/components/scenery/Hotel";
import { PlateImage } from "@/components/ui/PlateImage";
import { ScriptText } from "@/components/ui/ScriptText";
import { Caps } from "@/components/ui/Caps";
import { SCENE, type SceneHandle, type SceneProps, capsIn, exitSoft, scriptWrite } from "./scene";

/** Scene 3: sunset; the venue writes itself while the hotel entrance rises. */
export const VenueScene = forwardRef<SceneHandle, SceneProps>(function VenueScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const hotel = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const city = useRef<HTMLSpanElement>(null);
  const hall = useRef<HTMLSpanElement>(null);
  const setting = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      // Continue the upward pan begun by the date scene.
      tl.fromTo(r, { autoAlpha: 0, y: "26%" }, { autoAlpha: 1, y: 0, duration: SCENE.enter, ease: "power2.out" }, 0)
        .fromTo(hotel.current, { y: "40%", opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.08)
        .fromTo(sky.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0.1);
      scriptWrite(tl, name.current, 0.2, 0.22);
      capsIn(tl, city.current, 0.34);
      capsIn(tl, hall.current, 0.4);
      capsIn(tl, setting.current, 0.46);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "linear-gradient(180deg, #e9c9a6 0%, #f3d4b2 45%, #e3c39d 100%)" }}>
      {/* the sky warms */}
      <div ref={sky} className="absolute inset-0" style={{ background: "linear-gradient(180deg, #e4a56d 0%, #f4c89a 40%, #f8e0c4 70%, #e5c8a6 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 30% at 50% 48%, rgba(255, 224, 170, 0.8), transparent 70%)" }} />
      <div ref={hotel} className="absolute inset-x-0 bottom-0 h-[62%]" data-depth="0.35">
        <Hotel />
      </div>
      <PlateImage src={plates.dateVenue} alt="" style={{ objectPosition: "50% 100%" }} />
      <div className="absolute inset-x-0 flex flex-col items-center px-6 text-center" style={{ top: "calc(var(--safe-top) + 10svh)" }}>
        <h2 className="leading-none text-olive" style={{ fontSize: "clamp(2.6rem, 12vw, 4rem)" }}>
          <ScriptText ref={name}>{content.venue.name}</ScriptText>
        </h2>
        <Caps ref={city} as="p" className="mt-4 text-olive" style={{ fontSize: "clamp(0.9rem, 4.2vw, 1.15rem)" }}>
          {content.venue.city}
        </Caps>
        <Caps ref={hall} as="p" className="mt-2 text-olive" style={{ fontSize: "clamp(0.9rem, 4.2vw, 1.15rem)" }}>
          {content.venue.hall}
        </Caps>
        <Caps ref={setting} as="p" className="mt-2 text-olive-soft" style={{ fontSize: "clamp(0.8rem, 3.6vw, 1rem)" }}>
          {content.venue.setting}
        </Caps>
      </div>
    </div>
  );
});
