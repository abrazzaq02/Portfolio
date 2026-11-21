// Command palette (Ctrl/Cmd + K), hidden terminal mode, and the Konami-code easter egg.
import { $, $$ } from './env.js';
import { confetti } from './confetti.js';

const EMAIL = 'f23ari02@aror.edu.pk';
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -88 });
  else el.scrollIntoView({ behavior: 'smooth' });
  history.pushState(null, '', `#${id}`);
}

function toast(text) {
  const t = document.createElement('div');
  t.textContent = text;
  t.setAttribute('role', 'status');
  Object.assign(t.style, { position: 'fixed', left: '50%', bottom: '28px', transform: 'translateX(-50%)', zIndex: 9999, padding: '10px 16px', borderRadius: '12px', background: 'var(--panel-solid)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: '14px', boxShadow: '0 20px 50px -10px var(--shadow)' });
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
}

async function copyEmail() {
  try { await navigator.clipboard.writeText(EMAIL); toast('Email copied to clipboard ✓'); }
  catch (_) { location.href = `mailto:${EMAIL}`; }
}

/* ------------------------------ Terminal ------------------------------ */
function initTerminal() {
  const dlg = $('#terminal');
  const out = $('#termOut');
  const form = $('#termForm');
  const input = $('#termInput');
  if (!dlg) return { open() {} };

  const print = (text, cls) => {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text;
    out.append(line);
    out.scrollTop = out.scrollHeight;
  };
  const commands = {
    help: () => 'Commands: whoami, about, skills, projects, contact, resume, social, goto <section>, theme, date, clear, sudo hire-me, exit',
    whoami: () => 'abdul-razaque — BS Artificial Intelligence student @ Aror University, Sukkur 🇵🇰',
    about: () => 'I turn real-world problems into practical ML, computer-vision and generative-AI apps. Graduating May 2027. Open to internships.',
    skills: () => 'python · pytorch · tensorflow · scikit-learn · opencv · langchain · fastapi · flask · react · docker · sql',
    projects: () => '1. ASTROCARE AI (NASA Space Apps)\n2. Smart Career Counseling expert system\n3. AutoML for Small Businesses\n4. Face Detection Attendance System\n→ type "goto projects"',
    contact: () => `email: ${EMAIL}\nwhatsapp: +92 306 3044889\nlinkedin: /in/abdul-razaque-744a782a1`,
    social: () => 'github.com/abrazzaq02 · x.com/razaq303 · instagram.com/razzaq_khan7',
    resume: () => { const a = document.createElement('a'); a.href = 'Abdul_Razaque.pdf'; a.download = 'Abdul_Razaque_CV.pdf'; a.click(); return 'Downloading resume…'; },
    date: () => new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi' }) + ' (PKT)',
    theme: () => { $('#themeBtn')?.click(); return 'Theme toggled.'; },
    clear: () => { out.replaceChildren(); return null; },
    exit: () => { dlg.close(); return null; },
    goto: (arg) => { if (!document.getElementById(arg)) return `No section "${arg}". Try: about, skills, projects, github, experience, achievements, certifications, contact`; dlg.close(); goTo(arg); return null; },
    sudo: (arg) => { if (arg === 'hire-me') { confetti(); return '🎉 Permission granted. Excellent decision! Email me: ' + EMAIL; } return 'sudo: nice try 😄'; },
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    print(`$ ${raw}`, 'cmd');
    const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
    const fn = commands[cmd];
    const res = fn ? fn(rest.join(' ')) : `command not found: ${cmd} — type "help"`;
    if (res) print(res, fn ? '' : 'err');
  });
  $('#termClose')?.addEventListener('click', () => dlg.close());

  return {
    open() {
      if (dlg.open) return;
      if (!out.childElementCount) { print('Welcome to Abdul\'s terminal 👋'); print(commands.help()); }
      dlg.showModal();
      input.focus();
    },
  };
}

/* --------------------------- Command palette --------------------------- */
export function initPalette() {
  const dlg = $('#cmdk');
  const input = $('#cmdkInput');
  const list = $('#cmdkList');
  const terminal = initTerminal();
  $$('.cmdk-mod').forEach((m) => { m.textContent = isMac ? '⌘' : 'Ctrl'; });
  if (!dlg) return;

  const sections = $$('main section[id]').map((s) => ({
    group: 'Jump to',
    label: s.querySelector('h2')?.getAttribute('aria-label') || s.querySelector('h2')?.textContent || 'Home',
    hint: `#${s.id}`,
    icon: '#',
    run: () => goTo(s.id),
  }));
  sections[0].label = 'Home';
  const actions = [
    { label: 'Download resume (PDF)', icon: '↓', run: () => { const a = document.createElement('a'); a.href = 'Abdul_Razaque.pdf'; a.download = 'Abdul_Razaque_CV.pdf'; a.click(); } },
    { label: 'Copy email address', icon: '@', run: copyEmail },
    { label: 'Toggle light / dark theme', icon: '◐', run: () => $('#themeBtn')?.click() },
    { label: 'Chat with my AI assistant', icon: '✦', run: () => $('#chatFab')?.click() },
    { label: 'Open GitHub profile', icon: '↗', run: () => open('https://github.com/abrazzaq02', '_blank', 'noopener') },
    { label: 'Open LinkedIn profile', icon: '↗', run: () => open('https://www.linkedin.com/in/abdul-razaque-744a782a1/', '_blank', 'noopener') },
    { label: 'Open terminal mode', hint: '`', icon: '>_', run: () => terminal.open() },
    { label: 'Celebrate 🎉', icon: '✺', run: confetti },
  ].map((a) => ({ group: 'Actions', ...a }));
  const all = [...sections, ...actions];
  let shown = all;
  let active = 0;

  const render = () => {
    list.replaceChildren();
    let lastGroup = '';
    shown.forEach((item, i) => {
      if (item.group !== lastGroup) {
        lastGroup = item.group;
        const g = document.createElement('li');
        g.className = 'group';
        g.setAttribute('role', 'presentation');
        g.textContent = item.group;
        list.append(g);
      }
      const li = document.createElement('li');
      li.id = `cmd-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.innerHTML = '<span class="ico" aria-hidden="true"></span><span class="lbl"></span><small></small>';
      li.querySelector('.ico').textContent = item.icon;
      li.querySelector('.lbl').textContent = item.label;
      li.querySelector('small').textContent = item.hint || '';
      li.addEventListener('click', () => choose(i));
      li.addEventListener('pointermove', () => { if (active !== i) { active = i; update(); } });
      list.append(li);
    });
    if (!shown.length) list.innerHTML = '<li class="group" role="presentation">No results — try “projects” or “resume”</li>';
    input.setAttribute('aria-activedescendant', shown.length ? `cmd-${active}` : '');
  };
  const update = () => {
    $$('[role="option"]', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    $(`#cmd-${active}`, list)?.scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `cmd-${active}`);
  };
  const choose = (i) => { const item = shown[i]; if (!item) return; dlg.close(); item.run(); };
  const openPalette = () => {
    if (dlg.open) { dlg.close(); return; }
    input.value = ''; shown = all; active = 0; render();
    dlg.showModal(); input.focus();
  };

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    shown = all.filter((c) => `${c.label} ${c.hint || ''} ${c.group}`.toLowerCase().includes(q));
    active = 0; render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(shown.length, 1); update(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + shown.length) % Math.max(shown.length, 1); update(); }
    if (e.key === 'Enter') { e.preventDefault(); choose(active); }
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  $('#cmdkBtn')?.addEventListener('click', openPalette);

  // Global shortcuts + Konami code (↑ ↑ ↓ ↓ ← → ← → B A).
  const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
    if (typing) return;
    if (e.key === '`') { e.preventDefault(); terminal.open(); return; }
    pos = e.key.toLowerCase() === konami[pos] ? pos + 1 : (e.key.toLowerCase() === konami[0] ? 1 : 0);
    if (pos === konami.length) { pos = 0; confetti(); toast('Konami unlocked — you found the easter egg! 🎉'); }
  });
}
