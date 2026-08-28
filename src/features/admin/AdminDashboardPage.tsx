import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  PlusCircle, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../../components/ui/Modal';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';

export const AdminDashboardPage: React.FC = () => {
  const { products, updateStock, deleteProduct, addProduct, resetToDefaults } = useProductStore();
  const { orders, getTotalExpenses } = useOrderStore();
  const { addToast } = useToastStore();

  const [filterCategory, setFilterCategory] = useState<CategoryId>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('tops');
  const [newPrice, setNewPrice] = useState(15990);
  const [newStock, setNewStock] = useState(20);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');
  const [newSizes, setNewSizes] = useState('S, M, L, XL');

  // Calculations for KPI
  const totalRevenue = getTotalExpenses();
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProduct({
      title: newTitle,
      brand: newBrand || 'KitapAll Exclusive',
      category: newCategory,
      price: Number(newPrice),
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: newImageUrl,
      stock: Number(newStock),
      description: 'Премиальное качество, создано для комфорта.',
      sizes: newSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: ['Черный', 'Белый'],
    });

    addToast({
      message: `Товар «${newTitle}» добавлен в каталог (${newStock} шт.)`,
      type: 'success',
    });

    // Reset & close
    setNewTitle('');
    setNewBrand('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header and Title */}
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Админ-панель управления</h1>
            <span className="bg-[#FFF1F0] text-[#F14635] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              KitapAll
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Учет склада, остатков и аналитика заказов
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#F14635] hover:bg-[#E03221] text-white px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>
          <button
            onClick={resetToDefaults}
            title="Сбросить к исходным тестовым данным"
            className="p-3 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-2xl shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-50 p-6 rounded-3xl">
          <span className="text-xs text-gray-400 font-medium block">Выручка от продаж</span>
          <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {totalRevenue.toLocaleString()} ₸
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Всего {orders.length} оформленных заказов
          </span>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl">
          <span className="text-xs text-gray-400 font-medium block">Товаров на складе</span>
          <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {totalStockUnits} шт.
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {products.length} активных моделей
          </span>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl">
          <span className="text-xs text-gray-400 font-medium block">Заканчиваются (мало)</span>
          <h3 className="text-2xl font-black text-amber-600 mt-2 tracking-tight">
            {lowStockCount} поз.
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Остаток ≤ 5 единиц
          </span>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl">
          <span className="text-xs text-gray-400 font-medium block">Нет в наличии</span>
          <h3 className="text-2xl font-black text-rose-600 mt-2 tracking-tight">
            {outOfStockCount} поз.
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Требуется пополнение
          </span>
        </div>
      </div>

      {/* Warehouse Section */}
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Table Filter / Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Учет склада (Инвентарь)</h2>
            <p className="text-xs text-gray-400">Управление количеством остатков без сложных разделений по городам</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по складу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 outline-none shadow-xs"
              />
            </div>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CategoryId)}
              className="bg-white rounded-xl px-3 py-2 text-xs text-gray-800 outline-none shadow-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warehouse Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Товар</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Цена</th>
                <th className="py-3 px-4 text-center">Остаток (шт.)</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-white/60 transition-colors">
                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-12 object-cover rounded-xl bg-white shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            {p.brand}
                          </span>
                          <span className="font-semibold text-gray-900 block truncate max-w-xs">
                            {p.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-gray-600 capitalize">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      {p.price.toLocaleString()} ₸
                    </td>

                    {/* Stock Quick Adjustment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            updateStock(p.id, p.stock - 1);
                            addToast({ message: `Остаток «${p.title}»: ${Math.max(0, p.stock - 1)} шт.`, type: 'info' });
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => {
                            updateStock(p.id, p.stock + 1);
                            addToast({ message: `Остаток «${p.title}»: ${p.stock + 1} шт.`, type: 'info' });
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Нет в наличии</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Мало ({p.stock})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-gray-900" />
                          <span>В наличии</span>
                        </span>
                      )}
                    </td>

                    {/* Delete action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          addToast({ message: `Товар «${p.title}» удален со склада`, type: 'error' });
                        }}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-white transition-colors"
                        title="Удалить позицию"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить новый товар в маркетплейс"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Название товара</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Например: Классическая хлопковая футболка"
              className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Бренд / Производитель</label>
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Qazaq Brand"
                className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Категория</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
              >
                <option value="headwear">Головные уборы</option>
                <option value="tops">Верх</option>
                <option value="bottoms">Низ</option>
                <option value="footwear">Обувь</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Цена (₸)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Количество на складе (шт.)</label>
              <input
                type="number"
                required
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Ссылка на фото (URL)</label>
            <input
              type="url"
              required
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Размеры (через запятую)</label>
            <input
              type="text"
              value={newSizes}
              onChange={(e) => setNewSizes(e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full bg-gray-50 rounded-xl p-3 outline-none focus:bg-gray-100"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F14635] text-white font-bold hover:bg-[#E03221]"
            >
              Сохранить товар
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
