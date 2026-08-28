import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User, ShieldAlert } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export const MobileBottomNav: React.FC = () => {
  const { getTotalItems } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = getTotalItems();

  const navItems = [
    { to: '/', label: 'Главная', icon: Home },
    { to: '/catalog', label: 'Каталог', icon: LayoutGrid },
    { 
      to: '/cart', 
      label: 'Корзина', 
      icon: ShoppingBag, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { 
      to: user?.role === 'admin' ? '/admin' : '/dashboard', 
      label: user?.role === 'admin' ? 'Админка' : 'Кабинет', 
      icon: user?.role === 'admin' ? ShieldAlert : User 
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-2 px-4 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center relative py-1 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-[#F14635] font-semibold' : 'text-gray-500 hover:text-gray-900'
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
