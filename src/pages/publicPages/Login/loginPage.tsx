import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { login } from '../../../api/auth/auth';

interface JWTPayload {
    scope: string;
    sub: string;
    exp: number;
    iat: number;
    jti: string;
    iss: string;
}

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Gọi API login
            const tokenResponse = await login(email, password);

            // Lưu token vào httpOnly cookies
            Cookies.set('authToken', tokenResponse.token, {
                httpOnly: false, // Trong môi trường thực tế, backend sẽ set httpOnly cookies
                secure: false, // Trong production nên set true
                sameSite: 'strict',
                expires: 7 // 7 ngày
            });

            // Giải mã token để lấy scope
            const decodedToken = jwtDecode<JWTPayload>(tokenResponse.token);

            // Lưu scope vào localStorage
            localStorage.setItem('userScope', decodedToken.scope);
            localStorage.setItem('userId', decodedToken.sub);

            console.log('Login successful:', {
                scope: decodedToken.scope,
                userId: decodedToken.sub
            });

            if (decodedToken.scope === 'ROLE_ADMIN') {
                window.location.href = '/admin/home-page';
            } else if (decodedToken.scope === 'ROLE_USER') {
                window.location.href = '/user/home';
            } else {
                // Fallback cho các role khác
                window.location.href = '/user/home';
            }

        } catch (err) {
            console.error('Login failed:', err);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        } finally {
            setIsLoading(false);
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
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        disabled={isLoading}
                        className={`${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-bold py-2 px-4 rounded focus:outline-none w-full`}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
