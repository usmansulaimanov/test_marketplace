import { describe, it, expect, beforeEach } from 'vitest';
import { useSellerStore } from '../store/useSellerStore';

describe('Seller Operations & Orders Management', () => {
  beforeEach(() => {
    useSellerStore.getState().resetSellerData();
  });

  it('adds a new product with zero initial sales and active state', () => {
    useSellerStore.getState().addProduct({
      title: 'Худи Oversize Streetwear',
      brand: 'KitapAll',
      category: 'tops',
      price: 18990,
      stock: 15,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
    });

    const { products } = useSellerStore.getState();
    expect(products.length).toBe(1);
    expect(products[0].title).toBe('Худи Oversize Streetwear');
    expect(products[0].salesCount).toBe(0);
    expect(products[0].rating).toBe(0.0);
    expect(products[0].reviewsCount).toBe(0);
    expect(products[0].isActive).toBe(true);
  });

  it('toggles product visibility on and off', () => {
    useSellerStore.getState().addProduct({
      title: 'Кроссовки Runner Pro',
      brand: 'KitapAll',
      category: 'footwear',
      price: 24990,
      stock: 8,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    });

    const productId = useSellerStore.getState().products[0].id;
    useSellerStore.getState().toggleProductActive(productId);
    expect(useSellerStore.getState().products[0].isActive).toBe(false);

    useSellerStore.getState().toggleProductActive(productId);
    expect(useSellerStore.getState().products[0].isActive).toBe(true);
  });

  it('updates stock safely', () => {
    useSellerStore.getState().addProduct({
      title: 'Кепка Basic Minimal',
      brand: 'KitapAll',
      category: 'headwear',
      price: 5990,
      stock: 5,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
    });

    const productId = useSellerStore.getState().products[0].id;
    useSellerStore.getState().updateStock(productId, 20);
    expect(useSellerStore.getState().products[0].stock).toBe(20);

    useSellerStore.getState().updateStock(productId, -10);
    expect(useSellerStore.getState().products[0].stock).toBe(0);
  });
});
