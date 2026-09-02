import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SellerProduct, SellerOrder, SellerOrderStatus, MonthlyRevenue } from '../types';

interface SellerState {
  products: SellerProduct[];
  orders: SellerOrder[];
  monthlyRevenue: MonthlyRevenue[];
  
  // Actions
  toggleProductActive: (id: string) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Omit<SellerProduct, 'id' | 'createdAt' | 'salesCount' | 'rating' | 'reviewsCount'>) => void;
  updateStock: (id: string, newStock: number) => void;
  updateOrderStatus: (orderId: string, status: SellerOrderStatus) => void;
  resetSellerData: () => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      products: [],
      orders: [],
      monthlyRevenue: [],

      toggleProductActive: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addProduct: (newProduct) => {
        const product: SellerProduct = {
          ...newProduct,
          id: `sp-${Date.now()}`,
          salesCount: 0,
          rating: 0.0,
          reviewsCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          products: [product, ...state.products],
        }));
      },

      updateStock: (id, newStock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
          ),
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      resetSellerData: () => {
        set({
          products: [],
          orders: [],
          monthlyRevenue: [],
        });
      },
    }),
    {
      name: 'kitapall-seller-store-v3',
    }
  )
);
