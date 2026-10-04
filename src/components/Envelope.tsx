"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { content, plates } from "@/content/invitation";
import { Crest } from "@/components/ui/Crest";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { DoorsFace } from "@/components/DoorsFace";
import { imageExists, prefersReducedMotion, requestMotionPermission, softHaptic } from "@/lib/device";
import { isArabic } from "@/lib/guestName";

type Props = {
  guestName: string;
  /** Resolves when the song is buffered or has given up. */
  preloadMusic: () => Promise<void>;
  /** Start the music; must run inside the tap. */
  startMusic: () => void;
  burst: (x: number, y: number, count?: number) => void;
  onMotionPermission: (granted: boolean) => void;
  /** The card has filled the screen; the doors take over. */
  onOpened: () => void;
};

/**
 * The sealed envelope. It is also the loader: everything the next minute
 * needs is fetched behind it, and the seal glows once it is ready.
 */
export function Envelope({ guestName, preloadMusic, startMusic, burst, onMotionPermission, onOpened }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const sealLeftRef = useRef<HTMLDivElement>(null);
  const sealRightRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);
  const opening = useRef(false);

  // Preload fonts, the plates that exist and the song. Failures are fine.
  useEffect(() => {
    let alive = true;
    const fonts = typeof document !== "undefined" && "fonts" in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();
    const images = [plates.doorsClosed, plates.doorsOpen, plates.names, plates.childrenPhoto].map((src) => imageExists(src));
    const timeout = new Promise<void>((r) => setTimeout(r, 6000));
    Promise.race([Promise.all([fonts, ...images, preloadMusic()]).then(() => undefined), timeout]).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [preloadMusic]);

  const open = () => {
    if (opening.current) return;
    opening.current = true;
    const reduced = prefersReducedMotion();

    // Inside the tap: music, haptic, motion permission.
    startMusic();
    softHaptic();
    void requestMotionPermission().then(onMotionPermission);

    const root = rootRef.current;
    const seal = sealRef.current;
    const env = envRef.current;
    const card = cardRef.current;
    const flap = flapRef.current;
    if (!root || !seal || !env || !card || !flap) return onOpened();

    const sealRect = seal.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    burst((sealRect.left + sealRect.width / 2 - rootRect.left) / rootRect.width, (sealRect.top + sealRect.height / 2 - rootRect.top) / rootRect.height, 56);

    const tl = gsap.timeline({ onComplete: onOpened, defaults: { ease: "power2.inOut" } });
    if (reduced) {
      tl.to([seal, hintRef.current, nameRef.current], { autoAlpha: 0, duration: 0.4 })
        .to(flap, { autoAlpha: 0, duration: 0.4 }, "<")
        .to(card, { autoAlpha: 1, duration: 0.6 }, "<")
        .to(env, { autoAlpha: 0, duration: 0.6 }, "<");
      return;
    }

    gsap.set(card, { autoAlpha: 1 });
    tl
      // the seal cracks and lifts
      .to(hintRef.current, { autoAlpha: 0, duration: 0.3 }, 0)
      .to(sealLeftRef.current, { x: -14, y: -22, rotate: -22, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0)
      .to(sealRightRef.current, { x: 14, y: -26, rotate: 24, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0)
      .to(seal, { autoAlpha: 0, duration: 0.2 }, 0.5)
      // the flap opens away from the guest
      .to(flap, { rotateX: -175, duration: 1.0, ease: "power2.inOut" }, 0.45)
      .set(flap, { zIndex: 0 }, 0.95)
      .to(nameRef.current, { autoAlpha: 0, duration: 0.5 }, 0.9)
      // the card rises out and grows to fill the screen
      .to(card, { y: "-18%", duration: 0.9, ease: "power2.out" }, 1.15)
      .to(card, { scale: 1, y: 0, duration: 1.5, ease: "power3.inOut" }, 1.85)
      .to(env, { scale: 1.25, y: "40%", autoAlpha: 0, duration: 1.3, ease: "power2.in" }, 1.95)
      .to(root.querySelector(".env-bg"), { autoAlpha: 0, duration: 0.6 }, 2.9);
  };

  const rtl = isArabic(guestName);
  const cardScale = 0.72;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 30 }}>
      <div className="env-bg absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 20%, #f1e5d6 0%, #e6d3bc 60%, #d6bd9e 100%)" }}>
        <div className="grain absolute inset-0" />
        <LeafShadows opacity={0.22} />
      </div>

      {/* The card, drawn at full stage size and scaled down inside the envelope. */}
      <div
        ref={cardRef}
        className="absolute inset-0"
        style={{ transform: `scale(${cardScale}) translateY(8%)`, transformOrigin: "50% 50%", opacity: 0, visibility: "hidden", zIndex: 1, boxShadow: "0 30px 70px rgba(70, 45, 15, 0.35)" }}
        aria-hidden="true"
      >
        <DoorsFace />
      </div>

      {/* The envelope */}
      <div ref={envRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(84%, 520px)", aspectRatio: "1.42 / 1", perspective: "1200px", zIndex: 2 }}>
        {/* back */}
        <div className="absolute inset-0 rounded-[6px]" style={{ background: "linear-gradient(180deg, #ecdcc6, #e4d0b6)", boxShadow: "0 24px 50px rgba(80, 55, 20, 0.28)" }} />
        {/* the pocket: left/right/bottom triangles */}
        <div className="grain absolute inset-0 overflow-hidden rounded-[6px]" style={{ zIndex: 3 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #f1e4d2 0%, #ebdcc7 100%)", clipPath: "polygon(0 0, 50% 52%, 0 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(270deg, #f1e4d2 0%, #ebdcc7 100%)", clipPath: "polygon(100% 0, 50% 52%, 100% 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #ecdcc6 0%, #f3e8d8 100%)", clipPath: "polygon(0 100%, 50% 48%, 100% 100%)", filter: "drop-shadow(0 -3px 4px rgba(90, 60, 20, 0.12))" }} />
          {guestName && (
            <p
              ref={nameRef}
              className="font-script absolute left-[8%] right-[8%] text-center text-olive"
              style={{ top: "70%", fontSize: "clamp(1.25rem, 6vw, 1.9rem)", lineHeight: 1.1, direction: rtl ? "rtl" : "ltr", fontFamily: rtl ? "var(--font-arabic)" : undefined }}
              lang={rtl ? "ar" : undefined}
            >
              {guestName}
            </p>
          )}
        </div>
        {/* flap */}
        <div ref={flapRef} className="absolute inset-x-0 top-0" style={{ height: "54%", transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: 4 }}>
          <div className="grain absolute inset-0" style={{ background: "linear-gradient(180deg, #efe1cf 0%, #e6d4bd 100%)", clipPath: "polygon(0 0, 100% 0, 50% 100%)", filter: "drop-shadow(0 4px 6px rgba(90, 60, 20, 0.16))", backfaceVisibility: "hidden" }} />
          <div className="absolute inset-0" style={{ background: "#e2cfb6", clipPath: "polygon(0 0, 100% 0, 50% 100%)", transform: "rotateX(180deg)", backfaceVisibility: "hidden" }} />
        </div>
        {/* wax seal */}
        <button
          ref={sealRef}
          type="button"
          onClick={open}
          aria-label={content.ui.tapToOpen}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ top: "54%", width: "clamp(72px, 22%, 110px)", aspectRatio: "1 / 1", zIndex: 5, cursor: "pointer", background: "transparent", border: 0, padding: 0 }}
        >
          <span
            className="absolute inset-[-28%] rounded-full"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(233, 207, 147, 0.55) 0%, rgba(233, 207, 147, 0) 70%)",
              opacity: ready ? 1 : 0,
              transition: "opacity 1.2s ease",
              animation: ready ? "breathe 2.6s ease-in-out infinite" : "none",
            }}
          />
          <div ref={sealLeftRef} className="absolute inset-0" style={{ clipPath: "polygon(0 0, 52% 0, 48% 100%, 0 100%)" }} aria-hidden="true">
            <SealDisc />
          </div>
          <div ref={sealRightRef} className="absolute inset-0" style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 48% 100%)" }} aria-hidden="true">
            <SealDisc />
          </div>
        </button>
      </div>

      <p ref={hintRef} className="hint absolute inset-x-0 text-center" style={{ bottom: "calc(var(--safe-bottom) + 9%)", zIndex: 6 }}>
        {content.ui.tapToOpen}
      </p>
    </div>
  );
}

/** A champagne-gold wax disc embossed with the crest. */
function SealDisc() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 30%, #efdfb4 0%, #cfae6f 45%, #a8884a 100%)",
        boxShadow: "0 6px 14px rgba(90, 60, 20, 0.35), inset 0 2px 4px rgba(255, 250, 230, 0.7), inset 0 -3px 6px rgba(100, 70, 20, 0.35)",
        border: "1px solid rgba(140, 110, 50, 0.4)",
      }}
    >
      <div className="opacity-80" style={{ width: "58%", filter: "drop-shadow(0 1px 0 rgba(255,250,230,0.5))" }}>
        <Crest size={0} className="h-auto w-full" />
      </div>
    </div>
  );
}
