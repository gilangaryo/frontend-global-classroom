'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';

type DownloadLink = {
    title: string;
    url: string;
};

export default function SuccessPage() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [links, setLinks] = useState<DownloadLink[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    useEffect(() => {
        if (!sessionId) {
            setError('Session ID not found in URL.');
            setLinks([]);
            return;
        }

        const controller = new AbortController();
        (async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
                const res = await fetch(
                    `${base}/api/download/download-links?session_id=${encodeURIComponent(sessionId)}`,
                    { signal: controller.signal, cache: 'no-store' }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as DownloadLink[];
                setLinks(data);
            } catch (e) {
                if (e === 'AbortError') return;
                console.error(e);
                setError('Failed to load download links.');
                setLinks([]);
            }
        })();

        return () => controller.abort();
    }, [sessionId]);

    const handleDownloadAll = async () => {
        if (!links?.length || isDownloading) return;

        setIsDownloading(true);
        try {
            for (let i = 0; i < links.length; i++) {
                const a = document.createElement('a');
                a.href = links[i].url; // sudah proxied ke /api/download/file?... (same-origin)
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();

                if (i < links.length - 1) {
                    await new Promise((r) => setTimeout(r, 500)); // jeda kecil biar tidak diblokir browser
                }
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="max-w-full mx-auto px-6 py-25 text-center font-body text-primary">
            <div className="flex justify-center mb-6">
                <Image
                    src="/success/success-button.png"
                    alt="Success"
                    width={200}
                    height={200}
                    priority
                />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-green-active uppercase mb-6">
                Your Payment Successfully Paid
            </h1>
            <p className="max-w-xl mx-auto text-sm text-gray-600 mb-8 ">
                Your purchased resources are now available. You can download it directly
                below or check your Email account.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {links === null && !error && (
                <div className="mb-6">
                    <p className="text-gray-500">Loading download links…</p>
                </div>
            )}

            <div className="flex flex-col items-center justify-center gap-6">
                {links && links.length >= 1 && (
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloading}
                        className={`inline-flex items-center px-6 py-2 rounded shadow font-semibold transition ${isDownloading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-green-active text-white hover:bg-green-900'
                            }`}
                        aria-busy={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Downloading...
                            </>
                        ) : (
                            `Download Resources (${links.length})`
                        )}
                    </button>
                )}

                {links && links.length === 0 && !error && (
                    <p className="text-gray-500">
                        No files found. Please check your email for access.
                    </p>
                )}

                <Link
                    href="/"
                    className="inline-flex items-center text-green-active px-6 py-2 rounded hover:bg-gray-50 transition font-semibold"
                >
                    Back to Homepage
                    <span className="ml-2 text-lg" aria-hidden="true">
                        →
                    </span>
                </Link>
            </div>
        </main>
    );
}
