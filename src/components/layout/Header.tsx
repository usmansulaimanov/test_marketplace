import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  LogOut,
  Heart,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import { useUiStore } from '../../store/useUiStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useT } from '../../i18n/useT';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useT();
  const { items, getTotalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useProductStore();
  const { toggleSidebar } = useUiStore();
  const { items: wishlistItems } = useWishlistStore();
  const { theme, toggleTheme } = useThemeStore();

  const totalCartCount = getTotalItems();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Menu Button & Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-xl transition-colors cursor-pointer"
              title={t.nav.mainMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link to="/" className="flex items-center">
              <span className="font-black text-xl md:text-2xl tracking-tighter text-gray-900 dark:text-white uppercase">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
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
                placeholder={t.header.searchPlaceholder}
                className="w-full bg-gray-50 dark:bg-[#111111] border-none focus:bg-gray-100 dark:focus:bg-[#1a1a1a] text-gray-900 dark:text-white dark:placeholder-gray-500 rounded-xl pl-4 pr-12 py-2.5 text-xs outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#F14635] text-white p-1.5 rounded-lg hover:bg-[#E03221] transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-xl transition-colors cursor-pointer"
              title={t.header.toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Wishlist & Cart - ONLY for Client / Guest */}
            {user?.role !== 'admin' && user?.role !== 'seller' && (
              <>
                <Link
                  to="/wishlist"
                  className="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-xl transition-colors relative"
                  title={t.nav.wishlist}
                >
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-0 -right-0.5 bg-[#F14635] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors relative"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-[#F14635] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {items.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()} ₸
                  </span>
                </Link>
              </>
            )}

            {/* Profile / Admin / Seller Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    title={t.nav.adminPanel}
                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-[#F14635] flex items-center justify-center transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                ) : user?.role === 'seller' ? (
                  <Link
                    to="/seller"
                    title={t.nav.sellerPanel}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white bg-[#F14635] hover:bg-[#E03221] transition-colors shadow-xs"
                  >
                    <span className="text-xs font-bold">{t.nav.sellerPanel}</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    title={t.nav.profile}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-[#222222] flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-xs">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  title={t.nav.logout}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
                <span>{t.header.loginBtn}</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 relative cursor-pointer active:scale-95 transition-transform"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              aria-label="Сменить тему оформления"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-gray-700" />}
            </button>
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 relative"
            >
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute 0 top-0 right-0 bg-[#F14635] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
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
          </div>
        </div>
      </div>
    </header>
  );
};
