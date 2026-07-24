// Server-side proxy to the BGrowth Publishing Engine (lives in bgrowth-portal).
// Studio's frontend never holds PORTAL_PUBLISHING_ENGINE_SECRET — it calls
// this function, which attaches the secret server-side, exactly like the
// existing GAS proxy (api/gas-proxy-post.js) never exposes GAS internals to
// the browser either.

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // cover images arrive as base64
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const portalUrl = process.env.PORTAL_PUBLISHING_ENGINE_URL;
  const secret = process.env.PORTAL_PUBLISHING_ENGINE_SECRET;

  if (!portalUrl || !secret) {
    return res.status(500).json({
      ok: false,
      error: 'PORTAL_PUBLISHING_ENGINE_URL / PORTAL_PUBLISHING_ENGINE_SECRET are not configured on Studio.',
    });
  }

  try {
    const response = await fetch(portalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishing-engine-secret': secret,
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
