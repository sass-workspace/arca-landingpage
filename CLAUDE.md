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
index.html          landing page (EN): seven sections + sticky header + footer
es/index.html       the same page in Latin American Spanish, served at /es/
brand/index.html    brand guidelines & CI sheet (/brand/, noindex)
css/style.css       landing tokens, components, responsive (900px / 560px)
css/brand.css       guidelines page styles
js/site.js          marquees, reveals, connector lines, video triggers, form
src/worker.js       serves assets + POST /api/contact → email
robots.txt          allows all, disallows /brand/, points at the sitemap
sitemap.xml         both language URLs with reciprocal hreflang alternates
assets/logos/       23 client/press marks + arca-wordmark-cream.png
                    (glyph heights: header 15/13px, footer 18px; never the
                    badge version, never in a container shape)
assets/buyers/      12 buyer marks — the cleaned .png set only
assets/images/      2 videos, portrait (jpg), campaign image, grain tile
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
every file in assets/ must be greppable from index.html/es/brand/css/js/src.

**Asset paths are root-absolute** (`/css/…`, `/js/…`, `/assets/…`), in the
markup and in `js/site.js`. They have to be — relative paths resolve against
`/es/` and 404. Never reintroduce a relative one.

**i18n is two hand-maintained pages, no build step.** A copy change must be
made in both `index.html` and `es/index.html`, or the languages drift. The
only user-facing strings in JS are the two contact-form results, in the `COPY`
map in `js/site.js`, keyed off `<html lang>`.

## Form backend

`POST /api/contact` → Cloudflare Email Sending → **honor@arca-consultancy.com**.
`from` is currently `noreply@tryopenclimb.com` (the only domain onboarded to
Email Sending on this account). When `arca-consultancy.com` is added to
Cloudflare: `npx wrangler email sending enable arca-consultancy.com`, then
update `CONTACT_FROM` in `src/worker.js`.

## Brand system (canonical: /brand/ — the live CI sheet; keep it updated whenever the system changes)

- **Arca Blue `#08177E`** · **Arca Cream `#FFFDF3`** (never pure white on
  blue) · Card Cream `#FCFBF4` · TODO Yellow `#F7C948` (never ships)
- Cormorant Garamond (display) + DM Sans (text/UI); five type sizes. All display
  headings share `--ls-display` / `--lh-display` — never set tracking or leading
  per heading, that is what drifted and got flagged in review
- One button style (cream pill); no drop shadows except the header bar
- Logos rendered monochrome via CSS filters (`--f-cream`, `--f-blue`); sources
  are black-on-transparent. **Sized and centred on the cap band, not the
  bounding box** — one ~19px cap height across every row, `w` from the file's
  aspect, `dy` to put the cap band on the row centre (see the header comment in
  `js/site.js`). Box-centring is what made the walls look ragged in review:
  SER's tagline and Mialé's accent pushed their letterforms off the line.
  Signatures/monograms/lockups have no cap band — those are set by eye
- Band rhythm: cream → cream → cream → BLUE → cream → cream → BLUE

## Motion (implemented per prototype)

- **No vertical section snap.** Both the CSS scroll-snap and the later JS
  snap-assist were removed after client review — settling near a section edge
  pulled the page back and read as bouncing. Only anchor clicks are eased
  (rAF, cancelled by any wheel/touch/key). Do not reintroduce it.
  The horizontal card rails ≤900px keep `scroll-snap-type: x mandatory`
- Reveals: `[data-rv]` fade-up once (26px / .8s, threshold .12)
- Marquees: 32s/42s/38s-reverse, 2× duplicated rows, never pause — and, by
  client decision (Aug 2026), they keep running under
  `prefers-reduced-motion: reduce` too. That is a deliberate a11y exception,
  not an oversight; every other animation on the page still honours it.
  `.marquee` carries `will-change: transform` on purpose: the row animates
  inside a `mask-image` parent, which can disqualify the transform from the
  compositor and drop it to the main thread, where jank reads as a frozen
  strip. Do not remove it. The `-50%` loop is only seamless because
  `padding-right` supplies the trailing gap for the second set — half the
  row width must equal exactly one content set
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

