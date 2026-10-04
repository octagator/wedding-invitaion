"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Plate, PlateText } from "@/components/ui/Plate";
import { Flourish } from "@/components/ui/Flourish";
import { ScriptText } from "@/components/ui/ScriptText";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, scriptWrite } from "./scene";

const INK = "#4f4a30";
/** The real map can be switched off for hosts that block third-party frames. */
const EMBED = process.env.NEXT_PUBLIC_EMBED_MAP !== "0";

/** Scene 6: the map card as designed, with a real map inside, the pin dropping, and the button. */
export const LocationScene = forwardRef<SceneHandle, SceneProps>(function LocationScene({ near }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const flourish = useRef<SVGSVGElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLAnchorElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "8%");
      scriptWrite(tl, title.current, 0.12, 0.14);
      tl.fromTo(flourish.current, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.08 }, 0.24)
        .fromTo(card.current, { opacity: 0, x: "30%", rotate: 1.5 }, { opacity: 1, x: 0, rotate: 0, duration: 0.18, ease: "power3.out" }, 0.22)
        .fromTo(pin.current, { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1, ease: "bounce.out" }, 0.36)
        .fromTo(shadow.current, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.08 }, 0.4)
        .fromTo(label.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.1 }, 0.42)
        .fromTo(button.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.44);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "#eee0cb" }}>
      <Plate src={plates.location} width={814} height={1463}>
        <PlateText top="4.2%">
          <h2 style={{ fontSize: "8.4cqw", lineHeight: 1.1, color: INK }}>
            <ScriptText ref={title}>{content.location.title}</ScriptText>
          </h2>
        </PlateText>
        <Flourish ref={flourish} color={INK} className="absolute" style={{ top: "15.6%", left: "34%", width: "32%" }} />
        {/* the card: the illustrated map underneath, the real map on top once it loads */}
        <div ref={card} className="absolute overflow-hidden" style={{ left: "6%", top: "21.5%", width: "88%", height: "44%", borderRadius: "4cqw", boxShadow: "0 1.6cqw 4cqw rgba(90, 60, 20, 0.22)" }}>
          {near && EMBED && (
            <iframe
              title={content.location.label}
              src={content.location.embedUrl}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "sepia(0.4) saturate(0.78) hue-rotate(-6deg) brightness(1.03) contrast(0.95)", opacity: mapLoaded ? 1 : 0, transition: "opacity 1s ease" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setMapLoaded(true)}
            />
          )}
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 0.5cqw rgba(246, 238, 226, 0.9), inset 0 0 6cqw rgba(120, 90, 40, 0.14)", borderRadius: "4cqw" }} />
          <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ width: "7cqw" }}>
            <div ref={shadow} className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full" style={{ width: "4cqw", height: "1.4cqw", background: "rgba(60, 40, 10, 0.35)", filter: "blur(2px)" }} />
            <div ref={pin} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" style={{ width: "7cqw" }}>
              <svg viewBox="0 0 36 48" className="h-auto w-full" aria-hidden="true">
                <path d="M18 46 C18 46, 3 27, 3 16 A15 15 0 0 1 33 16 C33 27, 18 46, 18 46Z" fill="#d6413b" stroke="#9d2a26" strokeWidth="1" />
                <circle cx="18" cy="16" r="6" fill="#5a1d1a" />
              </svg>
            </div>
          </div>
        </div>
        <PlateText top="66.4%" innerRef={label}>
          <p className="caps" style={{ fontSize: "2.1cqw", letterSpacing: "0.22em", color: INK }}>
            {content.location.label}
          </p>
        </PlateText>
        <a
          ref={button}
          className="btn-olive absolute"
          href={content.location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ left: "12.4%", top: "70%", width: "75.2%", height: "9.4%", fontSize: "3.6cqw" }}
        >
          <svg viewBox="0 0 24 24" style={{ width: "3.4cqw", height: "3.4cqw" }} fill="currentColor" aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span aria-hidden="true" style={{ width: 1, height: "4.2cqw", background: "rgba(251, 244, 230, 0.5)" }} />
          {content.location.button}
        </a>
      </Plate>
    </div>
  );
});
