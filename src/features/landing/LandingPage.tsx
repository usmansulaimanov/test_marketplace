import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/product/ProductCard';
import { CATEGORIES } from '../../data/mockProducts';
import { CategoryId } from '../../types';

const categoryEmoji: Record<string, string> = {
  headwear: '🧢',
  tops: '🧥',
  bottoms: '👖',
  footwear: '👟',
};

export const LandingPage: React.FC = () => {
  const { products, setSelectedCategory } = useProductStore();
  const hitProducts = products.slice(0, 4);

  return (
    <div className="pb-24">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-8 pb-16 sm:pt-14 sm:pb-24">
        <div className="space-y-5 max-w-3xl">

          {/* Pill badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#F14635] border border-[#F14635]/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F14635] animate-pulse" />
            Маркетплейс одежды · Казахстан
          </span>

          {/* Headline */}
          <h1 className="text-[2.6rem] sm:text-[4.5rem] font-black leading-[1.02] tracking-[-0.03em] text-gray-900 dark:text-white">
            Одежда.<br />
            <span
              style={{
                WebkitTextStroke: '2px #F14635',
                color: 'transparent',
              }}
            >
              Без лишнего.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Минималистичные вещи для повседневной жизни. Натуральные материалы,
            честные цены — добавлено продавцами напрямую.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/catalog"
              onClick={() => setSelectedCategory('all')}
              className="group inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-[#F14635] dark:hover:bg-[#F14635] text-white dark:text-gray-900 dark:hover:text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-[0.97]"
            >
              Открыть каталог
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/catalog?cat=footwear"
              onClick={() => setSelectedCategory('footwear')}
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4"
            >
              Смотреть обувь →
            </Link>
          </div>
        </div>

        {/* Mini stats */}
        <div className="mt-14 pt-8 border-t border-gray-100 dark:border-white/10 grid grid-cols-3 gap-8">
          {[
            { value: '100%', label: 'Оригинальные товары' },
            { value: '1–2 дн', label: 'Доставка по Казахстану' },
            { value: 'Kaspi', label: 'Оплата без комиссий' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="space-y-5 mb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Категории
          </h2>
          <Link
            to="/catalog"
            className="text-xs font-bold text-gray-400 hover:text-[#F14635] transition-colors flex items-center gap-1"
          >
            Все <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
            <Link
              key={category.id}
              to={`/catalog?cat=${category.id}`}
              onClick={() => setSelectedCategory(category.id as CategoryId)}
              className="group relative overflow-hidden bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#161616] rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] border border-transparent hover:border-gray-200 dark:hover:border-white/10"
            >
              <div className="text-3xl mb-4">
                {categoryEmoji[category.id] ?? '🛍️'}
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {category.nameKz}
                </div>
                <div className="font-black text-sm text-gray-900 dark:text-white group-hover:text-[#F14635] transition-colors">
                  {category.name}
                </div>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-[#F14635] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS / HITS ──────────────────────────────────────────── */}
      <section className="space-y-5 mb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Новинки
          </h2>
          <Link
            to="/catalog"
            className="text-xs font-bold text-gray-400 hover:text-[#F14635] transition-colors flex items-center gap-1"
          >
            Весь каталог <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {hitProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {hitProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 dark:border-white/10 pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            label: 'Быстрая доставка',
            desc: 'Курьером по всему Казахстану. 1–3 рабочих дня.',
          },
          {
            label: 'Гарантия качества',
            desc: 'Только натуральные ткани и проверенные бренды.',
          },
          {
            label: 'Возврат 14 дней',
            desc: 'Не подошёл размер — обменяем без вопросов.',
          },
        ].map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="font-bold text-sm text-gray-900 dark:text-white">
              {item.label}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

/* ── Empty state ─────────────────────────────────────────────────────────── */
const EmptyState: React.FC = () => (
  <div className="border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center space-y-3">
    <div className="text-4xl">📦</div>
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Пока пусто
    </p>
    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
      Продавцы ещё не добавили товары. Загляните позже или{' '}
      <Link to="/auth" className="text-[#F14635] font-bold hover:underline">
        войдите как продавец
      </Link>
      , чтобы добавить первый.
    </p>
  </div>
);
