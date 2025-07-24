'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import cart_icon from '../../../../public/cart.png'; // pakai path-mu sendiri

interface CartModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CartModal({ open, onClose }: CartModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);


    if (!open) return null;

    return (

        <div className="absolute inset-0 z-40 flex items-start justify-end bg-transparent bg-opacity-90 mx-4">

            <div
                ref={modalRef}
                className="mt-20 mr-8 w-[460px] bg-white rounded-lg shadow-xl p-5 animate-fadeIn flex flex-col"
                style={{ minHeight: 250 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-700">Cart is Empty</span>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
                        <Image src={cart_icon} alt="Cart" width={24} height={24} />
                    </button>
                </div>
                <hr />

                {/* Total */}
                <div className="flex justify-between items-center text-base my-6 font-medium">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-black">$0.00</span>
                </div>
                <hr />

                {/* Wish List & View Cart */}
                <div className="flex items-center justify-between mt-6">
                    <a href="/wishlist" className="flex items-center text-black hover:underline text-base">
                        View Wish List
                        <svg width={24} height={24} className="ml-1">
                            <polyline
                                points="8 5 16 12 8 19"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                    <a
                        href="/cart"
                        className="px-6 py-2 rounded-lg bg-navbar text-white font-semibold hover:bg-green-800"
                    >
                        View Cart
                    </a>
                </div>
            </div>
            <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.15s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
        </div>
    );
}
