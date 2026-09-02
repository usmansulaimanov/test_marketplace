import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '../types';
import { useCartStore } from './useCartStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: Role, name?: string) => void;
  logout: () => void;
  updateBalance: (delta: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, role = 'client', name) => {
        let defaultName = name;
        if (!defaultName) {
          if (role === 'admin') defaultName = 'Администратор Маркета';
          else if (role === 'seller') defaultName = 'Магазин';
          else defaultName = 'Клиент';
        }

        set({
          isAuthenticated: true,
          user: {
            id: `usr-${Date.now()}`,
            name: defaultName,
            email,
            role,
            balance: 0,
          },
        });
      },
      logout: () => {
        useCartStore.getState().clearCart();
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
      name: 'kitap-auth-store-v2',
    }
  )
);
