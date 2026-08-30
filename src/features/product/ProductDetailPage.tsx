import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { ProductCard } from '../../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Черный');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 bg-gray-50 rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-white text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-7 h-7 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Товар не найден</h2>
        <p className="text-xs text-gray-500">
          Возможно, товар был удален со склада или указан неверный ID ({id}).
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-[#F14635] text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = () => {
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

  const handleInstantBuy = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize);
    navigate('/cart');
  };

  // Related products in the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={() => navigate(`/product/${product.id}/edit`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl"
          >
            <Edit3 className="w-4 h-4 text-[#F14635]" />
            <span>Изменить товар</span>
          </button>
        )}
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden shadow-xs">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Badges */}
          {product.oldPrice && !isOutOfStock && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#F14635] text-white text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-xs">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            </div>
          )}

          {isOutOfStock ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md">
                Нет в наличии на складе
              </span>
            </div>
          ) : isLowStock ? (
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                Осталось мало ({product.stock} шт.)
              </span>
            </div>
          ) : null}
        </div>

        {/* Right: Info & Ordering */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {product.brand}
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  ID: #{product.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
                {product.title}
              </h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-gray-900">{product.rating}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{product.reviewsCount} отзывов покупателей</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 font-medium">В наличии: {product.stock} шт.</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-5 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {product.price.toLocaleString()} ₸
              </span>
              {product.oldPrice && (
                <span className="text-base text-gray-400 line-through">
                  {product.oldPrice.toLocaleString()} ₸
                </span>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Выберите размер
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Цвет: <span className="text-gray-500 font-normal">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Описание товара
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-gray-900 text-white'
                    : 'bg-[#F14635] hover:bg-[#E03221] text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Добавлено в корзину</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>В корзину</span>
                  </>
                )}
              </button>

              <button
                onClick={handleInstantBuy}
                disabled={isOutOfStock}
                className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Купить сразу
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5 bg-gray-50 p-2.5 rounded-xl">
                <Truck className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span>Доставка 1-2 дня</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 p-2.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span>100% оригинал</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 p-2.5 rounded-xl">
                <RefreshCw className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span>Возврат 14 дней</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
