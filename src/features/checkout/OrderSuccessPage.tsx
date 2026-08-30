import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = useOrderStore(state => state.orders.find(o => o.id === id));

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 mb-4">Заказ не найден или сессия истекла.</p>
        <Link to="/" className="text-[#F14635] font-bold hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 bg-gray-50 rounded-3xl p-8 sm:p-10 text-center space-y-6">
      <div className="w-20 h-20 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Заказ успешно оформлен!</h1>
        <p className="text-xs text-gray-500 mt-2">
          Номер вашего заказа: <strong className="text-gray-900 text-sm">#{order.id}</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 text-left shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
          <span className="text-gray-500">Сумма заказа:</span>
          <span className="font-black text-gray-900 text-sm">{order.totalAmount.toLocaleString()} ₸</span>
        </div>
        <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
          <span className="text-gray-500">Адрес доставки:</span>
          <span className="font-semibold text-gray-800 text-right max-w-[150px] truncate" title={order.deliveryAddress}>
            {order.deliveryAddress}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Статус:</span>
          <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Оплачено</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          to="/dashboard"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs"
        >
          <span>Перейти к электронному чеку</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/catalog"
          className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Продолжить покупки</span>
        </Link>
      </div>
    </div>
  );
};
