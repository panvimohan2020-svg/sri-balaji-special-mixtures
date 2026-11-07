import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export interface WishlistState {
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistProductIds: [],

      toggleWishlist: (productId: string) => {
        const { wishlistProductIds } = get();
        const exists = wishlistProductIds.includes(productId);
        if (exists) {
          set({ wishlistProductIds: wishlistProductIds.filter(id => id !== productId) });
        } else {
          set({ wishlistProductIds: [...wishlistProductIds, productId] });
        }
      },

      isInWishlist: (productId: string) => {
        return get().wishlistProductIds.includes(productId);
      },

      clearWishlist: () => {
        set({ wishlistProductIds: [] });
      },

      getWishlistCount: () => {
        return get().wishlistProductIds.length;
      }
    }),
    {
      name: 'sri-balaji-wishlist-storage'
    }
  )
);

