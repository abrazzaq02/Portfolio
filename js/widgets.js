// Live Pakistan clock, seamless marquee, and GitHub stats + contribution graph.
import { $, $$ } from './env.js';

const GH_USER = 'abrazzaq02';

function initClock() {
  const el = $('#localClock');
  const status = $('#clockStatus');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: 'numeric', hour12: false });
  const tick = () => {
    const now = new Date();
    el.textContent = fmt.format(now);
    el.dateTime = now.toISOString();
    const h = Number(hourFmt.format(now));
    if (status) status.textContent = h >= 1 && h < 8 ? 'probably asleep — replies in the morning' : h < 18 && h >= 8 ? 'online · usually replies fast' : 'evening · coding or studying';
  };
  tick();
  setInterval(() => { if (document.visibilityState === 'visible') tick(); }, 1000);
}

function initMarquee() {
  const track = $('.marquee-track');
  if (!track) return;
  // Duplicate the items once; CSS slides the track by -50% so the loop is seamless.
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);
  });
}

async function cachedJSON(url, key) {
  try {
    const hit = sessionStorage.getItem(key);
    if (hit) return JSON.parse(hit);
  } catch (_) { /* storage blocked */ }
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (_) { /* ignore */ }
  return data;
}

function renderGraph(box, days) {
  const frag = document.createDocumentFragment();
  const firstWeekday = new Date(`${days[0].date}T00:00:00`).getDay(); // 0 = Sunday → first row
  for (let i = 0; i < firstWeekday; i++) frag.append(Object.assign(document.createElement('i'), { className: 'pad' }));
  days.forEach((d) => {
    const cell = document.createElement('i');
    cell.dataset.l = d.level;
    cell.title = `${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`;
    frag.append(cell);
  });
  box.replaceChildren(frag);
  box.scrollLeft = box.scrollWidth; // show the most recent weeks on small screens
}

async function loadGitHub() {
  const box = $('#ghGraph');
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  cachedJSON(`https://api.github.com/users/${GH_USER}`, 'gh-user').then((u) => {
    set('#ghRepos', u.public_repos);
    set('#ghFollowers', u.followers);
    set('#ghSince', new Date(u.created_at).getFullYear());
  }).catch(() => { set('#ghRepos', '20+'); set('#ghFollowers', '—'); set('#ghSince', '2023'); });

  try {
    const data = await cachedJSON(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`, 'gh-contrib');
    set('#ghTotal', data.total?.lastYear ?? '—');
    renderGraph(box, data.contributions);
  } catch (_) {
    // Fallback: a static SVG chart image service.
    box.innerHTML = `<img src="https://ghchart.rshah.org/a78bfa/${GH_USER}" alt="GitHub contribution chart for ${GH_USER}" loading="lazy" style="grid-row:1/-1;width:100%">`;
  }
}

function initGitHub() {
  const section = $('#github');
  if (!section) return;
  // Only fetch when the visitor scrolls near the section (saves requests and keeps the first load fast).
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); loadGitHub(); }
  }, { rootMargin: '600px 0px' });
  io.observe(section);
}

export function initWidgets() {
  initClock();
  initMarquee();
  initGitHub();
  $$('.learning-list').forEach((l) => setTimeout(() => l.classList.add('is-on'), 300));
}
