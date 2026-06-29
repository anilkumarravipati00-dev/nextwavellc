# NextWave Services LLC — Marketing Website

Premium single-page marketing site for NextWave Services LLC (US-based technology
consulting & IT staffing). Built with plain HTML, CSS and JavaScript — no build step,
no dependencies. Deploy by uploading the folder to any static host.

## Structure
```
index.html        # all page markup + SEO meta, Open Graph, JSON-LD
styles.css        # design system + responsive styles
script.js         # nav, mobile menu, counters, signal-line, FAQ, form, scroll-spy
robots.txt
sitemap.xml
assets/
  logo/nextwave.png
  img/            # optimized section imagery (hero, trust, about, tech, why, commitment, cta)
```

## Design
- Palette & typography derived from the brand logo (two-tone blue wave).
- Fonts: Sora (display), IBM Plex Sans (body), IBM Plex Mono (labels) via Google Fonts.
- Signature motif: a rising "signal line" pulled from the logo's waVe peak — animated in
  the hero and reused as section dividers.

## Notes
- The contact form is front-end only (shows a confirmation on submit). To capture leads,
  point the form at your provider (e.g. Formspree, Netlify Forms) or a backend endpoint.
- Update contact details, legal links, and the canonical/OG domain before going live.
- Images are compressed for fast loading; originals were supplied separately.

## Deploy
Upload everything to Netlify, Vercel, GitHub Pages, S3/CloudFront, or any web host.
No server-side runtime required.

© 2026 NextWave Services LLC.
