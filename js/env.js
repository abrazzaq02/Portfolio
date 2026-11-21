// Shared feature detection, so every module makes the same "is this device ready for motion?" decision.
const mq = (q) => window.matchMedia(q).matches;

export const env = {
  reducedMotion: mq('(prefers-reduced-motion: reduce)'),
  finePointer: mq('(hover: hover) and (pointer: fine)'),
  get desktop() { return mq('(min-width: 900px)'); },
  // Low-end check: few CPU cores, little RAM or Data Saver on → skip heavy effects.
  lowEnd:
    (navigator.hardwareConcurrency || 8) < 4 ||
    (navigator.deviceMemory || 8) < 4 ||
    Boolean(navigator.connection && navigator.connection.saveData),
};

export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Run work when the browser is idle (keeps Lighthouse "Total Blocking Time" low).
export const idle = (fn) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 600);
