import { Order } from '../types';
import { sendOrderEmails } from './emailService';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'magie_skin_data_secure';

// Helper to encode/decode for local storage fallback
const encodeData = (data: any): string => {
  try { return btoa(JSON.stringify(data)); } catch (e) { return ''; }
};
const decodeData = (str: string): any => {
  try { return JSON.parse(atob(str)); } catch (e) { return []; }
};

export const getOrders = async (): Promise<Order[]> => {
  // 1. Try Supabase (Cloud DB)
  if (supabase) {
    try {
      console.log("Fetching orders from Cloud (Supabase)...");
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      if (data) {
        console.log(`Loaded ${data.length} orders from Cloud.`);
        return data as Order[];
      }
    } catch (e) {
      console.error("Supabase fetch error - falling back to local:", e);
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
  // 1. Try Supabase
  if (supabase) {
    try {
      console.log("Saving order to Cloud...");
      const { error } = await supabase
        .from('orders')
        .insert([order]);
      
      if (error) throw error;
      console.log("Order saved to Cloud successfully.");
      await sendOrderEmails(order);
      return; // Success
    } catch (e) {
      console.error("Supabase save error:", e);
    }
  }

  // 2. Fallback to Local Storage
  return new Promise(async (resolve) => {
    try {
      const currentOrders = localStorage.getItem(STORAGE_KEY);
      const orders = currentOrders ? decodeData(currentOrders) : [];
      const updatedOrders = [order, ...orders];
      localStorage.setItem(STORAGE_KEY, encodeData(updatedOrders));
      await sendOrderEmails(order);
      resolve();
    } catch (e) {
      console.error("Local storage save error", e);
      resolve();
    }
  });
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed'): Promise<void> => {
  // 1. Try Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      return;
    } catch (e) {
      console.error("Supabase update error:", e);
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
