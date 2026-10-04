"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import { content } from "@/content/invitation";
import { LeafShadows } from "@/components/scenery/LeafShadows";
import { Poster } from "@/components/ui/Poster";
import { CalendarButtons } from "@/components/ui/CalendarButtons";
import { type SceneHandle, type SceneProps, linesIn } from "./scene";

/** Final frame: the poster as a printed card on the plaster, with three quiet controls. */
export const KeepsakeScene = forwardRef<SceneHandle, SceneProps>(function KeepsakeScene(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    build: () => {
      const tl = gsap.timeline();
      const r = root.current!;
      tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "power1.inOut" }, 0)
        .fromTo(card.current, { y: "60%", rotate: -3, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.1);
      linesIn(tl, controls.current!.children, 0.5, 0.14, 0.05);
      return tl;
    },
  }));

  const share = async () => {
    const url = window.location.href;
    const data = { title: content.share.title, text: content.share.description, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch {
      /* dismissed */
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div ref={root} className="scene absolute inset-0 overflow-hidden" style={{ visibility: "hidden", background: "radial-gradient(120% 90% at 50% 20%, #f1e5d6 0%, #e6d3bc 60%, #d6bd9e 100%)" }}>
      <div className="grain absolute inset-0" />
      <LeafShadows opacity={0.2} />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-6" style={{ paddingBottom: "calc(var(--safe-bottom) + 20px)", paddingTop: "calc(var(--safe-top) + 6svh)" }}>
        <div ref={card} className="w-full" style={{ maxWidth: "min(78%, 320px)", transform: "rotate(-1.5deg)" }} data-depth="0.2">
          <Poster />
        </div>
        <div ref={controls} className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a className="btn-quiet" href="/poster.jpg" download="Youssef-Hana-Wedding-Invitation.jpg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
            </svg>
            {content.ui.save}
          </a>
          <CalendarButtons />
          <button type="button" className="btn-quiet" onClick={share} style={{ borderColor: copied ? "var(--gold)" : undefined }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
            </svg>
            {content.ui.share}
          </button>
        </div>
      </div>
    </div>
  );
});
