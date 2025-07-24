'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

        if (res.ok && data.data && data.data.token && data.data.refreshToken) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('userId', data.data.user.id);
            localStorage.setItem('userEmail', data.data.user.email);
            router.replace('/dashboard');
        } else {
            setError(
                data.message || data.error || 'Invalid email or password'
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EFE9E9]">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-xs bg-white p-8 rounded shadow space-y-6"
            >
                <h1 className="text-2xl font-bold mb-2">Login</h1>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-[#363F36] text-white py-2 rounded font-semibold hover:bg-[#4E3D34] transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
