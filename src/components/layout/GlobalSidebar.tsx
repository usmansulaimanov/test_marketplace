import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { 
  X, 
  Home, 
  LayoutGrid, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Boxes, 
  TrendingUp, 
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

export const GlobalSidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/auth');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sliding Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
          <Link to="/" onClick={closeSidebar} className="flex items-center">
            <span className="font-black text-xl tracking-tighter text-gray-900 dark:text-gray-100 uppercase">
              KITAP<span className="text-[#F14635]">ALL</span>
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            {/* Main Navigation */}
            <nav className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-2 space-y-1 text-xs font-bold">
              <Link
                to="/"
                onClick={closeSidebar}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="w-4 h-4 text-gray-400" />
                <span>Главная страница</span>
              </Link>
              <Link
                to="/catalog"
                onClick={closeSidebar}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-[#F14635]" />
                  <span>Каталог товаров</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-[#F14635] px-2 py-0.5 rounded-full">
                  Все
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
                    <span>Избранное</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeSidebar}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F14635]" />
                    <span>Корзина</span>
                  </Link>
                </>
              )}
              
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
                  <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {theme === 'dark' ? 'Вкл' : 'Выкл'}
                </span>
              </button>
            </nav>

            {/* Catalog Categories */}
            <div className="space-y-2">
              <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Категории каталога
              </h3>
              <nav className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-2 space-y-1 text-xs font-bold">
                {[
                  { id: 'headwear', name: 'Головные уборы', count: 'Кепки, шапки' },
                  { id: 'tops', name: 'Верхняя одежда', count: 'Худи, футболки' },
                  { id: 'bottoms', name: 'Брюки и джинсы', count: 'Карго, деним' },
                  { id: 'footwear', name: 'Обувь', count: 'Кроссовки, кеды' },
                ].map((cat) => (
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
                  {user?.role === 'admin' ? 'Управление магазином' : 'Личный кабинет'}
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
                        <span>Обзор и аналитика</span>
                      </Link>
                      <Link
                        to="/admin?tab=inventory"
                        onClick={closeSidebar}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                      >
                        <Boxes className="w-4 h-4 text-gray-400" />
                        <span>Склад и остатки</span>
                      </Link>
                      <Link
                        to="/admin?tab=orders"
                        onClick={closeSidebar}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span>Все заказы</span>
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
                        <span>Моя аналитика</span>
                      </Link>
                      <Link
                        to="/dashboard?tab=orders"
                        onClick={closeSidebar}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span>Мои заказы</span>
                      </Link>
                      <Link
                        to="/dashboard?tab=profile"
                        onClick={closeSidebar}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs hover:text-gray-900 dark:hover:text-white"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                        <span>Настройки</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#111111]/50 rounded-3xl p-5 text-center">
                <User className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">Войдите в аккаунт</h4>
                <p className="text-[10px] text-gray-500 mb-4">Для отслеживания заказов и бонусной программы</p>
                <Link
                  to="/auth"
                  onClick={closeSidebar}
                  className="w-full flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-4 py-3 rounded-2xl font-bold text-xs transition-colors"
                >
                  Войти
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Logout Button */}
          {isAuthenticated && (
            <div className="pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-red-600 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
