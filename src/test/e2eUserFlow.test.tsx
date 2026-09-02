import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types';

const testProduct: Product = {
  id: 'prod-e2e-1',
  title: 'Классикалық футболка',
  brand: 'KitapAll Premium',
  category: 'tops',
  price: 8990,
  oldPrice: 11990,
  rating: 0,
  reviewsCount: 0,
  imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  stock: 5,
  sizes: ['S', 'M'],
  colors: ['Қара'],
  description: 'Ыңғайлы және сапалы мата.',
  createdAt: '2026-09-01',
};

describe('E2E Component & User Interaction Tests', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'kk' });
    useCartStore.getState().clearCart();
  });

  it('renders LanguageSwitcher and switches UI text on click', () => {
    render(<LanguageSwitcher />);

    const kzButton = screen.getByRole('button', { name: 'KZ' });
    const ruButton = screen.getByRole('button', { name: 'RU' });

    expect(kzButton).toBeInTheDocument();
    expect(ruButton).toBeInTheDocument();

    // Click RU
    fireEvent.click(ruButton);
    expect(useLanguageStore.getState().language).toBe('ru');

    // Click KZ
    fireEvent.click(kzButton);
    expect(useLanguageStore.getState().language).toBe('kk');
  });

  it('adds product to cart directly from ProductCard and reflects in store', () => {
    render(
      <MemoryRouter>
        <ProductCard product={testProduct} />
      </MemoryRouter>
    );

    // Verify title and price are displayed
    expect(screen.getByText('Классикалық футболка')).toBeInTheDocument();
    expect(screen.getByText(/8[, ]?990/)).toBeInTheDocument();

    // Click add to cart button
    const addToCartBtn = screen.getByRole('button', { name: /Себетке салу|В корзину/i });
    fireEvent.click(addToCartBtn);

    const { items, getTotalPrice } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe('prod-e2e-1');
    expect(getTotalPrice()).toBe(8990);
  });
});
