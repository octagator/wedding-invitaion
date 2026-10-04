import type gsap from "gsap";

/**
 * Every scene builds one GSAP timeline of duration 1 with three parts:
 * enter (0 → 0.18), body (0.18 → 0.82) and exit (0.82 → 1). The journey
 * adds them to a master timeline so each scene's enter overlaps the
 * previous scene's exit, then scrubs the master with scroll.
 */
export const SCENE = {
  enter: 0.18,
  bodyStart: 0.18,
  bodyEnd: 0.82,
  exit: 0.18,
  /** How much of the viewport height one unit of timeline scrolls through. */
  vhPerUnit: 115,
} as const;

export type SceneHandle = {
  /** Builds the scene timeline (paused). Called once after mount. */
  build: () => gsap.core.Timeline;
  /** Called when the scene becomes the active one on screen. */
  onActive?: () => void;
};

export type SceneProps = {
  /** True while this scene is the one the guest is looking at. */
  active: boolean;
  /** True when the scene is the active one or its neighbour. */
  near: boolean;
};

/** A soft entry used by most scenes: fade in and settle from slightly below. */
export function enterSoft(tl: gsap.core.Timeline, root: HTMLElement, y = "6%") {
  tl.fromTo(root, { autoAlpha: 0, y, scale: 1.02 }, { autoAlpha: 1, y: 0, scale: 1, duration: SCENE.enter, ease: "power2.out" }, 0);
}

/** A soft exit: drift up a little, scale up slightly and fade. */
export function exitSoft(tl: gsap.core.Timeline, root: HTMLElement, y = "-6%") {
  tl.to(root, { autoAlpha: 0, y, scale: 1.05, duration: SCENE.exit, ease: "power1.in" }, SCENE.bodyEnd);
}

/** Letters of a Caps element ease in while their spacing settles. */
export function capsIn(tl: gsap.core.Timeline, el: Element | null, at: number | string, duration = 0.12) {
  if (!el) return;
  const letters = el.querySelectorAll(".caps-letter");
  const n = letters.length || 1;
  tl.fromTo(
    letters,
    { opacity: 0, x: (i: number) => (i - n / 2) * 5 },
    { opacity: 1, x: 0, duration, ease: "power2.out", stagger: { each: duration / (n * 2.2) } },
    at,
  );
}

/** A ScriptText element is written on from left to right. */
export function scriptWrite(tl: gsap.core.Timeline, el: Element | null, at: number | string, duration = 0.2) {
  if (!el) return;
  tl.fromTo(el, { "--write": 0, opacity: 1 }, { "--write": 1, duration, ease: "none" }, at);
}

/** Lines of body text arrive one after another. */
export function linesIn(tl: gsap.core.Timeline, els: ArrayLike<Element>, at: number | string, duration = 0.14, each = 0.06) {
  tl.fromTo(els, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration, ease: "power2.out", stagger: each }, at);
}
