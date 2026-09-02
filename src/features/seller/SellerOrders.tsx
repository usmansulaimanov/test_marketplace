import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  Boxes, 
  Truck, 
  PackageCheck, 
  Phone, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { SellerOrderStatus } from '../../types';
import { useT } from '../../i18n/useT';

export const SellerOrders: React.FC = () => {
  const { t, language } = useT();
  const { orders, updateOrderStatus } = useSellerStore();
  const { addToast } = useToastStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SellerOrderStatus | 'all'>('all');

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: SellerOrderStatus, statusLabel: string) => {
    updateOrderStatus(orderId, newStatus);
    addToast({
      message: `${language === 'kk' ? 'Тапсырыс күйі өзгертілді' : 'Заказ переведен в статус'}: «${statusLabel}»`,
      type: 'success',
    });
  };

  const getStatusBadge = (status: SellerOrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FFF1F0] dark:bg-[#F14635]/20 text-[#F14635] text-xs font-bold px-3 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5" /> {t.seller.orderStatuses.new}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-xl">
            <Boxes className="w-3.5 h-3.5" /> {t.seller.orderStatuses.processing}
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-xl">
            <Truck className="w-3.5 h-3.5" /> {t.seller.orderStatuses.shipped}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-xl">
            <PackageCheck className="w-3.5 h-3.5" /> {t.seller.orderStatuses.delivered}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.seller.ordersTab}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {t.seller.kpi.totalOrders}: <span className="font-bold text-gray-900 dark:text-white">{orders.length}</span>
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-gray-50 dark:bg-[#111111] p-4 rounded-3xl space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'kk' ? 'Тапсырыс нөмірі, клиент аты немесе телефоны бойынша...' : 'Поиск по номеру заказа, имени клиента или телефону...'}
            className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-2xl text-xs outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
          {[
            { id: 'all', label: `${t.common.all} (${orders.length})` },
            { id: 'new', label: `${t.seller.orderStatuses.new} (${orders.filter((o) => o.status === 'new').length})` },
            { id: 'processing', label: `${t.seller.orderStatuses.processing} (${orders.filter((o) => o.status === 'processing').length})` },
            { id: 'shipped', label: `${t.seller.orderStatuses.shipped} (${orders.filter((o) => o.status === 'shipped').length})` },
            { id: 'delivered', label: `${t.seller.orderStatuses.delivered} (${orders.filter((o) => o.status === 'delivered').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-12 text-center space-y-3 border border-gray-100 dark:border-neutral-800/80">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t.dashboard.noOrdersTitle}</h4>
            <p className="text-xs text-gray-400">{t.dashboard.noOrdersDesc}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#111111] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-neutral-800/80 space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-50 dark:border-neutral-800/60">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-gray-900 dark:text-white">
                    #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <span className="text-xs text-gray-400 font-medium">{order.date}</span>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                {/* Customer Details */}
                <div className="space-y-2.5 bg-gray-50 dark:bg-[#161616] p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {t.auth.buyerTab}
                  </span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {order.customerName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{order.customerPhone}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </p>
                </div>

                {/* Items */}
                <div className="lg:col-span-2 space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {language === 'kk' ? 'Тапсырыс құрамы' : 'Состав заказа'} ({order.items.reduce((s, i) => s + i.quantity, 0)} {t.common.units})
                  </span>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${order.id}-${item.productId}-${item.size || idx}`}
                        className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <span className="text-[11px] text-gray-400">
                            {t.product.selectSize}: {item.size || 'One Size'} · {item.quantity} {t.common.units}
                          </span>
                        </div>
                        <span className="font-black text-gray-900 dark:text-white shrink-0">
                          {(item.price * item.quantity).toLocaleString()} ₸
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Footer & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-neutral-800/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-400 font-medium">{t.dashboard.totalAmount}:</span>
                  <span className="text-xl font-black text-[#F14635]">
                    {order.totalAmount.toLocaleString()} ₸
                  </span>
                </div>

                {/* Action Buttons depending on status */}
                <div className="flex items-center gap-2 flex-wrap">
                  {order.status === 'new' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, 'processing', t.seller.orderStatuses.processing)}
                      className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold text-xs hover:bg-black dark:hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {language === 'kk' ? 'Өңдеуге қабылдау' : 'Принять в сборку'}
                    </button>
                  )}

                  {order.status === 'processing' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, 'shipped', t.seller.orderStatuses.shipped)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{language === 'kk' ? 'Курьерге тапсыру' : 'Передать курьеру'}</span>
                    </button>
                  )}

                  {order.status === 'shipped' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, 'delivered', t.seller.orderStatuses.delivered)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'kk' ? 'Табысталғанын растау' : 'Подтвердить вручение'}</span>
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {language === 'kk' ? 'Тапсырыс сәтті жабылды' : 'Заказ успешно закрыт'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
