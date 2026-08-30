import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-gray-200 tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Страница не найдена</h2>
      <p className="text-gray-500 mb-8 max-w-md text-sm">
        Возможно, она была удалена, переименована или вы просто ошиблись в адресе.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </Link>
    </div>
  );
};
