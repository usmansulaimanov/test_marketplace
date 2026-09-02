import { useLanguageStore } from '../store/useLanguageStore';

export const useT = () => {
  const { t, language, setLanguage, toggleLanguage } = useLanguageStore();
  return { t, language, setLanguage, toggleLanguage };
};
