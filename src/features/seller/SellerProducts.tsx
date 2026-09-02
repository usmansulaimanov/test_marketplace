import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Boxes 
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { SafeImage } from '../../components/ui/SafeImage';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { useT } from '../../i18n/useT';

export const SellerProducts: React.FC = () => {
  const { t, language } = useT();
  const { products, toggleProductActive, deleteProduct, addProduct, updateStock } = useSellerStore();
  const { addToast } = useToastStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('tops');
  const [price, setPrice] = useState<number>(14990);
  const [stock, setStock] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (statusFilter === 'active' && !p.isActive) return false;
    if (statusFilter === 'inactive' && p.isActive) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ message: language === 'kk' ? 'Тауар атауын енгізіңіз' : 'Укажите название товара', type: 'error' });
      return;
    }
    if (price <= 0) {
      addToast({ message: language === 'kk' ? 'Баға 0-ден үлкен болуы керек' : 'Цена должна быть больше 0', type: 'error' });
      return;
    }

    addProduct({
      title: title.trim(),
      brand: 'KitapAll Exclusive',
      category,
      price,
      stock: Math.max(0, stock),
      isActive: true,
      imageUrl: imageUrl.trim(),
    });

    addToast({
      message: `${language === 'kk' ? 'Тауар қосылды' : 'Товар добавлен'}: «${title}»`,
      type: 'success',
    });

    // Reset & Close
    setTitle('');
    setPrice(14990);
    setStock(20);
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, productTitle: string) => {
    if (window.confirm(`${language === 'kk' ? 'Тауарды өшіруді растайсыз ба' : 'Удалить товар'} «${productTitle}»?`)) {
      deleteProduct(id);
      addToast({
        message: `${language === 'kk' ? 'Тауар өшірілді' : 'Товар удален'} «${productTitle}»`,
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.seller.productsTab}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'kk' ? 'Каталогтағы барлық тауар:' : 'Всего в каталоге:'} <span className="font-bold text-gray-900 dark:text-white">{products.length} {t.common.units}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#F14635] hover:bg-[#E03221] text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.seller.addProductBtn}</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="bg-gray-50 dark:bg-[#111111] p-4 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'kk' ? 'Атауы немесе ID бойынша іздеу...' : 'Поиск по названию или артикулу...'}
              className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-2xl text-xs outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
            className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-2.5 rounded-2xl text-xs font-bold outline-none shadow-xs cursor-pointer"
          >
            <option value="all">{t.catalog.allCategories}</option>
            <option value="headwear">{t.catalog.categories.headwear}</option>
            <option value="tops">{t.catalog.categories.tops}</option>
            <option value="bottoms">{t.catalog.categories.bottoms}</option>
            <option value="footwear">{t.catalog.categories.footwear}</option>
          </select>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
          {[
            { id: 'all', label: `${t.common.all} (${products.length})` },
            { id: 'active', label: `${language === 'kk' ? 'Белсенді' : 'Активные'} (${products.filter((p) => p.isActive).length})` },
            { id: 'inactive', label: `${language === 'kk' ? 'Жасырылған' : 'Сняты с продажи'} (${products.filter((p) => !p.isActive).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as 'all' | 'active' | 'inactive')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-xs border border-gray-100 dark:border-neutral-800/80 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t.catalog.noProductsTitle}</h4>
            <p className="text-xs text-gray-400">{t.catalog.noProductsDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-[#161616] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 dark:border-neutral-800">
                <tr>
                  <th className="py-3.5 px-5">{t.seller.table.product}</th>
                  <th className="py-3.5 px-4">{t.seller.table.category}</th>
                  <th className="py-3.5 px-4">{t.seller.table.price}</th>
                  <th className="py-3.5 px-4">{t.seller.table.stock}</th>
                  <th className="py-3.5 px-4">{language === 'kk' ? 'Сатылымдар' : 'Продажи'}</th>
                  <th className="py-3.5 px-4 text-center">{t.seller.table.status}</th>
                  <th className="py-3.5 px-5 text-right">{t.seller.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/60 font-medium">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-[#161616]/50 transition-colors"
                  >
                    {/* Title & Image */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-[#222222] shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {product.title}
                          </p>
                          <span className="font-mono text-[10px] text-gray-400">
                            #{product.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                      {t.catalog.categories[product.category] || (CATEGORIES.find((c) => c.id === product.category)?.name || product.category)}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-black text-gray-900 dark:text-white">
                      {product.price.toLocaleString()} ₸
                    </td>

                    {/* Stock Control */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => updateStock(product.id, Number(e.target.value))}
                          className="w-16 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-2.5 py-1.5 rounded-xl font-bold text-xs outline-none text-center"
                        />
                        <span className="text-[10px] text-gray-400">{t.common.units}</span>
                      </div>
                    </td>

                    {/* Sales */}
                    <td className="py-3.5 px-4 text-gray-500">
                      <span className="font-bold text-gray-900 dark:text-white">{product.salesCount}</span> {t.common.units}
                    </td>

                    {/* Active Status Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleProductActive(product.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-colors cursor-pointer ${
                          product.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-[#222222] text-gray-400'
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="w-3 h-3" /> {language === 'kk' ? 'Витринада' : 'В продаже'}
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> {language === 'kk' ? 'Жасырылған' : 'Скрыт'}
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#111111] max-w-lg w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 dark:border-neutral-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                {t.seller.addProductModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">
                  {t.seller.addProductModal.name}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Straight Fit Denim"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-3 rounded-2xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.category}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-3 rounded-2xl outline-none cursor-pointer"
                  >
                    <option value="headwear">{t.catalog.categories.headwear}</option>
                    <option value="tops">{t.catalog.categories.tops}</option>
                    <option value="bottoms">{t.catalog.categories.bottoms}</option>
                    <option value="footwear">{t.catalog.categories.footwear}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.price}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-3 rounded-2xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.stock}</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-3 rounded-2xl outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.imageUrl}</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-3 rounded-2xl outline-none truncate"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-[#F14635] hover:bg-[#E03221] text-white px-7 py-3 rounded-2xl font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
