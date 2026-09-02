import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/useAuthStore';

describe('Auth & Role Permissions', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('handles client login correctly', () => {
    useAuthStore.getState().login('user@kitapall.kz', 'client', 'Айдар');
    const { user, isAuthenticated } = useAuthStore.getState();

    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe('client');
    expect(user?.name).toBe('Айдар');
    expect(user?.balance).toBe(0);
  });

  it('handles seller and admin logins with proper defaults', () => {
    useAuthStore.getState().login('seller@shop.kz', 'seller');
    expect(useAuthStore.getState().user?.role).toBe('seller');

    useAuthStore.getState().login('admin@kitapall.kz', 'admin');
    expect(useAuthStore.getState().user?.role).toBe('admin');
  });

  it('updates balance accurately without allowing negative values', () => {
    useAuthStore.getState().login('user@kitapall.kz', 'client');
    useAuthStore.getState().updateBalance(5000);
    expect(useAuthStore.getState().user?.balance).toBe(5000);

    useAuthStore.getState().updateBalance(-7000);
    expect(useAuthStore.getState().user?.balance).toBe(0);
  });

  it('logs out cleanly and resets state', () => {
    useAuthStore.getState().login('user@kitapall.kz', 'client');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
