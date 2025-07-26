'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPageClient() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="max-w-full mx-auto px-15 py-10">
            <Link href="/courses" className="text-sm text-black flex items-center mb-6">
                <span className="mr-2 text-xl">&larr;</span> Back to course
            </Link>

            <h1 className="text-3xl font-bold mb-8">MY CART</h1>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Left: Cart Items */}
                <div className="md:col-span-4 space-y-6">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((product) => (
                            <div key={product.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => dispatch(removeFromCart(product.id))}
                                        className="p-2 rounded hover:bg-gray-100"
                                    >
                                        <Image src="/trash.png" alt="Remove" width={35} height={35} />
                                    </button>
                                    <Image src={product.image} alt={product.title} width={80} height={60} className="object-cover" />
                                    <div>
                                        <p className="font-semibold">{product.title}</p>
                                        {product.subtitle && <p className="text-sm text-gray-600">{product.subtitle}</p>}
                                    </div>
                                </div>
                                <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Right: Order Summary */}
                <div className="border rounded-md p-6">
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
                    <Link
                        href="/checkout"
                        className="block text-center w-full bg-primary text-white py-2 rounded hover:bg-green-hover transition"
                    >
                        Checkout Item
                    </Link>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Your purchased resources can be instantly <br />
                        downloaded from your account
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-primary">
                <p>Copyright © 2025 Global Classroom</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link href="/courses">Course</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="#" aria-label="Instagram">
                        <Image src="/social-icons/instagram.png" alt="Instagram" width={24} height={24} />
                    </Link>
                    <Link href="#" aria-label="WhatsApp">
                        <Image src="/social-icons/whatsapp.png" alt="WhatsApp" width={24} height={24} />
                    </Link>
                    <Link href="#" aria-label="LinkedIn">
                        <Image src="/social-icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
                    </Link>
                </div>
            </footer>
        </main>
    );
}
