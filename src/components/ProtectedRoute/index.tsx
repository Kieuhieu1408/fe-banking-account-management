import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
  requireAuth = true
}) => {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  // Đang loading, hiển thị loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu yêu cầu đăng nhập nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu không yêu cầu đăng nhập nhưng đã đăng nhập (như trang login)
  if (!requireAuth && isAuthenticated) {
    // Redirect dựa trên role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/home-page" replace />;
    } else if (user?.role === 'USER') {
      return <Navigate to="/user/home" replace />;
    }
    // Fallback
    return <Navigate to="/user/home" replace />;
  }

  // Nếu có yêu cầu role cụ thể
  if (requiredRoles.length > 0 && user?.role && !requiredRoles.includes(user.role)) {
    // Redirect về trang phù hợp dựa trên role hiện tại
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/home-page" replace />;
    } else if (user?.role === 'USER') {
      return <Navigate to="/user/home" replace />;
    }
    // Nếu không có role hợp lệ, về login
    return <Navigate to="/login" replace />;
  }

  // Có quyền truy cập
  return <>{children}</>;
};
