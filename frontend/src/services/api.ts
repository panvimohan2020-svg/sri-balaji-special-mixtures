import type { Product, Category, BusinessSettings } from '../types';
import { initialProducts, initialCategories, initialBusinessSettings } from '../data/initialData';
import {
  getFallbackPincodeServiceability,
  searchFallbackLocations,
  getFallbackHierarchy,
  getFallbackAutocomplete,
  ODISHA_30_DISTRICTS_DATA,
  OdishaDistrictOverview
} from '../data/regionalCoverageData';

export type { OdishaDistrictOverview };

const VITE_API_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';
const API_BASE = VITE_API_URL ? `${VITE_API_URL}/api/v1` : '/api/v1';

export interface OrderItemPayload {
  variant_id?: string;
  product_name: string;
  weight_label: string;
  unit_price?: number;
  quantity: number;
  subtotal?: number;
}

export interface OrderPayload {
  customer_id?: string;
  customer_name: string;
  phone_number: string;
  whatsapp_number?: string;
  business_name?: string;
  order_type: 'RETAIL' | 'WHOLESALE';
  fulfillment_type?: 'DELIVERY' | 'PICKUP';
  delivery_address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  notes?: string;
  payment_method?: string;
  total_estimated_amount?: number;
  total_estimated_weight_kg?: number;
  items: OrderItemPayload[];
}

export interface CustomerUser {
  id: string;
  phone_number: string;
  email?: string;
  full_name: string;
  is_verified: boolean;
  default_address_id?: string;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  state: string;
  pin_code: string;
  is_default: boolean;
  created_at: string;
}

