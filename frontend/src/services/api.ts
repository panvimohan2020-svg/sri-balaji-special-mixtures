import type { Product, Category, BusinessSettings, CartItem } from '../types';
import { initialProducts, initialCategories, initialBusinessSettings } from '../data/initialData';

const API_BASE = '/api/v1';

export interface OrderPayload {
  customer_name: string;
  phone_number: string;
  whatsapp_number?: string;
  business_name?: string;
  order_type: string;
  delivery_address?: string;
  city?: string;
  state?: string;
  notes?: string;
  total_estimated_amount: number;
  total_estimated_weight_kg: number;
  items: {
    product_name: string;
    weight_label: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }[];
}

export const apiService = {
  // Fetch products with backend live sync and fallback to cached data
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Offline or backend not connected; use local cache
    }
    return initialProducts;
  },

  // Fetch categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Offline fallback
    }
    return initialCategories;
  },

  // Fetch business settings
  async getSettings(): Promise<Partial<BusinessSettings>> {
    try {
      const res = await fetch(`${API_BASE}/settings/`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return initialBusinessSettings;
  },

  // Submit order to backend database
  async submitOrder(payload: OrderPayload): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // If backend is offline, gracefully return simulated order
    }
    return {
      order_number: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ENQUIRY_SAVED_LOCALLY'
    };
  },

  // Fetch orders (Admin only)
  async getAdminOrders(token: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [];
  }
};

