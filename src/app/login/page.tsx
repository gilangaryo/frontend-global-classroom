'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', { email, password: '***' });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            const data = await res.json();
            console.log('Response data:', data);

            if (res.ok && data.status === 'success' && data.data?.token && data.data?.refreshToken) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                localStorage.setItem('userId', data.data.user.id);
                localStorage.setItem('userEmail', data.data.user.email);
                localStorage.setItem('userName', data.data.user.name || '');
                localStorage.setItem('userRole', data.data.user.role || 'USER');

                console.log('Login successful, redirecting to dashboard');

                router.replace('/dashboard');
            } else {
                console.error('Login failed:', data);
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-between items-center bg-white text-green-active px-4">
            {/* Main Content: Centered Form */}
            <div className="flex-grow flex flex-col justify-center items-center w-full">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-sm bg-white px-8 py-10 shadow border rounded-md flex flex-col items-center space-y-6"
                >
                    {/* Logo and title */}
                    <div className="flex flex-col items-center space-y-2">
                        <Image src="/logo_navbar.png" alt="Logo" width={90} height={90} />
                        <h2 className="text-2xl font-bold text-green-active">SIGN IN</h2>
                    </div>

                    {error && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E724A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <div className="w-full relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full border rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E724A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm disabled:cursor-not-allowed"
                            tabIndex={-1}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* <div className="w-full flex items-center justify-start text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="accent-[#3E724A]"
                                disabled={loading}
                            />
                            Remember me
                        </label>
                    </div> */}

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full bg-green-active hover:bg-[#2d5d39] text-white py-2 rounded font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    {/* Debug info in development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="w-full text-xs text-gray-500 text-center">
                            <p>API URL: {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
                        </div>
                    )}
                </form>
            </div>

            {/* Footer: Bawah sendiri */}
            <div className="pb-4">
                <Image src="/dashboard/power-by.png" alt="Powered by" width={90} height={90} />
            </div>
        </div>
    );
}