import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';
import { sanitizePrice, sanitizeStock } from '../utils/security';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedSize, selectedColor) => {
        const size = selectedSize || product.sizes[0] || 'Standard';
        const color = selectedColor || product.colors[0] || 'Default';

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === size
          );

          if (existingIndex > -1) {
            const currentQuantity = state.items[existingIndex].quantity;
            const maxAvailableStock = Math.max(1, sanitizeStock(product.stock, 99));
            const newQuantity = Math.min(currentQuantity + 1, maxAvailableStock);

            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: newQuantity,
            };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                selectedSize: size,
                selectedColor: color,
              },
            ],
          };
        });
      },

      removeItem: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (!selectedSize || item.selectedSize === selectedSize)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedSize) => {
        const safeQuantity = sanitizeStock(quantity, 0);

        if (safeQuantity <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }

        const clampedQuantity = Math.min(99, safeQuantity);

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.product.id === productId &&
              (!selectedSize || item.selectedSize === selectedSize)
            ) {
              return { ...item, quantity: clampedQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + sanitizePrice(item.product.price) * sanitizeStock(item.quantity, 1),
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + sanitizeStock(item.quantity, 1), 0);
      },
    }),
    {
      name: 'kitap-cart-store-v2',
    }
  )
);
