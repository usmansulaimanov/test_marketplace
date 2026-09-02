import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations, DEFAULT_LANGUAGE } from '../i18n';

describe('i18n Localization & Language Store', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: DEFAULT_LANGUAGE });
  });

  it('defaults to Kazakh (kk) language', () => {
    const { language } = useLanguageStore.getState();
    expect(language).toBe('kk');
    expect(document.documentElement.lang).toBe('kk');
  });

  it('switches between Kazakh and Russian smoothly', () => {
    useLanguageStore.getState().setLanguage('ru');
    expect(useLanguageStore.getState().language).toBe('ru');
    expect(document.documentElement.lang).toBe('ru');

    useLanguageStore.getState().toggleLanguage();
    expect(useLanguageStore.getState().language).toBe('kk');
    expect(document.documentElement.lang).toBe('kk');
  });

  it('verifies dictionary key parity between kk and ru', () => {
    const kkKeys = Object.keys(translations.kk);
    const ruKeys = Object.keys(translations.ru);

    expect(kkKeys.sort()).toEqual(ruKeys.sort());

    // Check nested modules
    for (const key of kkKeys as Array<keyof typeof translations.kk>) {
      const kkModule = translations.kk[key];
      const ruModule = translations.ru[key];
      if (typeof kkModule === 'object' && kkModule !== null) {
        expect(Object.keys(kkModule).sort()).toEqual(Object.keys(ruModule).sort());
      }
    }
  });

  it('correctly executes dynamic interpolation functions', () => {
    const { kk, ru } = translations;
    const formattedSum = (15000).toLocaleString();
    expect(kk.header.cartSummary(3, 15000)).toContain('3');
    expect(kk.header.cartSummary(3, 15000)).toContain(formattedSum);
    expect(ru.header.cartSummary(3, 15000)).toContain('3');
    expect(ru.header.cartSummary(3, 15000)).toContain(formattedSum);
  });
});
