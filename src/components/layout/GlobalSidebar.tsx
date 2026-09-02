import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  User, 
  X, 
  Sun, 
  Moon, 
  Heart, 
  LogOut,
  LayoutDashboard,
  Boxes,
  TrendingUp,
  SlidersHorizontal,
  Store
} from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useT } from '../../i18n/useT';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { CategoryId } from '../../types';

export const GlobalSidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, language } = useT();

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  const categories: Array<{ id: CategoryId; name: string; count: string }> = [
    { id: 'headwear', name: t.catalog.categories.headwear, count: language === 'kk' ? 'Кепкалар, бөріктер' : 'Кепки, шапки' },
    { id: 'tops', name: t.catalog.categories.tops, count: language === 'kk' ? 'Худи, футболкалар' : 'Худи, футболки' },
    { id: 'bottoms', name: t.catalog.categories.bottoms, count: language === 'kk' ? 'Карго, деним' : 'Карго, деним' },
    { id: 'footwear', name: t.catalog.categories.footwear, count: language === 'kk' ? 'Кроссовкалар, кеды' : 'Кроссовки, кеды' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Off-canvas panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-white dark:bg-black border-r border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Header & Quick Nav */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={closeSidebar}
              className="font-black text-xl tracking-tighter text-gray-900 dark:text-white uppercase"
            >
              KITAP<span className="text-[#F14635]">ALL</span>
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
              title={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              {t.nav.mainMenu}
            </h3>
            <nav className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-2 space-y-1 text-xs font-bold">
              <Link
                to="/"
                onClick={closeSidebar}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="w-4 h-4 text-gray-400" />
                <span>{t.nav.home}</span>
              </Link>
              <Link
                to="/catalog"
                onClick={closeSidebar}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-[#F14635]" />
                  <span>{t.nav.catalog}</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-[#F14635] px-2 py-0.5 rounded-full">
                  {t.common.all}
                </span>
              </Link>

              {user?.role !== 'admin' && user?.role !== 'seller' && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={closeSidebar}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                  >
                    <Heart className="w-4 h-4 text-[#F14635]" />
                    <span>{t.nav.wishlist}</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeSidebar}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F14635]" />
                    <span>{t.nav.cart}</span>
                  </Link>
                </>
              )}

              {/* Language Switcher */}
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                  {language === 'kk' ? 'Тіл:' : 'Язык:'}
                </span>
                <LanguageSwitcher variant="compact" />
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-gray-600" />
                  )}
                  <span>{theme === 'dark' ? (language === 'kk' ? 'Ашық тақырып' : 'Светлая тема') : (language === 'kk' ? 'Қараңғы тақырып' : 'Тёмная тема')}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {theme === 'dark' ? (language === 'kk' ? 'Қосулы' : 'Вкл') : (language === 'kk' ? 'Сөндірулі' : 'Выкл')}
                </span>
              </button>
            </nav>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-2">
            <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              {t.landing.categoriesTitle}
            </h3>
            <nav className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-2 space-y-1 text-xs font-bold">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?cat=${cat.id}`}
                  onClick={closeSidebar}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-normal text-gray-400">{cat.count}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Dashboard / Admin Links based on Role */}
          {isAuthenticated ? (
            <div className="space-y-3">
              <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {user?.role === 'admin' ? t.nav.adminPanel : user?.role === 'seller' ? t.nav.sellerPanel : t.nav.profile}
              </h3>
              <nav className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-2 space-y-1 text-xs font-bold">
                {user?.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin?tab=analytics"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      <span>{t.admin.tabs.analytics}</span>
                    </Link>
                    <Link
                      to="/admin?tab=inventory"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <Boxes className="w-4 h-4 text-gray-400" />
                      <span>{t.admin.tabs.inventory}</span>
                    </Link>
                    <Link
                      to="/admin?tab=orders"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span>{t.admin.tabs.orders}</span>
                    </Link>
                  </>
                ) : user?.role === 'seller' ? (
                  <>
                    <Link
                      to="/seller"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <Store className="w-4 h-4 text-gray-400" />
                      <span>{t.seller.overviewTab}</span>
                    </Link>
                    <Link
                      to="/seller/products"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <Boxes className="w-4 h-4 text-gray-400" />
                      <span>{t.seller.productsTab}</span>
                    </Link>
                    <Link
                      to="/seller/orders"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span>{t.seller.ordersTab}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard?tab=overview"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>{t.dashboard.overviewTab}</span>
                    </Link>
                    <Link
                      to="/dashboard?tab=orders"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span>{t.dashboard.ordersTab}</span>
                    </Link>
                    <Link
                      to="/dashboard?tab=profile"
                      onClick={closeSidebar}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                      <span>{t.dashboard.profileTab}</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-5 text-center">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{t.auth.loginTitle}</h4>
              <p className="text-[10px] text-gray-500 mb-4">{t.auth.loginSub}</p>
              <Link
                to="/auth"
                onClick={closeSidebar}
                className="w-full flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-4 py-3 rounded-2xl font-bold text-xs transition-colors"
              >
                {t.header.loginBtn}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Logout Button */}
        {isAuthenticated && (
          <div className="p-6 border-t border-gray-100 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
