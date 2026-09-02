import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { useT } from '../../i18n/useT';

export const SellerAnalytics: React.FC = () => {
  const { t, language } = useT();
  const { products, orders, monthlyRevenue } = useSellerStore();

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalSalesUnits = products.reduce((s, p) => s + p.salesCount, 0);
  const avgCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const monthsList = language === 'kk'
    ? ['Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз']
    : ['Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'];

  const displayRevenue = monthlyRevenue.length > 0
    ? monthlyRevenue
    : monthsList.map((m) => ({ month: m, amount: 0 }));

  // Category sales breakdown
  const categoryStats = [
    { name: t.catalog.categories.headwear, category: 'headwear', color: 'bg-[#F14635]' },
    { name: t.catalog.categories.tops, category: 'tops', color: 'bg-neutral-800 dark:bg-neutral-200' },
    { name: t.catalog.categories.bottoms, category: 'bottoms', color: 'bg-blue-600' },
    { name: t.catalog.categories.footwear, category: 'footwear', color: 'bg-emerald-600' },
  ].map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.category);
    const units = catProducts.reduce((s, p) => s + p.salesCount, 0);
    const revenue = catProducts.reduce((s, p) => s + p.salesCount * p.price, 0);
    const percentage = totalSalesUnits > 0 ? Math.round((units / totalSalesUnits) * 100) : 0;
    return { ...cat, units, revenue, percentage };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {t.seller.analyticsTab}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'kk' ? 'Қаржылық көрсеткіштер, конверсия және түсім құрылымы' : 'Финансовые показатели, конверсия и структура выручки'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <span className="text-xs text-gray-400 font-semibold block">{t.seller.kpi.totalRevenue}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {totalRevenue.toLocaleString()} ₸
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> {orders.length > 0 ? '+24%' : '0%'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <span className="text-xs text-gray-400 font-semibold block">{language === 'kk' ? 'Орташа чек' : 'Средний чек'}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {avgCheck.toLocaleString()} ₸
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            {orders.length} {language === 'kk' ? 'тапсырыс бойынша' : 'оформленных заказов'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <span className="text-xs text-gray-400 font-semibold block">{t.seller.kpi.unitsSold}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {totalSalesUnits} {t.common.units}
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            {t.seller.kpi.conversion}: {orders.length > 0 ? '100%' : '0%'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#111111] p-5 rounded-3xl space-y-2">
          <span className="text-xs text-gray-400 font-semibold block">{t.seller.kpi.returns}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            0%
          </h3>
          <span className="text-[10px] text-gray-400 font-medium block">
            {t.seller.kpi.noReturns}
          </span>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="bg-gray-50 dark:bg-[#111111] p-6 sm:p-7 rounded-3xl space-y-6">
        <div>
          <h3 className="font-black text-base text-gray-900 dark:text-white">
            {t.seller.categorySales}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {t.seller.categorySalesSub}
          </p>
        </div>

        <div className="space-y-4">
          {categoryStats.map((cat) => (
            <div key={cat.category} className="space-y-2 bg-white dark:bg-[#161616] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 dark:text-white">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{cat.units} {t.common.units}</span>
                  <span className="font-black text-gray-900 dark:text-white">
                    {cat.revenue.toLocaleString()} ₸
                  </span>
                  <span className="font-mono font-bold text-[#F14635] w-10 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 dark:bg-[#222222] rounded-full overflow-hidden">
                <div
                  style={{ width: `${cat.percentage}%` }}
                  className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Performance Table */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-neutral-800/80 space-y-4">
        <h3 className="font-black text-base text-gray-900 dark:text-white">
          {t.seller.monthlyRevenue}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-[#161616] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">{t.seller.table.month}</th>
                <th className="py-3 px-4">{t.seller.table.revenue}</th>
                <th className="py-3 px-4">{t.seller.table.growth}</th>
                <th className="py-3 px-4 rounded-r-xl text-right">{t.seller.table.planStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/60 font-medium">
              {displayRevenue.map((row, i) => {
                const prev = i > 0 ? displayRevenue[i - 1].amount : row.amount;
                const growth = prev > 0 ? Math.round(((row.amount - prev) / prev) * 100) : 0;
                return (
                  <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-[#161616]/50">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {row.month} 2026
                    </td>
                    <td className="py-3.5 px-4 font-black text-gray-900 dark:text-white">
                      {row.amount.toLocaleString()} ₸
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {growth > 0 ? `+${growth}%` : `${growth}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                        row.amount > 0 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-gray-100 dark:bg-[#222222] text-gray-400'
                      }`}>
                        {row.amount > 0 ? (language === 'kk' ? 'Орындалды' : 'Выполнен') : (language === 'kk' ? 'Дерек жоқ' : 'Нет данных')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
