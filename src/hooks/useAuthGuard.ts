'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export default function useAuthGuard() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
            return;
        }

        const decoded = parseJwt(token);
        const now = Math.floor(Date.now() / 1000);

        if (!decoded?.exp || decoded.exp < now) {
            // token expired
            localStorage.removeItem('token');
            router.replace('/login');
            return;
        }

        // token valid
        setLoading(false);
    }, [router]);

    return loading;
}
