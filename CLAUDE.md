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

```
index.html      seven sections + sticky header + footer
css/style.css   tokens, components, responsive (900px / 560px)
js/site.js      marquee fill, reveals, connector lines, video triggers, form
src/worker.js   serves assets + POST /api/contact → email
assets/         logos/ buyers/ images/ — copied AS-IS from the handoff
                (background-keyed; buyers use the .png cleaned set;
                 wordmark = arca-wordmark-cream.png at GLYPH heights:
                 header 15px/13px, footer 18px — never the badge version)
wrangler.jsonc  Worker + assets binding + send_email binding
```

Local dev: `npx wrangler dev` (form works) or `python3 -m http.server`
(static only). Deploy: `npx wrangler deploy`.

## Form backend

`POST /api/contact` → Cloudflare Email Sending → **honor@arca-consultancy.com**.
`from` is currently `noreply@tryopenclimb.com` (the only domain onboarded to
Email Sending on this account). When `arca-consultancy.com` is added to
Cloudflare: `npx wrangler email sending enable arca-consultancy.com`, then
update `CONTACT_FROM` in `src/worker.js`.

## Brand system (from the handoff — canonical in Arca Brand Guidelines.dc.html)

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

## Content rules

- Copy is source-of-truth from the handoff — never rewrite or "improve"
- Unconfirmed content ships as visible chips on `#F7C948`: three founder
  `[[placeholders]]`, Isobelle `[[surname/role]]`, one Francques TODO —
  resolve or remove before launch, never silently
- No invented clients/numbers/testimonials; no emoji; no exclamation marks
- Banned words: elevate, unlock, seamless, empower, transform your brand

## Open before launch

1. Founder placeholders + Isobelle role + Francques claim (ask Honor)
2. Onboard arca-consultancy.com for email + custom domain routing
3. Third-party logo permissions: client/buyer/press marks belong to their
   owners — Honor confirmed use (Aug 2026), keep the paper trail
4. ES version (toggles are UI-only)
