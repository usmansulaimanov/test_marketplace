import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Boxes, 
  Star, 
  ArrowRight, 
  Plus, 
  Clock, 
  Truck, 
  PackageCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeImage } from '../../components/ui/SafeImage';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { products, orders, monthlyRevenue, toggleProductActive } = useSellerStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeProducts = products.filter((p) => p.isActive).length;
  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  const monthsList = ['Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'];
  const displayRevenue = monthlyRevenue.length > 0
    ? monthlyRevenue
    : monthsList.map((m) => ({ month: m, amount: 0 }));

  const maxRevenue = Math.max(...displayRevenue.map((m) => m.amount), 1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 bg-[#FFF1F0] dark:bg-[#F14635]/20 text-[#F14635] text-[10px] font-bold px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Новый
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <Boxes className="w-3 h-3" /> В сборке
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <Truck className="w-3 h-3" /> В пути
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <PackageCheck className="w-3 h-3" /> Доставлен
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Сводка продавца
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Магазин: <span className="font-bold text-gray-900 dark:text-white">{user?.name}</span>
          </p>
        </div>

        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить товар</span>
        </Link>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Общая выручка</span>
            <div className="p-2 bg-white dark:bg-[#1a1a1a] text-[#F14635] rounded-xl shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {totalRevenue.toLocaleString()} ₸
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            +18.4% за этот месяц
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Всего заказов</span>
            <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {orders.length}
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            {orders.filter((o) => o.status === 'new').length} новых к обработке
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Активных товаров</span>
            <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {activeProducts} / {products.length}
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            В каталоге маркетплейса
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Рейтинг магазина</span>
            <div className="p-2 bg-white dark:bg-[#1a1a1a] text-amber-500 rounded-xl shadow-xs">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-baseline gap-1">
            4.9 <span className="text-xs text-gray-400 font-medium">/ 5.0</span>
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            На основе 138 отзывов
          </span>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-gray-50 dark:bg-[#111111] p-6 sm:p-7 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-gray-900 dark:text-white">Динамика продаж</h3>
            <p className="text-xs text-gray-400 mt-0.5">Помесячный объем реализованной продукции</p>
          </div>
          <Link
            to="/seller/analytics"
            className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
          >
            <span>Вся аналитика</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Minimalist Bar Chart in Kaspi Style */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2">
          {displayRevenue.map((item) => {
            const heightPercent = item.amount > 0 ? Math.round((item.amount / maxRevenue) * 100) : 4;
            return (
              <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {item.amount > 0 ? `${(item.amount / 1000).toFixed(0)}k` : '0₸'}
                </span>
                <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-xl h-full flex items-end p-1 shadow-xs">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-orange-500 dark:bg-white group-hover:bg-orange-600 dark:group-hover:bg-orange-400 rounded-lg transition-all duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-500 truncate">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Section: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-gray-900 dark:text-white">Новые заказы</h3>
            <Link
              to="/seller/orders"
              className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
            >
              <span>Все ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#161616] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-transparent dark:border-neutral-800/60"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-black text-gray-900 dark:text-white">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                    {order.customerName}
                  </p>
                  <p className="text-[10px] text-gray-400">{order.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-gray-900 dark:text-white block">
                    {order.totalAmount.toLocaleString()} ₸
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} шт.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-gray-900 dark:text-white">Мои товары</h3>
            <Link
              to="/seller/products"
              className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
            >
              <span>Управление складом</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#161616] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-transparent dark:border-neutral-800/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-11 h-11 object-cover rounded-xl shrink-0 bg-gray-100 dark:bg-[#111111]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {product.title}
                    </h4>
                    <span className="text-[11px] font-black text-[#F14635] block">
                      {product.price.toLocaleString()} ₸
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      {product.stock} шт.
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {product.salesCount} прод.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleProductActive(product.id)}
                    title={product.isActive ? 'Снять с витрины' : 'Опубликовать'}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      product.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-[#222222] text-gray-400'
                    }`}
                  >
                    {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
