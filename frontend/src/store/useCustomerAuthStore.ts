import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, CustomerUser, CustomerAddress, CustomerNotification } from '../services/api';

export interface CustomerAuthState {
  token: string | null;
  customer: CustomerUser | null;
  addresses: CustomerAddress[];
  notifications: CustomerNotification[];
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (phone: string, password?: string, otp?: string) => Promise<void>;
  register: (data: { phone_number: string; full_name: string; email?: string; password?: string }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  clearError: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      customer: null,
      addresses: [],
      notifications: [],
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (phone: string, password?: string, otp?: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiService.customerLogin(phone, password, otp);
          set({ token: res.access_token, customer: res.customer, isLoading: false });
          // Fetch addresses & notifications
          get().fetchAddresses();
          get().fetchNotifications();
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Login failed' });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiService.customerRegister(data);
          set({ token: res.access_token, customer: res.customer, isLoading: false });
          get().fetchAddresses();
          get().fetchNotifications();
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Registration failed' });
          throw err;
        }
      },

      logout: () => {
        set({ token: null, customer: null, addresses: [], notifications: [], error: null });
      },

      fetchProfile: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const profile = await apiService.getCustomerProfile(token);
          set({ customer: profile });
        } catch {
          // Token expired or invalid
          set({ token: null, customer: null });
        }
      },

      fetchAddresses: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const addrs = await apiService.getCustomerAddresses(token);
          set({ addresses: addrs });
        } catch {
          // Ignore
        }
      },

      fetchNotifications: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const notifs = await apiService.getCustomerNotifications(token);
          set({ notifications: notifs });
        } catch {
          // Ignore
        }
      }
    }),
    {
      name: 'sri_balaji_customer_storage',
      partialize: (state) => ({ token: state.token, customer: state.customer })
    }
  )
);
