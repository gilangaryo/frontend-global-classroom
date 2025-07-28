'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';

export default function SuccessPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <main className="max-w-3xl mx-auto px-6 py-16 text-center font-body text-primary">
            {/* <div className="border border-dashed rounded-lg p-6 mb-12 flex items-center justify-between">
                <div className="text-left">
                    <h2 className="font-bold text-lg mb-1">
                        Case Study: Sportswashing and Qatar’s Quest for Soft Power
                    </h2>
                    <p className="text-sm text-gray-500">Global Politic Lesson</p>
                </div>
                <div>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded font-semibold text-md">
                        $15.00
                    </span>
                </div>
            </div> */}

            <div className="flex justify-center mb-8">
                <Image
                    src="/success/success-button.png"
                    alt="Success"
                    width={150}
                    height={150}
                />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-green-active mb-4">
                YOUR PAYMENT SUCCESSFULLY PAID
            </h1>
            <p className="text-gray-600 mb-10">
                Your purchased resources are now available. You can instantly download them<br />
                from your Email Account
            </p>

            <Link
                href="/"
                className="inline-flex items-center bg-green-active text-white px-6 py-2 rounded hover:bg-green-hover transition"
            >
                Back to Home
                <span className="ml-2 text-lg">→</span>
            </Link>
        </main>
    );
}
