import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { ProductCard } from '../../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { items } = useWishlistStore();

  return (
    <div className="pb-16 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Heart className="w-7 h-7 text-[#F14635] fill-current" />
          Избранное
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {items.length} {items.length === 1 ? 'товар' : 'товаров'} в списке желаний
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl mt-8 max-w-2xl mx-auto px-4">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">В избранном пока пусто</h2>
          <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
            Добавляйте сюда товары, которые вам понравились, нажав на сердечко, чтобы не потерять их.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-8 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
          >
            <span>Перейти в каталог</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
