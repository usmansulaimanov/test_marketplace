import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translations, translations, DEFAULT_LANGUAGE } from '../i18n';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const syncDocumentLang = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      t: translations[DEFAULT_LANGUAGE],

      setLanguage: (language: Language) => {
        syncDocumentLang(language);
        set({
          language,
          t: translations[language] || translations[DEFAULT_LANGUAGE],
        });
      },

      toggleLanguage: () => {
        const nextLang: Language = get().language === 'kk' ? 'ru' : 'kk';
        syncDocumentLang(nextLang);
        set({
          language: nextLang,
          t: translations[nextLang] || translations[DEFAULT_LANGUAGE],
        });
      },
    }),
    {
      name: 'kitapall-language-storage-v1',
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncDocumentLang(state.language);
          state.t = translations[state.language] || translations[DEFAULT_LANGUAGE];
        }
      },
    }
  )
);
