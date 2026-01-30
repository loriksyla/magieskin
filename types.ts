export interface Product {
  id: string;
  name: string;
  shortName: string;
  price: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  imageUrl: string;
  size: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface Order {
  id: string;
  customer: {
    emri: string;
    mbiemri: string;
    email: string;
    adresa: string;
    shteti: string;
    qyteti: string;
    otherCity?: string;
  };
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed';
}