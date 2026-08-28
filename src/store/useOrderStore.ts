import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Order } from '../types';

interface OrderState {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    totalAmount: number,
    paymentMethod: 'kaspi_qr' | 'kaspi_gold' | 'card',
    address: string
  ) => Order;
  getTotalExpenses: () => number;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7841',
    createdAt: '2026-02-24 14:35',
    totalAmount: 32980,
    status: 'paid_and_delivered',
    paymentMethod: 'kaspi_qr',
    deliveryAddress: 'г. Алматы, пр. Достык 180',
    items: [
      {
        productId: 'hw-1',
        title: 'Минималистичная бейсболка Cotton Mono',
        brand: 'Qazaq Republic',
        price: 8990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
        selectedSize: 'One Size',
      },
      {
        productId: 'top-1',
        title: 'Худи Oversize Heavyweight 450 GSM',
        brand: 'Raw Essentials',
        price: 23990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
        selectedSize: 'L',
      }
    ],
  },
  {
    id: 'ORD-6520',
    createdAt: '2026-02-15 18:10',
    totalAmount: 38990,
    status: 'paid_and_delivered',
    paymentMethod: 'kaspi_gold',
    deliveryAddress: 'г. Астана, ул. Сыганак 45',
    items: [
      {
        productId: 'ftw-1',
        title: 'Кожаные кеды Court Classic White',
        brand: 'Nordic Heritage',
        price: 38990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        selectedSize: '42',
      }
    ],
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,

      createOrder: (items, totalAmount, paymentMethod, address) => {
        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          items: items.map((i) => ({
            productId: i.product.id,
            title: i.product.title,
            brand: i.product.brand,
            price: i.product.price,
            quantity: i.quantity,
            imageUrl: i.product.imageUrl,
            selectedSize: i.selectedSize,
          })),
          totalAmount,
          status: 'paid_and_delivered',
          paymentMethod,
          deliveryAddress: address || 'Самовывоз / Доставка по адресу',
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getTotalExpenses: () => {
        return get().orders.reduce((sum, o) => sum + o.totalAmount, 0);
      },
    }),
    {
      name: 'kitap-orders-store',
    }
  )
);
