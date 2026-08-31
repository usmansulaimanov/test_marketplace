import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

import { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (allowedRoles) {
    if (!isAuthenticated) {
      if (allowedRoles.includes('admin') || allowedRoles.includes('seller')) {
        return <Navigate to="/auth" replace />;
      }
      // Allow guest for client-facing routes
      return children ? <>{children}</> : <Outlet />;
    }
    
    if (user && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'seller') return <Navigate to="/seller" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  } else if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
