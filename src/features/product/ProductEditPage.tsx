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
import { SafeImage } from '../../components/ui/SafeImage';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { useT } from '../../i18n/useT';

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useT();

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
      <div className="max-w-md mx-auto my-16 bg-gray-50 dark:bg-[#111111] rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-[#FFF1F0] dark:bg-red-900/30 text-[#F14635] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {language === 'kk' ? 'Қолжетімділік шектелген' : 'Доступ ограничен'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'kk' ? 'Тауарды өзгерту беті тек әкімшіге арналған.' : 'Страница редактирования товаров доступна только для администратора.'}
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-[#F14635] text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all shadow-sm"
        >
          <span>{t.auth.loginTitle}</span>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 bg-gray-50 dark:bg-[#111111] rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-white dark:bg-[#1a1a1a] text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-7 h-7 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.catalog.noProductsTitle}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'kk' ? `ID #${id} тауары табылмады.` : `Товар с ID #${id} не существует или был удален.`}
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-[#F14635] text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-[#E03221] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.cart.goToCatalog}</span>
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
      message: `${language === 'kk' ? 'Тауар сақталды' : 'Товар успешно сохранен'}: «${title}»`,
      type: 'success',
    });

    navigate('/admin');
  };

  const handleDelete = () => {
    if (window.confirm(`${language === 'kk' ? 'Тауарды өшіруді растайсыз ба' : 'Вы уверены, что хотите удалить товар'} «${product.title}»?`)) {
      deleteProduct(product.id);
      addToast({
        message: `${language === 'kk' ? 'Тауар қоймадан өшірілді' : 'Товар удален со склада'}: «${product.title}»`,
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
            className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            title={t.common.back}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t.seller.addProductModal.editTitle}
              </h1>
              <span className="bg-[#FFF1F0] dark:bg-red-900/30 text-[#F14635] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                #{product.id}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {language === 'kk' ? 'Өзгерістерді енгізіп, сақтау батырмасын басыңыз' : 'Внесите изменения и нажмите кнопку сохранения'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.product.viewDetails}</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-2xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title={t.common.delete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 dark:bg-[#111111] p-6 sm:p-8 rounded-3xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900 dark:text-white">
              {language === 'kk' ? 'Негізгі ақпарат' : 'Основная информация'}
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.name}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Classic Cotton T-Shirt"
                className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
              />
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.brand}</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Qazaq Republic"
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {t.catalog.categories[c.id] || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.price}</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.oldPrice}</label>
                <input
                  type="number"
                  value={oldPrice || ''}
                  onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={language === 'kk' ? 'Жеңілдік үшін' : 'Для расчета % скидки'}
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.stock}</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs font-bold"
                />
              </div>
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.sizes}</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.colors}</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Қара, Ақ"
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.description}</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="..."
                className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 text-xs text-gray-900 dark:text-white outline-none shadow-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Image Preview & Save Actions */}
        <div className="space-y-6">
          {/* Image preview card */}
          <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900 dark:text-white">{language === 'kk' ? 'Тауар суреті' : 'Фотография товара'}</h2>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">{t.seller.addProductModal.imageUrl}</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none shadow-xs"
              />
            </div>

            {/* Live Preview */}
            <div className="aspect-[4/5] bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xs relative flex items-center justify-center">
              {imageUrl ? (
                <SafeImage
                  src={imageUrl}
                  alt="Превью"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span>{language === 'kk' ? 'Сурет жоқ' : 'Нет изображения'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-gray-50 dark:bg-[#111111] p-6 rounded-3xl space-y-3">
            <button
              type="submit"
              className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 py-3.5 rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
