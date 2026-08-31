import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck, 
  Boxes, 
  TrendingUp, 
  Store 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSellerStore } from '../../store/useSellerStore';

export const MobileBottomNav: React.FC = () => {
  const { getTotalItems } = useCartStore();
  const { user } = useAuthStore();
  const { orders: sellerOrders } = useSellerStore();
  
  const cartCount = getTotalItems();
  const newSellerOrdersCount = sellerOrders.filter((o) => o.status === 'new').length;

  let navItems = [
    { to: '/', label: 'Главная', icon: Home },
    { to: '/catalog', label: 'Каталог', icon: LayoutGrid },
    { to: '/wishlist', label: 'Избранное', icon: Heart },
    { 
      to: '/cart', 
      label: 'Корзина', 
      icon: ShoppingBag, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { 
      to: user ? '/dashboard' : '/auth', 
      label: user ? 'Кабинет' : 'Войти', 
      icon: User 
    },
  ];

  if (user?.role === 'admin') {
    navItems = [
      { to: '/', label: 'Главная', icon: Home },
      { to: '/catalog', label: 'Витрина', icon: LayoutGrid },
      { to: '/admin?tab=inventory', label: 'Склад', icon: Boxes },
      { to: '/admin?tab=orders', label: 'Заказы', icon: ShoppingBag },
      { to: '/admin', label: 'Админка', icon: ShieldCheck },
    ];
  } else if (user?.role === 'seller') {
    navItems = [
      { to: '/seller', label: 'Обзор', icon: Store },
      { to: '/seller/products', label: 'Товары', icon: Boxes },
      { 
        to: '/seller/orders', 
        label: 'Заказы', 
        icon: ShoppingBag, 
        badge: newSellerOrdersCount > 0 ? newSellerOrdersCount : undefined 
      },
      { to: '/seller/analytics', label: 'Аналитика', icon: TrendingUp },
      { to: '/catalog', label: 'Витрина', icon: LayoutGrid },
    ];
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-black border-t border-gray-100 dark:border-neutral-800 py-2 px-2 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center relative py-1 px-2.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#F14635] font-bold' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#F14635] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
