import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  ShoppingBag, 
  TrendingUp, 
  Store, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Wallet
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSellerStore } from '../../store/useSellerStore';
import { ToastContainer } from '../../components/ui/ToastContainer';
import { useT } from '../../i18n/useT';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

export const SellerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useT();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { orders } = useSellerStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { to: '/seller', label: t.seller.overviewTab, icon: LayoutDashboard, end: true },
    { to: '/seller/products', label: t.seller.productsTab, icon: Boxes },
    { 
      to: '/seller/orders', 
      label: t.seller.ordersTab, 
      icon: ShoppingBag, 
      badge: newOrdersCount > 0 ? newOrdersCount : undefined 
    },
    { to: '/seller/analytics', label: t.seller.analyticsTab, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-xl transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tighter text-gray-900 dark:text-white uppercase">
              KITAP<span className="text-[#F14635]">ALL</span>
            </span>
            <span className="bg-[#F14635] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
              SELLER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-xl transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-screen w-[280px] bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-100 dark:border-neutral-800 flex flex-col justify-between p-5 transform transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link to="/seller" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter text-gray-900 dark:text-white uppercase">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
              <span className="bg-[#FFF1F0] dark:bg-[#F14635]/20 text-[#F14635] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                SELLER
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 bg-white dark:bg-[#1a1a1a] text-gray-500 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shop Profile Widget */}
          <div className="bg-white dark:bg-[#111111] p-4 rounded-2xl shadow-xs border border-gray-100/80 dark:border-neutral-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1F0] dark:bg-[#F14635]/15 text-[#F14635] flex items-center justify-center font-black text-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                  {user?.name || (language === 'kk' ? 'Менің дүкенім' : 'Мой магазин')}
                </h4>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-50 dark:border-neutral-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <Wallet className="w-3 h-3 text-[#F14635]" /> {t.dashboard.balance}
              </span>
              <span className="font-black text-gray-900 dark:text-white">
                {user?.balance?.toLocaleString()} ₸
              </span>
            </div>
          </div>

          {/* Language Switcher in Seller Sidebar */}
          <div className="px-2 flex items-center justify-between">
            <span className="text-gray-500 text-xs font-semibold">{language === 'kk' ? 'Тіл:' : 'Язык:'}</span>
            <LanguageSwitcher variant="compact" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs font-black'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#111111] hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#F14635] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
              <span>{theme === 'dark' ? (language === 'kk' ? 'Ашық тақырып' : 'Светлая тема') : (language === 'kk' ? 'Қараңғы тақырып' : 'Тёмная тема')}</span>
            </div>
          </button>

          <Link
            to="/catalog"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#111111] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Store className="w-4 h-4 text-[#F14635]" />
            <span>{t.nav.showcase}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
};
