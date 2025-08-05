import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { initializeAuth } from './store/slices/authSlice';
import type { AppDispatch } from './store';
import router from './routes';
import './index.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Khởi tạo auth state từ cookies/localStorage khi app khởi động
    // dispatch(initializeAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
