import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = 'kk';
  document.documentElement.classList.remove('dark');
});
