import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CategoryId } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface ProductState {
  products: Product[];
  selectedCategory: CategoryId;
  searchQuery: string;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating';
  
  // Actions
  setSelectedCategory: (cat: CategoryId) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'popular' | 'price_asc' | 'price_desc' | 'rating') => void;
  
  // Admin & Warehouse Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'popular',

      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),

      addProduct: (newProd) => {
        const item: Product = {
          ...newProd,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ products: [item, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      updateStock: (id, newStock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      resetToDefaults: () => {
        set({ products: INITIAL_PRODUCTS });
      },
    }),
    {
      name: 'kitap-products-store-v4',
    }
  )
);
