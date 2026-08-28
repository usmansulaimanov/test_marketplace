import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Receipt,
  FileText,
  Printer
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { Modal } from '../../components/ui/Modal';
import { Order } from '../../types';

export const ClientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, getTotalExpenses } = useOrderStore();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const totalSpent = getTotalExpenses();
  const ordersCount = orders.length;
  const avgCheck = ordersCount > 0 ? Math.round(totalSpent / ordersCount) : 0;

  return (
    <div className="space-y-10 pb-16">
      {/* Header Profile Section */}
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-gray-900 flex items-center justify-center font-black text-xl shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
              <span className="bg-gray-200/70 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Клиент
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:px-6 flex items-center gap-4 w-full sm:w-auto shadow-xs">
          <div className="p-2.5 bg-gray-50 rounded-xl text-gray-800">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block">Баланс Kaspi Gold</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {(user?.balance || 0).toLocaleString()} ₸
            </span>
          </div>
        </div>
      </div>

      {/* Spending Analytics KPI Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Деньги и аналитика трат</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-white text-gray-900 rounded-2xl shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Всего потрачено</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {totalSpent.toLocaleString()} ₸
              </h3>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-white text-gray-900 rounded-2xl shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Количество покупок</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {ordersCount} заказов
              </h3>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-white text-gray-900 rounded-2xl shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Средний чек</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {avgCheck.toLocaleString()} ₸
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Orders and Expenses History List */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">История заказов и расходов</h2>
            <p className="text-xs text-gray-400 mt-0.5">Детализация всех совершенных покупок</p>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
          >
            <span>В каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-3xl p-6 space-y-4"
              >
                {/* Order meta bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-gray-900">Заказ #{order.id}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{order.createdAt}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />
                      <span>Оплачено и получено</span>
                    </span>
                    <span className="text-base font-black text-gray-900">
                      {order.totalAmount.toLocaleString()} ₸
                    </span>
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-white transition-colors"
                      title="Посмотреть чек"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                          <span>{item.quantity} шт. {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                          <span className="font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} ₸
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-400 flex items-center justify-between pt-1">
                  <span>Адрес доставки: {order.deliveryAddress}</span>
                  <span className="uppercase font-semibold text-gray-500">
                    Оплата: {order.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-12 text-center text-xs text-gray-400">
            История покупок пуста
          </div>
        )}
      </div>

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
              <span className="font-black text-xl text-gray-900 tracking-tight">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">ТОО «KitapAll Marketplace»</p>
              <p className="text-[11px] text-gray-400">Дата: {selectedReceiptOrder.createdAt}</p>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl">
              {selectedReceiptOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-400 text-[10px]">{item.quantity} шт. × {item.price.toLocaleString()} ₸</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-1.5 px-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Итого оплачено:</span>
                <span className="text-[#F14635] font-black text-base">{selectedReceiptOrder.totalAmount.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Способ оплаты:</span>
                <span className="uppercase font-semibold text-gray-800">{selectedReceiptOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Статус:</span>
                <span className="font-semibold text-gray-900">Оплачено и выдано</span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Распечатать</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 bg-[#F14635] hover:bg-[#E03221] text-white py-3 rounded-xl font-semibold transition-colors"
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
