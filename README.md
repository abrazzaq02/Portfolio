# Abdul Razaque — AI Engineering Portfolio

A responsive, single-page portfolio for Abdul Razaque, an Artificial Intelligence student at Aror University in Sukkur, Pakistan. It highlights projects, technical skills, internships, education, certificates, and contact links.

## Run locally

This is a static site with no build step or package installation required. From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Project files

- `index.html` — portfolio content and page structure.
- `portfolio.css` — colorful midnight / light themes, responsive layout, and 3D visual styling.
- `main.js` — theme control, mobile navigation, section reveals, certificate filtering and previews, and the email form.
- `Abdul_Razaque.pdf` — downloadable CV.
- `assets/certificates/` — original certificate scans used in the recognition section.
- `images/About.png` — portfolio portrait.

The theme toggle remembers the selected mode in local storage. The contact form opens a pre-filled email in the visitor's mail application; it does not send data to a server.
