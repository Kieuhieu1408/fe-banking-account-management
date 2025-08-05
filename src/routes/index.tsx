import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { publicRoutes } from './publicRoutes.tsx';
import { privateRoutes } from './privateRoutes.tsx';
import type { RootState } from '../store';

// Component để handle root redirect dựa trên auth status
const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect dựa trên role
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/home-page" replace />;
  } else if (user?.role === 'USER') {
    return <Navigate to="/user/home" replace />;
  }
  
  // Fallback
  return <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  ...publicRoutes,
  ...privateRoutes,
  
  // Catch-all route for 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
