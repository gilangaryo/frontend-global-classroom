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
    const [downloadProgress, setDownloadProgress] = useState<{ current: number, total: number } | null>(null);

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
                    {
                        cache: 'no-store',
                        headers: { 'Accept': 'application/json' }
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${res.status}`);
                }

                const data = (await res.json()) as DownloadLink[];
                console.log('📥 Received download links:', data.length);
                setLinks(data);
            } catch (error: unknown) {
                // Fix: Better error handling for CORS and network issues
                if (error instanceof Error && error.name === 'AbortError') return;

                console.error('Download links fetch error:', error);

                let errorMessage = 'Unknown error';
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    errorMessage = 'Unable to connect to server. Please check your connection and try again.';
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                setError('Failed to load download links: ' + errorMessage);
                setLinks([]);
            }
        })();

        return () => controller.abort();
    }, [sessionId]);

    // Enhanced bulk download for PDFs without ZIP
    const handleDownloadAll = async () => {
        // Fix: Null check with proper type guard
        if (!links || links.length === 0 || isDownloading) return;

        setIsDownloading(true);
        setDownloadProgress({ current: 0, total: links.length });

        try {
            // Method 1: Try iframe download (most reliable for PDFs)
            if (links.length <= 5) {
                await downloadWithIframes();
            } else {
                // Method 2: Sequential downloads with optimized timing for larger batches
                await downloadSequentially();
            }
        } catch (error) {
            console.error('Download failed:', error);
            setError('Some downloads may have failed. Please try downloading individual files.');
        } finally {
            setIsDownloading(false);
            setDownloadProgress(null);
        }
    };

    // Download using hidden iframes (best for PDFs, bypasses most browser blocking)
    const downloadWithIframes = async () => {
        // Fix: Add null check
        if (!links) return;

        const iframes: HTMLIFrameElement[] = [];

        try {
            for (let i = 0; i < links.length; i++) {
                setDownloadProgress({ current: i + 1, total: links.length });

                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.position = 'absolute';
                iframe.style.top = '-9999px';
                iframe.src = links[i].url;

                document.body.appendChild(iframe);
                iframes.push(iframe);

                // Small delay between iframe creations
                if (i < links.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            // Wait a bit for downloads to start, then cleanup
            await new Promise(resolve => setTimeout(resolve, 3000));

        } finally {
            // Cleanup iframes
            iframes.forEach(iframe => {
                try {
                    document.body.removeChild(iframe);
                } catch {
                    // Fix: Remove unused parameter
                    // Iframe might already be removed
                }
            });
        }
    };

    // Sequential download with better error handling
    const downloadSequentially = async () => {
        // Fix: Add null check
        if (!links) return;

        for (let i = 0; i < links.length; i++) {
            setDownloadProgress({ current: i + 1, total: links.length });

            try {
                await downloadSingleFile(links[i]);

                // Progressive delay to avoid browser blocking
                if (i < links.length - 1) {
                    const delay = Math.min(1200 + (i * 300), 4000);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            } catch (error) {
                console.warn(`Failed to download ${links[i].title}:`, error);
                // Continue with next file
            }
        }
    };

    // Download single PDF file with enhanced compatibility
    const downloadSingleFile = async (link: DownloadLink): Promise<void> => {
        // Fix: Remove unused index parameter
        return new Promise((resolve) => {
            // Method 1: Try window.open with download (works well for PDFs)
            const newWindow = window.open(link.url, '_blank');

            if (newWindow) {
                // If popup opened successfully, use it
                setTimeout(() => {
                    try {
                        newWindow.close();
                    } catch {
                        // Fix: Remove unused parameter
                        // Window might already be closed
                    }
                    resolve();
                }, 2000);
            } else {
                // Fallback to anchor tag method
                const a = document.createElement('a');
                a.href = link.url;
                a.download = getFileName(link.title);
                a.target = '_blank';
                a.style.display = 'none';

                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    resolve();
                }, 500);
            }
        });
    };

    // Extract filename from title
    const getFileName = (title: string): string => {
        // Fix: Remove unused url parameter
        // For PDFs, ensure .pdf extension
        const cleanTitle = title.replace(/[^a-z0-9\s-_]/gi, '').replace(/\s+/g, '_').toLowerCase();
        return cleanTitle.endsWith('.pdf') ? cleanTitle : `${cleanTitle}.pdf`;
    };

    // Individual PDF download
    const handleSingleDownload = (link: DownloadLink) => {
        // For single downloads, try window.open first (better for PDFs)
        const newWindow = window.open(link.url, '_blank');

        if (!newWindow) {
            // Fallback to anchor method if popup blocked
            const a = document.createElement('a');
            a.href = link.url;
            a.download = getFileName(link.title);
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
            <p className="max-w-xl mx-auto text-sm text-gray-600 mb-8">
                Your purchased resources are now available. You can download them directly
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
                {/* Fix: Add proper null checks */}
                {links && links.length >= 1 && (
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleDownloadAll}
                            disabled={isDownloading}
                            className={`inline-flex items-center px-6 py-3 rounded-lg shadow-lg font-semibold transition-all transform ${isDownloading
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-active text-white hover:bg-green-900 hover:scale-105'
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
                                    {downloadProgress
                                        ? `Downloading... (${downloadProgress.current}/${downloadProgress.total})`
                                        : 'Downloading...'
                                    }
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M7 7h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                    </svg>
                                    Download All PDFs ({links.length})
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 max-w-md text-center">
                            {links.length > 5
                                ? "Large batch detected. Downloads will be sequential to avoid browser blocking."
                                : "Small batch - using optimized download method."
                            }
                        </p>

                        {downloadProgress && (
                            <div className="w-full max-w-md">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-active h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Progress: {downloadProgress.current} of {downloadProgress.total} files
                                </p>
                            </div>
                        )}

                        {/* Individual download links */}
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                Download individual files
                            </summary>
                            <div className="mt-3 space-y-2 max-w-md">
                                {links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSingleDownload(link)}
                                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm transition-colors"
                                    >
                                        <span className="font-medium">{link.title}</span>
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
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