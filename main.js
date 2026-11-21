'use strict';

(() => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle: the colorful midnight theme is the default, with a saved light option.
  const themeButton = $('#themeBtn');
  const themeLabel = $('#modeLabel');
  const themeColor = $('#metaThemeColor');

  function setTheme(theme, persist = true) {
    const selectedTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = selectedTheme;
    const isDark = selectedTheme === 'dark';

    if (themeLabel) themeLabel.textContent = isDark ? 'Midnight' : 'Daylight';
    if (themeButton) {
      themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to midnight theme');
      themeButton.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to midnight theme');
    }
    if (themeColor) themeColor.setAttribute('content', isDark ? '#07111f' : '#f5f7ff');
    if (persist) {
      try { localStorage.setItem('portfolio-theme', selectedTheme); } catch (_) { /* Storage can be unavailable in private browsing. */ }
    }
  }

  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme, false);
  } catch (_) { /* Keep the default theme when storage is unavailable. */ }

  // View Transitions API: the new theme grows as a circle from the button (see upgrade.css).
  themeButton?.addEventListener('click', (event) => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reducedMotion) { setTheme(next); return; }
    root.style.setProperty('--vt-x', `${event.clientX || window.innerWidth - 60}px`);
    root.style.setProperty('--vt-y', `${event.clientY || 36}px`);
    document.startViewTransition(() => setTheme(next));
  });

  // Accessible mobile navigation.
  const menu = $('#navMenu');
  const menuButton = $('#menuBtn');
  const navLinks = $$('.nav-link');

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menu?.classList.toggle('open', isOpen);
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Keep the current section reflected in the desktop navigation.
  const header = $('#header');
  const sections = $$('main section[id]');

  function updateScrollState() {
    header?.classList.toggle('stuck', window.scrollY > 16);
    const threshold = window.innerHeight * 0.38;
    let activeId = sections[0]?.id || 'home';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) activeId = section.id;
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  // Reveal content as it enters the viewport, without hiding it when JavaScript is unavailable.
  const revealItems = $$('.reveal');
  if (revealItems.length && !reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    root.classList.add('motion-ready');
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  // Subtle pointer-driven depth on the portrait, cards and ambient 3D scene.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reducedMotion) {
    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      root.style.setProperty('--px', x.toFixed(3));
      root.style.setProperty('--py', y.toFixed(3));
    }, { passive: true });

    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });

    const cube = $('#cube');
    if (cube) {
      let previousFrame = 0;
      const animateCube = (time) => {
        if (document.visibilityState === 'visible' && time - previousFrame > 28) {
          const seconds = time / 1000;
          cube.style.transform = `rotateX(${Math.sin(seconds * 0.28) * 20 - 14}deg) rotateY(${seconds * 13}deg) rotateZ(${Math.sin(seconds * 0.18) * 9}deg)`;
          previousFrame = time;
        }
        window.requestAnimationFrame(animateCube);
      };
      window.requestAnimationFrame(animateCube);
    }
  }

  // Filter the certificate cards with keyboard-accessible pressed states.
  const filterButtons = $$('.filter-chip');
  const certificateCards = $$('.cert-card[data-category]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.dataset.filter || 'All';
      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle('active', isSelected);
        filterButton.setAttribute('aria-pressed', String(isSelected));
      });
      certificateCards.forEach((card) => {
        card.hidden = selectedCategory !== 'All' && card.dataset.category !== selectedCategory;
      });
    });
  });

  // Open original certificate scans in a native accessible dialog.
  const certificateDialog = $('#certificate-dialog');
  const dialogImage = $('#dialog-image');
  const dialogTitle = $('#dialog-title');
  const dialogOpenLink = $('#dialog-open');
  const closeDialogButton = $('#close-dialog');

  $$('[data-full]').forEach((button) => {
    button.addEventListener('click', () => {
      const imagePath = button.dataset.full;
      if (!imagePath) return;
      const title = button.dataset.title || 'Certificate';

      if (certificateDialog?.showModal && dialogImage && dialogTitle && dialogOpenLink) {
        dialogImage.src = imagePath;
        dialogImage.alt = `${title} — full certificate`;
        dialogTitle.textContent = title;
        dialogOpenLink.href = imagePath;
        certificateDialog.showModal();
      } else {
        window.open(imagePath, '_blank', 'noopener,noreferrer');
      }
    });
  });

  closeDialogButton?.addEventListener('click', () => certificateDialog?.close());
  certificateDialog?.addEventListener('click', (event) => {
    if (event.target === certificateDialog) certificateDialog.close();
  });

  // The contact form uses the visitor's email app, so it works without a backend.
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim() || 'Portfolio enquiry';
    const message = String(formData.get('message') || '').trim();
    const body = `${message}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:f23ari02@aror.edu.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
