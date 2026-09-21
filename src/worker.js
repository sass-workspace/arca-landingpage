/**
 * Arca Consultancy — Worker
 * Serves the static site (assets binding) and handles the contact form:
 * POST /api/contact → relayed to the elbDev-account Worker, which emails
 * honor@arca-consultancy.com via Cloudflare Email Sending.
 *
 * NOTE: this account is on Workers Free, where Email Sending is not available,
 * and Email Routing is off the table — onboarding it replaces the root MX and
 * breaks the Google mailbox. Once this account is on Workers Paid: run
 * `wrangler email sending enable arca-consultancy.com`, restore the
 * `send_email` binding and send from here instead of relaying.
 */

const CONTACT_RELAY = 'https://arca-landingpage.ms-45f.workers.dev/api/contact';
const MAX_FIELD = 2000;

function clean(v) {
  return (typeof v === 'string' ? v : '').slice(0, MAX_FIELD).trim();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return Response.json({ ok: false, error: 'method not allowed' }, { status: 405 });
      }
      let data;
      try {
        data = await request.json();
      } catch {
        return Response.json({ ok: false, error: 'invalid body' }, { status: 400 });
      }
      const name = clean(data.name);
      const brand = clean(data.brand);
      const website = clean(data.website);
      const market = clean(data.market);
      const message = clean(data.message);

      if (!name && !brand && !message) {
        return Response.json({ ok: false, error: 'empty submission' }, { status: 400 });
      }

      try {
        const res = await fetch(CONTACT_RELAY, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, brand, website, market, message }),
        });
        if (!res.ok) throw new Error('relay responded ' + res.status);
        return Response.json({ ok: true });
      } catch (err) {
        console.error('contact relay failed', err && err.message);
        return Response.json({ ok: false, error: 'send failed' }, { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
