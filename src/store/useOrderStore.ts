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

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items, totalAmount, paymentMethod, address) => {
        const newOrder: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
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
      name: 'kitap-orders-store-v2',
    }
  )
);
