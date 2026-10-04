"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { PlateImage } from "@/components/ui/PlateImage";
import { ScriptText } from "@/components/ui/ScriptText";
import { Divider } from "@/components/ui/Divider";
import { type SceneHandle, type SceneProps, enterSoft, exitSoft, scriptWrite } from "./scene";

/** Scene 6: the map card slides in, the pin drops, the button opens Google Maps. */
export const LocationScene = forwardRef<SceneHandle, SceneProps>(function LocationScene({ near }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const button = useRef<HTMLAnchorElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      enterSoft(tl, r, "8%");
      scriptWrite(tl, title.current, 0.14, 0.14);
      tl.fromTo(card.current, { opacity: 0, x: "40%", rotate: 2 }, { opacity: 1, x: 0, rotate: 0, duration: 0.18, ease: "power3.out" }, 0.22)
        .fromTo(pin.current, { y: -140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1, ease: "bounce.out" }, 0.4)
        .fromTo(shadow.current, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.08 }, 0.44)
        .fromTo(label.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.1 }, 0.5)
        .fromTo(button.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.56);
      exitSoft(tl, r);
      return tl;
    },
  }));

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "linear-gradient(180deg, #efe3d3 0%, #e7d6c0 60%, #ddc7ab 100%)" }}>
      <div className="grain absolute inset-0" />
      <LeafShadows opacity={0.14} />
      <PlateImage src={plates.location} alt="" />
      <div className="absolute inset-0 flex flex-col items-center px-6 text-center" style={{ paddingTop: "calc(var(--safe-top) + 9svh)" }}>
        <h2 className="leading-none text-olive" style={{ fontSize: "clamp(2.4rem, 11vw, 3.6rem)" }}>
          <ScriptText ref={title}>{content.location.title}</ScriptText>
        </h2>
        <Divider className="mt-2" />
        <div
          ref={card}
          className="relative mt-6 w-full overflow-hidden rounded-[18px]"
          style={{ maxWidth: 380, aspectRatio: "4 / 3.4", background: "#e8dcc8", border: "1px solid rgba(200, 168, 106, 0.7)", boxShadow: "0 18px 40px rgba(90, 60, 20, 0.25), inset 0 0 0 6px #f6efe4" }}
        >
          {/* a drawn map underneath, so the card is never empty */}
          <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[12px]" aria-hidden="true">
            <rect width="400" height="340" fill="#efe4d2" />
            <g fill="#e4d6c0">
              <rect x="0" y="0" width="150" height="110" />
              <rect x="190" y="0" width="210" height="80" />
              <rect x="0" y="150" width="110" height="190" />
              <rect x="150" y="120" width="120" height="90" />
              <rect x="310" y="120" width="90" height="220" />
              <rect x="150" y="250" width="120" height="90" />
            </g>
            <g fill="none" stroke="#f8f1e6" strokeWidth="10" strokeLinecap="round">
              <path d="M-10 130 H410" />
              <path d="M-10 230 H410" />
              <path d="M130 -10 V350" />
              <path d="M290 -10 V350" />
            </g>
            <g fill="none" stroke="#f8f1e6" strokeWidth="5">
              <path d="M170 -10 V350" />
              <path d="M-10 60 H410" />
              <path d="M-10 300 H410" />
            </g>
            <path d="M-10 20 C80 60, 160 10, 250 40 S380 10, 410 50" fill="none" stroke="#cfd9d2" strokeWidth="8" opacity="0.8" />
            <g fill="#cdd6b6" opacity="0.8">
              <circle cx="60" cy="280" r="26" />
              <circle cx="350" cy="60" r="20" />
            </g>
          </svg>
          {/* a real map, toned warm and cream so it sits in the palette */}
          {near && (
            <iframe
              title={content.location.label}
              src={content.location.embedUrl}
              className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[12px]"
              style={{ border: 0, filter: "sepia(0.42) saturate(0.75) hue-rotate(-6deg) brightness(1.03) contrast(0.95)", opacity: mapLoaded ? 1 : 0, transition: "opacity 1s ease" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setMapLoaded(true)}
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-[18px]" style={{ boxShadow: "inset 0 0 40px rgba(120, 90, 40, 0.18)" }} />
          {/* the pin */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" style={{ width: 36 }}>
            <div ref={shadow} className="absolute left-1/2 top-[100%] h-2 w-5 -translate-x-1/2 rounded-full" style={{ background: "rgba(60, 40, 10, 0.35)", filter: "blur(2px)" }} />
            <div ref={pin}>
              <svg viewBox="0 0 36 48" width="36" height="48" aria-hidden="true">
                <path d="M18 46 C18 46, 3 27, 3 16 A15 15 0 0 1 33 16 C33 27, 18 46, 18 46Z" fill="#b8924c" stroke="#8a6a2e" strokeWidth="1" />
                <circle cx="18" cy="16" r="6" fill="#fff6e0" />
              </svg>
            </div>
          </div>
        </div>
        <p ref={label} className="caps mt-4 text-olive" style={{ fontSize: "clamp(0.78rem, 3.4vw, 0.95rem)", letterSpacing: "0.2em" }}>
          {content.location.label}
        </p>
        <a ref={button} className="btn-gold mt-5" href={content.location.mapsUrl} target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {content.location.button}
        </a>
      </div>
    </div>
  );
});
