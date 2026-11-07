import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export interface RecentlyViewedState {
  recentProductIds: string[];
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      recentProductIds: [],

      addRecentlyViewed: (productId: string) => {
        const { recentProductIds } = get();
        // Move to front, filter duplicate, limit to 8
        const filtered = recentProductIds.filter(id => id !== productId);
        set({ recentProductIds: [productId, ...filtered].slice(0, 8) });
      },

      clearRecentlyViewed: () => {
        set({ recentProductIds: [] });
      }
    }),
    {
      name: 'sri-balaji-recently-viewed-storage'
    }
  )
);
