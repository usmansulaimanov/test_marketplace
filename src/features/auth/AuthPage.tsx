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

    // Client login/registration
    const userName = name.trim() || trimmedEmail.split('@')[0];
    login(trimmedEmail, 'client', userName);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </h1>
        <p className="text-xs text-gray-400">
          {mode === 'login'
            ? 'Введите свои данные для входа'
            : 'Создайте аккаунт для покупок и отслеживания заказов'}
        </p>
      </div>

      <div className="bg-gray-50 p-7 sm:p-9 rounded-3xl space-y-6">
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
              <label className="block text-xs font-bold text-gray-700">
                Ваше имя
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="w-full bg-white text-gray-900 rounded-2xl px-4 py-3 text-xs outline-none shadow-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
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
                className="w-full bg-white text-gray-900 rounded-2xl pl-11 pr-4 py-3 text-xs outline-none shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
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
                className="w-full bg-white text-gray-900 rounded-2xl pl-11 pr-11 py-3 text-xs outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm mt-2"
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
              setError(null);
            }}
            className="text-xs text-gray-400 hover:text-gray-900 font-semibold"
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
