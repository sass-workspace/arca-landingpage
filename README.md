# Arca Consultancy — Landing Page

One-page marketing site for [arca-consultancy.com](https://arca-consultancy.com).
Implementation of the design handoff (`Arca Landing.dc.html` + handoff README).

**Live:** https://arca-landingpage.ms-45f.workers.dev
**Brand guidelines:** https://arca-landingpage.ms-45f.workers.dev/brand/

## Stack

Static HTML/CSS/JS + one Cloudflare Worker (assets + contact form email).

- `index.html` / `css/style.css` / `js/site.js` — the page
- `src/worker.js` — `POST /api/contact` → honor@arca-consultancy.com
  via Cloudflare Email Sending
- `assets/` — production assets from the design handoff, copied as-is

## Develop & deploy

```bash
npx wrangler dev      # local, with working form
npx wrangler deploy   # production
```

See `CLAUDE.md` for the full spec, brand system, and open items.
