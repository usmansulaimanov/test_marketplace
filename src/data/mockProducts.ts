import { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Все товары', nameKz: 'Барлық тауарлар', description: 'Полный ассортимент одежды' },
  { id: 'headwear', name: 'Головные уборы', nameKz: 'Бас киімдер', description: 'Кепки, панамы, бини, шапки' },
  { id: 'tops', name: 'Верх', nameKz: 'Үстіңгі киім', description: 'Куртки, худи, футболки, свитшоты' },
  { id: 'bottoms', name: 'Низ', nameKz: 'Астыңғы киім', description: 'Брюки, джинсы, карго' },
  { id: 'footwear', name: 'Обувь', nameKz: 'Аяқ киім', description: 'Кроссовки, кеды, ботинки' },
];

export const INITIAL_PRODUCTS: Product[] = [];
