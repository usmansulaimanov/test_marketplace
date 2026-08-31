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

const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: 'sp-1',
    title: 'Минималистичная бейсболка Cotton Mono',
    brand: 'KitapAll Exclusive',
    category: 'headwear',
    price: 8990,
    stock: 24,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
    salesCount: 142,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: '2026-01-10',
  },
  {
    id: 'sp-2',
    title: 'Оверсайз худи Heavyweight Fleece',
    brand: 'KitapAll Exclusive',
    category: 'tops',
    price: 24990,
    stock: 14,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    salesCount: 89,
    rating: 4.9,
    reviewsCount: 24,
    createdAt: '2026-01-14',
  },
  {
    id: 'sp-3',
    title: 'Брюки-карго Wide Fit Utility Pants',
    brand: 'KitapAll Exclusive',
    category: 'bottoms',
    price: 19990,
    stock: 8,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    salesCount: 92,
    rating: 4.7,
    reviewsCount: 19,
    createdAt: '2026-01-20',
  },
  {
    id: 'sp-4',
    title: 'Минималистичные кожаные кеды Court Pure',
    brand: 'KitapAll Exclusive',
    category: 'footwear',
    price: 32990,
    stock: 0,
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    salesCount: 110,
    rating: 4.8,
    reviewsCount: 45,
    createdAt: '2026-02-01',
  },
  {
    id: 'sp-5',
    title: 'Панама из плотного хлопка Bucket Canvas',
    brand: 'KitapAll Exclusive',
    category: 'headwear',
    price: 7990,
    stock: 18,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop&q=80',
    salesCount: 64,
    rating: 4.6,
    reviewsCount: 12,
    createdAt: '2026-02-12',
  },
];

const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'SO-1094',
    customerName: 'Айдос Нурланов',
    customerPhone: '+7 (707) 890-12-34',
    items: [
      { productId: 'sp-2', title: 'Оверсайз худи Heavyweight Fleece', price: 24990, quantity: 1, size: 'L' },
      { productId: 'sp-1', title: 'Минималистичная бейсболка Cotton Mono', price: 8990, quantity: 1, size: 'One Size' }
    ],
    totalAmount: 33980,
    status: 'new',
    date: '31.08.2026, 19:45',
    deliveryAddress: 'г. Алматы, пр. Достык 120, кв 45',
  },
  {
    id: 'SO-1092',
    customerName: 'Динара Сатпаева',
    customerPhone: '+7 (777) 321-65-98',
    items: [
      { productId: 'sp-3', title: 'Брюки-карго Wide Fit Utility Pants', price: 19990, quantity: 1, size: 'M' }
    ],
    totalAmount: 19990,
    status: 'processing',
    date: '31.08.2026, 16:20',
    deliveryAddress: 'г. Астана, ул. Кунаева 14',
  },
  {
    id: 'SO-1088',
    customerName: 'Ернар Касымов',
    customerPhone: '+7 (701) 456-78-90',
    items: [
      { productId: 'sp-5', title: 'Панама из плотного хлопка Bucket Canvas', price: 7990, quantity: 2, size: 'One Size' }
    ],
    totalAmount: 15980,
    status: 'shipped',
    date: '30.08.2026, 12:10',
    deliveryAddress: 'г. Шымкент, мкр. Нурсат 8',
  },
  {
    id: 'SO-1081',
    customerName: 'Мадина Омарова',
    customerPhone: '+7 (705) 112-33-44',
    items: [
      { productId: 'sp-1', title: 'Минималистичная бейсболка Cotton Mono', price: 8990, quantity: 1, size: 'One Size' }
    ],
    totalAmount: 8990,
    status: 'delivered',
    date: '29.08.2026, 14:05',
    deliveryAddress: 'г. Алматы, ул. Желтоксан 115',
  },
  {
    id: 'SO-1075',
    customerName: 'Тимур Алиев',
    customerPhone: '+7 (708) 555-12-88',
    items: [
      { productId: 'sp-2', title: 'Оверсайз худи Heavyweight Fleece', price: 24990, quantity: 1, size: 'XL' }
    ],
    totalAmount: 24990,
    status: 'delivered',
    date: '28.08.2026, 11:30',
    deliveryAddress: 'г. Караганда, пр. Бухар Жырау 32',
  },
];

const INITIAL_MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: 'Март', amount: 480000 },
  { month: 'Апрель', amount: 620000 },
  { month: 'Май', amount: 790000 },
  { month: 'Июнь', amount: 890000 },
  { month: 'Июль', amount: 1120000 },
  { month: 'Август', amount: 1450000 },
];

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      products: INITIAL_SELLER_PRODUCTS,
      orders: INITIAL_SELLER_ORDERS,
      monthlyRevenue: INITIAL_MONTHLY_REVENUE,

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
          rating: 5.0,
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
          products: INITIAL_SELLER_PRODUCTS,
          orders: INITIAL_SELLER_ORDERS,
          monthlyRevenue: INITIAL_MONTHLY_REVENUE,
        });
      },
    }),
    {
      name: 'kitapall-seller-store',
    }
  )
);
