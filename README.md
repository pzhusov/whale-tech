# WHALE TECH — Corporate Website

Dubai-based IT consulting, e-commerce, and data classification & analytics. Single-page corporate site.

**Live:** deployed on Vercel (auto-deploys from `main`).

## Stack

- Pure HTML5 / CSS3 / vanilla JS — no frameworks, no build step
- Inline SVG for graphics
- Google Fonts (Inter + Space Grotesk) for typography
- Formspree for contact form submissions

## Structure

```
whale-tech/
├── index.html         # Single-page site, all 5 sections
├── styles.css         # Design system, responsive
├── script.js          # Mobile menu, scroll, AJAX form
├── content.md         # Source copy (English)
└── assets/
    ├── logo.svg
    └── favicon.svg
```

## Sections

1. Home (hero + stats + services overview)
2. `#consulting` — Technology Consulting
3. `#ecommerce` — E-commerce Solutions
4. `#data` — Data Classification & Analytics
5. `#about` — About + Capabilities + Why WHALE TECH + Licensing
6. `#contact` — Contact + form

## Contact form

Wired to Formspree endpoint `https://formspree.io/f/mrewppak` via AJAX submission. The endpoint and notification recipient are managed in the Formspree dashboard, not in code.

If you change the domain, update **Restrict to Domain** in the Formspree project settings.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

Pushes to `main` trigger Vercel to redeploy automatically.

## License

Private — WHALE TECH — FZCO. All rights reserved.