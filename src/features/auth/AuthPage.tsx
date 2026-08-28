import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, UserCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('usman@kitapall.kz');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<Role>('client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role, role === 'admin' ? 'Администратор Маркета' : 'Усман С.');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </h1>
        <p className="text-xs text-gray-500">
          KitapAll Clothes маркетплейсіне қош келдіңіз
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-6">
        {/* Role toggle */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Выберите роль для входа
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'client'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-gray-900" />
              <span>Клиент</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-[#F14635] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Администратор</span>
            </button>
          </div>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Email адрес
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.kz"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#F14635] focus:bg-white text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Пароль
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#F14635] focus:bg-white text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F14635] hover:bg-[#E03221] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>{mode === 'login' ? 'Войти в кабинет' : 'Зарегистрироваться'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-gray-500 hover:text-[#F14635] font-medium"
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
