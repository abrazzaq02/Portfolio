# Abdul Razaque — AI Engineering Portfolio

A responsive, single-page portfolio for Abdul Razaque, an Artificial Intelligence student at Aror University in Sukkur, Pakistan. It highlights projects, technical skills, internships, education, certificates, and contact links.

## Run locally

This is a static site with no build step or package installation required. From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## 2026 upgrade

Still plain HTML/CSS/JS with no build step. New features: bento About/Skills grid, glass cards with a glow border that follows the mouse, letter-by-letter 3D headings, a role-line text scramble, a lazy-loaded WebGL particle sphere (desktop only), Lenis smooth scrolling, a custom cursor, magnetic buttons, a tech marquee, live GitHub stats and contribution graph, a hackathon badge section, a scroll-driven timeline, a Ctrl/Cmd+K command palette, an on-page assistant, a live Pakistan clock and easter eggs (the ` key opens terminal mode; the Konami code fires confetti). All motion respects `prefers-reduced-motion`.

Lines marked `EDIT:` in `index.html` are drafts to personalise ("Currently learning", "Currently reading", "What I learned").

## Project files

- `index.html` — portfolio content and page structure.
- `portfolio.css` — colorful midnight / light themes, responsive layout, and 3D visual styling.
- `upgrade.css` — 2026 upgrade layer (bento, glass, letter motion, palette, chat, responsive and reduced-motion rules).
- `js/` — ES modules: `app.js` (entry), `text-motion.js`, `motion.js`, `widgets.js`, `palette.js`, `chatbot.js`, `confetti.js`, `hero3d.js` (lazy WebGL).
- `assets/og-image.jpg` — 1200×630 social preview image.
- `main.js` — theme control, mobile navigation, section reveals, certificate filtering and previews, and the email form.
- `Abdul_Razaque.pdf` — downloadable CV.
- `assets/certificates/` — original certificate scans used in the recognition section.
- `images/About.png` — portfolio portrait.

The theme toggle remembers the selected mode in local storage. The contact form opens a pre-filled email in the visitor's mail application; it does not send data to a server.
