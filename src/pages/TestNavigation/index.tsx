import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const TestNavigationPage: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const userRole = user?.role;
  const userId = user?.id;
  const isAdmin = userRole === 'ADMIN';
  const isUser = userRole === 'USER';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Navigation Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User Info</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {userId || 'N/A'}</p>
            <p><strong>Role:</strong> {userRole || 'N/A'}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>Is User:</strong> {isUser ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Navigation Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Admin only links */}
            <div className="border rounded p-4">
              <h3 className="font-semibold text-red-600 mb-2">Admin Only</h3>
              <div className="space-y-2">
                <a 
                  href="/admin/home-page" 
                  className={`block px-4 py-2 rounded ${
                    isAdmin
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Admin Home Page
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isAdmin ? 'You have access' : 'Access denied'}
              </p>
            </div>

            {/* User only links */}
            <div className="border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">User Only</h3>
              <div className="space-y-2">
                <a 
                  href="/user/home" 
                  className={`block px-4 py-2 rounded ${
                    isUser
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  User Home Page
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isUser ? 'You have access' : 'Access denied'}
              </p>
            </div>

            {/* Common links */}
            <div className="border rounded p-4">
              <h3 className="font-semibold text-green-600 mb-2">Common (Any Role)</h3>
              <div className="space-y-2">
                <a 
                  href="/profile" 
                  className={`block px-4 py-2 rounded ${
                    (isAdmin || isUser)
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Profile Page
                </a>
                <a 
                  href="/dashboard" 
                  className={`block px-4 py-2 rounded ${
                    isAuthenticated 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Dashboard
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isAuthenticated ? 'You have access' : 'Login required'}
              </p>
            </div>

            {/* Public links */}
            <div className="border rounded p-4">
              <h3 className="font-semibold text-gray-600 mb-2">Public</h3>
              <div className="space-y-2">
                <a 
                  href="/login" 
                  className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login Page
                </a>
                <a 
                  href="/unauthorized" 
                  className="block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Unauthorized Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNavigationPage;
