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

// Seller Feature
import { SellerLayout } from '../features/seller/SellerLayout';
import { SellerDashboard } from '../features/seller/SellerDashboard';
import { SellerProducts } from '../features/seller/SellerProducts';
import { SellerOrders } from '../features/seller/SellerOrders';
import { SellerAnalytics } from '../features/seller/SellerAnalytics';

export const router = createBrowserRouter([
  // B2B Seller Space (Isolated with SellerLayout)
  {
    path: '/seller',
    element: (
      <ProtectedRoute allowedRoles={['seller']}>
        <SellerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SellerDashboard />,
      },
      {
        path: 'products',
        element: <SellerProducts />,
      },
      {
        path: 'orders',
        element: <SellerOrders />,
      },
      {
        path: 'analytics',
        element: <SellerAnalytics />,
      },
    ],
  },

  // Main Marketplace Space (with Consumer Header & Footer)
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
        element: (
          <ProtectedRoute allowedRoles={['client']}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute allowedRoles={['client']}>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },
      {
        // Protected Admin Routes
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'admin',
            element: <AdminDashboardPage />,
          },
          {
            path: 'product/:id/edit',
            element: <ProductEditPage />,
          },
        ],
      },
      {
        // Protected Client Routes
        element: <ProtectedRoute allowedRoles={['client', 'admin']} />,
        children: [
          {
            path: 'dashboard',
            element: <ClientDashboardPage />,
          },
          {
            path: 'order-success/:id',
            element: <OrderSuccessPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
