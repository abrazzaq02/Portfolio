// Letter-by-letter 3D headings + role-line text scramble.
// No library needed: we split text into <span>s and let CSS keyframes (upgrade.css §2) animate them.
import { env, $, $$ } from './env.js';

/** Wrap every word in .lw and every letter in .lt, keeping nested elements (like .gradient-text). */
function split(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        child.setAttribute('aria-hidden', 'true');
        walk(child);
        if (child.classList.contains('gradient-text')) child.classList.add('is-split');
        return;
      }
      if (child.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const word = document.createElement('span');
        word.className = 'lw';
        word.setAttribute('aria-hidden', 'true');
        [...part].forEach((ch) => {
          const letter = document.createElement('span');
          letter.className = 'lt';
          letter.textContent = ch;
          letter.style.setProperty('--i', i++);
          word.append(letter);
        });
        frag.append(word);
      });
      child.replaceWith(frag);
    });
  };
  walk(el);
  el.classList.add('split-ready', 'split-3d');
}

/** Give each gradient letter the slice of the gradient behind it. */
function paintGradients() {
  $$('.gradient-text.is-split').forEach((g) => {
    const width = g.getBoundingClientRect().width;
    const left = g.getBoundingClientRect().left;
    $$('.lt', g).forEach((l) => {
      l.style.setProperty('--gw', `${width}px`);
      l.style.setProperty('--gx', `${l.getBoundingClientRect().left - left}px`);
    });
  });
}

/** Text scramble: random glyphs resolve left-to-right into the next role. */
function scramble(el, roles) {
  const glyphs = '!<>-_\\/[]{}=+*^?#01ABCDEF';
  let index = 0;
  const to = (text) => new Promise((resolve) => {
    const from = el.textContent;
    const len = Math.max(from.length, text.length);
    const queue = Array.from({ length: len }, (_, k) => {
      const start = Math.floor(Math.random() * 14);
      return { from: from[k] || '', to: text[k] || '', start, end: start + 10 + Math.floor(Math.random() * 16) };
    });
    let frame = 0;
    const tick = () => {
      let out = '';
      let done = 0;
      queue.forEach((q) => {
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) out += `<span class="scr">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`;
        else out += q.from;
      });
      el.innerHTML = out; // only our own glyphs and role strings — no user input
      if (done === queue.length) resolve();
      else { frame++; requestAnimationFrame(tick); }
    };
    tick();
  });
  const loop = async () => {
    index = (index + 1) % roles.length;
    await to(roles[index]);
    setTimeout(loop, 2600);
  };
  setTimeout(loop, 2200);
}

export function initTextMotion() {
  const roleEl = $('#roleScramble');
  if (env.reducedMotion) return; // keep plain, readable text

  if (roleEl) scramble(roleEl, ['AI Engineering Student', 'Student Developer', 'AI Enthusiast', 'Problem Solver', 'Computer Vision Builder']);

  // Hero name plays immediately.
  const hero = $('#heroName');
  if (hero) {
    split(hero);
    requestAnimationFrame(() => { paintGradients(); hero.classList.add('lt-play'); });
  }

  // Section titles reveal when scrolled into view.
  const titles = $$('.section-head h2');
  titles.forEach(split);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--d', '120ms');
      e.target.classList.add('lt-play');
      io.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  titles.forEach((t) => io.observe(t));

  let raf;
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paintGradients); }, { passive: true });
  document.fonts?.ready.then(paintGradients);
}
