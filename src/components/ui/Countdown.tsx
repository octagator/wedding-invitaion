"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/content/invitation";

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function partsAt(now: number, target: number): Parts {
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff <= 0,
  };
}

/** One digit column whose value rolls softly on change. */
function Digit({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [prev, setPrev] = useState<string | null>(null);
  const timer = useRef(0);
  useEffect(() => {
    if (value === shown) return;
    setPrev(shown);
    setShown(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPrev(null), 520);
  }, [value, shown]);
  return (
    <span className="relative inline-block overflow-hidden align-baseline" style={{ width: "0.62em", height: "1.1em" }} aria-hidden="true">
      {prev !== null && (
        <span key={`p${prev}${shown}`} className="digit-out absolute inset-0 flex justify-center">
          {prev}
        </span>
      )}
      <span key={`c${shown}`} className={`absolute inset-0 flex justify-center ${prev !== null ? "digit-in" : ""}`}>
        {shown}
      </span>
      <style jsx>{`
        .digit-in {
          animation: digitIn 0.5s cubic-bezier(0.22, 0.8, 0.3, 1) both;
        }
        .digit-out {
          animation: digitOut 0.5s cubic-bezier(0.22, 0.8, 0.3, 1) both;
        }
        @keyframes digitIn {
          from { transform: translateY(60%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes digitOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-60%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .digit-in, .digit-out { animation: none; }
          .digit-out { display: none; }
        }
      `}</style>
    </span>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex h-[64px] w-[64px] items-center justify-center rounded-[10px] font-serif text-[1.9rem] font-medium tabular-nums text-[#fff4dc] sm:h-[72px] sm:w-[72px] sm:text-[2.1rem]"
        style={{
          border: "1px solid rgba(233, 207, 147, 0.55)",
          background: "linear-gradient(180deg, rgba(60, 50, 60, 0.35) 0%, rgba(30, 28, 40, 0.5) 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          backdropFilter: "blur(4px)",
        }}
        aria-label={`${text} ${label}`}
      >
        {Array.from(text).map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </div>
      <span className="caps text-[0.62rem] text-[#e9cf93]">{label}</span>
    </div>
  );
}

/**
 * Live countdown to the ceremony instant (stored in UTC). Holds at zeros
 * once reached and tells the parent so petals may fall.
 */
export function Countdown({ onDone }: { onDone?: () => void }) {
  const target = useRef(Date.parse(content.date.utc));
  // Zeros on the server and first paint, so the static HTML and the client agree.
  const [parts, setParts] = useState<Parts>({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });
  const doneRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const p = partsAt(Date.now(), target.current);
      setParts(p);
      if (p.done && !doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [onDone]);

  const l = content.countdown.labels;
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-4" role="timer" aria-live="off">
      <Box label={l.days} value={parts.days} />
      <Box label={l.hours} value={parts.hours} />
      <Box label={l.minutes} value={parts.minutes} />
      <Box label={l.seconds} value={parts.seconds} />
    </div>
  );
}
