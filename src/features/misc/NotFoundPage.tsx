import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../../i18n/useT';

export const NotFoundPage: React.FC = () => {
  const { t } = useT();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-gray-200 dark:text-neutral-800 tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.errors.notFoundTitle}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-sm">
        {t.errors.notFoundDesc}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-6 py-3 rounded-2xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.errors.goHome}</span>
      </Link>
    </div>
  );
};
