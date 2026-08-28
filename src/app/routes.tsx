import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../features/landing/LandingPage';
import { CatalogPage } from '../features/catalog/CatalogPage';
import { CartPage } from '../features/cart/CartPage';
import { AuthPage } from '../features/auth/AuthPage';
import { ClientDashboardPage } from '../features/client/ClientDashboardPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'dashboard',
        element: <ClientDashboardPage />,
      },
      {
        path: 'admin',
        element: <AdminDashboardPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
