import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types';

const mockProduct: Product = {
  id: 'prod-test-1',
  title: 'Хлопковая Футболка KitapAll',
  brand: 'KitapAll Exclusive',
  category: 'tops',
  price: 9990,
  oldPrice: 12990,
  rating: 0,
  reviewsCount: 0,
  imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  stock: 10,
  sizes: ['S', 'M', 'L'],
  colors: ['Қара', 'Ақ'],
  description: 'Премиум сапа',
  createdAt: '2026-09-01',
};

describe('Cart Business Logic & Bounds', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds item to cart with default attributes', () => {
    useCartStore.getState().addItem(mockProduct);
    const { items, getTotalItems, getTotalPrice } = useCartStore.getState();

    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe('prod-test-1');
    expect(items[0].quantity).toBe(1);
    expect(items[0].selectedSize).toBe('S');
    expect(getTotalItems()).toBe(1);
    expect(getTotalPrice()).toBe(9990);
  });

  it('increments quantity when adding same item and size', () => {
    useCartStore.getState().addItem(mockProduct, 'M', 'Қара');
    useCartStore.getState().addItem(mockProduct, 'M', 'Қара');

    const { items, getTotalItems, getTotalPrice } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
    expect(getTotalItems()).toBe(2);
    expect(getTotalPrice()).toBe(19980);
  });

  it('creates separate items for different sizes', () => {
    useCartStore.getState().addItem(mockProduct, 'S');
    useCartStore.getState().addItem(mockProduct, 'L');

    const { items, getTotalItems } = useCartStore.getState();
    expect(items.length).toBe(2);
    expect(getTotalItems()).toBe(2);
  });

  it('clamps quantity to product stock limit', () => {
    const limitedProduct = { ...mockProduct, stock: 3 };
    useCartStore.getState().addItem(limitedProduct, 'S');
    useCartStore.getState().addItem(limitedProduct, 'S');
    useCartStore.getState().addItem(limitedProduct, 'S');
    useCartStore.getState().addItem(limitedProduct, 'S'); // 4th attempt

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(3);
  });

  it('removes item from cart when quantity is updated to 0', () => {
    useCartStore.getState().addItem(mockProduct, 'S');
    useCartStore.getState().updateQuantity('prod-test-1', 0, 'S');

    const { items } = useCartStore.getState();
    expect(items.length).toBe(0);
  });
});
