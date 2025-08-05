'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';

interface DownloadLink {
    title: string;
    url: string;
}

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
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/download-links?session_id=${encodeURIComponent(sessionId)}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<DownloadLink[]>;
            })
            .then(setLinks)
            .catch(err => {
                console.error(err);
                setError('Failed to load download links.');
            });
    }, [sessionId]);

    const handleDownloadAll = async () => {
        if (!links || isDownloading) return;

        setIsDownloading(true);

        try {
            for (let i = 0; i < links.length; i++) {
                const link = links[i];

                try {
                    console.log(`Downloading ${link.title}...`);

                    const res = await fetch(link.url);
                    if (!res.ok) throw new Error(`Failed to fetch ${link.title}: ${res.status}`);

                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = blobUrl;

                    const urlParts = link.url.split('.');
                    const extension = urlParts.length > 1 ? `.${urlParts.pop()}` : '.pdf';

                    a.download = `${link.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}${extension}`;
                    a.style.display = 'none';

                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    URL.revokeObjectURL(blobUrl);

                    if (i < links.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                } catch (err) {
                    console.error(`Download error for ${link.title}:`, err);
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
                Your purchased resources are now available. You can download it directly below or check your Email account.
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

            <div className='flex flex-col items-center justify-center gap-6'>
                {links && links.length > 1 && (
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloading}
                        className={`inline-flex items-center px-6 py-2 rounded shadow font-semibold transition ${isDownloading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-green-active text-white hover:bg-green-900'
                            }`}
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Downloading...
                            </>
                        ) : (
                            `Download Resources (${links.length})`
                        )}
                    </button>
                )}

                {/* Optional: individual download buttons */}
                {/* {links && links.map(dl => (
                    <a
                        key={dl.title}
                        href={dl.url}
                        download={`${dl.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`}
                        className="inline-flex items-center bg-green-active text-white px-6 py-2 rounded shadow hover:bg-green-hover transition font-semibold"
                    >
                        Download {dl.title}
                    </a>
                ))} */}

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
