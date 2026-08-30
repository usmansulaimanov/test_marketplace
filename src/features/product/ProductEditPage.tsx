import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Lock, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon 
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { products, updateProduct, deleteProduct } = useProductStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const product = products.find((p) => p.id === id);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<CategoryId>('tops');
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setOldPrice(product.oldPrice);
      setStock(product.stock);
      setImageUrl(product.imageUrl);
      setSizes(product.sizes.join(', '));
      setColors(product.colors.join(', '));
      setDescription(product.description);
    }
  }, [product]);

  // Protect route for Admin only
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 bg-gray-50 rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-[#FFF1F0] text-[#F14635] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Доступ ограничен</h2>
        <p className="text-xs text-gray-500">
          Страница редактирования товаров доступна только для администратора.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-[#F14635] text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all shadow-sm"
        >
          <span>Войти в аккаунт</span>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 bg-gray-50 rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-white text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-7 h-7 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Товар не найден</h2>
        <p className="text-xs text-gray-500">
          Товар с ID #{id} не существует или был удален.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-[#F14635] text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedColors = colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateProduct(product.id, {
      title: title.trim(),
      brand: brand.trim(),
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      stock: Number(stock),
      imageUrl: imageUrl.trim(),
      sizes: parsedSizes.length > 0 ? parsedSizes : ['One Size'],
      colors: parsedColors.length > 0 ? parsedColors : ['Черный'],
      description: description.trim(),
    });

    addToast({
      message: `Товар «${title}» успешно сохранен`,
      type: 'success',
    });

    navigate('/admin');
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить товар «${product.title}»?`)) {
      deleteProduct(product.id);
      addToast({
        message: `Товар «${product.title}» удален со склада`,
        type: 'info',
      });
      navigate('/catalog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-2">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
            title="Назад"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Редактирование товара
              </h1>
              <span className="bg-[#FFF1F0] text-[#F14635] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                #{product.id}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Внесите изменения и нажмите кнопку сохранения
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-50 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Страница товара</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-2xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Удалить товар"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 p-6 sm:p-8 rounded-3xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900">Основная информация</h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Название товара</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Классическая хлопковая футболка"
                className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
              />
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Бренд / Производитель</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Qazaq Republic"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Категория одежды</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameKz})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Текущая цена (₸)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Старая цена (₸)</label>
                <input
                  type="number"
                  value={oldPrice || ''}
                  onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Для расчета % скидки"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Остаток на складе (шт.)</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs font-bold"
                />
              </div>
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Размеры (через запятую)</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Цвета (через запятую)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Черный, Белый, Серый"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-gray-700 block">Описание и состав материала</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробное описание товара..."
                className="w-full bg-white rounded-2xl p-4 text-xs text-gray-900 outline-none shadow-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Image Preview & Save Actions */}
        <div className="space-y-6">
          {/* Image preview card */}
          <div className="bg-gray-50 p-6 rounded-3xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900">Фотография товара</h2>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">URL изображения</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none shadow-xs"
              />
            </div>

            {/* Live Preview */}
            <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-xs relative flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Превью"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600';
                  }}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span>Нет изображения</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
            <button
              type="submit"
              className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить изменения</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full bg-white hover:bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs"
            >
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
