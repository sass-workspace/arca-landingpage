# Arca Consultancy — Landing Page

Static one-page site for [arca-consultancy.com](https://arca-consultancy.com).
Implementation of `Arca Landing v2.dc.html` (editorial direction) from the Claude design project
("Arca Consultancy landing page"), rebuilt as dependency-free HTML/CSS/JS.

## Stack

Plain static site — no build step, no framework.

- `index.html` — all seven sections + header/footer
- `css/style.css` — design system (Arca Blue `#08177E`, Arca Cream `#FFFDF3`,
  Cormorant Garamond display / DM Sans body) + responsive breakpoints
- `js/site.js` — logo marquees, scroll reveals, service connector lines,
  video behaviour, contact form
- `assets/` — logos (clients, buyers, press), images, video

Run locally: `python3 -m http.server` in the repo root → http://localhost:8000

## Pending assets (placeholders in place)

| Asset | Status |
|---|---|
| `assets/images/honor-portrait.png` | **Missing** — placeholder SVG shown. Export the portrait from the design project (`images/honor-portrait.png`) or use an original photo, then update the `<img>` in the founder section. |
| `assets/images/collection-animate.mp4` | **Missing** — the section hides itself gracefully. Export from design project (`images/collection-animate.mp4`). |
| Hero video | Using Instagram-compressed `summer-palette.mp4` (226 KB). Ask for the original export for crisper full-bleed playback. |
| Ola Azul campaign image | 1080×1350 from Instagram — fine at half-width; request original for retina. |
| Arca wordmark | 260×140 screenshot — **request vector/large export from Honor** (used in header + footer). |

## Pending content (marked with yellow TODO chips on the page)

- Founder statement placeholders: `[[X years]]`, `[[buying/design/production]]`, `[[cities]]`
- Isobelle's surname/role
- Francques claim: "their strongest order season to date" — unconfirmed, currently omitted
- ES translation (toggle is UI-only)

## Form

Submits via `mailto:` to honor@arca-consultancy.com as an interim solution.
Replace with a real endpoint (Formspree/Cloudflare Worker/etc.) before launch —
see `js/site.js`, the `contact-form` handler.

## Trademark note

Buyer-relationship and partner logo use confirmed by Honor (Aug 2026).
