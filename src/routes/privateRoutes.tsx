import { type RouteObject } from 'react-router-dom';
import AdminHomePage from '../pages/adminPages/HomePage/homePage.tsx';
import UserHomePage from '../pages/userPages/HomePage/HomePage.tsx';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const privateRoutes: RouteObject[] = [
  // Admin routes
  {
    path: '/admin/home-page',
    element: (
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <AdminHomePage />
      </ProtectedRoute>
    ),
  },
  
  // User routes  
  {
    path: '/user/home',
    element: (
      <ProtectedRoute requiredRoles={['USER']}>
        <UserHomePage />
      </ProtectedRoute>
    ),
  },
  
  // Route chung cho cả admin và user (nếu cần)
  {
    path: '/profile',
    element: (
      <ProtectedRoute requiredRoles={['ADMIN', 'USER']}>
        <div>Profile Page - Accessible by both Admin and User</div>
      </ProtectedRoute>
    ),
  },
  
  // Protected route không yêu cầu role cụ thể (chỉ cần đăng nhập)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <div>Dashboard - Accessible by any authenticated user</div>
      </ProtectedRoute>
    ),
  },
];
