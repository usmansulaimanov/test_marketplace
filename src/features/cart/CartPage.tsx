import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../../components/ui/Modal';
import { Order } from '../../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { createOrder } = useOrderStore();
  const { updateBalance } = useAuthStore();

  const [address, setAddress] = useState('г. Алматы, пр. Абая 150');
  const [paymentMethod, setPaymentMethod] = useState<'kaspi_qr' | 'kaspi_gold' | 'card'>('kaspi_qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 20000 || totalPrice === 0 ? 0 : 1500;
  const finalAmount = totalPrice + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    // Simulate instant payment in Kaspi style
    setTimeout(() => {
      const newOrder = createOrder(items, finalAmount, paymentMethod, address);
      updateBalance(-finalAmount);
      clearCart();
      setIsProcessing(false);
      setCompletedOrder(newOrder);
    }, 800);
  };

  const handleSuccessClose = () => {
    setCompletedOrder(null);
    navigate('/dashboard');
  };

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="bg-gray-50 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-white text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Корзина пуста</h2>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          Вы еще не добавили ни одного товара. Перейдите в каталог одежды и выберите стильные вещи.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-7 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm"
        >
          <span>Перейти в каталог</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Корзина товаров</h1>
        <p className="text-xs text-gray-400 mt-1">
          Проверьте список покупок и оформите заказ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="bg-gray-50 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
                {/* Product Image */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-24 object-cover rounded-xl bg-white shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {item.product.brand}
                  </span>
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {item.product.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    {item.selectedSize && (
                      <span className="bg-white px-2.5 py-0.5 rounded-md text-[10px] font-bold text-gray-700 shadow-xs">
                        Размер: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-black text-gray-900 mt-2">
                    {(item.product.price * item.quantity).toLocaleString()} ₸
                    <span className="text-xs font-normal text-gray-400 ml-2">
                      ({item.product.price.toLocaleString()} ₸ / шт.)
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center bg-white rounded-xl shadow-xs overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-white transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-1 pt-2">
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Очистить корзину
            </button>
            <Link
              to="/catalog"
              className="text-xs text-gray-600 hover:text-[#F14635] font-bold flex items-center gap-1"
            >
              <span>Продолжить покупки</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Checkout Box */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 sm:p-7 rounded-3xl space-y-6">
            <h2 className="font-black text-lg text-gray-900">Детали заказа</h2>

            {/* Delivery address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Адрес доставки
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Город, улица, дом, квартира"
                className="w-full bg-white rounded-xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Способ оплаты
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kaspi_qr')}
                  className={`p-3 rounded-2xl text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'kaspi_qr'
                      ? 'bg-gray-900 text-white font-bold shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-[10px]">Kaspi QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('kaspi_gold')}
                  className={`p-3 rounded-2xl text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'kaspi_gold'
                      ? 'bg-gray-900 text-white font-bold shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px]">Kaspi Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-gray-900 text-white font-bold shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px]">Карта Visa</span>
                </button>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-gray-500">
                <span>Товары ({items.length})</span>
                <span className="font-semibold text-gray-800">{totalPrice.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Доставка</span>
                <span className="font-semibold text-gray-800">{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₸`}</span>
              </div>
              <div className="pt-3 flex justify-between items-baseline">
                <span className="font-black text-sm text-gray-900">Итого:</span>
                <span className="font-black text-2xl text-[#F14635]">
                  {finalAmount.toLocaleString()} ₸
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {isProcessing ? (
                <span>Обработка платежа...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Оплатить заказ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instant Success Order Modal */}
      {completedOrder && (
        <Modal
          isOpen={true}
          onClose={handleSuccessClose}
          title="Заказ успешно оформлен и оплачен"
          maxWidth="max-w-md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 bg-[#FFF1F0] text-[#F14635] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-black text-gray-900">
                Чек #{completedOrder.id}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Оплата прошла успешно через Kaspi. Статус: <b>Получено сразу же</b>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Сумма:</span>
                <span className="font-bold text-gray-900">{completedOrder.totalAmount.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Способ:</span>
                <span className="font-semibold uppercase text-gray-800">{completedOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Адрес:</span>
                <span className="font-medium text-gray-800 text-right truncate max-w-[200px]">{completedOrder.deliveryAddress}</span>
              </div>
            </div>

            <button
              onClick={handleSuccessClose}
              className="w-full bg-[#F14635] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#E03221] transition-all"
            >
              Перейти в историю трат (Кабинет)
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
