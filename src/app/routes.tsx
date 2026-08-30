import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LandingPage } from '../features/landing/LandingPage';
import { CatalogPage } from '../features/catalog/CatalogPage';
import { CartPage } from '../features/cart/CartPage';
import { AuthPage } from '../features/auth/AuthPage';
import { ClientDashboardPage } from '../features/client/ClientDashboardPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { ProductDetailPage } from '../features/product/ProductDetailPage';
import { ProductEditPage } from '../features/product/ProductEditPage';
import { OrderSuccessPage } from '../features/checkout/OrderSuccessPage';
import { WishlistPage } from '../features/wishlist/WishlistPage';
import { NotFoundPage } from '../features/misc/NotFoundPage';

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
        path: 'product/:id',
        element: <ProductDetailPage />,
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
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        // Protected Admin Routes
        element: <ProtectedRoute allowedRole="admin" />,
        children: [
          {
            path: 'admin',
            element: <AdminDashboardPage />,
          },
          {
            path: 'product/:id/edit',
            element: <ProductEditPage />,
          },
        ]
      },
      {
        // Protected Client Routes
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <ClientDashboardPage />,
          },
          {
            path: 'order-success/:id',
            element: <OrderSuccessPage />,
          },
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
