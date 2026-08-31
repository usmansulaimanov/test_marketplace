import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Fixed Admin credentials
const ADMIN_EMAIL = 'admin@kitapall.kz';
const ADMIN_PASSWORD = 'admin123';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'seller'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Check if logging in as Admin
    if (trimmedEmail === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        setError('Неверный пароль администратора');
        return;
      }

      // Log in as Admin
      login(ADMIN_EMAIL, 'admin', 'Администратор');
      navigate('/admin');
      return;
    }

    const userName = name.trim() || (role === 'seller' ? 'Магазин' : trimmedEmail.split('@')[0]);

    if (mode === 'register' && role === 'seller') {
      login(trimmedEmail, 'seller', userName);
      navigate('/seller');
      return;
    }

    // Client login/registration
    login(trimmedEmail, 'client', userName);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </h1>
        <p className="text-xs text-gray-400">
          {mode === 'login'
            ? 'Введите свои данные для входа'
            : role === 'seller'
            ? 'Создайте аккаунт продавца для торговли на маркетплейсе'
            : 'Создайте аккаунт для покупок и отслеживания заказов'}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-[#111111] p-7 sm:p-9 rounded-3xl space-y-6">
        {/* Role Tab Switcher (Only on Registration) */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-white dark:bg-[#1a1a1a] rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'client'
                  ? 'bg-[#F14635] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Покупатель
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'seller'
                  ? 'bg-[#F14635] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Продавец (Seller)
            </button>
          </div>
        )}
        {/* Error alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 border border-red-100 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {role === 'seller' ? 'Название магазина / бренда' : 'Ваше имя'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'seller' ? 'Например: Qazaq Wear' : 'Имя'}
                className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl px-4 py-3 text-xs outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Email адрес
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="user@example.com"
                className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl pl-11 pr-4 py-3 text-xs outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Пароль
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Введите пароль"
                className="w-full bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-2xl pl-11 pr-11 py-3 text-xs outline-none shadow-xs border border-transparent focus:border-gray-200 dark:focus:border-neutral-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm mt-2 cursor-pointer"
          >
            <span>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setRole('client');
              setError(null);
            }}
            className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold cursor-pointer"
          >
            {mode === 'login'
              ? 'Еще нет аккаунта? Зарегистрироваться'
              : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};
