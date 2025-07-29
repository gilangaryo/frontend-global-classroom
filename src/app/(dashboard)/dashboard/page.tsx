'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, {
            headers: { Authorization: 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                const userData = data.data || data;
                if (userData && userData.name) setUser(userData);
                else {
                    localStorage.removeItem('token');
                    router.replace('/login');
                }
            })
            .catch(() => {
                localStorage.removeItem('token');
                router.replace('/login');
            });
    }, [router]);

    function handleLogout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            })
                .finally(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    router.replace('/login');
                });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            router.replace('/login');
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EFE9E9]">
                <div className="text-lg text-gray-700">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-gray-600 mb-6">This is your dashboard.</p>
                <button
                    className="px-4 py-2 rounded bg-[#363F36] text-white hover:bg-[#4E3D34] transition"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
