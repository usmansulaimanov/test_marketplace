import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Trash2, 
  PlusCircle, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Lock,
  ArrowRight,
  Edit3,
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  TrendingUp,
  LogOut,
  ChevronRight,
  Calendar,
  X,
  MapPin
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useUiStore } from '../../store/useUiStore';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';

type AdminTab = 'analytics' | 'inventory' | 'orders' | 'add_product';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { products, updateStock, deleteProduct, addProduct, resetToDefaults } = useProductStore();
  const { orders, getTotalExpenses } = useOrderStore();
  const { addToast } = useToastStore();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  
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
      <div className="max-w-md mx-auto my-16 bg-gray-50 rounded-3xl p-8 sm:p-10 text-center space-y-5">
        <div className="w-16 h-16 bg-[#FFF1F0] text-[#F14635] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900">Доступ ограничен</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Раздел склада и управления доступен только для авторизованных администраторов.
          </p>
        </div>
        <Link
          to="/auth"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          <span>Войти в аккаунт</span>
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
    if (!newTitle.trim()) return;

    addProduct({
      title: newTitle.trim(),
      brand: newBrand.trim() || 'KitapAll Exclusive',
      category: newCategory,
      price: Number(newPrice),
      oldPrice: newOldPrice ? Number(newOldPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: newImageUrl.trim(),
      stock: Number(newStock),
      description: newDescription.trim(),
      sizes: newSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: newColors.split(',').map((c) => c.trim()).filter(Boolean),
    });

    addToast({
      message: `Товар «${newTitle}» добавлен на склад (${newStock} шт.)`,
      type: 'success',
    });

    setNewTitle('');
    setNewBrand('');
    setActiveTab('inventory');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="pb-16 pt-2">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Панель управления
              </h1>
              <span className="bg-[#FFF1F0] text-[#F14635] text-[10px] font-bold px-2.5 py-0.5 rounded-full hidden sm:inline-flex">
                Admin
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Учет остатков, аналитика продаж и каталог товаров
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/catalog"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-50 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors"
          >
            <span>В магазин</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={resetToDefaults}
            title="Сбросить склад к исходным демо-данным"
            className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <span className="font-black text-lg text-gray-900 tracking-tight">Меню склада</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Admin Profile Box */}
          <div className="bg-gray-50 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F14635] text-white flex items-center justify-center font-black text-lg shadow-sm">
                A
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-gray-900 truncate">Администратор</h3>
                <p className="text-[11px] text-gray-400 font-mono truncate">{user?.email}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-2.5 text-[11px] text-gray-500 flex items-center justify-between shadow-xs">
              <span>Доступ:</span>
              <span className="font-bold text-gray-900">Root</span>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="bg-gray-50 rounded-3xl p-2 space-y-1 text-xs font-bold">
            <button
              onClick={() => handleTabSelect('analytics')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-[#F14635]' : 'text-gray-400'}`} />
                <span>Обзор и аналитика</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => handleTabSelect('inventory')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-[#F14635]' : 'text-gray-400'}`} />
                <span>Склад и остатки</span>
              </div>
              <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('orders')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#F14635]' : 'text-gray-400'}`} />
                <span>Заказы клиентов</span>
              </div>
              <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('add_product')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === 'add_product'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlusCircle className={`w-4 h-4 ${activeTab === 'add_product' ? 'text-[#F14635]' : 'text-gray-400'}`} />
                <span>Добавить товар</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </nav>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-red-600 font-bold text-xs hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти из админки</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full space-y-6">
        {/* TAB 1: Analytics & Overview */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Выручка маркетплейса</span>
                  <div className="p-2 bg-white text-gray-900 rounded-xl shadow-xs">
                    <TrendingUp className="w-4 h-4 text-[#F14635]" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  {totalRevenue.toLocaleString()} ₸
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  По всем {orders.length} заказам
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Товаров на складе</span>
                  <div className="p-2 bg-white text-gray-900 rounded-xl shadow-xs">
                    <Boxes className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  {totalStockUnits} шт.
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {products.length} активных моделей
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Заканчиваются (мало)</span>
                  <div className="p-2 bg-white text-amber-600 rounded-xl shadow-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-amber-600 tracking-tight">
                  {lowStockCount} поз.
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Остаток на складе ≤ 5 шт.
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Нет в наличии</span>
                  <div className="p-2 bg-white text-rose-600 rounded-xl shadow-xs">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-rose-600 tracking-tight">
                  {outOfStockCount} поз.
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Требуется пополнение запасов
                </span>
              </div>
            </div>

            {/* Quick Warehouse Summary */}
            <div className="bg-gray-50 p-6 sm:p-7 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-gray-900">Категории ассортимента</h3>
                  <p className="text-xs text-gray-400">Распределение товаров по разделам</p>
                </div>
                <button
                  onClick={() => handleTabSelect('inventory')}
                  className="text-xs font-bold text-[#F14635] hover:underline"
                >
                  К таблице склада
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <div key={cat.id} className="bg-white p-4 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">
                        {cat.nameKz}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-0.5">{cat.name}</h4>
                      <span className="text-xs font-black text-gray-700 mt-2 block">
                        {count} моделей
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
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Учет остатков на складе</h2>
                <p className="text-xs text-gray-400">Найдено позиций: {filteredProducts.length}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск модели..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 outline-none shadow-xs"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as CategoryId)}
                  className="bg-white rounded-xl px-3 py-2 text-xs text-gray-800 outline-none shadow-xs cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                    <th className="py-3 px-3">Товар</th>
                    <th className="py-3 px-3">Категория</th>
                    <th className="py-3 px-3">Цена</th>
                    <th className="py-3 px-3 text-center">Остаток (шт.)</th>
                    <th className="py-3 px-3">Статус</th>
                    <th className="py-3 px-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/60">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock === 0;
                    const isLow = p.stock > 0 && p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-white/60 transition-colors">
                        {/* Product */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-10 h-12 object-cover rounded-xl bg-white shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                                {p.brand}
                              </span>
                              <span className="font-semibold text-gray-900 block truncate max-w-[180px]">
                                {p.title}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 text-gray-600 capitalize">
                          {p.category}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 font-black text-gray-900">
                          {p.price.toLocaleString()} ₸
                        </td>

                        {/* Stock Quick Adjustment */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                updateStock(p.id, p.stock - 1);
                                addToast({ message: `Остаток «${p.title}»: ${Math.max(0, p.stock - 1)} шт.`, type: 'info' });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-gray-900">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => {
                                updateStock(p.id, p.stock + 1);
                                addToast({ message: `Остаток «${p.title}»: ${p.stock + 1} шт.`, type: 'info' });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              <span>Нет</span>
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Мало ({p.stock})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              <CheckCircle2 className="w-3 h-3 text-gray-900" />
                              <span>Есть</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/product/${p.id}/edit`}
                              className="text-gray-400 hover:text-gray-900 p-1.5 rounded-xl hover:bg-white transition-colors"
                              title="Редактировать товар (отдельная страница)"
                            >
                              <Edit3 className="w-4 h-4 text-[#F14635]" />
                            </Link>
                            <button
                              onClick={() => {
                                deleteProduct(p.id);
                                addToast({ message: `Товар «${p.title}» удален`, type: 'error' });
                              }}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-white transition-colors"
                              title="Удалить"
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
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Заказы покупателей</h2>
                <p className="text-xs text-gray-400">Всего заказов: {orders.length}</p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 rounded-3xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-gray-200/50">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-gray-900">Заказ #{order.id}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.createdAt}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />
                          <span>Оплачено и выдано</span>
                        </span>
                        <span className="text-base font-black text-gray-900">
                          {order.totalAmount.toLocaleString()} ₸
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-xs"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-14 object-cover rounded-xl bg-gray-50 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              {item.brand}
                            </span>
                            <h4 className="text-xs font-semibold text-gray-900 truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] text-gray-600 mt-1">
                              <span>{item.quantity} шт. {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                              <span className="font-bold text-gray-900">
                                {(item.price * item.quantity).toLocaleString()} ₸
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Адрес: {order.deliveryAddress}</span>
                      <span className="uppercase font-bold text-gray-500">
                        Способ: {order.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-12 text-center text-xs text-gray-400">
                Пока нет оформленных заказов
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Add New Product Form */}
        {activeTab === 'add_product' && (
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-xs">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Добавить новый товар</h2>
              <p className="text-xs text-gray-400 mt-0.5">Заполните параметры для добавления в каталог</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Название товара</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Оверсайз футболка Cotton Graphic"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Бренд / Производитель</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Qazaq Republic"
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Категория</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs cursor-pointer"
                  >
                    <option value="headwear">Головные уборы</option>
                    <option value="tops">Верх</option>
                    <option value="bottoms">Низ</option>
                    <option value="footwear">Обувь</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Цена (₸)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Старая цена (₸)</label>
                  <input
                    type="number"
                    value={newOldPrice || ''}
                    onChange={(e) => setNewOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Не обязательно"
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Количество на складе (шт.)</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Ссылка на фото (URL)</label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Размеры (через запятую)</label>
                  <input
                    type="text"
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Цвета (через запятую)</label>
                  <input
                    type="text"
                    value={newColors}
                    onChange={(e) => setNewColors(e.target.value)}
                    placeholder="Черный, Белый"
                    className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Описание товара</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white rounded-2xl p-4 text-xs text-gray-900 outline-none shadow-xs resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#F14635] hover:bg-[#E03221] text-white px-8 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-[0.98]"
                >
                  Добавить товар в каталог
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
