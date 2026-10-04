"use client";

import { useEffect, useState } from "react";
import { content } from "@/content/invitation";
import type { MusicController } from "@/lib/music";

/** The monogram in a ring, fixed in a corner, with a clear on and off state. */
export function MusicButton({ music, visible }: { music: MusicController | null; visible: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!music) return;
    setOn(music.isOn);
    return music.onChange(setOn);
  }, [music]);

  return (
    <button
      type="button"
      onClick={() => music?.toggle()}
      aria-pressed={on}
      aria-label={on ? content.ui.musicOn : content.ui.musicOff}
      title={on ? content.ui.musicOn : content.ui.musicOff}
      className="absolute z-40 flex h-11 w-11 items-center justify-center rounded-full"
      style={{
        top: "calc(var(--safe-top) + 14px)",
        right: "14px",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.8s ease",
        background: "rgba(248, 240, 228, 0.55)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(200, 168, 106, 0.7)",
        boxShadow: "0 6px 18px rgba(80, 60, 30, 0.18)",
      }}
    >
      <span className={`font-script text-[1.25rem] leading-none text-olive ${on ? "" : "opacity-50"}`} aria-hidden="true">
        {content.monogram.first}
        {content.monogram.second}
      </span>
      {/* ring that spins slowly while music plays */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 44 44" aria-hidden="true" style={{ animation: on ? "spin 9s linear infinite" : "none" }}>
        <circle cx="22" cy="22" r="19" fill="none" stroke="#c8a86a" strokeWidth="1" strokeDasharray={on ? "6 4" : "0 0"} opacity={on ? 0.9 : 0.5} />
      </svg>
      {!on && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 44 44" aria-hidden="true">
          <line x1="12" y1="32" x2="32" y2="12" stroke="#4b503c" strokeWidth="1.2" opacity="0.7" />
        </svg>
      )}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
    </button>
  );
}
