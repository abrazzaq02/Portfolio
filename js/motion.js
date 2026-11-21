// Smooth scrolling (Lenis), custom cursor, magnetic buttons, glow borders and the timeline scroll line.
import { env, $, $$ } from './env.js';

export let lenis = null;

function initLenis() {
  if (env.reducedMotion || !window.Lenis) return;
  lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  window.__lenis = lenis;

  // Route in-page anchor links through Lenis so they glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -88 });
    history.pushState(null, '', a.getAttribute('href'));
    if (a.classList.contains('skip-link')) target.focus?.({ preventScroll: true });
  });

  // Pause smooth scroll while a modal <dialog> is open.
  new MutationObserver(() => {
    document.querySelector('dialog[open]') ? lenis.stop() : lenis.start();
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
}

function initCursor() {
  if (!env.finePointer || env.reducedMotion) return;
  const dot = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-cursor');

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    const interactive = e.target.closest('a, button, [data-tilt], input, textarea, .marquee li');
    ring.classList.toggle('is-hover', Boolean(interactive));
  }, { passive: true });
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => document.documentElement.classList.add('cursor-hidden'));
  document.addEventListener('pointerenter', () => document.documentElement.classList.remove('cursor-hidden'));
  const loop = () => { // the ring trails behind the dot (linear interpolation)
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

function initMagnetic() {
  if (!env.finePointer || env.reducedMotion) return;
  $$('.magnetic, .hero-actions .btn, .more-projects .btn').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mgx', `${(e.clientX - b.left - b.width / 2) * 0.28}px`);
      el.style.setProperty('--mgy', `${(e.clientY - b.top - b.height / 2) * 0.35}px`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mgx', '0px'); el.style.setProperty('--mgy', '0px'); });
  });
}

function initGlow() {
  if (!env.finePointer) return;
  $$('.card, .cert-card, .service-card').forEach((card) => {
    if (card.closest('.chat-panel')) return;
    card.classList.add('has-glow');
    const edge = document.createElement('span');
    edge.className = 'glow-edge';
    edge.setAttribute('aria-hidden', 'true');
    card.append(edge);
    card.addEventListener('pointermove', (e) => {
      const b = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${e.clientX - b.left}px`);
      card.style.setProperty('--gy', `${e.clientY - b.top}px`);
    }, { passive: true });
  });
}

function initTimeline() {
  const tl = $('#timeline');
  if (!tl) return;
  const items = $$('.timeline-item', tl);
  if (env.reducedMotion) { tl.style.setProperty('--tl', 1); items.forEach((i) => i.classList.add('is-lit')); return; }
  tl.classList.add('is-tracking');
  let ticking = false;
  const update = () => {
    ticking = false;
    const b = tl.getBoundingClientRect();
    const mid = innerHeight * 0.6;
    const progress = Math.min(1, Math.max(0, (mid - b.top) / b.height));
    tl.style.setProperty('--tl', progress.toFixed(3));
    items.forEach((it) => it.classList.toggle('is-lit', it.getBoundingClientRect().top < mid));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

export function initMotion() {
  initLenis();
  initCursor();
  initMagnetic();
  initGlow();
  initTimeline();
}
