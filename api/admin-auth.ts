import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = req.headers['x-admin-password'];

  if (!adminPassword || typeof provided !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (provided !== adminPassword) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(200).json({ ok: true });
}
