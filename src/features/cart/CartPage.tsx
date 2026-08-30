import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag,
  CreditCard,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { createOrder } = useOrderStore();
  const { updateBalance, isAuthenticated } = useAuthStore();

  const [address, setAddress] = useState('г. Алматы, пр. Абая 150');
  const [paymentMethod, setPaymentMethod] = useState<'kaspi_qr' | 'kaspi_gold' | 'card'>('kaspi_qr');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 20000 || totalPrice === 0 ? 0 : 1500;
  const finalAmount = totalPrice + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;
    setIsProcessing(true);

    // Simulate instant payment in Kaspi style
    setTimeout(() => {
      const newOrder = createOrder(items, finalAmount, paymentMethod, address);
      updateBalance(-finalAmount);
      clearCart();
      setIsProcessing(false);
      navigate(`/order-success/${newOrder.id}`);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-white text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Корзина пуста</h2>
        <p className="text-xs text-gray-500 max-w-[250px] mx-auto">
          Перейдите в каталог, чтобы выбрать стильную одежду и обувь.
        </p>
        <div className="pt-4">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 bg-[#F14635] text-white px-8 py-3.5 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all shadow-xs"
          >
            В каталог одежды
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Корзина</h1>
        <p className="text-xs text-gray-400 mt-0.5">{items.length} товара(ов) к оформлению</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Cart Items */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}`}
              className="group bg-gray-50 dark:bg-[#111111] rounded-3xl p-4 flex gap-4 items-center transition-colors hover:bg-gray-100/50 dark:hover:bg-[#161616]"
            >
              {/* Product Image */}
              <Link to={`/product/${item.product.id}`} className="shrink-0 relative overflow-hidden rounded-2xl">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-24 object-cover object-center bg-white group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0 py-1">
                <Link to={`/product/${item.product.id}`} className="block">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    {item.product.brand}
                  </span>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {item.product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                  {item.selectedSize && (
                    <span className="bg-white dark:bg-[#1a1a1a] dark:text-gray-300 px-2 py-0.5 rounded-md shadow-xs">Размер: {item.selectedSize}</span>
                  )}
                  {item.selectedColor && (
                    <span className="bg-white dark:bg-[#1a1a1a] dark:text-gray-300 px-2 py-0.5 rounded-md shadow-xs">Цвет: {item.selectedColor}</span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="font-black text-base text-gray-900 dark:text-white">
                    {(item.product.price * item.quantity).toLocaleString()} ₸
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1a] p-1 rounded-xl shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="shrink-0 self-start">
                <button
                  onClick={() => removeItem(item.product.id, item.selectedSize)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-xs"
                  title="Удалить товар"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Checkout Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-6 sm:p-7 space-y-6">
            <h2 className="font-black text-lg text-gray-900 dark:text-white">Детали заказа</h2>

            {/* Delivery Settings */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Адрес доставки</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white dark:bg-[#1a1a1a] text-xs px-4 py-3 rounded-2xl text-gray-900 dark:text-white outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700 transition-colors"
                placeholder="Укажите город, улицу и дом"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span>Способ оплаты</span>
              </label>
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'kaspi_qr' ? 'bg-white shadow-xs border border-[#F14635]' : 'bg-gray-100/50 hover:bg-white border border-transparent'
                }`}>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Kaspi QR</span>
                  <input
                    type="radio"
                    name="payment"
                    value="kaspi_qr"
                    checked={paymentMethod === 'kaspi_qr'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="accent-[#F14635] w-3.5 h-3.5"
                  />
                </label>
                <label className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'kaspi_gold' ? 'bg-white shadow-xs border border-[#F14635]' : 'bg-gray-100/50 hover:bg-white border border-transparent'
                }`}>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Kaspi Gold (с баланса)</span>
                  <input
                    type="radio"
                    name="payment"
                    value="kaspi_gold"
                    checked={paymentMethod === 'kaspi_gold'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="accent-[#F14635] w-3.5 h-3.5"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Товары ({items.length}):</span>
                <span className="font-semibold text-gray-900">{totalPrice.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Доставка:</span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? <span className="text-green-500">Бесплатно</span> : `${deliveryFee.toLocaleString()} ₸`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                <span className="font-bold text-gray-900">К оплате:</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
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
                  <span>Оплатить {finalAmount.toLocaleString()} ₸</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            {/* Guarantee Badge */}
            <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed justify-center text-center px-4">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-green-500 mt-0.5" />
              <span>Безопасная оплата. Товар можно будет проверить при получении в пункте выдачи.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
