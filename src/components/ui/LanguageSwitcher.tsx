import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Language } from '../../i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { language, setLanguage } = useLanguageStore();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-xl text-xs font-bold ${className}`}>
        <button
          type="button"
          onClick={() => handleSelect('kk')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            language === 'kk'
              ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          KZ
        </button>
        <button
          type="button"
          onClick={() => handleSelect('ru')}
          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            language === 'ru'
              ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          RU
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center bg-gray-50 dark:bg-[#111111] p-1 rounded-xl border border-gray-100 dark:border-white/5 text-xs font-bold select-none ${className}`}>
      <button
        type="button"
        onClick={() => handleSelect('kk')}
        className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
          language === 'kk'
            ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-xs'
            : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="Қазақ тілі"
      >
        KZ
      </button>
      <button
        type="button"
        onClick={() => handleSelect('ru')}
        className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
          language === 'ru'
            ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-xs'
            : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="Русский язык"
      >
        RU
      </button>
    </div>
  );
};
