# CLAUDE.md — Arca Consultancy Landing Page

## What this is

One-page marketing site for **Arca Consultancy** (arca-consultancy.com) — a
London-based fashion consultancy (founder: **Honor Ripley**) that takes
luxury/contemporary fashion brands into international wholesale. Showrooms in
Paris, London & New York. Single conversion goal: a qualified brand founder
sends an inquiry.

## Stack & structure

Plain static site — **no framework, no build step**. Don't introduce one
without being asked.

```
index.html        all 7 sections + footer (semantic, sections in order below)
css/style.css     full design system + responsive (breakpoints: 1024/860/560)
js/site.js        logo walls (from config arrays), scroll reveals, hero video,
                  form mailto handoff
assets/logos/     client + press logos (recolored cream via CSS filter)
assets/buyers/    12 retailer logos (Harrods, Net-A-Porter, …)
assets/images/    hero video, specimen texture, grain, placeholders
```

Local dev: `python3 -m http.server` → localhost:8000.

## Design source of truth

The design lives in the Claude design project **"Arca Consultancy landing
page"** (id `62f6dacf-6859-4786-a635-c32b0163c8e0`), reachable via the
DesignSync tool. Two files there:

- `Arca Landing v2.dc.html` — **current visual direction** (editorial):
  full-bleed hero + overlay header, COLLECTION specimen SVG, ruled services
  list, static logo walls, pin+dot process steps, uppercase outline buttons.
- `Arca Landing.dc.html` — older direction (pill buttons, marquees) but was
  the first to carry corrected content.

This repo = **v2 visuals + corrected content** (content wins over whatever a
design file says — see next section).

## Content rules (important)

Facts come from Arca's official portfolio PDF (authoritative) — summarized in
`arca-design-project-brief.md` in the design project's uploads. Key locked-in
facts:

- Positioning: "We build fashion brands ready for international growth"
  (global, NOT LatAm-only — LatAm/Colombiamoda is one strength)
- Founder: Honor Ripley, London. Contact: honor@arca-consultancy.com,
  +44 7896 976515. Footer cities: London — Paris — New York.
- Stats (publishable): 3,000+ retail relationships · 600+ accounts managed ·
  2× season wholesale growth · 60%+ e-commerce growth
- Process: FOUR steps (Immersion / Insight & Direction / Refinement /
  International Launch)
- Testimonial: Pitusa founder quote (verbatim, do not paraphrase)
- Never invent numbers, clients, or testimonials. Unconfirmed claims stay as
  visible `[[ todo ]]` tags — do not silently resolve them.
- The stat tiles were removed from the proof section to match the v2 design;
  the numbers live in the buyer-wall caption. Do not re-add tiles without a
  design-project update.

## Motion system

- Scroll-snap: `y proximity` on html, sections snap-align start ("slide"
  feel; proximity NOT mandatory — mandatory trapped the footer 16px short).
- Reveal-on-scroll: `[data-rv]` fades up once via IntersectionObserver.
- Specimen video: plays ONCE when its vertical center is within ±25% of
  the viewport center; static SVG is the no-asset/error fallback.

## Brand system (non-negotiable)

- **Arca Blue `#08177E`** and **Arca Cream `#FFFDF3`** — type on blue is
  always cream, NEVER pure `#FFFFFF`.
- Fonts: **Cormorant Garamond** (display serif, ≥28px only) +
  **DM Sans** (body/UI). Exactly two families.
- Logo: lowercase "arca" wordmark (`assets/logos/arca-wordmark.png`) —
  never in a circle, never re-typed in another font.
- UI language: uppercase letterspaced (.16–.22em) small labels, 1px outline
  buttons, square corners. No drop shadows, no rounded cards, no icons/emoji.
- Logo walls render monochrome cream via `filter: var(--f-cream)`.

## Open items (blocking launch)

1. **Assets**: Honor portrait (`honor-portrait-placeholder.svg` is a stub),
   Cult Mia/SER placement image (bordered placeholder in proof section),
   Casa SER texture for specimen section (interim: Ola Azul campaign),
   SER Miami hero image (hero is the v2 warm block `#C96F3B` until then),
   `assets/images/collection-animate.mp4` (specimen section upgrades from
   static SVG to the animation automatically once the file exists —
   plays once when centered in viewport), vector wordmark (current PNG
   is 260px). Logo files still needed: SER, Mai Petit, lululemon wordmark
   (all three currently render as styled text in the client wall; the
   fetched mai-petit.gif was a WRONG logo and was removed; ser-cream.png
   kept corrupting in transfer — export manually from the design project).
2. **Copy**: founder statement placeholders ([[X years]] etc.), Isobelle's
   surname/role, Francques order-record claim, WhatsApp yes/no, ES version.
3. **Form**: currently `mailto:` — needs real endpoint (Formspree or
   Cloudflare Worker) before launch.
4. **Sign-offs from Honor**: hero positioning wording.
   (Buyer/partner logo use: CONFIRMED by Honor, Aug 2026.)

## History / related material

Research artifacts (IG scrape, competitor analysis, logo manifests) live in
`../scraping/` — see `arca-design-project-brief.md` and
`arca-instagram-audit.md` there for the full background.
