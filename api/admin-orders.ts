import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
};

const isAuthorized = (req: VercelRequest) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = req.headers['x-admin-password'];
  return adminPassword && typeof provided === 'string' && provided === adminPassword;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Admin orders fetch failed', error);
      res.status(500).json({ error: 'Failed to load orders' });
      return;
    }

    res.status(200).json({ data: data ?? [] });
    return;
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body ?? {};
    if (!id || (status !== 'pending' && status !== 'completed')) {
      res.status(400).json({ error: 'Invalid update payload' });
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Admin order update failed', error);
      res.status(500).json({ error: 'Failed to update order' });
      return;
    }

    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
