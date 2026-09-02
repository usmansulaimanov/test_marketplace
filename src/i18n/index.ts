import { kk } from './kk';
import { ru } from './ru';
import { Language, Translations } from './types';

export * from './types';
export * from './useT';

export const translations: Record<Language, Translations> = {
  kk,
  ru,
};

export const DEFAULT_LANGUAGE: Language = 'kk';
