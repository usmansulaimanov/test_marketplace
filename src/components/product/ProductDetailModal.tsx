import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Zap, 
  Package 
} from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  // Sync defaults when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedColor(product.colors[0] || 'Default');
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor);
    setIsAdded(true);
    addToast({
      message: `«${product.title}» добавлено в корзину`,
      actionLabel: 'Корзина',
      onAction: () => navigate('/cart'),
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor);
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm border border-gray-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Big Product Image */}
        <div className="md:w-1/2 bg-gray-50 relative aspect-square md:aspect-auto">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
          {product.oldPrice && !isOutOfStock && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#F14635] text-white text-xs font-black px-2 py-1 rounded">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Right: Info and Actions */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {product.brand}
              </span>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mt-0.5">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 text-xs mt-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-bold text-gray-900">{product.rating}</span>
                <span className="text-gray-400">({product.reviewsCount} отзывов)</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Package className="w-3.5 h-3.5" />
                  <span>Остаток: <b>{product.stock} шт.</b></span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 py-2 border-y border-gray-100">
              <span className="text-2xl font-black text-gray-900">
                {product.price.toLocaleString()} ₸
              </span>
              {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {product.oldPrice.toLocaleString()} ₸
                </span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Размер: <span className="text-gray-900 font-bold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? 'border-[#F14635] bg-[#FFF1F0] text-[#F14635]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Цвет: <span className="text-gray-900 font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1 text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
              <span className="font-semibold text-gray-800 block">Описание:</span>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-gray-900 text-white'
                    : 'bg-[#F14635] hover:bg-[#E03221] text-white shadow-sm'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>В корзине</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>В корзину</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-gray-900"
              >
                <Zap className="w-4 h-4 text-[#F14635]" />
                <span>Купить сразу</span>
              </button>
            </div>

            {/* Guarantee badges */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>1-2 дня доставка</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Оригинальное качество</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
