import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../types';

export interface CartState {
  items: CartItem[];
  isWholesaleMode: boolean;
  
  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setWholesaleMode: (enabled: boolean) => void;
  toggleWholesaleMode: () => void;
  
  // Getters / Computed
  getItemCount: () => number;
  getTotalAmount: () => number;
  getTotalWeightKg: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isWholesaleMode: true,

      addItem: (product: Product, variant: ProductVariant, quantity: number = 1) => {
        const itemId = `${product.id}_${variant.id}`;
        const state = get();
        const existingIndex = state.items.findIndex((item: CartItem) => item.id === itemId);
        const imageUrl = product.images?.[0]?.image_url || '';

        const effectivePrice = state.isWholesaleMode 
          ? (variant.wholesale_price || variant.retail_price || 0)
          : (variant.retail_price || variant.wholesale_price || 0);

        if (existingIndex > -1) {
          const updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            productSlug: product.slug,
            categoryName: product.category?.name || 'Snacks',
            weightLabel: variant.weight_label,
            weightInGrams: variant.weight_in_grams,
            unitPrice: Number(effectivePrice),
            retailPrice: Number(variant.retail_price || 0),
            wholesalePrice: Number(variant.wholesale_price || 0),
            quantity: Math.max(quantity, state.isWholesaleMode ? (product.minimum_order_qty || 1) : 1),
            minimumOrderQty: product.minimum_order_qty || 1,
            imageUrl,
            foodClassification: product.food_classification
          };
          set({ items: [...state.items, newItem] });
        }
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (id: string) => {
        set({
          items: get().items.filter((item: CartItem) => item.id !== id)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setWholesaleMode: (enabled: boolean) => {
        const state = get();
        const updatedItems = state.items.map((item: CartItem) => ({
          ...item,
          unitPrice: enabled ? item.wholesalePrice : item.retailPrice
        }));
        set({ isWholesaleMode: enabled, items: updatedItems });
      },

      toggleWholesaleMode: () => {
        get().setWholesaleMode(!get().isWholesaleMode);
      },

      getItemCount: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((total: number, item: CartItem) => total + (item.unitPrice * item.quantity), 0);
      },

      getTotalWeightKg: () => {
        const totalGrams = get().items.reduce(
          (total: number, item: CartItem) => total + (item.weightInGrams * item.quantity),
          0
        );
        return Number((totalGrams / 1000).toFixed(2));
      }
    }),
    {
      name: 'sri-balaji-cart-storage'
    }
  )
);
