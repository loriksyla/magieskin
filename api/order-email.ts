import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

type OrderItem = {
  product?: { name?: string; price?: number };
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
};

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_EMAIL_FROM;
  const notifyTo = process.env.ORDER_NOTIFY_TO;

  if (!apiKey || !fromEmail || !notifyTo) {
    res.status(500).json({ error: 'Missing email configuration' });
    return;
  }

  const order: OrderPayload = req.body ?? {};
  const customerName = `${order.customer?.emri ?? ''} ${order.customer?.mbiemri ?? ''}`.trim() || 'Customer';
  const customerEmail = order.customer?.email;
  const itemsText = buildItemsText(order.items);
  const itemsHtml = buildItemsHtml(order.items);
  const address = [
    order.customer?.adresa,
    order.customer?.qyteti === 'other' ? order.customer?.otherCity : order.customer?.qyteti,
    order.customer?.shteti,
  ]
    .filter(Boolean)
    .join(', ');

  const resend = new Resend(apiKey);

  const adminSubject = `New order placed${order.id ? ` (#${order.id})` : ''}`;
  const adminText = [
    `New order placed by ${customerName}`,
    customerEmail ? `Email: ${customerEmail}` : undefined,
    address ? `Address: ${address}` : undefined,
    order.date ? `Date: ${order.date}` : undefined,
    '',
    'Items:',
    itemsText || '- (no items)',
    '',
    `Total: ${formatMoney(order.total)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const adminHtml = `
    <h2>New order placed</h2>
    <p><strong>Customer:</strong> ${customerName}</p>
    ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ''}
    ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
    ${order.date ? `<p><strong>Date:</strong> ${order.date}</p>` : ''}
    <h3>Items</h3>
    <ul>${itemsHtml || '<li>(no items)</li>'}</ul>
    <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
  `;

  const customerSubject = 'Your Magie Skin order is confirmed';
  const customerText = [
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
    .join('\n');

  const customerHtml = `
    <p>Hi ${customerName},</p>
    <p>Thanks for your order! Here are the details:</p>
    <ul>${itemsHtml || '<li>(no items)</li>'}</ul>
    <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
    <p>We will contact you soon with delivery updates.</p>
  `;

  try {
    const sendPromises = [
      resend.emails.send({
        from: fromEmail,
        to: notifyTo,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      }),
    ];

    if (customerEmail) {
      sendPromises.push(
        resend.emails.send({
          from: fromEmail,
          to: customerEmail,
          subject: customerSubject,
          text: customerText,
          html: customerHtml,
        }),
      );
    }

    await Promise.all(sendPromises);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email send failed', error);
    res.status(500).json({ error: 'Email send failed' });
  }
}
