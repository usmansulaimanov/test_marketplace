import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../ui/ToastContainer';
import { GlobalSidebar } from './GlobalSidebar';
import { useThemeStore } from '../../store/useThemeStore';

export const Layout: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <GlobalSidebar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
