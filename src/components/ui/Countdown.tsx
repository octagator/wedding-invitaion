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
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: "10.6cqw",
        height: "8.2cqw",
        borderRadius: "0.9cqw",
        border: "0.16cqw solid rgba(95, 86, 56, 0.75)",
        background: "rgba(255, 250, 242, 0.28)",
        boxShadow: "inset 0 0 0 0.35cqw rgba(255, 250, 242, 0.25)",
      }}
      aria-label={`${text} ${label}`}
    >
      <div className="font-serif font-medium tabular-nums" style={{ fontSize: "4.6cqw", lineHeight: 1, color: "#5a553a" }}>
        {Array.from(text).map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </div>
      <span className="caps" style={{ fontSize: "1.2cqw", marginTop: "0.9cqw", letterSpacing: "0.16em", color: "#6b6448" }}>
        {label}
      </span>
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
    <div className="flex items-start justify-center" style={{ gap: "1.5cqw" }} role="timer" aria-live="off">
      <Box label={l.days} value={parts.days} />
      <Box label={l.hours} value={parts.hours} />
      <Box label={l.minutes} value={parts.minutes} />
      <Box label={l.seconds} value={parts.seconds} />
    </div>
  );
}
