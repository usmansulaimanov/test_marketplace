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
  AlertCircle,
  Heart
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { SafeImage } from '../../components/ui/SafeImage';
import { useWishlistStore } from '../../store/useWishlistStore';
import { ProductCard } from '../../components/product/ProductCard';
import { useT } from '../../i18n';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useT();

  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.catalog.noProductsTitle}</h2>
        <p className="text-xs text-gray-500">{t.catalog.noProductsDesc}</p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
        >
          {t.errors.goHome}
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor);
    setIsAdded(true);
    addToast({
      message: `«${product.title}» - ${t.product.inCart}`,
      actionLabel: t.nav.cart,
      onAction: () => navigate('/cart'),
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleInstantBuy = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>

        {user?.role === 'admin' && (
          <button
            onClick={() => navigate(`/product/${product.id}/edit`)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#F14635] hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.product.editProduct}</span>
          </button>
        )}
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/5] bg-gray-50 dark:bg-[#111111] rounded-3xl overflow-hidden shadow-xs">
          <SafeImage
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
            <div className="absolute inset-0 bg-white/80 dark:bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold px-4 py-2 rounded-xl">
                {t.product.outOfStock}
              </span>
            </div>
          ) : isLowStock ? (
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                {t.product.leftCount(product.stock)}
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
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                {product.title}
              </h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{product.rating}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">
                {product.reviewsCount > 0 ? t.product.reviewsCount(product.reviewsCount) : t.product.noReviews}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 font-medium">{product.stock > 0 ? t.product.leftCount(product.stock) : t.product.outOfStock}</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
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
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {t.product.selectSize}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-xs'
                          : 'bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
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
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {t.product.colorLabel} <span className="text-gray-500 font-normal">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                          : 'bg-gray-50 dark:bg-[#111111] text-gray-600 dark:text-gray-400 hover:bg-gray-100'
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
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t.product.description}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            {user?.role === 'admin' ? (
              <div className="flex gap-3">
                <Link
                  to={`/product/${product.id}/edit`}
                  className="flex-1 bg-[#F14635] hover:bg-[#E03221] text-white py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{t.product.editProduct}</span>
                </Link>
                <Link
                  to="/admin?tab=inventory"
                  className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-neutral-800 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all"
                >
                  {t.nav.warehouse}
                </Link>
              </div>
            ) : user?.role === 'seller' ? (
              <div className="flex gap-3">
                <Link
                  to="/seller/products"
                  className="flex-1 bg-[#F14635] hover:bg-[#E03221] text-white py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{t.nav.sellerPanel}</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer ${
                    isOutOfStock
                      ? 'bg-gray-100 dark:bg-[#111111] text-gray-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                      : 'bg-[#F14635] hover:bg-[#E03221] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.product.inCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.product.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleInstantBuy}
                  disabled={isOutOfStock}
                  className="flex-1 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black py-4 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {t.product.buyNow}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'border-[#F14635] bg-[#FFF1F0] text-[#F14635]'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-[#111111] text-gray-400'
                  }`}
                  title={t.product.addToWishlist}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

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
