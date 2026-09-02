import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Lock,
  ArrowRight,
  Edit3,
  Boxes,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { SafeImage } from '../../components/ui/SafeImage';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { useT } from '../../i18n/useT';

type AdminTab = 'analytics' | 'inventory' | 'orders' | 'add_product';

export const AdminDashboardPage: React.FC = () => {
  const { t, language } = useT();
  const { user } = useAuthStore();
  const { products, updateStock, deleteProduct, addProduct, resetToDefaults } = useProductStore();
  const { orders, getTotalExpenses } = useOrderStore();
  const { addToast } = useToastStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as AdminTab) || 'analytics';
  
  const [filterCategory, setFilterCategory] = useState<CategoryId>('all');
  const [search, setSearch] = useState('');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('tops');
  const [newPrice, setNewPrice] = useState(15990);
  const [newOldPrice, setNewOldPrice] = useState<number | undefined>(undefined);
  const [newStock, setNewStock] = useState(20);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');
  const [newSizes, setNewSizes] = useState('S, M, L, XL');
  const [newColors, setNewColors] = useState('Черный, Белый');
  const [newDescription, setNewDescription] = useState('Премиальное качество, создано для комфорта.');

  // If user is not logged in as Admin, show access gate
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 bg-gray-50 dark:bg-[#111111] rounded-3xl p-8 sm:p-10 text-center space-y-5">
        <div className="w-16 h-16 bg-[#FFF1F0] dark:bg-red-900/30 text-[#F14635] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {language === 'kk' ? 'Қолжетімділік шектелген' : 'Доступ ограничен'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'kk'
              ? 'Қойма және басқару бөлімі тек жүйе әкімшісіне қолжетімді.'
              : 'Раздел склада и управления доступен только для авторизованных администраторов.'}
          </p>
        </div>
        <Link
          to="/auth"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>{t.auth.loginTitle}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // KPI Calculations
  const totalRevenue = getTotalExpenses();
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    const parsedPrice = Math.max(0, Number(newPrice) || 0);
    const parsedOldPrice = newOldPrice ? Math.max(0, Number(newOldPrice)) : undefined;
    const parsedStock = Math.max(0, Number(newStock) || 0);

    if (!cleanTitle) {
      addToast({
        message: language === 'kk' ? 'Тауар атауын көрсетіңіз' : 'Укажите название товара',
        type: 'error',
      });
      return;
    }

    if (parsedPrice <= 0) {
      addToast({
        message: language === 'kk' ? 'Тауар бағасы 0 ₸ жоғары болуы тиіс' : 'Цена товара должна быть больше 0 ₸',
        type: 'error',
      });
      return;
    }

    addProduct({
      title: cleanTitle,
      brand: newBrand.trim() || 'KitapAll Exclusive',
      category: newCategory,
      price: parsedPrice,
      oldPrice: parsedOldPrice,
      rating: 0.0,
      reviewsCount: 0,
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      stock: parsedStock,
      description: newDescription.trim() || 'Премиальное качество, создано для комфорта.',
      sizes: newSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: newColors.split(',').map((c) => c.trim()).filter(Boolean),
    });

    addToast({
      message: `${language === 'kk' ? 'Тауар қоймаға қосылды' : 'Товар добавлен на склад'}: «${cleanTitle}» (${parsedStock} ${t.common.units})`,
      type: 'success',
    });

    // Full form reset
    setNewTitle('');
    setNewBrand('');
    setNewPrice(9990);
    setNewOldPrice(undefined);
    setNewStock(20);
    setNewImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');
    setNewSizes('S, M, L, XL');
    setNewColors('Черный, Белый');
    setNewDescription('Премиальное качество, создано для комфорта.');
    setNewCategory('headwear');

    setSearchParams({ tab: 'inventory' });
  };

  return (
    <div className="pb-16 pt-2">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                {t.admin.title}
              </h1>
              <span className="bg-[#FFF1F0] dark:bg-red-900/30 text-[#F14635] px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{t.admin.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/catalog"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <span>{t.nav.showcase}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={resetToDefaults}
            title={language === 'kk' ? 'Қойманы бастапқы қалпына келтіру' : 'Сбросить склад к исходным демо-данным'}
            className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#111111] text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Direct Horizontal Tabs Bar for Admin */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'analytics', label: t.admin.tabs.analytics },
          { id: 'inventory', label: `${t.admin.tabs.inventory} (${products.length})` },
          { id: 'orders', label: t.admin.tabs.orders },
          { id: 'add_product', label: t.admin.tabs.addProduct },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-gray-50 dark:bg-[#111111] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="w-full space-y-6">
        {/* TAB 1: Analytics & Overview */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">{t.admin.quickStats.totalRevenue}</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
                    <TrendingUp className="w-4 h-4 text-[#F14635]" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {totalRevenue.toLocaleString()} ₸
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {orders.length} {language === 'kk' ? 'тапсырыс бойынша' : 'заказам'}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">{t.admin.quickStats.itemsInStock}</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
                    <Boxes className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {totalStockUnits} {t.common.units}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {products.length} {language === 'kk' ? 'белсенді үлгі' : 'активных моделей'}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">{language === 'kk' ? 'Аз қалғандар' : 'Заканчиваются'}</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-amber-600 rounded-xl shadow-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-amber-600 tracking-tight">
                  {lowStockCount} {t.common.units}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {language === 'kk' ? 'Қоймадағы қалдық ≤ 5 дана' : 'Остаток на складе ≤ 5 шт.'}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">{t.product.outOfStock}</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-rose-600 rounded-xl shadow-xs">
                    <Boxes className="w-4 h-4 text-rose-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-rose-600 tracking-tight">
                  {outOfStockCount} {t.common.units}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {language === 'kk' ? 'Қорды толықтыру қажет' : 'Требуется пополнение'}
                </span>
              </div>
            </div>

            {/* Quick Warehouse Summary */}
            <div className="bg-gray-50 dark:bg-[#111111] p-6 sm:p-7 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white">
                    {t.landing.categoriesTitle}
                  </h3>
                  <p className="text-xs text-gray-400">{language === 'kk' ? 'Бөлімдер бойынша тауарлар үлесі' : 'Распределение товаров по разделам'}</p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'inventory' })}
                  className="text-xs font-bold text-[#F14635] hover:underline cursor-pointer"
                >
                  {language === 'kk' ? 'Қойма кестесіне өту' : 'К таблице склада'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <div key={cat.id} className="bg-white dark:bg-[#161616] p-4 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">
                        {language === 'kk' ? cat.nameKz : cat.name}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">
                        {t.catalog.categories[cat.id] || cat.name}
                      </h4>
                      <span className="text-xs font-black text-gray-700 dark:text-gray-300 mt-2 block">
                        {count} {language === 'kk' ? 'үлгі' : 'моделей'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Warehouse Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{language === 'kk' ? 'Қоймадағы қалдық есебі' : 'Учет остатков на складе'}</h2>
                <p className="text-xs text-gray-400">{t.catalog.foundCount(filteredProducts.length)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'kk' ? 'Үлгіні іздеу...' : 'Поиск модели...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none shadow-xs"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as CategoryId)}
                  className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none shadow-xs cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id === 'all' ? t.catalog.allCategories : (t.catalog.categories[c.id] || (language === 'kk' ? c.nameKz : c.name))}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-3">{t.seller.table.product}</th>
                    <th className="py-3 px-3">{t.seller.table.category}</th>
                    <th className="py-3 px-3">{t.seller.table.price}</th>
                    <th className="py-3 px-3 text-center">{t.seller.table.stock}</th>
                    <th className="py-3 px-3">{t.seller.table.status}</th>
                    <th className="py-3 px-3 text-right">{t.seller.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/60 dark:divide-neutral-800/60">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock === 0;
                    const isLow = p.stock > 0 && p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-white/60 dark:hover:bg-[#161616]/60 transition-colors">
                        {/* Product */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <SafeImage
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-10 h-12 object-cover rounded-xl bg-white dark:bg-[#1a1a1a] shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                                {p.brand}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white block truncate max-w-[180px]">
                                {p.title}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 text-gray-600 dark:text-gray-400 capitalize">
                          {t.catalog.categories[p.category] || p.category}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 font-black text-gray-900 dark:text-white">
                          {p.price.toLocaleString()} ₸
                        </td>

                        {/* Stock Quick Adjustment */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                updateStock(p.id, p.stock - 1);
                                addToast({ message: `${p.title}: ${Math.max(0, p.stock - 1)} ${t.common.units}`, type: 'info' });
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 transition-colors shadow-xs cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-gray-900 dark:text-white">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => {
                                updateStock(p.id, p.stock + 1);
                                addToast({ message: `${p.title}: ${p.stock + 1} ${t.common.units}`, type: 'info' });
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 transition-colors shadow-xs cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <span>{t.product.outOfStock}</span>
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{t.product.leftCount(p.stock)}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              <CheckCircle2 className="w-3 h-3 text-gray-900 dark:text-white" />
                              <span>{language === 'kk' ? 'Қоймада бар' : 'Есть'}</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/product/${p.id}/edit`}
                              className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-white dark:hover:bg-[#1a1a1a] transition-colors"
                              title={t.product.editProduct}
                            >
                              <Edit3 className="w-4 h-4 text-[#F14635]" />
                            </Link>
                            <button
                              onClick={() => {
                                deleteProduct(p.id);
                                addToast({ message: `${language === 'kk' ? 'Тауар өшірілді' : 'Товар удален'}: «${p.title}»`, type: 'error' });
                              }}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-white dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                              title={t.common.delete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.admin.tabs.orders}</h2>
                <p className="text-xs text-gray-400">{t.seller.kpi.totalOrders}: {orders.length}</p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-gray-200/50 dark:border-neutral-800/60">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-gray-900 dark:text-white">{t.dashboard.orderNum(order.id)}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.createdAt}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                          <span>{language === 'kk' ? 'Төленді және берілді' : 'Оплачено и выдано'}</span>
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white">
                          {order.totalAmount.toLocaleString()} ₸
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white dark:bg-[#161616] p-3 rounded-2xl shadow-xs"
                        >
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-14 object-cover rounded-xl bg-gray-50 dark:bg-[#222222] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              {item.brand}
                            </span>
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                              <span>{item.quantity} {t.common.units} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {(item.price * item.quantity).toLocaleString()} ₸
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {t.cart.deliveryAddress}: {order.deliveryAddress}</span>
                      <span className="uppercase font-bold text-gray-500">
                        {language === 'kk' ? 'Төлем' : 'Способ'}: {order.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-12 text-center text-xs text-gray-400">
                {t.dashboard.noOrdersDesc}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Add New Product Form */}
        {activeTab === 'add_product' && (
          <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-xs">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.seller.addProductModal.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{language === 'kk' ? 'Каталогқа қосу үшін параметрлерді толтырыңыз' : 'Заполните параметры для добавления в каталог'}</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.name}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Cotton Graphic T-Shirt"
                  className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.brand}</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="KitapAll Exclusive"
                    className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.category}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs cursor-pointer"
                  >
                    <option value="headwear">{t.catalog.categories.headwear}</option>
                    <option value="tops">{t.catalog.categories.tops}</option>
                    <option value="bottoms">{t.catalog.categories.bottoms}</option>
                    <option value="footwear">{t.catalog.categories.footwear}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.price}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.oldPrice}</label>
                  <input
                    type="number"
                    min="0"
                    value={newOldPrice || ''}
                    onChange={(e) => setNewOldPrice(e.target.value ? Math.max(0, Number(e.target.value)) : undefined)}
                    placeholder={language === 'kk' ? 'Міндетті емес' : 'Не обязательно'}
                    className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.stock}</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.imageUrl}</label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.sizes}</label>
                  <input
                    type="text"
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.colors}</label>
                  <input
                    type="text"
                    value={newColors}
                    onChange={(e) => setNewColors(e.target.value)}
                    placeholder="Черный, Белый"
                    className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.description}</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl p-4 text-xs outline-none shadow-xs resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#F14635] hover:bg-[#E03221] text-white px-8 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  {t.seller.addProductBtn}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
