# CLAUDE.md — Arca Consultancy Landing Page

## What this is

One-page marketing site for **Arca Consultancy** (arca-consultancy.com) — a
London-based fashion consultancy (founder: **Honor Ripley**) taking
luxury/contemporary brands (Latin American focus) into international retail.
Live: https://arca-landingpage.ms-45f.workers.dev
Repo: https://github.com/sass-workspace/arca-landingpage

## Design source of truth

**The design handoff bundle** (`~/Downloads/design_handoff_arca_site/`) —
`README.md` (spec) + `Arca Landing.dc.html` (prototype) + `Arca Brand
Guidelines.dc.html` (CI sheet). This implementation follows the prototype
1:1. Where the handoff README's prose and the prototype disagree, **the
prototype wins** (e.g. proof section: stories left / Ola Azul image right,
walls full-width below as marquees).

Do NOT redesign from memory or from other versions in the Claude design
project — "Arca Landing v2" (editorial/orange direction) was explicitly
rejected by the client.

## Stack & structure

Static front-end + one Cloudflare Worker. No framework, no build step.
Every file below is load-bearing — nothing unused is kept in the repo.

```
index.html          landing page: seven sections + sticky header + footer
brand/index.html    brand guidelines & CI sheet (/brand/, noindex)
css/style.css       landing tokens, components, responsive (900px / 560px)
css/brand.css       guidelines page styles
js/site.js          marquees, reveals, connector lines, video triggers, form
src/worker.js       serves assets + POST /api/contact → email
assets/logos/       20 client/press marks + arca-wordmark-cream.png
                    (glyph heights: header 15/13px, footer 18px; never the
                    badge version, never in a container shape)
assets/buyers/      12 buyer marks — the cleaned .png set only
assets/images/      2 videos, portrait, campaign image, grain tile
favicon/            16/32/48/180/192/512 PNG set (cream wordmark on blue)
social/             og-image-en.png / og-image-es.png (1200×630)
site.webmanifest    PWA manifest (theme #08177E)
wrangler.jsonc      Worker + assets binding + send_email binding
.assetsignore       keeps repo/meta files out of the deployed assets
```

Local dev: `npx wrangler dev` (form works) or `python3 -m http.server`
(static only). Deploy: `npx wrangler deploy`.

Rule: when adding an asset, reference it or don't commit it. When removing
a feature, remove its files. Re-run the unused check before big commits:
every file in assets/ must be greppable from index.html/brand/css/js/src.

## Form backend

`POST /api/contact` → Cloudflare Email Sending → **honor@arca-consultancy.com**.
`from` is currently `noreply@tryopenclimb.com` (the only domain onboarded to
Email Sending on this account). When `arca-consultancy.com` is added to
Cloudflare: `npx wrangler email sending enable arca-consultancy.com`, then
update `CONTACT_FROM` in `src/worker.js`.

## Brand system (canonical: /brand/ — the live CI sheet; keep it updated whenever the system changes)

- **Arca Blue `#08177E`** · **Arca Cream `#FFFDF3`** (never pure white on
  blue) · Card Cream `#FCFBF4` · TODO Yellow `#F7C948` (never ships)
- Cormorant Garamond (display) + DM Sans (text/UI); five type sizes
- One button style (cream pill); no drop shadows except the header bar
- Logos rendered monochrome via CSS filters (`--f-cream`, `--f-blue`);
  sources are black-on-transparent, sized optically (each height in site.js)
- Band rhythm: cream → cream → cream → BLUE → cream → cream → BLUE

## Motion (implemented per prototype)

- Scroll-snap `y mandatory` desktop, **disabled ≤900px**
- Reveals: `[data-rv]` fade-up once (26px / .8s, threshold .12)
- Marquees: 32s/42s/38s-reverse, 2× duplicated rows, never pause
- Collection video plays ONCE when centered in viewport (±25% innerHeight)
- Services connector lines: L-shaped 1px divs, staggered draw-in
  (i×900ms, +500ms horizontal), redrawn on resize, desktop only
- Steps ≤900px: horizontal snap rail, cards 76% wide, edge-bleed 22px

## Accessibility layer (invisible — preserve it)

All of these change nothing visually; do not strip them during edits:
skip-link (.skip-link, appears on keyboard focus), <main> landmark,
aria-labels on the five form fields and both Instagram icon links,
aria-hidden on decorative videos and on the marquee's duplicate logo
set (the seamless-loop copy), :focus-visible outlines (form fields
excepted — their focus state is the underline per spec).

## Content rules

- Copy is source-of-truth from the handoff — never rewrite or "improve"
- Unconfirmed content ships as visible chips on `#F7C948`: three founder
  `[[placeholders]]`, Isobelle `[[surname/role]]`, one Francques TODO —
  resolve or remove before launch, never silently
- No invented clients/numbers/testimonials; no emoji; no exclamation marks
- Banned words: elevate, unlock, seamless, empower, transform your brand

## Future adjustments — do not forget

- **Domain switch (arca-consultancy.com):** update `og:url` + `og:image`
  absolute URLs in index.html, `CONTACT_FROM` in src/worker.js, and run
  `npx wrangler email sending enable arca-consultancy.com`. Add the custom
  domain to the Worker.
- **/brand/ is the living CI sheet** — any change to colors, type, spacing,
  components or motion on the site MUST be mirrored on /brand/ in the same
  commit. If they diverge, /brand/ is wrong and the change was incomplete.
- **OG images** are rendered with system font stand-ins — re-render from the
  design file with real Cormorant Garamond/DM Sans when brand type matters.
- **Spanish OG copy** (social/og-image-es.png + the es_ES snippet in the
  export README) is an unreviewed translation — brand review before an ES
  page ships. ES meta tags are NOT yet in index.html (EN only until i18n).
- **Favicon rule:** the square favicon is the ONLY permitted container for
  the wordmark. Everywhere else: no container shapes.

## Open before launch

1. Founder placeholders + Isobelle role + Francques claim (ask Honor)
2. Onboard arca-consultancy.com for email + custom domain routing
3. Third-party logo permissions: client/buyer/press marks belong to their
   owners — Honor confirmed use (Aug 2026), keep the paper trail
4. ES version (toggles are UI-only)
