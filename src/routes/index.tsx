import { createBrowserRouter, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicRoutes.tsx';
import { privateRoutes } from './privateRoutes.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  ...publicRoutes,
  ...privateRoutes,
]);

export default router;
