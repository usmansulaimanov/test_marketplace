import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, RotateCcw } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductDetailModal } from '../../components/product/ProductDetailModal';
import { CATEGORIES } from '../../data/mockProducts';
import { CategoryId, Product } from '../../types';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') as CategoryId | null;

  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy
  } = useProductStore();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Sync category param from URL if present
  React.useEffect(() => {
    if (catParam && ['headwear', 'tops', 'bottoms', 'footwear'].includes(catParam)) {
      setSelectedCategory(catParam);
    }
  }, [catParam, setSelectedCategory]);

  const handleCategoryChange = (id: CategoryId) => {
    setSelectedCategory(id);
    if (id === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: id });
    }
  };

  // Extract unique brands from current products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // Price range filter
        if (selectedPriceRange === 'under_10k' && p.price >= 10000) return false;
        if (selectedPriceRange === '10k_30k' && (p.price < 10000 || p.price > 30000)) return false;
        if (selectedPriceRange === 'above_30k' && p.price <= 30000) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc) return false;
        }
        // In stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default popular
        return b.reviewsCount - a.reviewsCount;
      });
  }, [products, selectedCategory, selectedBrand, selectedPriceRange, searchQuery, inStockOnly, sortBy]);

  const hasActiveFilters = selectedBrand !== 'all' || selectedPriceRange !== 'all' || inStockOnly || searchQuery;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedPriceRange('all');
    setInStockOnly(false);
    setSearchQuery('');
    searchParams.delete('cat');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Seamless Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Каталог одежды
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Найдено моделей: <b className="text-gray-900">{filteredProducts.length}</b>
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="popular">По популярности</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>
      </div>

      {/* Categories Tabs bar (Pill buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Seamless Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-4">
          {/* Stock filter checkbox */}
          <label className="flex items-center gap-2 font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#F14635] accent-[#F14635]"
            />
            <span>Только в наличии</span>
          </label>

          {/* Brand filter dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Бренд:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-gray-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none hover:bg-gray-100 transition-colors"
            >
              <option value="all">Все бренды</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price budget filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Цена:</span>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="bg-gray-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none hover:bg-gray-100 transition-colors"
            >
              <option value="all">Любая стоимость</option>
              <option value="under_10k">До 10 000 ₸</option>
              <option value="10k_30k">10 000 — 30 000 ₸</option>
              <option value="above_30k">От 30 000 ₸</option>
            </select>
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-[#F14635] hover:underline font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить фильтры</span>
          </button>
        )}
      </div>

      {/* Search query chip */}
      {searchQuery && (
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-xs text-gray-700">
          <span>Поиск: <b>"{searchQuery}"</b></span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpenDetail={(p) => setSelectedProductForModal(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-white text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Товары не найдены</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Попробуйте изменить параметры фильтрации или поисковый запрос.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#F14635] hover:underline"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />
    </div>
  );
};