export interface CustomerNotification {
  id: string;
  customer_id: string;
  order_id?: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface StockMovementItem {
  id: string;
  variant_id: string;
  movement_type: string;
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reference_id?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface LowStockAlertItem {
  id: string;
  variant_id: string;
  product_name: string;
  weight_label: string;
  current_quantity: number;
  threshold: number;
  is_acknowledged: boolean;
  acknowledged_at?: string;
  is_resolved: boolean;
  created_at: string;
}

export interface PaymentTransactionItem {
  id: string;
  order_id: string;
  order_number?: string;
  transaction_reference: string;
  gateway: string;
  gateway_payment_id?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  error_code?: string;
  error_description?: string;
  created_at: string;
  updated_at: string;
}

export interface DealerProfileItem {
  id: string;
  customer_id: string;
  business_name: string;
  business_category: string;
  owner_name: string;
  phone_number: string;
  email?: string;
  gstin?: string;
  pan_number?: string;
  business_address: string;
  city: string;
  state: string;
  pin_code: string;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  pricing_tier: 'STANDARD_WHOLESALE' | 'DISTRIBUTOR' | 'SUPERMARKET';
  wholesale_requirements?: string;
  credit_limit: number;
  credit_days: number;
  admin_notes?: string;
  verified_at?: string;
  created_at: string;
}

export interface WholesaleQuotationItem {
  id: string;
  quote_number: string;
  dealer_id?: string;
  recipient_name: string;
  business_name?: string;
  phone_number: string;
  email?: string;
  delivery_address?: string;
  city: string;
  state: string;
  pin_code: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'CONVERTED' | 'EXPIRED' | 'CANCELLED';
  subtotal: number;
  delivery_charges: number;
  total_amount: number;
  total_weight_kg: number;
  valid_until: string;
  terms_and_conditions?: string;
  notes?: string;
  converted_order_id?: string;
  created_by: string;
  created_at: string;
  items: {
    id: string;
    variant_id?: string;
    product_name: string;
    weight_label: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }[];
}

export interface ShipmentRecordItem {
  id: string;
  order_id: string;
  order_number?: string;
  courier_partner: string;
  tracking_number: string;
  tracking_url?: string;
  dispatch_date: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  shipping_charges: number;
  status: string;
  destination_pincode?: string;
  recipient_name?: string;
  recipient_phone?: string;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PincodeCheckResult {
  pincode: string;
  is_serviceable: boolean;
  serviceability_status?: 'REGULAR' | 'CUSTOM_TRANSIT' | 'PENDING_VERIFICATION' | 'UNAVAILABLE';
  status_label?: string;
  city?: string;
  district?: string;
  state?: string;
  zone_name?: string;
  localities?: string[];
  transport_modes?: string[];
  transit_duration_label?: string;
  min_delivery_days: number;
  max_delivery_days: number;
  standard_shipping_rate: number;
  delivery_charges_text?: string;
  cod_available: boolean;
  daily_transit_available?: boolean;
  delivery_conditions?: string;
  message: string;
  whatsapp_url?: string;
  is_postal_valid?: boolean;
}

export interface CoverageLocationItem {
  id?: string;
  pincode: string;
  city: string;
  district?: string;
  state?: string;
  zone_name?: string;
  serviceability_status: 'REGULAR' | 'CUSTOM_TRANSIT' | 'PENDING_VERIFICATION' | 'UNAVAILABLE';
  status_label?: string;
  is_serviceable: boolean;
  localities?: string[];
  transport_modes?: string[];
  transit_duration_label?: string;
  standard_shipping_rate?: number;
  delivery_charges_text?: string;
  whatsapp_url?: string;
}

export interface CoverageDistrictItem {
  district_name: string;
  locations_count: number;
  locations: CoverageLocationItem[];
}

export interface CoverageStateItem {
  state_name: string;
  districts_count: number;
  districts: CoverageDistrictItem[];
}

export interface CoverageHierarchyResponse {
  total_records: number;
  supported_transport_methods: string[];
  states: CoverageStateItem[];
}

export interface CouponValidateResult {
  is_valid: boolean;
  coupon_code: string;
  discount_amount: number;
  final_cart_amount: number;
  message: string;
  discount_type?: string;
  discount_value?: number;
}

export interface MarketingCampaignItem {
  id: string;
  title: string;
  subtitle: string;
  badge_text: string;
  cta_text: string;
  cta_link: string;
  banner_theme: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface MarketingCouponItem {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_discount_cap?: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export interface AIRecommendationItem {
  id: string;
  name: string;
  category: string;
  price: number;
  weight_label: string;
  description: string;
  image_url?: string;
  spice_level?: string;
  pairing_notes?: string;
}

export interface AIChatResult {
  reply: string;
  language: string;
  recommendations: AIRecommendationItem[];
  quick_suggestions: string[];
  contact_action?: string;
}

export interface LoyaltyAccountItem {
  id: string;
  customer_id: string;
  points_balance: number;
  lifetime_points_earned: number;
  lifetime_points_redeemed: number;
  referral_code: string;
  referral_link: string;
  recent_transactions: {
    id: string;
    transaction_type: string;
    points: number;
    balance_after: number;
    description: string;
    created_at: string;
  }[];
}

export interface RedeemEstimateResult {
  points_to_redeem: number;
  points_discount: number;
  max_redeemable_points: number;
  final_cart_amount: number;
  points_balance_remaining: number;
}

export interface NotificationPreferences {
  customer_id: string;
  email_updates: boolean;
  sms_updates: boolean;
  whatsapp_updates: boolean;
  promotional_push: boolean;
}

export interface AnalyticsSummary {
  period: string;
  confirmed_revenue: number;
  paid_revenue: number;
  retail_revenue: number;
  wholesale_revenue: number;
  total_orders_count: number;
  confirmed_orders_count: number;
  enquiry_orders_count: number;
  delivered_orders_count: number;
  cancelled_orders_count: number;
  paid_orders_count: number;
  average_order_value: number;
  total_weight_kg: number;
  repeat_customer_rate: number;
  total_dealers: number;
  approved_dealers: number;
  top_selling_products: {
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }[];
  trend_data: {
    date: string;
    revenue: number;
    orders_count: number;
  }[];
}

export const apiService = {
  // --- Public Catalogue & Settings ---
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Offline fallback
    }
    return initialProducts;
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Offline fallback
    }
    return initialCategories;
  },

  async getSettings(): Promise<Partial<BusinessSettings>> {
    try {
      const res = await fetch(`${API_BASE}/settings/`);
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
    return initialBusinessSettings;
  },

  // --- Order Placement & Tracking ---
  async submitOrder(payload: OrderPayload): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch {
      // If backend offline
    }
    const rand = Math.floor(1000 + Math.random() * 9000);
    return {
      order_number: `SB-LOCAL-${rand}`,
      status: 'NEW ENQUIRY',
      total_estimated_amount: payload.total_estimated_amount || 0
    };
  },

  async trackOrder(orderNumber: string, phone?: string): Promise<any> {
    const url = new URL(`${window.location.origin}${API_BASE}/orders/track/${encodeURIComponent(orderNumber.trim())}`);
    if (phone) url.searchParams.append('phone', phone.trim());
    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Order not found' }));
      throw new Error(err.detail || 'Could not find order. Please verify your reference number.');
    }
    return await res.json();
  },

  // --- Admin Authentication ---
  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const res = await fetch(`${API_BASE}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid administrator email or password.');
    }
    return await res.json();
  },

  async getAdminMe(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error('Unauthorized or expired session');
    }
    return await res.json();
  },

  async adminLogout(token: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  async getAdminList(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/auth/admins`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load administrator accounts');
    return await res.json();
  },

  async updateAdminUser(token: string, userId: string, data: { role?: string; is_active?: boolean; full_name?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/admins/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update administrator' }));
      throw new Error(err.detail || 'Failed to update administrator');
    }
    return await res.json();
  },

  async revokeAdminUser(token: string, userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/admins/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to revoke administrator' }));
      throw new Error(err.detail || 'Failed to revoke administrator');
    }
    return await res.json();
  },

