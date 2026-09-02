import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some(item => item.id === product.id);
        
        if (exists) {
          set({ items: currentItems.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...currentItems, product] });
        }
      },
      isInWishlist: (productId) => get().items.some(item => item.id === productId),
    }),
    { 
      name: 'kitapall-wishlist-storage-v2'
    }
  )
);
