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
        <>
            {/* Backdrop overlay untuk close saat click diluar */}
            <div
                className="fixed inset-0 bg-transparent z-30"
                onClick={onClose}
            />

            {/* Modal positioned di bawah cart button */}
            <div className="absolute top-full right-0 mt-2 w-[340px] z-40">
                <div
                    className="bg-white p-6 rounded-lg shadow-xl border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Small arrow pointing up to cart button */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

                    {/* Header: Total Item + Icon */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-gray-800">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in a Cart
                        </span>
                        <Image src={cart_icon} alt="Cart" width={20} height={20} />
                    </div>

                    <hr className="my-3" />

                    {/* Show cart items summary  */}
                    {cartItems.length > 0 && (
                        <div className="max-h-32 overflow-y-auto mb-3">
                            {cartItems.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-1 text-sm">
                                    <span className="truncate mr-2">{item.title}</span>
                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                            {cartItems.length > 3 && (
                                <div className="text-xs text-gray-500 text-center pt-1">
                                    +{cartItems.length - 3} more items
                                </div>
                            )}
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center text-base my-4 font-medium">
                        <span>Total:</span>
                        <span className="text-2xl font-bold text-black">${total.toFixed(2)}</span>
                    </div>

                    <hr className="my-3" />

                    {/* Action: View Cart */}
                    <div className="flex justify-end items-center mt-4">
                        <Link
                            href="/cart"
                            onClick={onClose}
                            className="px-5 py-2 rounded bg-[#3E724A] text-white font-semibold hover:bg-[#2d5436] transition-colors"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}