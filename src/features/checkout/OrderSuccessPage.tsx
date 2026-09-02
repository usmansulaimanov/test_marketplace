import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useT } from '../../i18n/useT';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useT();
  const order = useOrderStore(state => state.orders.find(o => o.id === id));

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 mb-4">{t.dashboard.noOrdersTitle}</p>
        <Link to="/" className="text-[#F14635] font-bold hover:underline">
          {t.errors.goHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 bg-gray-50 dark:bg-[#111111] rounded-3xl p-8 sm:p-10 text-center space-y-6">
      <div className="w-20 h-20 bg-white dark:bg-[#1a1a1a] text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          {language === 'kk' ? 'Тапсырыс сәтті рәсімделді!' : 'Заказ успешно оформлен!'}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t.dashboard.orderNum(order.id)}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 text-left shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-white/5 pb-2">
          <span className="text-gray-500 dark:text-gray-400">{t.cart.summary}:</span>
          <span className="font-black text-gray-900 dark:text-white text-sm">{order.totalAmount.toLocaleString()} ₸</span>
        </div>
        <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-white/5 pb-2">
          <span className="text-gray-500 dark:text-gray-400">{t.cart.deliveryAddress}:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[150px] truncate" title={order.deliveryAddress}>
            {order.deliveryAddress}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">{t.common.status}:</span>
          <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md">
            {language === 'kk' ? 'Төленді' : 'Оплачено'}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          to="/dashboard"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <span>{t.dashboard.ordersTab}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/catalog"
          className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.cart.goToCatalog}</span>
        </Link>
      </div>
    </div>
  );
};
