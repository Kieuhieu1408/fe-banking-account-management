import { type RouteObject } from 'react-router-dom';
import LoginPage from '../pages/publicPages/Login';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  
  {
    path: '/unauthorized',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized</h2>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </a>
        </div>
      </div>
    ),
  },
];
