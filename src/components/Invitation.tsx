"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Envelope } from "@/components/Envelope";
import { Doors } from "@/components/Doors";
import { Journey } from "@/components/Journey";
import { Particles, type ParticlesHandle } from "@/components/ui/Particles";
import { MusicButton } from "@/components/ui/MusicButton";
import { MusicController } from "@/lib/music";
import { readGuestName } from "@/lib/guestName";
import { useParallax } from "@/lib/useParallax";

type Stage = "envelope" | "doors" | "journey";

/**
 * The whole piece: a sealed envelope, the doors, and the scroll through
 * the wedding day, all on one portrait stage.
 */
export function Invitation() {
  const [stage, setStage] = useState<Stage>("envelope");
  const [guestName, setGuestName] = useState("");
  const [music, setMusic] = useState<MusicController | null>(null);
  const [tilt, setTilt] = useState(false);
  const [doorsAt, setDoorsAt] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<ParticlesHandle | null>(null);

  useEffect(() => {
    setGuestName(readGuestName(window.location.search));
    const m = new MusicController();
    setMusic(m);
  }, []);

  // The page cannot scroll until the doors have opened.
  useEffect(() => {
    const locked = stage !== "journey";
    document.body.classList.toggle("is-locked", locked);
    if (locked) window.scrollTo(0, 0);
    return () => document.body.classList.remove("is-locked");
  }, [stage]);

  useParallax(stageRef, tilt, stage !== "envelope");

  const preloadMusic = useCallback(() => (music ? music.preload() : Promise.resolve()), [music]);
  const startMusic = useCallback(() => void music?.start(), [music]);
  const burst = useCallback((x: number, y: number, count?: number) => particles.current?.burst(x, y, count), []);
  const onOpened = useCallback(() => {
    setDoorsAt(performance.now());
    setStage("doors");
  }, []);
  const onEntered = useCallback(() => setStage("journey"), []);
  const onCountdownDone = useCallback(() => particles.current?.setPetalFall(true), []);

  const doorsOpenedAt = useMemo(() => doorsAt, [doorsAt]);

  return (
    <>
      <div className="frame">
        <div className="frame-backdrop drift" aria-hidden="true" />
        <div className="frame-particles" aria-hidden="true">
          <Particles density={0.6} />
        </div>
        <div ref={stageRef} className="stage" id="stage">
          <Journey active={stage === "journey"} onCountdownDone={onCountdownDone} spacerRef={spacerRef} />
          {stage === "doors" && <Doors openedAt={doorsOpenedAt} onEntered={onEntered} />}
          {stage === "envelope" && (
            <Envelope guestName={guestName} preloadMusic={preloadMusic} startMusic={startMusic} burst={burst} onMotionPermission={setTilt} onOpened={onOpened} />
          )}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 35 }}>
            <Particles handleRef={particles} />
          </div>
          <MusicButton music={music} visible={stage !== "envelope"} />
        </div>
      </div>
      {/* The scroll track: the stage is fixed, so the document scrolls through this. */}
      <div ref={spacerRef} aria-hidden="true" style={{ height: "100svh" }} />
    </>
  );
}
