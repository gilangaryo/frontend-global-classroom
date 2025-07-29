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

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.data?.token && data.data?.refreshToken) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('userId', data.data.user.id);
            localStorage.setItem('userEmail', data.data.user.email);
            router.replace('/dashboard');
        } else {
            setError(data.message || data.error || 'Invalid email or password');
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

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E724A]"
                    />

                    <div className="w-full relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E724A]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                            tabIndex={-1}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <div className="w-full flex items-center justify-start text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-[#3E724A]" />
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-active hover:bg-[#2d5d39] text-white py-2 rounded font-semibold transition"
                    >
                        Sign In
                    </button>
                </form>
            </div>

            {/* Footer: Bawah sendiri */}
            <div className="pb-4">
                <Image src="/dashboard/power-by.png" alt="Powered by" width={90} height={90} />
            </div>
        </div>
    );
}
