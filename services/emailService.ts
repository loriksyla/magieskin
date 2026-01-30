import { Order } from '../types';

export const sendOrderEmails = async (order: Order): Promise<void> => {
  try {
    await fetch('/api/order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch (error) {
    console.error('Order email request failed', error);
  }
};
