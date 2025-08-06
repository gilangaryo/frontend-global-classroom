'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';

import { removeFromCart, revalidateCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function CartPageClient() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    // ✅ Ambil items dan status revalidasi dari Redux state
    const { items: cartItems, revalidationStatus } = useSelector((state: RootState) => state.cart);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        if (cartItems.length > 0 && revalidationStatus === 'idle') {
            dispatch(revalidateCart(cartItems));
        }
    }, [dispatch, cartItems, revalidationStatus]);

    if (!isClient) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-8">MY CART</h1>
                <p>Loading cart...</p>
            </main>
        );
    }

    const total = cartItems.reduce((sum: number, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
            <button
                onClick={() => router.back()}
                className="text-sm text-black flex items-center hover:underline mb-8"
            >
                <Image
                    src="/back-button.png"
                    alt="Back"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                Back
            </button>

            <h1 className="text-2xl md:text-3xl font-bold mb-8">MY CART</h1>

            {revalidationStatus === 'loading' && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                    <p>Verifying cart items with server...</p>
                </div>
            )}
            {revalidationStatus === 'failed' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>Failed to update cart. Some prices or items might be out of date. Please try refreshing.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-6">
                    {cartItems.length === 0 && revalidationStatus !== 'loading' ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((product) => (
                            <div key={product.id} className="flex items-start justify-between gap-4 border-b pb-4">
                                <div className="flex flex-1 items-start space-x-4">
                                    <button
                                        onClick={() => dispatch(removeFromCart(product.id))}
                                        className="p-2 rounded hover:bg-gray-200 mt-1 shrink-0"
                                    >
                                        <Image src="/trash.png" alt="Remove" width={24} height={24} />
                                    </button>

                                    <Image src={product.image || '/placeholder.jpg'} alt={product.title} width={80} height={60} className="rounded object-cover" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{product.title}</p>
                                        {product.subtitle && <p className="line-clamp-2 text-sm text-gray-600">{product.subtitle}</p>}
                                    </div>
                                </div>

                                <div className="min-w-[90px] text-right">
                                    <h2 className="text-lg font-semibold">${(product.price || 0).toFixed(2)}</h2>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="md:col-span-2 border rounded-md p-6 h-fit md:sticky md:top-24">
                    <h2 className="font-bold text-lg mb-4">ORDER SUMMARY</h2>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Subtotal ({cartItems.length} items):</span>
                        <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold mb-4">
                        <span>Totals:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Link href="/checkout" className="block text-center w-full bg-green-active text-white py-2 rounded hover:bg-green-hover transition">
                        Checkout Item
                    </Link>
                </div>
            </div>
        </main>
    );
}