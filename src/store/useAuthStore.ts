import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: Role, name?: string) => void;
  logout: () => void;
  updateBalance: (delta: number) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Усман С.',
  email: 'usman@kitapall.kz',
  role: 'client',
  balance: 150000,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      isAuthenticated: true,
      login: (email, role = 'client', name = 'Клиент') => {
        set({
          isAuthenticated: true,
          user: {
            id: `usr-${Date.now()}`,
            name: role === 'admin' ? 'Администратор Маркета' : name,
            email,
            role,
            balance: role === 'admin' ? 500000 : 150000,
          },
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      updateBalance: (delta: number) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              balance: Math.max(0, state.user.balance + delta),
            },
          };
        });
      },
    }),
    {
      name: 'kitap-auth-store',
    }
  )
);
