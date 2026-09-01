import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Receipt,
  FileText,
  Printer,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { Modal } from '../../components/ui/Modal';
import { SafeImage } from '../../components/ui/SafeImage';
import { Order } from '../../types';

type ClientTab = 'overview' | 'orders' | 'profile';

export const ClientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, getTotalExpenses } = useOrderStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as ClientTab) || 'overview';
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const totalSpent = getTotalExpenses();
  const ordersCount = orders.length;
  const avgCheck = ordersCount > 0 ? Math.round(totalSpent / ordersCount) : 0;

  return (
    <div className="pb-16 pt-2">
      {/* Top Breadcrumb & Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Личный кабинет
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Управление заказами и историей расходов
            </p>
          </div>
        </div>

        <Link
          to="/catalog"
          className="hidden sm:inline-flex items-center gap-2 bg-[#F14635] text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>В каталог одежды</span>
        </Link>
      </div>

      {/* Direct Horizontal Tabs Bar for Client */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'overview', label: 'Мои расходы' },
          { id: 'orders', label: `Мои заказы (${orders.length})` },
          { id: 'profile', label: 'Настройки профиля' },
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
        {/* TAB 1: Overview & Spending */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Spending Analytics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Всего потрачено</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-[#F14635] rounded-xl shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {totalSpent.toLocaleString()} ₸
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  По всем покупкам
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Покупок оформлено</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {ordersCount} заказов
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Мгновенная выдача
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Средний чек</span>
                  <div className="p-2 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {avgCheck.toLocaleString()} ₸
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  На один заказ
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white">Последние заказы</h3>
                  <p className="text-xs text-gray-400">Быстрый доступ к электронным чекам</p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => setSearchParams({ tab: 'orders' })}
                    className="text-xs font-bold text-[#F14635] hover:underline cursor-pointer"
                  >
                    Смотреть все ({orders.length})
                  </button>
                )}
              </div>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-[#161616] p-4 rounded-2xl flex flex-col gap-3 shadow-xs border border-transparent dark:border-neutral-800/60"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-50 dark:bg-[#222222] rounded-xl text-gray-800 dark:text-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-gray-900 dark:text-white block">
                              Заказ #{order.id}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {order.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-neutral-800/60">
                        <span className="font-black text-sm text-gray-900 dark:text-white">
                          {order.totalAmount.toLocaleString()} ₸
                        </span>
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Чек</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#161616] rounded-2xl p-8 text-center text-xs text-gray-400">
                  История покупок пока пуста
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">История всех заказов</h2>
                <p className="text-xs text-gray-400">Детализация покупок и печать чеков</p>
              </div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1 rounded-full">
                Всего: {orders.length}
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 space-y-4"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-gray-200/50 dark:border-neutral-800/60">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-gray-900 dark:text-white">Заказ #{order.id}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.createdAt}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Оплачено и выдано</span>
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white">
                          {order.totalAmount.toLocaleString()} ₸
                        </span>
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-white dark:hover:bg-[#1a1a1a] transition-colors shadow-xs bg-white/50 dark:bg-[#161616] cursor-pointer"
                          title="Посмотреть чек"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                              <span>{item.quantity} шт. {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                              <span className="font-bold text-gray-900 dark:text-white">
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
                        Оплата: {order.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-12 text-center text-xs text-gray-400 space-y-3">
                <p>У вас еще нет совершенных покупок</p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 bg-[#F14635] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#E03221]"
                >
                  <span>Перейти в каталог</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-xs">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Данные пользователя</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#161616] p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold block">ФИО Клиента</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{user?.name || 'Клиент'}</p>
              </div>

              <div className="bg-white dark:bg-[#161616] p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold block">Email аккаунта</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{user?.email || 'Не указан'}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161616] p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <MapPin className="w-4 h-4 text-[#F14635]" />
                <span>Сохраненный адрес доставки</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">г. Алматы, пр. Абая 150, блок Б</p>
            </div>

            <div className="bg-white dark:bg-[#161616] p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <ShieldCheck className="w-4 h-4 text-[#F14635]" />
                <span>Безопасность и Kaspi Pay</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                Все платежи защищены протоколом безопасности Kaspi. Средства списываются только при подтверждении заказа.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Electronic Receipt Modal */}
      {selectedReceiptOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReceiptOrder(null)}
          title={`Электронный чек #${selectedReceiptOrder.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="pb-3 text-center">
              <span className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">ТОО «KitapAll Marketplace»</p>
              <p className="text-[11px] text-gray-400">Дата: {selectedReceiptOrder.createdAt}</p>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-[#161616] p-4 rounded-2xl">
              {selectedReceiptOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-gray-400 text-[10px]">{item.quantity} шт. × {item.price.toLocaleString()} ₸</p>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-1.5 px-1">
              <div className="flex justify-between font-bold text-sm">
                <span className="text-gray-700 dark:text-gray-300">Итого оплачено:</span>
                <span className="text-[#F14635] font-black text-base">{selectedReceiptOrder.totalAmount.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                <span>Способ оплаты:</span>
                <span className="uppercase font-semibold text-gray-800 dark:text-gray-200">{selectedReceiptOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                <span>Статус:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Оплачено и выдано</span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-800 dark:text-gray-200 py-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Распечатать</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 bg-[#F14635] hover:bg-[#E03221] text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
