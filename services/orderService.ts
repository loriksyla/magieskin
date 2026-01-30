import { Order } from '../types';
import { getAdminPassword } from './authService';

const STORAGE_KEY = 'magie_skin_data_secure';

// Helper to encode/decode for local storage fallback
const encodeData = (data: any): string => {
  try { return btoa(JSON.stringify(data)); } catch (e) { return ''; }
};
const decodeData = (str: string): any => {
  try { return JSON.parse(atob(str)); } catch (e) { return []; }
};

export const getOrders = async (): Promise<Order[]> => {
  const adminPassword = getAdminPassword();
  if (adminPassword) {
    try {
      const response = await fetch('/api/admin-orders', {
        headers: { 'x-admin-password': adminPassword },
      });
      if (!response.ok) {
        throw new Error('Admin orders request failed');
      }
      const payload = await response.json();
      return (payload.data ?? []) as Order[];
    } catch (e) {
      console.error("Admin orders fetch error:", e);
    }
  }

  // 2. Fallback to Local Storage (Demo Mode)
  return new Promise((resolve) => {
    try {
      console.warn("Using Local Storage (Data will not sync across devices)");
      const stored = localStorage.getItem(STORAGE_KEY);
      resolve(stored ? decodeData(stored) : []);
    } catch (e) {
      console.error("Local storage error", e);
      resolve([]);
    }
  });
};

export const saveOrder = async (order: Order): Promise<void> => {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Order API failed');
    }

    return;
  } catch (e) {
    console.error("Order API error:", e);
    if (import.meta.env.DEV) {
      return new Promise((resolve) => {
        try {
          const currentOrders = localStorage.getItem(STORAGE_KEY);
          const orders = currentOrders ? decodeData(currentOrders) : [];
          const updatedOrders = [order, ...orders];
          localStorage.setItem(STORAGE_KEY, encodeData(updatedOrders));
          resolve();
        } catch (e) {
          console.error("Local storage save error", e);
          resolve();
        }
      });
    }
    throw e;
  }
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed'): Promise<void> => {
  const adminPassword = getAdminPassword();
  if (adminPassword) {
    try {
      const response = await fetch('/api/admin-orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (!response.ok) {
        throw new Error('Admin order update failed');
      }
      return;
    } catch (e) {
      console.error("Admin order update error:", e);
    }
  }

  // 2. Fallback to Local Storage
  return new Promise((resolve) => {
    try {
      const currentOrders = localStorage.getItem(STORAGE_KEY);
      if (currentOrders) {
        const orders = decodeData(currentOrders);
        const updatedOrders = orders.map((order: Order) => 
          order.id === orderId ? { ...order, status } : order
        );
        localStorage.setItem(STORAGE_KEY, encodeData(updatedOrders));
      }
      resolve();
    } catch (e) {
      console.error("Local storage update error", e);
      resolve();
    }
  });
};
