'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import cart_icon from '../../../../public/cart.png';

interface CartModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CartModal({ open, onClose }: CartModalProps) {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-[340px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: Total Item + Icon */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-medium text-gray-800">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in a Cart
                    </span>
                    <Image src={cart_icon} alt="Cart" width={20} height={20} />
                </div>

                <hr className="my-3" />

                {/* Total */}
                <div className="flex justify-between items-center text-base my-4 font-medium">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-black">${total.toFixed(2)}</span>
                </div>

                <hr className="my-3" />

                {/* Action: Wish List & View Cart */}
                <div className="flex justify-between items-center mt-4">
                    <p className="flex items-center text-base text-black">
                        View Wish List
                        <svg
                            width={20}
                            height={20}
                            className="ml-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <polyline points="9 6 15 12 9 18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </p>
                    <Link
                        href="/cart"
                        onClick={onClose}
                        className="px-5 py-2 rounded bg-[#3E724A] text-white font-semibold"
                    >
                        View Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}
