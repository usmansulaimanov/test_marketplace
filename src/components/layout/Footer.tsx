import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-24 lg:pb-16 text-sm text-gray-600 mt-20 rounded-3xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-black text-xl text-gray-900 uppercase tracking-tight">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Заманауи киім және аяқ киім маркетплейсі. Минимализм, сапа және жылдам жеткізу.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Категории</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/catalog?cat=headwear" className="hover:text-[#F14635] transition-colors">Головные уборы</Link></li>
              <li><Link to="/catalog?cat=tops" className="hover:text-[#F14635] transition-colors">Верхняя одежда и худи</Link></li>
              <li><Link to="/catalog?cat=bottoms" className="hover:text-[#F14635] transition-colors">Брюки и джинсы</Link></li>
              <li><Link to="/catalog?cat=footwear" className="hover:text-[#F14635] transition-colors">Обувь и кроссовки</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Клиентам</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/dashboard" className="hover:text-[#F14635] transition-colors">История заказов и трат</Link></li>
              <li><Link to="/cart" className="hover:text-[#F14635] transition-colors">Корзина и доставка</Link></li>
              <li><Link to="/auth" className="hover:text-[#F14635] transition-colors">Вход в личный кабинет</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Управление</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/admin" className="hover:text-[#F14635] transition-colors">Админ-панель</Link></li>
              <li><Link to="/admin" className="hover:text-[#F14635] transition-colors">Учет склада и остатков</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 KitapAll Marketplace. Барлық құқықтар қорғалған.</p>
          <p className="flex items-center gap-4">
            <span>React + TypeScript + Vite + Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
