import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Edit3 } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, selectedSize);
    setIsAdded(true);
    addToast({
      message: `«${product.title}» добавлено в корзину`,
      actionLabel: 'Корзина',
      onAction: () => navigate('/cart'),
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}/edit`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-3">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Admin Edit Action Button on Card */}
        {isAdmin && (
          <button
            onClick={handleEditClick}
            className="absolute top-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-gray-900 text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1 shadow-xs transition-all active:scale-95"
            title="Редактировать товар (Админ)"
          >
            <Edit3 className="w-3 h-3 text-[#F14635]" />
            <span>Изменить</span>
          </button>
        )}

        {/* Stock alerts */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-md">
              Нет в наличии
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Осталось {product.stock} шт.
            </span>
          </div>
        ) : null}

        {/* Discount badge */}
        {product.oldPrice && !isOutOfStock && !isAdmin && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-[#F14635] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2 px-1">
        <div>
          {/* Brand & ID */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            <span>{product.brand}</span>
            <span className="font-mono text-[10px] font-normal text-gray-300">#{product.id}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-[#F14635] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-bold text-gray-800">{product.rating}</span>
            <span className="text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 1 && (
            <div 
              className="flex items-center gap-1.5 flex-wrap mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                    selectedSize === sz
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-black text-gray-900 tracking-tight block">
              {product.price.toLocaleString()} ₸
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-gray-400 line-through block">
                {product.oldPrice.toLocaleString()} ₸
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-gray-900 text-white'
                : 'bg-[#F14635] hover:bg-[#E03221] active:scale-95 text-white shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>В корзине</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
