# Abdul Razaque — Navy Blue Luxury Portfolio

A responsive portfolio with a deep navy, emerald, metallic gold and ivory palette; animated canvas starfield; CSS-built chrome 3D orb and orbital rings; glassmorphism; pointer-reactive 3D cards; scroll reveals; curated GitHub project links; CV; and original certificates.

## Open / deploy

Open `index.html` in a browser, or run `python -m http.server 8000` in this directory and visit `http://localhost:8000`.

For GitHub Pages, commit the contents of this directory to the Pages branch/repository root. No build system or API keys required. Google Fonts and Boxicons load from CDNs; the rest of the site works locally.

## Content sources / notes

- Projects are based on the supplied CV and the repos visible at `github.com/abrazzaq02` on 5 Nov 2026.
- LinkedIn links point to `linkedin.com/in/abdul-razaque-744a782a1/`. Detailed LinkedIn content is not asserted unless supported by the CV.
- 9 unique supplied certificates are displayed; a duplicate NYLP AI Hackathon image was omitted.
- The Alkaram Textile Mills letter verifies a Business Technology internship, listed under Experience. Its image is deliberately **not publicly displayed** because it contains a government ID number.
- Contact form opens the visitor's email app (there is no backend). No misleading success message.
- A CV is included as `Abdul_Razaque.pdf`.
- Motion is reduced automatically for visitors who request reduced motion. 3D pointer tilt activates on devices with a fine pointer.

## Edit content

Project cards, experience entries and certificate titles are in `index.html`; the navy luxury theme is in `luxury.css`; interactions are in `experience.js`. Originals `style.css`, `main.js` and `certifications.css` have been retained for reference and compatibility, but `main.js` is not loaded.
