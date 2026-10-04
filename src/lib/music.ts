import { music } from "@/content/invitation";

/**
 * A small controller around one looping <audio>. Starts only from a user
 * gesture, fades in, pauses when the tab is hidden and keeps quiet if the
 * file is missing.
 */
export class MusicController {
  private audio: HTMLAudioElement | null = null;
  private fadeFrame = 0;
  private wantedOn = false;
  private wasPlayingBeforeHide = false;
  private listeners = new Set<(on: boolean) => void>();
  available = false;

  constructor() {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    audio.crossOrigin = "anonymous";
    audio.src = music.src;
    audio.addEventListener("canplaythrough", () => (this.available = true), { once: true });
    audio.addEventListener("error", () => (this.available = false));
    this.audio = audio;
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /** Resolves when enough of the track is buffered, or after a timeout. */
  preload(timeoutMs = 4000): Promise<void> {
    return new Promise((resolve) => {
      const audio = this.audio;
      if (!audio) return resolve();
      if (audio.readyState >= 3) return resolve();
      const done = () => resolve();
      audio.addEventListener("canplaythrough", done, { once: true });
      audio.addEventListener("error", done, { once: true });
      setTimeout(done, timeoutMs);
      try {
        audio.load();
      } catch {
        resolve();
      }
    });
  }

  onChange(fn: (on: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  get isOn(): boolean {
    return this.wantedOn && !!this.audio && !this.audio.paused;
  }

  /** Must be called from a user gesture the first time. */
  async start(): Promise<void> {
    const audio = this.audio;
    if (!audio) return;
    this.wantedOn = true;
    try {
      await audio.play();
      this.fadeTo(1, music.fadeInSeconds * 1000);
    } catch {
      /* Autoplay refused or file missing: stay quiet. */
    }
    this.emit();
  }

  stop(): void {
    this.wantedOn = false;
    this.fadeTo(0, 600, () => this.audio?.pause());
    this.emit();
  }

  toggle(): void {
    if (this.wantedOn) this.stop();
    else void this.start();
  }

  private onVisibility = () => {
    const audio = this.audio;
    if (!audio) return;
    if (document.hidden) {
      this.wasPlayingBeforeHide = this.wantedOn && !audio.paused;
      if (this.wasPlayingBeforeHide) audio.pause();
    } else if (this.wasPlayingBeforeHide && this.wantedOn) {
      audio.play().catch(() => undefined);
    }
  };

  private fadeTo(target: number, ms: number, then?: () => void) {
    const audio = this.audio;
    if (!audio) return;
    cancelAnimationFrame(this.fadeFrame);
    const from = audio.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const eased = k * k * (3 - 2 * k);
      audio.volume = from + (target - from) * eased;
      if (k < 1) this.fadeFrame = requestAnimationFrame(step);
      else then?.();
    };
    this.fadeFrame = requestAnimationFrame(step);
  }

  private emit() {
    for (const fn of this.listeners) fn(this.wantedOn);
  }
}
