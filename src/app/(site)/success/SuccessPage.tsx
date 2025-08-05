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
            setError('Session ID tidak ditemukan di URL.');
            return;
        }

        fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/download-links?session_id=${encodeURIComponent(
                sessionId
            )}`
        )
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<DownloadLink[]>;
            })
            .then(setLinks)
            .catch(err => {
                console.error(err);
                setError('Gagal memuat tautan download.');
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
                    if (!res.ok) {
                        throw new Error(`Failed to fetch ${link.title}: ${res.status}`);
                    }

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
        <main className="max-w-3xl mx-auto px-6 py-16 text-center font-body text-primary">
            <div className="flex justify-center mb-6">
                <Image
                    src="/success/success-button.png"
                    alt="Success"
                    width={150}
                    height={150}
                    priority
                />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-green-800 uppercase mb-2">
                Pembayaran Berhasil!
            </h1>
            <p className="text-sm text-gray-600 mb-8">
                File Anda siap diunduh. Klik Download All untuk mengunduh semua sekaligus,
                atau pilih per-file di bawah.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {links === null && !error && (
                <div className="mb-6">
                    <p className="text-gray-500">Memuat tautan download…</p>
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
                                Mengunduh...
                            </>
                        ) : (
                            `Download All (${links.length})`
                        )}
                    </button>
                )}

                {/* Individual Download Links */}
                {/* {links && links.map(dl => (
                    <a
                        key={dl.title}
                        href={dl.url}
                        download={`${dl.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`}
                        className="inline-flex items-center bg-green-active text-white px-6 py-2 rounded shadow hover:bg-green-hover transition font-semibold"
                    >
                        Unduh {dl.title}
                    </a>
                ))} */}

                {links && links.length === 0 && !error && (
                    <p className="text-gray-500">
                        Tidak ada file ditemukan. Silakan periksa email Anda.
                    </p>
                )}

                <Link
                    href="/"
                    className="inline-flex items-center text-green-active px-6 py-2 rounded hover:bg-green-50 transition font-semibold"
                >
                    Kembali ke Beranda
                    <span className="ml-2 text-lg" aria-hidden="true">
                        →
                    </span>
                </Link>
            </div>
        </main>
    );
}