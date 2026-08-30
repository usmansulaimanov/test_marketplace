import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ShoppingBag
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/product/ProductCard';
import { CATEGORIES } from '../../data/mockProducts';
import { CategoryId } from '../../types';

export const LandingPage: React.FC = () => {
  const { products, setSelectedCategory } = useProductStore();

  const hitProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Seamless Section */}
      <section className="py-6 sm:py-10">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-[#111111] text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 rounded-full">
            <span>Жаңа топтама 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Заманауи киім & <br />
            <span className="text-[#F14635]">минимализм стилі</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Сапалы табиғи материалдар, қалалық минимализм және күнделікті ыңғайлылық. Головные уборы, верхняя одежда, брюки және премиум аяқ киім.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/catalog"
              onClick={() => setSelectedCategory('all')}
              className="w-full sm:w-auto bg-[#F14635] hover:bg-[#E03221] text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Каталогты көру</span>
            </Link>
            <Link
              to="/catalog?cat=footwear"
              onClick={() => setSelectedCategory('footwear')}
              className="w-full sm:w-auto bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-900 dark:text-white px-7 py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Обувь & кроссовки</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Seamless stats row (no lines/boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12">
          <div>
            <span className="block text-3xl font-black text-gray-900 dark:text-white tracking-tight">100%</span>
            <span className="text-xs text-gray-500 font-medium">Оригинал сапа</span>
          </div>
          <div>
            <span className="block text-3xl font-black text-gray-900 dark:text-white tracking-tight">1-2 күн</span>
            <span className="text-xs text-gray-500 font-medium">Жылдам жеткізу</span>
          </div>
          <div>
            <span className="block text-3xl font-black text-gray-900 dark:text-white tracking-tight">4</span>
            <span className="text-xs text-gray-500 font-medium">Негізгі категория</span>
          </div>
          <div>
            <span className="block text-3xl font-black text-[#F14635] tracking-tight">Kaspi</span>
            <span className="text-xs text-gray-500 font-medium">Ыңғайлы төлем</span>
          </div>
        </div>
      </section>

      {/* 4 Main Categories Section */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Категории одежды</h2>
            <p className="text-xs text-gray-500 mt-1">Таңдаулы бөлімдер бойынша жылдам өту</p>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
          >
            <span>Барлығы</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
            <Link
              key={category.id}
              to={`/catalog?cat=${category.id}`}
              onClick={() => setSelectedCategory(category.id as CategoryId)}
              className="group bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-[#161616] p-6 rounded-2xl transition-all flex flex-col justify-between h-36"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {category.nameKz}
                </span>
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#F14635] transition-colors mt-1">
                  {category.name}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="text-[11px] text-gray-400">{category.description}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#F14635] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Popular Hits */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Хиты продаж</h2>
            <p className="text-xs text-gray-500 mt-1">Ең көп сұранысқа ие заманауи киімдер</p>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold text-[#F14635] hover:underline flex items-center gap-1"
          >
            <span>Смотреть весь каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hitProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      </section>

      {/* Value Proposition Seamless Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Жылдам жеткізу</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Қазақстанның барлық қалаларына 1-3 күн ішінде курьер арқылы.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Сапа кепілдігі</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Тек табиғи маталар мен тексерілген премиум брендтер.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-xl shadow-xs">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Оңай қайтару</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Өлшемі сәйкес келмесе, 14 күн ішінде кедергісіз айырбастау.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
