import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CategoryId } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { sanitizePrice, sanitizeStock, sanitizeInput, sanitizeUrl } from '../utils/security';

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
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>, customId?: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
  decreaseStock: (id: string, count: number) => void;
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
      setSearchQuery: (query) => set({ searchQuery: sanitizeInput(query) }),
      setSortBy: (sort) => set({ sortBy: sort }),

      addProduct: (newProd, customId) => {
        const item: Product = {
          ...newProd,
          id: customId || `prod-${Date.now()}`,
          title: sanitizeInput(newProd.title),
          brand: sanitizeInput(newProd.brand),
          price: sanitizePrice(newProd.price),
          oldPrice: newProd.oldPrice ? sanitizePrice(newProd.oldPrice) : undefined,
          stock: sanitizeStock(newProd.stock),
          imageUrl: sanitizeUrl(newProd.imageUrl, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'),
          description: sanitizeInput(newProd.description),
          sizes: newProd.sizes?.length ? newProd.sizes : ['Standard'],
          colors: newProd.colors?.length ? newProd.colors : ['Default'],
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ products: [item, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            return {
              ...p,
              ...updates,
              title: updates.title !== undefined ? sanitizeInput(updates.title) : p.title,
              brand: updates.brand !== undefined ? sanitizeInput(updates.brand) : p.brand,
              price: updates.price !== undefined ? sanitizePrice(updates.price) : p.price,
              oldPrice: updates.oldPrice !== undefined ? sanitizePrice(updates.oldPrice) : p.oldPrice,
              stock: updates.stock !== undefined ? sanitizeStock(updates.stock) : p.stock,
              imageUrl: updates.imageUrl !== undefined ? sanitizeUrl(updates.imageUrl, p.imageUrl) : p.imageUrl,
              description: updates.description !== undefined ? sanitizeInput(updates.description) : p.description,
            };
          }),
        }));
      },

      updateStock: (id, newStock) => {
        const safeStock = sanitizeStock(newStock);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: safeStock } : p
          ),
        }));
      },

      decreaseStock: (id, count) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - sanitizeStock(count, 1)) } : p
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
