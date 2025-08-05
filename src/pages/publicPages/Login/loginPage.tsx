import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../../store';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Redirect nếu đã đăng nhập
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/home-page', { replace: true });
            } else if (user.role === 'USER') {
                navigate('/user/home', { replace: true });
            } else {
                navigate('/user/home', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const result = await dispatch(loginUser({ username, password }));
            
            if (loginUser.fulfilled.match(result)) {
                // Login thành công, useEffect sẽ handle redirect
                console.log('Login successful:', result.payload);
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 w-full max-w-sm"
            >
                <h2 className="text-3xl font-bold text-red-500 text-center mb-6">
                    Đăng nhập
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tài khoản
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-bold py-2 px-4 rounded focus:outline-none w-full`}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
