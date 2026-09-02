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
import { useT } from '../../i18n/useT';

export const MobileBottomNav: React.FC = () => {
  const { t } = useT();
  const { getTotalItems } = useCartStore();
  const { user } = useAuthStore();
  const { orders: sellerOrders } = useSellerStore();
  
  const cartCount = getTotalItems();
  const newSellerOrdersCount = sellerOrders.filter((o) => o.status === 'new').length;

  let navItems = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/catalog', label: t.nav.catalog, icon: LayoutGrid },
    { to: '/wishlist', label: t.nav.wishlist, icon: Heart },
    { 
      to: '/cart', 
      label: t.nav.cart, 
      icon: ShoppingBag, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { 
      to: user ? '/dashboard' : '/auth', 
      label: user ? t.nav.profile : t.nav.login, 
      icon: User 
    },
  ];

  if (user?.role === 'admin') {
    navItems = [
      { to: '/', label: t.nav.home, icon: Home },
      { to: '/catalog', label: t.nav.showcase, icon: LayoutGrid },
      { to: '/admin?tab=inventory', label: t.nav.warehouse, icon: Boxes },
      { to: '/admin?tab=orders', label: t.nav.orders, icon: ShoppingBag },
      { to: '/admin', label: t.nav.adminPanel, icon: ShieldCheck },
    ];
  } else if (user?.role === 'seller') {
    navItems = [
      { to: '/seller', label: t.nav.overview, icon: Store },
      { to: '/seller/products', label: t.nav.products, icon: Boxes },
      { 
        to: '/seller/orders', 
        label: t.nav.orders, 
        icon: ShoppingBag, 
        badge: newSellerOrdersCount > 0 ? newSellerOrdersCount : undefined 
      },
      { to: '/seller/analytics', label: t.nav.analytics, icon: TrendingUp },
      { to: '/catalog', label: t.nav.showcase, icon: LayoutGrid },
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
