import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';

export const Footer: React.FC = () => {
  const { t } = useT();

  return (
    <footer className="bg-gray-50 dark:bg-[#111111] pt-16 pb-24 lg:pb-16 text-sm text-gray-600 dark:text-gray-400 mt-20 rounded-3xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight">
                KITAP<span className="text-[#F14635]">ALL</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              {t.footer.categories}
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <Link to="/catalog?cat=headwear" className="hover:text-[#F14635] transition-colors">
                  {t.catalog.categories.headwear}
                </Link>
              </li>
              <li>
                <Link to="/catalog?cat=tops" className="hover:text-[#F14635] transition-colors">
                  {t.catalog.categories.tops}
                </Link>
              </li>
              <li>
                <Link to="/catalog?cat=bottoms" className="hover:text-[#F14635] transition-colors">
                  {t.catalog.categories.bottoms}
                </Link>
              </li>
              <li>
                <Link to="/catalog?cat=footwear" className="hover:text-[#F14635] transition-colors">
                  {t.catalog.categories.footwear}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              {t.footer.forClients}
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <Link to="/dashboard" className="hover:text-[#F14635] transition-colors">
                  {t.dashboard.ordersTab}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#F14635] transition-colors">
                  {t.cart.title}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-[#F14635] transition-colors">
                  {t.auth.loginTitle}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              {t.footer.management}
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <Link to="/seller" className="hover:text-[#F14635] transition-colors">
                  {t.nav.sellerPanel}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#F14635] transition-colors">
                  {t.nav.adminPanel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 KitapAll Marketplace. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
