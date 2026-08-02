/**
 * Arca Consultancy — Worker
 * Serves the static site (assets binding) and handles the contact form:
 * POST /api/contact → email to honor@arca-consultancy.com via Cloudflare Email Sending.
 *
 * NOTE: the `from` domain must be onboarded to Email Sending on this account.
 * Currently using tryopenclimb.com (onboarded); switch to arca-consultancy.com
 * once that zone is added and `wrangler email sending enable arca-consultancy.com` is run.
 */

const CONTACT_TO = 'honor@arca-consultancy.com';
const CONTACT_FROM = { email: 'noreply@tryopenclimb.com', name: 'Arca Website' };
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

      const text =
        'New inquiry via arca-consultancy.com\n\n' +
        'Name: ' + name + '\n' +
        'Brand: ' + brand + '\n' +
        'Website/Instagram: ' + website + '\n' +
        'Target market: ' + market + '\n\n' +
        'Message:\n' + message + '\n';

      try {
        await env.EMAIL.send({
          to: CONTACT_TO,
          from: CONTACT_FROM,
          subject: 'Introduction call — ' + (brand || name || 'new inquiry'),
          text: text,
        });
        return Response.json({ ok: true });
      } catch (err) {
        console.error('email send failed', err && err.message);
        return Response.json({ ok: false, error: 'send failed' }, { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
