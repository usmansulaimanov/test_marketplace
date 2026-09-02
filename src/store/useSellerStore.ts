import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SellerProduct, SellerOrder, SellerOrderStatus, MonthlyRevenue } from '../types';
import { sanitizePrice, sanitizeStock, sanitizeInput, sanitizeUrl } from '../utils/security';
import { useProductStore } from './useProductStore';

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
  addOrder: (order: SellerOrder) => void;
  recordSale: (productId: string, quantity: number, price: number) => void;
  resetSellerData: () => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      products: [],
      orders: [],
      monthlyRevenue: [],

      toggleProductActive: (id) => {
        set((state) => {
          const updated = state.products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          );
          return { products: updated };
        });
      },

      deleteProduct: (id) => {
        useProductStore.getState().deleteProduct(id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addProduct: (newProduct) => {
        const id = `sp-${Date.now()}`;
        const safeTitle = sanitizeInput(newProduct.title);
        const safeBrand = sanitizeInput(newProduct.brand) || 'KitapAll Seller';
        const safePrice = sanitizePrice(newProduct.price);
        const safeStock = sanitizeStock(newProduct.stock);
        const safeImage = sanitizeUrl(newProduct.imageUrl, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');

        const product: SellerProduct = {
          ...newProduct,
          id,
          title: safeTitle,
          brand: safeBrand,
          price: safePrice,
          stock: safeStock,
          imageUrl: safeImage,
          salesCount: 0,
          rating: 5.0,
          reviewsCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };

        // Sync with main customer-facing catalog
        useProductStore.getState().addProduct(
          {
            title: safeTitle,
            brand: safeBrand,
            category: newProduct.category,
            price: safePrice,
            stock: safeStock,
            imageUrl: safeImage,
            description: `${safeTitle} от продавца ${safeBrand}`,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Черный', 'Белый'],
            rating: 5.0,
            reviewsCount: 0,
          },
          id
        );

        set((state) => ({
          products: [product, ...state.products],
        }));
      },

      updateStock: (id, newStock) => {
        const safeStock = sanitizeStock(newStock);
        useProductStore.getState().updateStock(id, safeStock);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: safeStock } : p
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

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      recordSale: (productId, quantity, price) => {
        const currentMonth = new Date().toLocaleString('ru-RU', { month: 'long' });
        const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
        const saleAmount = quantity * price;

        set((state) => {
          // Update product sales and stock
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                salesCount: p.salesCount + quantity,
                stock: Math.max(0, p.stock - quantity),
              };
            }
            return p;
          });

          // Update monthly revenue
          const existingMonthIndex = state.monthlyRevenue.findIndex((m) => m.month.toLowerCase() === capitalizedMonth.toLowerCase());
          let updatedRevenue = [...state.monthlyRevenue];

          if (existingMonthIndex > -1) {
            updatedRevenue[existingMonthIndex] = {
              ...updatedRevenue[existingMonthIndex],
              amount: updatedRevenue[existingMonthIndex].amount + saleAmount,
            };
          } else {
            updatedRevenue.push({
              month: capitalizedMonth,
              amount: saleAmount,
            });
          }

          return {
            products: updatedProducts,
            monthlyRevenue: updatedRevenue,
          };
        });
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
