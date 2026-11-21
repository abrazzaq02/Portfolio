// Entry point for the 2026 upgrade. main.js (theme, nav, certificates, form) still runs first.
import { env, idle } from './env.js';
import { initTextMotion } from './text-motion.js';
import { initMotion } from './motion.js';
import { initWidgets } from './widgets.js';
import { initPalette } from './palette.js';
import { initChatbot } from './chatbot.js';

initTextMotion();
initMotion();
initWidgets();
initPalette();
initChatbot();

// Lazy-load the WebGL hero only on capable desktops, after the page has loaded and the browser is idle.
const canRun3D = env.desktop && env.finePointer && !env.reducedMotion && !env.lowEnd;
if (canRun3D) {
  const load = () => idle(() => import('./hero3d.js').then((m) => m.initHero3D()).catch(() => {}));
  if (document.readyState === 'complete') load();
  else window.addEventListener('load', load, { once: true });
}
