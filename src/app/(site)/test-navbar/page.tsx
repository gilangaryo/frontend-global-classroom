'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

function CartModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div ref={modalRef} className="bg-white p-6 rounded shadow-lg flex flex-col gap-4">
                <div>Cart is empty</div>
                <button
                    onClick={() => {
                        onClose();
                        router.push('/cart');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Go to Cart
                </button>
            </div>
        </div>
    );
}

export default function TestNavbarPage() {
    const [cartOpen, setCartOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setCartOpen(false);
    }, [pathname]);

    return (
        <div>
            <button onClick={() => setCartOpen(true)} className="p-4 bg-green-700 text-white rounded">
                Open Cart Modal
            </button>
            <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}
