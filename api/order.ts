import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

type OrderItem = {
  product?: { id?: string; name?: string; price?: number };
  quantity?: number;
};

type OrderPayload = {
  id?: string;
  customer?: {
    emri?: string;
    mbiemri?: string;
    email?: string;
    adresa?: string;
    shteti?: string;
    qyteti?: string;
    otherCity?: string;
  };
  items?: OrderItem[];
  total?: number;
  date?: string;
  status?: 'pending' | 'completed';
};

const rateLimit = (() => {
  const hits = new Map<string, { count: number; ts: number }>();
  const windowMs = 60_000;
  const max = 10;
  return (ip: string) => {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.ts > windowMs) {
      hits.set(ip, { count: 1, ts: now });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count += 1;
    return true;
  };
})();

const formatMoney = (value?: number) => {
  const safe = typeof value === 'number' ? value : 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(safe);
};

const buildItemsText = (items: OrderItem[] = []) =>
  items
    .map((item) => {
      const name = item.product?.name ?? 'Item';
      const qty = item.quantity ?? 1;
      const price = formatMoney(item.product?.price);
      return `- ${name} x${qty} (${price} each)`;
    })
    .join('\n');

const buildItemsHtml = (items: OrderItem[] = []) =>
  items
    .map((item) => {
      const name = item.product?.name ?? 'Item';
      const qty = item.quantity ?? 1;
      const price = formatMoney(item.product?.price);
      return `<li><strong>${name}</strong> x${qty} <span>(${price} each)</span></li>`;
    })
    .join('');

const isValidEmail = (value?: string) =>
  typeof value === 'string' && value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sanitize = (value?: string, max = 200) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip)) {
    res.status(429).json({ error: 'Too Many Requests' });
    return;
  }

  const order: OrderPayload = req.body ?? {};

  const customer = order.customer ?? {};
  const email = sanitize(customer.email);
  if (!sanitize(customer.emri) || !sanitize(customer.mbiemri) || !isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid customer details' });
    return;
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    res.status(400).json({ error: 'Order items missing' });
    return;
  }

  const total = typeof order.total === 'number' && order.total >= 0 ? order.total : null;
  if (total === null) {
    res.status(400).json({ error: 'Invalid total' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const payload = {
    id: order.id,
    customer: {
      emri: sanitize(customer.emri, 80),
      mbiemri: sanitize(customer.mbiemri, 80),
      email,
      adresa: sanitize(customer.adresa, 200),
      shteti: sanitize(customer.shteti, 80),
      qyteti: sanitize(customer.qyteti, 80),
      otherCity: sanitize(customer.otherCity, 80),
    },
    items: order.items,
    total,
    date: order.date ?? new Date().toISOString(),
    status: 'pending',
  };

  const { error } = await supabase.from('orders').insert([payload]);
  if (error) {
    console.error('Order save failed', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    res.status(500).json({ error: 'Order save failed', details: error.message });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_EMAIL_FROM;
  const notifyTo = process.env.ORDER_NOTIFY_TO;
  if (resendKey && fromEmail && notifyTo) {
    try {
      const resend = new Resend(resendKey);
      const itemsText = buildItemsText(order.items);
      const itemsHtml = buildItemsHtml(order.items);
      const customerName = `${sanitize(customer.emri)} ${sanitize(customer.mbiemri)}`.trim() || 'Customer';
      const address = [
        sanitize(customer.adresa),
        customer.qyteti === 'other' ? sanitize(customer.otherCity) : sanitize(customer.qyteti),
        sanitize(customer.shteti),
      ]
        .filter(Boolean)
        .join(', ');

      await Promise.all([
        resend.emails.send({
          from: fromEmail,
          to: notifyTo,
          subject: `New order placed${order.id ? ` (#${order.id})` : ''}`,
          text: [
            `New order placed by ${customerName}`,
            email ? `Email: ${email}` : undefined,
            address ? `Address: ${address}` : undefined,
            '',
            'Items:',
            itemsText || '- (no items)',
            '',
            `Total: ${formatMoney(order.total)}`,
          ]
            .filter(Boolean)
            .join('\n'),
          html: `
            <h2>New order placed</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
            <h3>Items</h3>
            <ul>${itemsHtml || '<li>(no items)</li>'}</ul>
            <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
          `,
        }),
        resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Your Magie Skin order is confirmed',
          text: [
            `Hi ${customerName},`,
            '',
            'Thanks for your order! Here are the details:',
            '',
            itemsText || '- (no items)',
            '',
            `Total: ${formatMoney(order.total)}`,
            '',
            'We will contact you soon with delivery updates.',
          ]
            .filter(Boolean)
            .join('\n'),
          html: `
            <p>Hi ${customerName},</p>
            <p>Thanks for your order! Here are the details:</p>
            <ul>${itemsHtml || '<li>(no items)</li>'}</ul>
            <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
            <p>We will contact you soon with delivery updates.</p>
          `,
        }),
      ]);
    } catch (emailError) {
      console.error('Order email failed', emailError);
    }
  }

  res.status(200).json({ ok: true });
}
