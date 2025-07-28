'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-7/12 flex flex-col items-center justify-center px-6 py-16 bg-white text-center">
            <h1 className="text-2xl font-semibold text-primary mb-2 tracking-wide">OOPS!</h1>
            <p className="text-primary mb-4">Page not found</p>

            <div className="relative w-full max-w-xl h-90 mb-8">
                <Image
                    src="/not-found.png"
                    alt="404 illustration"
                    fill
                    className="object-contain"
                />
            </div>



            <Link
                href="/"
                className="px-10 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
                Back to Home
            </Link>
        </div>
    );
}