- **The site is bilingual. Every content change ships in both languages, in the
  same commit.** `index.html` (EN) and `es/index.html` (ES) are hand-maintained
  twins — there is no build step and nothing generates one from the other. If
  you edit a sentence, add or delete a list item, retitle a heading, swap an
  image, change an `alt`, or touch a meta tag in one file, make the matching
  change in the other *before* you commit. A change that lands in one language
  only is not half done, it is broken: the toggle puts the two pages one click
  apart and the gap is immediately visible to the client.
  - **Must stay identical:** section order and IDs (`#top`, `#about`,
    `#services`, `#work`, `#contact`), every class the CSS or JS targets, the
    number of `.highlights` items (the connector stagger has one `--i` rule per
    item in `css/style.css`), form field `name`s (the Worker reads them by
    name), and asset paths.
  - **Intentionally different:** `<html lang>`, `<title>`, meta description,
    `og:locale` / `og:url` / `og:image`, `canonical`, which side of the toggle
    is the link, and `.keep-together` — EN only, because the Spanish headline
    is too long to pin (see the comment in `es/index.html`).
  - User-facing strings in JS live in the `COPY` map in `js/site.js`, keyed off
    `<html lang>`. A new string there needs an entry per language.
  - Spanish is **Latin American** Spanish, not Castilian. No `vosotros`.
- Copy is source-of-truth from the handoff — never rewrite or "improve"
- Unconfirmed content ships as visible `.chip-todo` chips on `#F7C948` — resolve
  or remove before launch, never silently. **None on the page right now** — the
  founder `[[placeholders]]` and the six missing client logos are all resolved.
  Keep `.chip-todo` in the CSS; it is the convention for the next gap.
- No invented clients/numbers/testimonials; no emoji; no exclamation marks
- Banned words: elevate, unlock, seamless, empower, transform your brand

## Future adjustments — do not forget

- **Domain switch (arca-consultancy.com)** — every absolute URL on the site is
  `arca-landingpage.ms-45f.workers.dev`. One find-and-replace across the repo
  catches them all; this is the checklist to verify afterwards:
  - `index.html` and `es/index.html`: `og:url`, `og:image`, `canonical`, all
    three `hreflang` links, and the **JSON-LD** block (`@id`, `url`, `logo`,
    `image`)
  - `robots.txt`: the `Sitemap:` line
  - `sitemap.xml`: both `<loc>` and all six `<xhtml:link href>`
  - `src/worker.js`: `CONTACT_FROM`, then run
    `npx wrangler email sending enable arca-consultancy.com`
  - Add the custom domain to the Worker
  - Verify: `curl -s <domain>/sitemap.xml` and re-check the pair of pages still
    reference each other reciprocally in `hreflang`
- **/brand/ is the living CI sheet** — any change to colors, type, spacing,
  components or motion on the site MUST be mirrored on /brand/ in the same
  commit. If they diverge, /brand/ is wrong and the change was incomplete.
- **`es/index.html` is the other half of the site** — any change to copy,
  structure or content on `index.html` MUST be mirrored there in the same
  commit, and vice versa. Same rule as /brand/, same consequence: if they
  diverge, the change was incomplete. Full checklist under "Content rules".
- **OG images** are rendered with system font stand-ins — re-render from the
  design file with real Cormorant Garamond/DM Sans when brand type matters.
- **`social/og-image-es.png`** is an unreviewed translation and is now live on
  `/es/`. Re-render it whenever the Spanish hero copy changes, and get it
  reviewed alongside the page copy.
- **Favicon rule:** the square favicon is the ONLY permitted container for
  the wordmark. Everywhere else: no container shapes.

## Open before launch

1. Onboard arca-consultancy.com for email + custom domain routing
2. **Decided, do not re-raise:** three of the seven 2026 Highlights restate the
   numbers in the stats row directly above (600+, 2×, 60%). Kept deliberately —
   the stats are the headline figures and the highlights explain them further.
3. **Spanish copy: one client review pass done (Aug 2026)**, which corrected
   wording, gender agreement and terminology. Standing conventions from that
   pass: thousands are Colombia-style (`3.000+`); "retailers" not "retail" for
   relationships; industry terms deliberately left in English (sourcing,
   fashion week, swimwear, chainmail, line sheets, sell-in, DTC, SKU,
   e-commerce, pop-ups, showroom). Not yet reviewed: `social/og-image-es.png`,
   which still carries the pre-review hero wording.

Third-party logo permissions: client/buyer/press marks belong to their owners —
Honor confirmed use for the full current set including the five marks added in
the Aug 2026 round (Valentina Quintero, Maygel Coronel, Soloio, Casabela,
kibys). Keep the paper trail.

Note on `collection-animate.mp4`: it is a baked video with no editable source in
the handoff — any text change in that diagram means a re-export from the designer,
not a code edit. (It read "Buyers" until the Aug 2026 re-export to "Orders".)
