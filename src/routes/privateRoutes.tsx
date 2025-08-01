import { type RouteObject } from 'react-router-dom';
import AdminHomePage from '../pages/adminPages/HomePage/homePage.tsx';
import AuthGuard from '../components/authGuard';

export const privateRoutes: RouteObject[] = [
  {
    path: '/admin/home-page',
    element: (
      <AuthGuard requireAuth={true}>
        <AdminHomePage />
      </AuthGuard>
    ),
  },
];