  async inviteAdmin(token: string, data: { email: string; role: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create invitation' }));
      throw new Error(err.detail || 'Failed to create invitation');
    }
    return await res.json();
  },

  async getAdminInvites(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/auth/invites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async cancelAdminInvite(token: string, inviteId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/invites/${inviteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to cancel invitation');
    return await res.json();
  },

  async getAuditLogs(token: string, params?: { action?: string; admin_email?: string; limit?: number }): Promise<{ total: number; logs: any[] }> {
    const url = new URL(`${window.location.origin}${API_BASE}/auth/audit-logs`);
    if (params?.action) url.searchParams.append('action', params.action);
    if (params?.admin_email) url.searchParams.append('admin_email', params.admin_email);
    if (params?.limit) url.searchParams.append('limit', String(params.limit));

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return { total: 0, logs: [] };
    return await res.json();
  },

  async passkeyRegisterChallenge(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/passkey/register-challenge`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to generate passkey challenge');
    return await res.json();
  },

  async passkeyRegisterVerify(token: string, data: { challenge: string; credential_id: string; public_key: string; device_name?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/passkey/register-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Passkey registration failed' }));
      throw new Error(err.detail || 'Passkey registration failed');
    }
    return await res.json();
  },

  async passkeyLoginChallenge(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/passkey/login-challenge`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to initiate passkey login');
    return await res.json();
  },

  async passkeyLoginVerify(data: { challenge: string; credential_id: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/passkey/login-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Passkey authentication failed' }));
      throw new Error(err.detail || 'Passkey authentication failed');
    }
    return await res.json();
  },

  // --- Business Owner Handover & Super Admin Activation ---
  async getOwnerSetupStatus(): Promise<{ is_activated: boolean; status: string; owner_email_masked?: string; activated_at?: string; activated_by_name?: string }> {
    const res = await fetch(`${API_BASE}/auth/owner/setup-status`);
    if (!res.ok) return { is_activated: false, status: 'UNKNOWN' };
    return await res.json();
  },

  async verifyOwnerToken(token: string): Promise<{ valid: boolean; owner_email?: string; owner_name?: string; suggested_name?: string; message?: string; error_code?: string; activated_at?: string }> {
    const res = await fetch(`${API_BASE}/auth/owner/verify-token?token=${encodeURIComponent(token.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Verification failed' }));
      return { valid: false, message: err.detail || err.message || 'Invalid token' };
    }
    return await res.json();
  },

  async activateOwnerAccount(data: { token: string; full_name: string; password: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/owner/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Activation failed' }));
      throw new Error(err.detail || 'Failed to activate owner account');
    }
    return await res.json();
  },

  async forgotPassword(email: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to initiate password recovery' }));
      throw new Error(err.detail || 'Failed to initiate recovery');
    }
    return await res.json();
  },

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to reset password' }));
      throw new Error(err.detail || 'Failed to reset password');
    }
    return await res.json();
  },

  async getAdminCoupons(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/marketing/admin/coupons`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async deleteAdminCoupon(token: string, couponId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/marketing/admin/coupons/${couponId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return await res.json();
  },

  async exportCsv(token: string, type: 'orders' | 'inventory' | 'customers' | 'dealers'): Promise<void> {
    const res = await fetch(`${API_BASE}/analytics/export/${type}.csv`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Failed to export ${type} CSV`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri_balaji_${type}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // --- Admin Order Management (OMS) ---
  async getAdminOrders(token: string, params?: { search?: string; order_type?: string; status?: string; sort_order?: string }): Promise<any[]> {
    try {
      const url = new URL(`${window.location.origin}${API_BASE}/orders/`);
      if (params?.search) url.searchParams.append('search', params.search);
      if (params?.order_type) url.searchParams.append('order_type', params.order_type);
      if (params?.status) url.searchParams.append('status', params.status);
      if (params?.sort_order) url.searchParams.append('sort_order', params.sort_order);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async getOrderById(token: string, orderId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  },

  async updateOrderStatus(token: string, orderId: string, status: string, notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update order status' }));
      throw new Error(err.detail || 'Failed to update order status');
    }
    return await res.json();
  },

  async updateOrderAdminNotes(token: string, orderId: string, adminNotes: string): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/admin-notes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ admin_notes: adminNotes })
    });
    if (!res.ok) throw new Error('Failed to save administrative notes');
    return await res.json();
  },

  // --- Smart Inventory Management ---
  async getInventorySummary(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/inventory/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch inventory summary');
    return await res.json();
  },

  async getInventoryItems(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/inventory/items`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch inventory items');
    return await res.json();
  },

  async updateInventoryConfig(token: string, variantId: string, config: { track_inventory: boolean; min_stock_threshold: number }): Promise<any> {
    const res = await fetch(`${API_BASE}/inventory/variants/${variantId}/config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update inventory config');
    return await res.json();
  },

  async adjustStock(token: string, variantId: string, data: { movement_type: string; quantity: number; notes?: string; reference_id?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/inventory/variants/${variantId}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to adjust stock' }));
      throw new Error(err.detail || 'Failed to adjust stock');
    }
    return await res.json();
  },

  async getStockMovements(token: string, variantId?: string): Promise<StockMovementItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/inventory/movements`);
    if (variantId) url.searchParams.append('variant_id', variantId);
    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getLowStockAlerts(token: string): Promise<LowStockAlertItem[]> {
    const res = await fetch(`${API_BASE}/inventory/alerts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async acknowledgeAlert(token: string, alertId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/inventory/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return await res.json();
  },

  // --- Customer Accounts ---
  async customerRequestOtp(phone: string): Promise<any> {
    const res = await fetch(`${API_BASE}/customers/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to send OTP' }));
      throw new Error(err.detail || 'Failed to send OTP');
    }
    return await res.json();
  },

  async customerLogin(phone: string, password?: string, otp?: string): Promise<{ access_token: string; customer: CustomerUser }> {
    const res = await fetch(`${API_BASE}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone, password, otp })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Invalid mobile number or credentials.');
    }
    return await res.json();
  },

  async customerRegister(data: { phone_number: string; full_name: string; email?: string; password?: string }): Promise<{ access_token: string; customer: CustomerUser }> {
    const res = await fetch(`${API_BASE}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  },

  async getCustomerProfile(token: string): Promise<CustomerUser> {
    const res = await fetch(`${API_BASE}/customers/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async updateCustomerProfile(token: string, data: { full_name?: string; email?: string }): Promise<CustomerUser> {
    const res = await fetch(`${API_BASE}/customers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },

  async getCustomerAddresses(token: string): Promise<CustomerAddress[]> {
    const res = await fetch(`${API_BASE}/customers/addresses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createCustomerAddress(token: string, data: Partial<CustomerAddress>): Promise<CustomerAddress> {
    const res = await fetch(`${API_BASE}/customers/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save address');
    return await res.json();
  },

  async updateCustomerAddress(token: string, addressId: string, data: Partial<CustomerAddress>): Promise<CustomerAddress> {
    const res = await fetch(`${API_BASE}/customers/addresses/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update address');
    return await res.json();
  },

  async deleteCustomerAddress(token: string, addressId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/customers/addresses/${addressId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  },

  async getCustomerOrders(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/customers/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getCustomerNotifications(token: string): Promise<CustomerNotification[]> {
    const res = await fetch(`${API_BASE}/customers/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async markCustomerNotificationRead(token: string, notificationId: string): Promise<void> {
    await fetch(`${API_BASE}/customers/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // --- Online Payments & Transactions ---
  async createPaymentOrder(orderId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, gateway: 'RAZORPAY' })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to initiate payment' }));
      throw new Error(err.detail || 'Failed to initiate payment');
    }
    return await res.json();
  },

  async verifyPayment(data: { order_id: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Payment verification failed' }));
      throw new Error(err.detail || 'Payment verification failed');
    }
    return await res.json();
  },

  async confirmOfflinePayment(data: { order_id: string; payment_method: string; transaction_reference: string; notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/confirm-offline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to record payment reference');
    return await res.json();
  },

  async getPaymentTransactions(token: string, params?: { status?: string; search?: string }): Promise<PaymentTransactionItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/payments/transactions`);
    if (params?.status) url.searchParams.append('status', params.status);
    if (params?.search) url.searchParams.append('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async reconcilePayment(token: string, txnId: string, targetStatus: string, notes?: string): Promise<any> {
    const url = new URL(`${window.location.origin}${API_BASE}/payments/transactions/${txnId}/status`);
    url.searchParams.append('target_status', targetStatus);
    if (notes) url.searchParams.append('notes', notes);

    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to reconcile transaction');
    return await res.json();
  },

  // --- Admin General Data Management ---
  async updateVariant(token: string, variantId: string, data: { is_in_stock?: boolean; retail_price?: number; wholesale_price?: number }): Promise<any> {
    const res = await fetch(`${API_BASE}/products/variants/${variantId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update variant');
    return await res.json();
  },

  async updateProduct(token: string, productId: string, data: Partial<Product>): Promise<any> {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  },

  async deleteProduct(token: string, productId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  },

  async createProduct(token: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  },

  async updateSetting(token: string, key: string, value: string): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ value })
    });
    if (!res.ok) throw new Error(`Failed to update setting '${key}'`);
    return await res.json();
  },

  async getWholesaleEnquiries(token: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/enquiries/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  // --- B2B Wholesale Dealer Ecosystem (Phase 4) ---
  async applyForDealer(token: string, data: any): Promise<DealerProfileItem> {
    const res = await fetch(`${API_BASE}/dealers/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit dealer application' }));
      throw new Error(err.detail || 'Failed to submit dealer application');
    }
    return await res.json();
  },

  async getMyDealerProfile(token: string): Promise<DealerProfileItem | null> {
    const res = await fetch(`${API_BASE}/dealers/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async getDealerPortalSummary(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dealers/portal-summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load dealer summary');
    return await res.json();
  },

  async listDealers(token: string, params?: { status?: string; search?: string }): Promise<DealerProfileItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/dealers/`);
    if (params?.status) url.searchParams.append('status', params.status);
    if (params?.search) url.searchParams.append('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async updateDealerStatus(token: string, dealerId: string, data: { status: string; pricing_tier?: string; credit_limit?: number; credit_days?: number; admin_notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/dealers/${dealerId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update dealer status');
    return await res.json();
  },

  // --- Wholesale Quotations (Phase 4) ---
  async createQuotation(token: string, data: any): Promise<WholesaleQuotationItem> {
    const res = await fetch(`${API_BASE}/quotations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create quotation' }));
      throw new Error(err.detail || 'Failed to create quotation');
    }
    return await res.json();
  },

  async getQuotations(token: string, params?: { dealer_id?: string; search?: string }): Promise<WholesaleQuotationItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/quotations/`);
    if (params?.dealer_id) url.searchParams.append('dealer_id', params.dealer_id);
    if (params?.search) url.searchParams.append('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getQuotationById(quoteIdOrNum: string): Promise<WholesaleQuotationItem> {
    const res = await fetch(`${API_BASE}/quotations/${encodeURIComponent(quoteIdOrNum.trim())}`);
    if (!res.ok) throw new Error('Quotation not found');
    return await res.json();
  },

  async convertQuotationToOrder(token: string, quoteId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/quotations/${quoteId}/convert-to-order`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to convert quotation to order');
    return await res.json();
  },

  // --- Logistics & Shipping (Phase 4) ---
  async checkPincodeServiceability(pincode: string): Promise<PincodeCheckResult> {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        pincode: cleanPin,
        is_serviceable: false,
        serviceability_status: 'UNAVAILABLE',
        status_label: 'Invalid PIN Code',
        min_delivery_days: 0,
        max_delivery_days: 0,
        standard_shipping_rate: 0,
        cod_available: false,
        is_postal_valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code (e.g., 761200, 532001, 760001).'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/logistics/pincode/${encodeURIComponent(cleanPin)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Graceful fallback to verified PostgreSQL synced dataset
    }

    const fallback = getFallbackPincodeServiceability(cleanPin);
    if (fallback) {
      return fallback;
    }

    return {
      pincode: cleanPin,
      is_serviceable: false,
      serviceability_status: 'UNAVAILABLE',
      status_label: 'Currently Unavailable',
      city: 'Regional Destination',
      district: 'Regional Route',
      state: 'Odisha / Andhra Pradesh',
      min_delivery_days: 2,
      max_delivery_days: 4,
      standard_shipping_rate: 0,
      delivery_charges_text: 'Custom Freight Quote',
      cod_available: false,
      daily_transit_available: false,
      is_postal_valid: true,
      message: `PIN code ${cleanPin} is currently outside our regular daily route network. Custom road transit or parcel cargo can be arranged manually via our WhatsApp dispatch desk (+91 98617 89602).`,
      whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(`🚚 *DELIVERY ENQUIRY – SRI BALAJI*\nPIN: ${cleanPin}\nPlease advise transport availability and freight charges.`)}`
    };
  },

  async listServiceablePincodes(): Promise<any[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/logistics/pincodes`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async searchLogisticsLocations(query: string): Promise<{ query: string; count: number; results: any[] }> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return { query: '', count: 0, results: [] };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/logistics/search?q=${encodeURIComponent(cleanQuery)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          return data;
        }
      }
    } catch {
      // Graceful fallback
    }

    return searchFallbackLocations(cleanQuery);
  },

  async getAutocompleteLocations(query: string): Promise<any[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE}/logistics/autocomplete?q=${encodeURIComponent(cleanQuery)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Graceful fallback
    }

    return getFallbackAutocomplete(cleanQuery);
  },

  async getOdishaDistrictsOverview(): Promise<OdishaDistrictOverview[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/logistics/districts/odisha`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.districts) && data.districts.length > 0) {
          return data.districts;
        }
      }
    } catch {
      // Graceful fallback
    }

    return ODISHA_30_DISTRICTS_DATA;
  },

  async getCoverageHierarchy(): Promise<CoverageHierarchyResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/logistics/coverage/hierarchy`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.states) && data.states.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }

    return getFallbackHierarchy();
  },

  async adminListPincodes(token: string, params?: { search?: string; state?: string; district?: string; status?: string; skip?: number; limit?: number }): Promise<{ total: number; records: any[] }> {
    const url = new URL(`${window.location.origin}${API_BASE}/logistics/admin/pincodes`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.state) url.searchParams.append('state', params.state);
    if (params?.district) url.searchParams.append('district', params.district);
    if (params?.status) url.searchParams.append('status', params.status);
    if (params?.skip !== undefined) url.searchParams.append('skip', String(params.skip));
    if (params?.limit !== undefined) url.searchParams.append('limit', String(params.limit));

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load delivery coverage records');
    return await res.json();
  },

  async adminCreatePincode(token: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/logistics/admin/pincodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to add coverage PIN code' }));
      throw new Error(err.detail || 'Failed to add coverage PIN code');
    }
    return await res.json();
  },

  async adminUpdatePincode(token: string, id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/logistics/admin/pincodes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update coverage PIN code' }));
      throw new Error(err.detail || 'Failed to update coverage PIN code');
    }
    return await res.json();
  },

  async adminDeletePincode(token: string, id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/logistics/admin/pincodes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete coverage PIN code' }));
      throw new Error(err.detail || 'Failed to delete coverage PIN code');
    }
    return await res.json();
  },

  async adminBulkImportPincodes(token: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/logistics/admin/pincodes/bulk-import`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to import CSV' }));
      throw new Error(err.detail || 'Failed to import CSV');
    }
    return await res.json();
  },

  async createShipment(token: string, data: any): Promise<ShipmentRecordItem> {
    const res = await fetch(`${API_BASE}/logistics/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create shipment' }));
      throw new Error(err.detail || 'Failed to create shipment');
    }
    return await res.json();
  },

  async getShipments(token: string, status?: string): Promise<ShipmentRecordItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/logistics/shipments`);
    if (status) url.searchParams.append('status', status);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getShipmentByOrder(orderId: string): Promise<ShipmentRecordItem | null> {
    const res = await fetch(`${API_BASE}/logistics/shipments/order/${orderId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async updateShipmentStatus(token: string, shipmentId: string, data: { status: string; notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/logistics/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update shipment status');
    return await res.json();
  },

  // --- Phase 5: Marketing & Coupons ---
  async validateCoupon(code: string, cartAmount: number, orderType = 'RETAIL'): Promise<CouponValidateResult> {
    const res = await fetch(`${API_BASE}/marketing/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cart_amount: cartAmount, order_type: orderType })
    });
    if (!res.ok) {
      return {
        is_valid: false,
        coupon_code: code,
        discount_amount: 0,
        final_cart_amount: cartAmount,
        message: 'Unable to validate coupon.'
      };
    }
    return await res.json();
  },

  async getActiveCampaigns(): Promise<MarketingCampaignItem[]> {
    try {
      const res = await fetch(`${API_BASE}/marketing/campaigns`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async listAdminCoupons(token: string): Promise<MarketingCouponItem[]> {
    const res = await fetch(`${API_BASE}/marketing/admin/coupons`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createAdminCoupon(token: string, data: any): Promise<MarketingCouponItem> {
    const res = await fetch(`${API_BASE}/marketing/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return await res.json();
  },

  async toggleAdminCoupon(token: string, couponId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/marketing/admin/coupons/${couponId}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to toggle coupon');
    return await res.json();
  },

  async listAdminCampaigns(token: string): Promise<MarketingCampaignItem[]> {
    const res = await fetch(`${API_BASE}/marketing/admin/campaigns`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createAdminCampaign(token: string, data: any): Promise<MarketingCampaignItem> {
    const res = await fetch(`${API_BASE}/marketing/admin/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create campaign banner');
    return await res.json();
  },

  async toggleAdminCampaign(token: string, campaignId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/marketing/admin/campaigns/${campaignId}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to toggle campaign banner');
    return await res.json();
  },

  // --- Phase 5: AI Snack Discovery Assistant (Balaji Mitra) ---
  async getAIStatus(): Promise<{ status: string; name: string; subtitle: string; operational: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_BASE}/ai/status`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return { status: 'offline', name: 'Balaji Mitra', subtitle: 'Sri Balaji Crisp & Flavour Assistant', operational: false };
      }
      return await res.json();
    } catch {
      return { status: 'offline', name: 'Balaji Mitra', subtitle: 'Sri Balaji Crisp & Flavour Assistant', operational: false };
    }
  },

  async aiChat(message: string, language = 'en', sessionId?: string): Promise<AIChatResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), language, session_id: sessionId }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: 'AI Assistant is temporarily busy' }));
        throw new Error(errJson.detail || 'AI Assistant is temporarily busy');
      }
      return await res.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('AI Assistant request timed out. Please try again or connect via WhatsApp.');
      }
      throw err;
    }
  },

  // --- Phase 5: Customer Loyalty & Referrals ---
  async getMyLoyaltyAccount(token: string): Promise<LoyaltyAccountItem> {
    const res = await fetch(`${API_BASE}/loyalty/my-account`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to retrieve loyalty account');
    return await res.json();
  },

  async estimateLoyaltyRedemption(token: string, cartAmount: number, pointsToRedeem: number): Promise<RedeemEstimateResult> {
    const res = await fetch(`${API_BASE}/loyalty/redeem-estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cart_amount: cartAmount, points_to_redeem: pointsToRedeem })
    });
    if (!res.ok) throw new Error('Failed to calculate redemption');
    return await res.json();
  },

  async getNotificationPreferences(token: string): Promise<NotificationPreferences> {
    const res = await fetch(`${API_BASE}/loyalty/preferences`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch preferences');
    return await res.json();
  },

  async updateNotificationPreferences(token: string, data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const res = await fetch(`${API_BASE}/loyalty/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update preferences');
    return await res.json();
  },

  async listLoyaltyAccounts(token: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/loyalty/admin/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async adjustLoyaltyPoints(token: string, customerId: string, points: number, reason: string): Promise<any> {
    const url = new URL(`${window.location.origin}${API_BASE}/loyalty/admin/adjust-points`);
    url.searchParams.append('customer_id', customerId);
    url.searchParams.append('points', points.toString());
    url.searchParams.append('reason', reason);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to adjust points');
    return await res.json();
  },

  // --- Phase 5: Business Analytics ---
  async getAnalyticsSummary(token: string, period = 'all'): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics/dashboard-summary?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics summary');
    return await res.json();
  },

  // --- Phase 6: Customer Feedback & Reviews ---
  async submitFeedback(payload: {
    author_name: string;
    rating: number;
    title: string;
    comment: string;
    city?: string;
    phone?: string;
    category?: string;
    order_number?: string;
    product_id?: string;
    photo_url?: string;
  }): Promise<{ success: boolean; id: string; is_verified_purchase: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/feedback/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit feedback' }));
      throw new Error(err.detail || 'Could not submit your review. Please try again.');
    }
    return await res.json();
  },

  async getPublicFeedback(productId?: string): Promise<{ average_rating: number; total_reviews: number; distribution: Record<number, number>; reviews: any[] }> {
    try {
      const url = new URL(`${window.location.origin}${API_BASE}/feedback/public`);
      if (productId && productId !== 'general') {
        url.searchParams.append('product_id', productId);
      }
      const res = await fetch(url.toString());
      if (res.ok) return await res.json();
    } catch {}
    return { average_rating: 5.0, total_reviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, reviews: [] };
  },

  async markFeedbackHelpful(feedbackId: string): Promise<{ success: boolean; helpful_count: number }> {
    const res = await fetch(`${API_BASE}/feedback/${feedbackId}/helpful`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to mark review helpful');
    return await res.json();
  },

  // --- Phase 6: Marketing Analytics Event Tracking & UTM Attribution ---
  async logMarketingEvent(payload: {
    event_type: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    page_url?: string;
    product_id?: string;
    order_id?: string;
    session_id?: string;
  }): Promise<void> {
    try {
      await fetch(`${API_BASE}/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Fire-and-forget; never block the user journey
    }
  },

  async getMarketingFunnel(token: string, period = 'all'): Promise<{
    period: string;
    total_tracked_events: number;
    funnel: Array<{ step: string; count: number; pct: number }>;
    attributions: Array<{ source: string; visitors: number; events_count: number; enquiries_count: number; conversion_rate: number }>;
  }> {
    const res = await fetch(`${API_BASE}/analytics/marketing-funnel?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch marketing funnel');
    return await res.json();
  }
};
