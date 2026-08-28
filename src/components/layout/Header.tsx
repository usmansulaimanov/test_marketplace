import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { items, getTotalItems } = useCartStore();
  const { user, isAuthenticated, logout, switchRole } = useAuthStore();
  const { searchQuery, setSearchQuery } = useProductStore();

  const totalCartCount = getTotalItems();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  const handleToggleRole = () => {
    const nextRole = user?.role === 'admin' ? 'client' : 'admin';
    switchRole(nextRole);
    if (nextRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo & Catalog Button */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center">
              <span className="font-black text-xl md:text-2xl tracking-tighter text-gray-900 uppercase">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
            </Link>

            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Каталог</span>
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск одежды, обуви, головных уборов..."
                className="w-full bg-gray-50 border-none focus:bg-gray-100 text-gray-900 rounded-xl pl-4 pr-12 py-2.5 text-xs outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#F14635] text-white p-1.5 rounded-lg hover:bg-[#E03221] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Navigation Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Role Switcher */}
            <button
              onClick={handleToggleRole}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Переключить роль Клиент / Админ"
            >
              {user?.role === 'admin' ? (
                <span>Режим: <b className="text-[#F14635]">Админ</b></span>
              ) : (
                <span>Режим: <b className="text-gray-900">Клиент</b></span>
              )}
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors relative"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F14635] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-900">
                {items.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()} ₸
              </span>
            </Link>

            {/* Profile / Admin Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors bg-gray-50"
                >
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-xs">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    {user?.name}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Выйти"
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold transition-all hover:bg-black"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Войти</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/cart"
              className="p-2 text-gray-700 relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalCartCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-[#F14635] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-2 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-medium text-gray-600">Переключить роль:</span>
              <button
                onClick={handleToggleRole}
                className="text-xs font-bold text-[#F14635]"
              >
                {user?.role === 'admin' ? 'Администратор' : 'Клиент'}
              </button>
            </div>
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-800 font-medium text-xs"
            >
              <LayoutGrid className="w-4 h-4 text-[#F14635]" />
              <span>Каталог товаров</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-800 font-medium text-xs"
                >
                  <UserIcon className="w-4 h-4 text-[#F14635]" />
                  <span>{user?.role === 'admin' ? 'Админ-панель' : 'Личный кабинет (История трат)'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выйти из аккаунта</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F14635] text-white font-bold text-xs justify-center"
              >
                <UserIcon className="w-4 h-4" />
                <span>Войти / Регистрация</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
