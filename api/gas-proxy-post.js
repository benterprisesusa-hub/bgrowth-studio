export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const GAS_URL = process.env.VITE_GAS_URL ||
    'https://script.google.com/macros/s/AKfycbxpzLWLE_rv6u-pYRx8PuclAkvyf3wYTHioSxG789Bjhe-faVVfFkmxe1g3CkgtA8ut/exec';

  const body = req.body || {};

  try {
    // GAS aceita form-encoded no POST
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, String(value));
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'BGrowth-Studio-Proxy/1.0',
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    const text = await response.text();

    // Verificar se o GAS retornou HTML de erro
    if (text.trim().startsWith('<')) {
      res.status(500).json({ ok: false, error: 'GAS returned HTML instead of JSON. Check doPost implementation.' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
