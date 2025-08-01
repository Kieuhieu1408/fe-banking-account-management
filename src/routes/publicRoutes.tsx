import { type RouteObject } from 'react-router-dom';
import LoginPage from '../pages/publicPages/Login';
import AuthGuard from '../components/authGuard';

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <AuthGuard requireAuth={false}>
        <LoginPage />
      </AuthGuard>
    ),
  },
];
