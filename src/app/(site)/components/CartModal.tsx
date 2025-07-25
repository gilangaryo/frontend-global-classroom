'use client';
import Link from 'next/link';
interface CartModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CartModal({ open, onClose }: CartModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-[340px]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-medium text-gray-800">Cart is Empty</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-gray-100"
                        aria-label="Close"
                    >
                        {/* Cart Icon SVG */}
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.61 17h7.78
                a2 2 0 0 0 1.94-1.61L23 6H6" />
                        </svg>
                    </button>
                </div>
                <hr />

                {/* Total */}
                <div className="flex justify-between items-center text-base my-4 font-medium">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-black">$0.00</span>
                </div>
                <hr />

                {/* Action: Wish List & View Cart */}
                <div className="flex justify-between items-center mt-4">
                    <p className="flex items-center text-base text-black">
                        View Wish List
                        <svg width={20} height={20} className="ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <polyline points="9 6 15 12 9 18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </p>
                    <Link
                        href="/cart"
                        onClick={onClose}
                        className="px-5 py-2 rounded bg-green-active text-white font-semibold"
                    >
                        View Cart
                    </Link>

                </div>
            </div>
        </div>
    );
}
